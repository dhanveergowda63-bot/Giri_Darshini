export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  webViewLink?: string;
  modifiedTime?: string;
}

export interface SheetTabInfo {
  sheetId: number;
  title: string;
}

export interface SpreadsheetMetadata {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheets: SheetTabInfo[];
}

export interface TrekInquiryRecord {
  submittedAt: string;
  inquiryId: string;
  trekName: string;
  region: string;
  duration: string;
  preferredWindow: string;
  groupSize: number;
  tariffPerTrekkerInr: number;
  estimatedTotalInr: number;
  fullName: string;
  phone: string;
  email: string;
  preferences: string;
}

export const SHEET_FIELD_HEADERS = [
  'Submitted At',
  'Inquiry ID',
  'Trek Package',
  'Region',
  'Duration',
  'Preferred Window',
  'Group Size',
  'Tariff Per Trekker (INR)',
  'Estimated Total (INR)',
  'Full Name',
  'Phone / WhatsApp',
  'Email Address',
  'Experience Preferences',
] as const;

export function recordToSheetRow(record: TrekInquiryRecord): (string | number)[] {
  return [
    record.submittedAt,
    record.inquiryId,
    record.trekName,
    record.region,
    record.duration,
    record.preferredWindow,
    record.groupSize,
    record.tariffPerTrekkerInr,
    record.estimatedTotalInr,
    record.fullName,
    record.phone,
    record.email,
    record.preferences || '—',
  ];
}

function escapeSheetTitleForA1(sheetTitle: string): string {
  return `'${sheetTitle.replace(/'/g, "''")}'`;
}

async function parseGoogleError(res: Response, fallbackMessage: string): Promise<string> {
  try {
    const payload = await res.json();
    const message = payload?.error?.message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  } catch {
    // Ignore non-JSON error body
  }
  return `${fallbackMessage} (HTTP ${res.status})`;
}

export async function listUserSpreadsheets(
  accessToken: string,
): Promise<DriveSpreadsheetFile[]> {
  const query = encodeURIComponent(
    "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
  );
  const fields = encodeURIComponent('files(id,name,webViewLink,modifiedTime)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=25`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(await parseGoogleError(res, 'Failed to list Google Spreadsheets'));
  }

  const data = await res.json();
  return Array.isArray(data.files) ? data.files : [];
}

export async function getSpreadsheetMetadata(
  accessToken: string,
  spreadsheetId: string,
): Promise<SpreadsheetMetadata> {
  const fields = encodeURIComponent(
    'spreadsheetId,spreadsheetUrl,properties.title,sheets(properties(sheetId,title))',
  );
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=${fields}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(await parseGoogleError(res, 'Failed to load spreadsheet tabs'));
  }

  const data = await res.json();
  const sheets: SheetTabInfo[] = Array.isArray(data.sheets)
    ? data.sheets
        .map((s: { properties?: { sheetId?: number; title?: string } }) => ({
          sheetId: s.properties?.sheetId ?? 0,
          title: s.properties?.title ?? 'Sheet',
        }))
        .filter((s: SheetTabInfo) => Boolean(s.title))
    : [];

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title ?? 'Untitled Spreadsheet',
    spreadsheetUrl:
      data.spreadsheetUrl ?? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    sheets,
  };
}

export async function createGiriDarshiniSpreadsheet(
  accessToken: string,
): Promise<SpreadsheetMetadata> {
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'Giri Darshini Treks — Trek Inquiries',
      },
      sheets: [
        {
          properties: {
            title: 'Trek Inquiries',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    throw new Error(await parseGoogleError(createRes, 'Failed to create Google Spreadsheet'));
  }

  const created = await createRes.json();
  const spreadsheetId: string = created.spreadsheetId;
  const tabTitle: string = created.sheets?.[0]?.properties?.title ?? 'Trek Inquiries';
  const sheetId: number = created.sheets?.[0]?.properties?.sheetId ?? 0;

  // Populate the structured header row A1:M1
  const headerRange = encodeURIComponent(`${escapeSheetTitleForA1(tabTitle)}!A1:M1`);
  const headerRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${headerRange}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[...SHEET_FIELD_HEADERS]],
      }),
    },
  );

  if (!headerRes.ok) {
    throw new Error(await parseGoogleError(headerRes, 'Created sheet, but failed to write header columns'));
  }

  // Style header row cleanly (bold forest-green header)
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: SHEET_FIELD_HEADERS.length,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.106, green: 0.263, blue: 0.196 },
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true,
                  },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
        ],
      }),
    },
  );

  return {
    spreadsheetId,
    title: created.properties?.title ?? 'Giri Darshini Treks — Trek Inquiries',
    spreadsheetUrl:
      created.spreadsheetUrl ?? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    sheets: [{ sheetId, title: tabTitle }],
  };
}

export async function readSheetRows(
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string,
): Promise<string[][]> {
  const range = encodeURIComponent(`${escapeSheetTitleForA1(sheetTitle)}!A1:M50`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${range}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(await parseGoogleError(res, 'Failed to read spreadsheet rows'));
  }

  const data = await res.json();
  return Array.isArray(data.values) ? data.values : [];
}

export async function appendInquiryToSheet(
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string,
  record: TrekInquiryRecord,
): Promise<{ updatedRange: string; initializedHeaders: boolean }> {
  const existingRows = await readSheetRows(accessToken, spreadsheetId, sheetTitle);
  let initializedHeaders = false;

  // Ensure structured column headers exist in row 1 if the selected tab is empty
  if (existingRows.length === 0 || existingRows[0].length === 0) {
    const headerRange = encodeURIComponent(`${escapeSheetTitleForA1(sheetTitle)}!A1:M1`);
    const headerRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${headerRange}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[...SHEET_FIELD_HEADERS]],
        }),
      },
    );

    if (!headerRes.ok) {
      throw new Error(await parseGoogleError(headerRes, 'Failed to initialize column headers'));
    }
    initializedHeaders = true;
  }

  const appendRange = encodeURIComponent(`${escapeSheetTitleForA1(sheetTitle)}!A:M`);
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${appendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [recordToSheetRow(record)],
    }),
  });

  if (!res.ok) {
    throw new Error(await parseGoogleError(res, 'Failed to append inquiry row to Google Sheets'));
  }

  const result = await res.json();
  return {
    updatedRange: result.updates?.updatedRange ?? `${sheetTitle}!A:M`,
    initializedHeaders,
  };
}
