import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { type User } from 'firebase/auth';
import {
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  LogOut,
  Minus,
  Plus,
  RefreshCw,
  TableProperties,
  X,
} from 'lucide-react';
import { TREK_PACKAGES } from '../data/treksData';
import {
  appendInquiryToSheet,
  createGiriDarshiniSpreadsheet,
  getSpreadsheetMetadata,
  listUserSpreadsheets,
  readSheetRows,
  SHEET_FIELD_HEADERS,
  type DriveSpreadsheetFile,
  type SheetTabInfo,
  type TrekInquiryRecord,
} from '../lib/googleSheetsService';
import {
  clearAccessToken,
  getAccessToken,
  googleSignIn,
  initAuth,
  logoutGoogle,
} from '../lib/googleWorkspaceAuth';
import { GoogleSignInButton } from './GoogleSignInButton';

interface InquiryPlannerProps {
  preselectedTrekId: string;
}

export function InquiryPlanner({ preselectedTrekId }: InquiryPlannerProps) {
  const [selectedTrekId, setSelectedTrekId] = useState(
    preselectedTrekId || TREK_PACKAGES[0].id,
  );
  const [groupSize, setGroupSize] = useState(4);
  const [preferredMonth, setPreferredMonth] = useState('November 2026');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [lastRecord, setLastRecord] = useState<TrekInquiryRecord | null>(null);

  // Google Workspace Auth & Sheets State
  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [spreadsheets, setSpreadsheets] = useState<DriveSpreadsheetFile[]>([]);
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState('');
  const [selectedSpreadsheetUrl, setSelectedSpreadsheetUrl] = useState('');
  const [sheetTabs, setSheetTabs] = useState<SheetTabInfo[]>([]);
  const [selectedSheetTitle, setSelectedSheetTitle] = useState('');
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSavingToSheet, setIsSavingToSheet] = useState(false);
  const [sheetsError, setSheetsError] = useState('');
  const [savedToSheetInfo, setSavedToSheetInfo] = useState<{
    spreadsheetTitle: string;
    sheetTitle: string;
    updatedRange: string;
    spreadsheetUrl: string;
  } | null>(null);

  // Explicit confirmation modal state before writing/modifying user Google Sheet data
  const [pendingWriteRecord, setPendingWriteRecord] = useState<TrekInquiryRecord | null>(
    null,
  );

  useEffect(() => {
    if (preselectedTrekId) {
      setSelectedTrekId(preselectedTrekId);
      setSubmitted(false);
      setSavedToSheetInfo(null);
    }
  }, [preselectedTrekId]);

  const loadSheetRows = useCallback(
    async (token: string, spreadsheetId: string, sheetTitle: string) => {
      if (!spreadsheetId || !sheetTitle) return;
      setSheetsLoading(true);
      setSheetsError('');
      try {
        const rows = await readSheetRows(token, spreadsheetId, sheetTitle);
        setSheetRows(rows);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unable to read rows from selected sheet.';
        setSheetsError(message);
        if (message.toLowerCase().includes('401') || message.toLowerCase().includes('invalid')) {
          clearAccessToken();
          setNeedsAuth(true);
        }
      } finally {
        setSheetsLoading(false);
      }
    },
    [],
  );

  const loadSpreadsheetTabs = useCallback(
    async (token: string, spreadsheetId: string) => {
      if (!spreadsheetId) return;
      setSheetsLoading(true);
      setSheetsError('');
      try {
        const meta = await getSpreadsheetMetadata(token, spreadsheetId);
        setSheetTabs(meta.sheets);
        setSelectedSpreadsheetUrl(meta.spreadsheetUrl);
        const firstTab = meta.sheets[0]?.title ?? '';
        setSelectedSheetTitle(firstTab);
        if (firstTab) {
          const rows = await readSheetRows(token, spreadsheetId, firstTab);
          setSheetRows(rows);
        } else {
          setSheetRows([]);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unable to inspect spreadsheet tabs.';
        setSheetsError(message);
      } finally {
        setSheetsLoading(false);
      }
    },
    [],
  );

  const loadUserSpreadsheets = useCallback(
    async (token: string, preferredId?: string) => {
      setSheetsLoading(true);
      setSheetsError('');
      try {
        const files = await listUserSpreadsheets(token);
        setSpreadsheets(files);
        const targetFile =
          (preferredId && files.find((f) => f.id === preferredId)) ||
          files.find((f) => f.name.includes('Giri Darshini')) ||
          files[0];

        if (targetFile) {
          setSelectedSpreadsheetId(targetFile.id);
          setSelectedSpreadsheetUrl(
            targetFile.webViewLink ??
              `https://docs.google.com/spreadsheets/d/${targetFile.id}/edit`,
          );
          await loadSpreadsheetTabs(token, targetFile.id);
        } else {
          setSelectedSpreadsheetId('');
          setSelectedSpreadsheetUrl('');
          setSheetTabs([]);
          setSelectedSheetTitle('');
          setSheetRows([]);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unable to list Google Sheets from Drive.';
        setSheetsError(message);
      } finally {
        setSheetsLoading(false);
      }
    },
    [loadSpreadsheetTabs],
  );

  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser, token) => {
        setUser(authedUser);
        setNeedsAuth(false);
        void loadUserSpreadsheets(token);
      },
      (maybeUser) => {
        setUser(maybeUser);
        setNeedsAuth(true);
        setSpreadsheets([]);
        setSelectedSpreadsheetId('');
        setSheetTabs([]);
        setSelectedSheetTitle('');
        setSheetRows([]);
      },
    );
    return () => unsubscribe();
  }, [loadUserSpreadsheets]);

  useEffect(() => {
    if (!pendingWriteRecord) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSavingToSheet) {
        setPendingWriteRecord(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pendingWriteRecord, isSavingToSheet]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setSheetsError('');
    try {
      const result = await googleSignIn();
      setUser(result.user);
      setNeedsAuth(false);
      await loadUserSpreadsheets(result.accessToken);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Google sign-in was canceled or blocked by popup settings.';
      setSheetsError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setNeedsAuth(true);
    setSavedToSheetInfo(null);
    setPendingWriteRecord(null);
  };

  const handleCreateInquirySheet = async () => {
    const token = getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setIsCreatingSheet(true);
    setSheetsError('');
    try {
      const created = await createGiriDarshiniSpreadsheet(token);
      await loadUserSpreadsheets(token, created.spreadsheetId);
      setSelectedSpreadsheetUrl(created.spreadsheetUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not create a new Google Sheet.';
      setSheetsError(message);
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const selectedTrek =
    TREK_PACKAGES.find((t) => t.id === selectedTrekId) || TREK_PACKAGES[0];
  const estimatedTotal = selectedTrek.priceInr * groupSize;

  const buildInquiryRecord = (): TrekInquiryRecord => {
    const now = new Date();
    const idSuffix = Math.floor(1000 + Math.random() * 9000);
    return {
      submittedAt: now.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      inquiryId: `GDT-${now.getFullYear()}-${idSuffix}`,
      trekName: selectedTrek.name,
      region: selectedTrek.region,
      duration: selectedTrek.duration,
      preferredWindow: preferredMonth,
      groupSize,
      tariffPerTrekkerInr: selectedTrek.priceInr,
      estimatedTotalInr: estimatedTotal,
      fullName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      preferences: notes.trim() || 'Standard guided pace',
    };
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.replace(/\s+/g, '');

    if (trimmedName.length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address so we can send the permit sheet.');
      return;
    }
    if (!/^[+\d]{10,15}$/.test(trimmedPhone)) {
      setErrorMsg('Please enter a valid 10-digit phone or WhatsApp number.');
      return;
    }

    const record = buildInquiryRecord();
    setLastRecord(record);
    setSavedToSheetInfo(null);

    const token = getAccessToken();
    if (!needsAuth && token && selectedSpreadsheetId && selectedSheetTitle) {
      // Prompt explicit user confirmation before writing to user's Google Sheet
      setPendingWriteRecord(record);
    } else {
      setSubmitted(true);
    }
  };

  const handleConfirmSheetWrite = async () => {
    if (!pendingWriteRecord) return;
    const token = getAccessToken();
    if (!token) {
      setPendingWriteRecord(null);
      setNeedsAuth(true);
      setSheetsError('Session token expired. Please sign in with Google again.');
      return;
    }

    setIsSavingToSheet(true);
    setSheetsError('');
    try {
      const result = await appendInquiryToSheet(
        token,
        selectedSpreadsheetId,
        selectedSheetTitle,
        pendingWriteRecord,
      );
      const selectedFile = spreadsheets.find((f) => f.id === selectedSpreadsheetId);
      setSavedToSheetInfo({
        spreadsheetTitle: selectedFile?.name ?? 'Google Spreadsheet',
        sheetTitle: selectedSheetTitle,
        updatedRange: result.updatedRange,
        spreadsheetUrl:
          selectedSpreadsheetUrl ||
          `https://docs.google.com/spreadsheets/d/${selectedSpreadsheetId}/edit`,
      });
      setPendingWriteRecord(null);
      setSubmitted(true);
      await loadSheetRows(token, selectedSpreadsheetId, selectedSheetTitle);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save inquiry row to Google Sheets.';
      setSheetsError(message);
    } finally {
      setIsSavingToSheet(false);
    }
  };

  const selectedSpreadsheetName =
    spreadsheets.find((s) => s.id === selectedSpreadsheetId)?.name ?? 'Selected Spreadsheet';

  const dataRows = sheetRows.length > 1 ? sheetRows.slice(1) : [];

  return (
    <section id="plan-trek" className="py-16 sm:py-24 bg-[#ECEFEB] border-t border-[#DCE0D9]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Guidance, Estimated Summary & Google Sheets Connection */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-sm font-medium text-[#1B4332] mb-2">
                Plan Your Departure
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#111814] text-balance">
                Reserve a guided batch or private Chikmagalur trail
              </h2>
              <p className="mt-3 text-base text-[#46524B] leading-relaxed">
                Tell us which ridge you have in mind. Our Chikmagalur basecamp team coordinates Karnataka Forest Department permits, estate homestays, and 4x4 jeep transfers.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#DCE0D9] rounded-xl space-y-4">
              <div className="pb-4 border-b border-[#ECEFEB]">
                <p className="text-xs text-[#647069]">Selected Route</p>
                <p className="mt-1 font-display text-lg font-medium text-[#111814]">
                  {selectedTrek.name}
                </p>
                <p className="mt-0.5 text-xs font-mono text-[#4D5952] tabular-nums">
                  {selectedTrek.elevationMeters.toLocaleString('en-IN')} m · {selectedTrek.distanceKm} km · {selectedTrek.duration}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#46524B]">Per-trekker guided tariff</span>
                <span className="font-mono font-medium text-[#111814] tabular-nums">
                  ₹{selectedTrek.priceInr.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#46524B]">Group size</span>
                <span className="font-mono font-medium text-[#111814] tabular-nums">
                  {groupSize} {groupSize === 1 ? 'trekker' : 'trekkers'}
                </span>
              </div>

              <div className="pt-4 border-t border-[#ECEFEB] flex items-baseline justify-between">
                <span className="text-sm font-medium text-[#111814]">
                  Estimated trip total
                </span>
                <span className="font-mono text-2xl font-medium text-[#1B4332] tabular-nums">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-[#647069]">
                Includes forest permits, certified mountain leader, and Malnad estate meals. No advance payment charged here.
              </p>
            </div>

            {/* Google Sheets Workspace Sync Panel */}
            <div className="p-6 bg-white border border-[#DCE0D9] rounded-xl space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-5 h-5 text-[#1B4332] shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#111814]">
                      Google Sheets Inquiry Ledger
                    </h3>
                    <p className="text-xs text-[#647069]">
                      Store every submission in mapped spreadsheet columns
                    </p>
                  </div>
                </div>
                {!needsAuth && user && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#46524B] hover:text-[#111814] hover:bg-[#ECEFEB] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Sign out</span>
                  </button>
                )}
              </div>

              {needsAuth ? (
                <div className="pt-2 space-y-3">
                  <p className="text-xs text-[#46524B] leading-relaxed">
                    Sign in with Google to link an existing spreadsheet or auto-create a structured <span className="font-medium text-[#111814]">Giri Darshini Treks — Trek Inquiries</span> sheet with 13 mapped fields.
                  </p>
                  <GoogleSignInButton
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    label={isLoggingIn ? 'Connecting Google...' : 'Sign in with Google'}
                  />
                </div>
              ) : (
                <div className="space-y-4 pt-2 border-t border-[#ECEFEB]">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#46524B]">
                    <span className="truncate">
                      Connected as <strong className="text-[#111814]">{user?.email || user?.displayName}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const token = getAccessToken();
                        if (token) void loadUserSpreadsheets(token, selectedSpreadsheetId);
                      }}
                      disabled={sheetsLoading}
                      aria-label="Refresh Google Spreadsheets list"
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#1B4332] hover:bg-[#E7F0EA] rounded-md transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${sheetsLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* Select Existing Sheet or Create New */}
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="google-sheet-select"
                        className="block text-xs font-medium text-[#111814] mb-1"
                      >
                        Destination Spreadsheet
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          id="google-sheet-select"
                          value={selectedSpreadsheetId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setSelectedSpreadsheetId(id);
                            const token = getAccessToken();
                            if (token && id) void loadSpreadsheetTabs(token, id);
                          }}
                          disabled={sheetsLoading || spreadsheets.length === 0}
                          className="flex-1 h-10 px-3 bg-[#FAFBF9] border border-[#CFD5CB] rounded-lg text-xs text-[#111814] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                        >
                          {spreadsheets.length === 0 ? (
                            <option value="">No spreadsheets found in Drive</option>
                          ) : (
                            spreadsheets.map((file) => (
                              <option key={file.id} value={file.id}>
                                {file.name}
                              </option>
                            ))
                          )}
                        </select>

                        <button
                          type="button"
                          onClick={handleCreateInquirySheet}
                          disabled={isCreatingSheet}
                          className="px-3.5 py-2 min-h-[40px] text-xs font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
                        >
                          {isCreatingSheet ? 'Creating...' : 'Create Inquiry Sheet'}
                        </button>
                      </div>
                    </div>

                    {sheetTabs.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                        <div>
                          <label
                            htmlFor="google-sheet-tab"
                            className="block text-xs font-medium text-[#111814] mb-1"
                          >
                            Sheet Tab
                          </label>
                          <select
                            id="google-sheet-tab"
                            value={selectedSheetTitle}
                            onChange={(e) => {
                              const tab = e.target.value;
                              setSelectedSheetTitle(tab);
                              const token = getAccessToken();
                              if (token && selectedSpreadsheetId && tab) {
                                void loadSheetRows(token, selectedSpreadsheetId, tab);
                              }
                            }}
                            className="w-full h-10 px-3 bg-[#FAFBF9] border border-[#CFD5CB] rounded-lg text-xs text-[#111814] focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                          >
                            {sheetTabs.map((tab) => (
                              <option key={tab.sheetId} value={tab.title}>
                                {tab.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedSpreadsheetUrl && (
                          <a
                            href={selectedSpreadsheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 h-10 px-3 text-xs font-medium text-[#1B4332] bg-[#E7F0EA] hover:bg-[#D8E7DD] rounded-lg transition-colors whitespace-nowrap"
                          >
                            <span>Open in Google Sheets</span>
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mapped Column Structure Summary */}
                  <div className="pt-3 border-t border-[#ECEFEB] flex items-center justify-between text-xs text-[#46524B]">
                    <span>
                      Mapped columns: <strong className="text-[#111814]">13 structured fields</strong>
                    </span>
                    <span className="font-mono tabular-nums text-[#1B4332]">
                      {dataRows.length} {dataRows.length === 1 ? 'row' : 'rows'} logged
                    </span>
                  </div>
                </div>
              )}

              {sheetsError && (
                <p role="alert" className="text-xs font-medium text-[#991B1B] bg-[#FEE2E2] px-3 py-2 rounded-lg">
                  {sheetsError}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Validated Inquiry Form + Live Synced Rows Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#DCE0D9] rounded-xl p-6 sm:p-8">
              {submitted ? (
                <div className="py-6 space-y-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#E7F0EA] text-[#1B4332]">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  </div>

                  <h3 className="font-display text-2xl font-medium text-[#111814]">
                    {savedToSheetInfo
                      ? `Saved to Google Sheets for ${selectedTrek.name}`
                      : `Trek inquiry received for ${selectedTrek.name}`}
                  </h3>

                  <p className="text-sm sm:text-base text-[#46524B] leading-relaxed">
                    Thank you, <span className="font-semibold text-[#111814]">{name}</span>. Our Chikmagalur trail coordinator will verify permit availability for{' '}
                    <span className="font-medium text-[#111814]">{preferredMonth}</span> ({groupSize}{' '}
                    {groupSize === 1 ? 'trekker' : 'trekkers'}) and send your detailed route briefing to{' '}
                    <span className="font-medium text-[#111814]">{email}</span>.
                  </p>

                  {savedToSheetInfo ? (
                    <div className="p-4 bg-[#FAFBF9] border border-[#DCE0D9] rounded-lg text-xs sm:text-sm text-[#35403A] space-y-1.5">
                      <p className="font-medium text-[#111814]">
                        Recorded in {savedToSheetInfo.spreadsheetTitle} ({savedToSheetInfo.sheetTitle})
                      </p>
                      <p className="font-mono text-xs text-[#4D5952]">
                        Range: {savedToSheetInfo.updatedRange} · Reference: {lastRecord?.inquiryId}
                      </p>
                      <a
                        href={savedToSheetInfo.spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-[#1B4332] hover:underline"
                      >
                        <span>View row in Google Sheets</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  ) : lastRecord && (
                    <div className="p-4 bg-[#FAFBF9] border border-[#DCE0D9] rounded-lg space-y-3">
                      <p className="text-xs text-[#46524B]">
                        Want to store this entry directly in your Google Sheet? Connect your account and confirm saving row <span className="font-mono text-[#111814]">{lastRecord.inquiryId}</span>.
                      </p>
                      {needsAuth ? (
                        <GoogleSignInButton
                          onClick={handleGoogleLogin}
                          disabled={isLoggingIn}
                          label="Sign in with Google to Save"
                        />
                      ) : selectedSpreadsheetId && selectedSheetTitle ? (
                        <button
                          type="button"
                          onClick={() => setPendingWriteRecord(lastRecord)}
                          className="px-4 py-2 min-h-[40px] text-xs sm:text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors cursor-pointer"
                        >
                          Save This Entry to Google Sheets
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleCreateInquirySheet}
                          disabled={isCreatingSheet}
                          className="px-4 py-2 min-h-[40px] text-xs sm:text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors cursor-pointer"
                        >
                          {isCreatingSheet ? 'Creating Sheet...' : 'Create Inquiry Sheet & Continue'}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#ECEFEB] flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setSavedToSheetInfo(null);
                        setNotes('');
                      }}
                      className="px-5 py-2.5 min-h-[40px] text-sm font-medium text-[#1B4332] bg-[#E7F0EA] hover:bg-[#D8E7DD] rounded-lg transition-colors cursor-pointer"
                    >
                      Plan Another Trek
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="trek-select"
                        className="block text-sm font-medium text-[#111814] mb-1.5"
                      >
                        Choose Trek Package
                      </label>
                      <select
                        id="trek-select"
                        value={selectedTrekId}
                        onChange={(e) => setSelectedTrekId(e.target.value)}
                        className="w-full h-11 px-3.5 bg-[#FAFBF9] border border-[#CFD5CB] rounded-lg text-sm text-[#111814] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332]"
                      >
                        {TREK_PACKAGES.map((trek) => (
                          <option key={trek.id} value={trek.id}>
                            {trek.name} ({trek.duration} · ₹{trek.priceInr.toLocaleString('en-IN')})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="preferred-month"
                        className="block text-sm font-medium text-[#111814] mb-1.5"
                      >
                        Preferred Window
                      </label>
                      <select
                        id="preferred-month"
                        value={preferredMonth}
                        onChange={(e) => setPreferredMonth(e.target.value)}
                        className="w-full h-11 px-3.5 bg-[#FAFBF9] border border-[#CFD5CB] rounded-lg text-sm text-[#111814] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332]"
                      >
                        <option value="November 2026">November 2026 (Post-Monsoon Mist)</option>
                        <option value="December 2026">December 2026 (Peak Ridge Views)</option>
                        <option value="January 2027">January 2027 (Clear Dawn Skies)</option>
                        <option value="February – May 2027">February – May 2027 (Coffee Blossom)</option>
                        <option value="June – September 2027">June – September 2027 (Monsoon Emerald)</option>
                      </select>
                    </div>

                    <div>
                      <span className="block text-sm font-medium text-[#111814] mb-1.5">
                        Trekkers in Your Group (Max 12)
                      </span>
                      <div className="flex items-center justify-between h-11 px-2 bg-[#FAFBF9] border border-[#CFD5CB] rounded-lg">
                        <button
                          type="button"
                          onClick={() => setGroupSize((prev) => Math.max(1, prev - 1))}
                          aria-label="Decrease group size"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[#111814] hover:bg-[#E7EAE4] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-mono text-sm font-medium text-[#111814] tabular-nums">
                          {groupSize} {groupSize === 1 ? 'Trekker' : 'Trekkers'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGroupSize((prev) => Math.min(12, prev + 1))}
                          aria-label="Increase group size"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[#111814] hover:bg-[#E7EAE4] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="trekker-name"
                        className="block text-sm font-medium text-[#111814] mb-1.5"
                      >
                        Full Name
                      </label>
                      <input
                        id="trekker-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Siddharth Gowda"
                        className="w-full h-11 px-3.5 bg-[#FAFBF9] border border-[#CFD5CB] rounded-lg text-sm text-[#111814] placeholder:text-[#7D8781] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="trekker-phone"
                        className="block text-sm font-medium text-[#111814] mb-1.5"
                      >
                        Phone / WhatsApp
                      </label>
                      <input
                        id="trekker-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98450 12345"
                        className="w-full h-11 px-3.5 bg-[#FAFBF9] border border-[#CFD5CB] rounded-lg text-sm text-[#111814] placeholder:text-[#7D8781] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="trekker-email"
                        className="block text-sm font-medium text-[#111814] mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        id="trekker-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-11 px-3.5 bg-[#FAFBF9] border border-[#CFD5CB] rounded-lg text-sm text-[#111814] placeholder:text-[#7D8781] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="trek-notes"
                        className="block text-sm font-medium text-[#111814] mb-1.5"
                      >
                        Experience Preferences (Optional)
                      </label>
                      <textarea
                        id="trek-notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Mention preferred weekend dates, Bengaluru/Mangaluru pickup needs, dietary notes, or photography focus..."
                        className="w-full p-3.5 bg-[#FAFBF9] border border-[#CFD5CB] rounded-lg text-sm text-[#111814] placeholder:text-[#7D8781] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332]"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <p role="alert" className="text-sm font-medium text-[#991B1B] bg-[#FEE2E2] px-4 py-2.5 rounded-lg">
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-[#647069]">
                      {!needsAuth && selectedSpreadsheetId && selectedSheetTitle
                        ? `Syncing to "${selectedSpreadsheetName}" → ${selectedSheetTitle}`
                        : 'Basecamp responds within 4 hours during trail season.'}
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-3 min-h-[44px] text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B4332]"
                    >
                      {!needsAuth && selectedSpreadsheetId
                        ? 'Review & Save to Sheet'
                        : 'Request Trek Dates'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Live Synced Entries Table from Connected Google Sheet */}
            {!needsAuth && selectedSpreadsheetId && selectedSheetTitle && (
              <div className="bg-white border border-[#DCE0D9] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#ECEFEB] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <TableProperties className="w-4 h-4 text-[#1B4332]" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-[#111814]">
                      Recent Entries in {selectedSheetTitle}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const token = getAccessToken();
                      if (token) void loadSheetRows(token, selectedSpreadsheetId, selectedSheetTitle);
                    }}
                    disabled={sheetsLoading}
                    className="text-xs font-medium text-[#1B4332] hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {sheetsLoading ? 'Syncing...' : 'Sync rows'}
                  </button>
                </div>

                {dataRows.length === 0 ? (
                  <p className="px-6 py-6 text-xs text-[#647069]">
                    No inquiry rows recorded in this tab yet. Submit the form above to append your first structured record.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAFBF9] border-b border-[#ECEFEB] text-[#4D5952]">
                        <tr>
                          <th className="py-2.5 px-4 font-medium whitespace-nowrap">Inquiry ID</th>
                          <th className="py-2.5 px-4 font-medium whitespace-nowrap">Trek Package</th>
                          <th className="py-2.5 px-4 font-medium whitespace-nowrap">Trekker</th>
                          <th className="py-2.5 px-4 font-medium whitespace-nowrap">Window</th>
                          <th className="py-2.5 px-4 font-medium whitespace-nowrap text-right">Group</th>
                          <th className="py-2.5 px-4 font-medium whitespace-nowrap text-right">Est. Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ECEFEB] text-[#111814]">
                        {dataRows.slice(-6).reverse().map((row, idx) => (
                          <tr key={`${row[1] ?? idx}-${idx}`}>
                            <td className="py-2.5 px-4 font-mono tabular-nums whitespace-nowrap text-[#1B4332]">
                              {row[1] || '—'}
                            </td>
                            <td className="py-2.5 px-4 max-w-[200px] truncate">
                              {row[2] || row[0] || '—'}
                            </td>
                            <td className="py-2.5 px-4 whitespace-nowrap">
                              {row[9] || '—'}
                            </td>
                            <td className="py-2.5 px-4 whitespace-nowrap text-[#4D5952]">
                              {row[5] || '—'}
                            </td>
                            <td className="py-2.5 px-4 font-mono tabular-nums text-right">
                              {row[6] || '—'}
                            </td>
                            <td className="py-2.5 px-4 font-mono tabular-nums text-right">
                              {row[8] ? `₹${Number(row[8]).toLocaleString('en-IN')}` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory User Confirmation Dialog Before Writing/Updating Google Sheet Data */}
      {pendingWriteRecord && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-sheet-write-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B140F]/75 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSavingToSheet) {
              setPendingWriteRecord(null);
            }
          }}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F6F7F5] rounded-2xl border border-[#DCE0D9] shadow-2xl">
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#DCE0D9]">
              <div>
                <p className="text-xs font-mono text-[#1B4332]">
                  Google Sheets Confirmation
                </p>
                <h3
                  id="confirm-sheet-write-title"
                  className="font-display text-xl font-medium text-[#111814]"
                >
                  Append inquiry row to “{selectedSpreadsheetName}”
                </h3>
              </div>
              <button
                type="button"
                disabled={isSavingToSheet}
                onClick={() => setPendingWriteRecord(null)}
                aria-label="Cancel saving to Google Sheets"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#46524B] hover:text-[#111814] hover:bg-[#E7EAE4] transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm text-[#46524B] leading-relaxed">
                This will append 1 new row to tab <span className="font-semibold text-[#111814]">{selectedSheetTitle}</span>
                {sheetRows.length === 0
                  ? ' and initialize the 13 header columns in row 1.'
                  : ' using the mapped inquiry fields below.'}
              </p>

              <div className="bg-white border border-[#DCE0D9] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAFBF9] border-b border-[#ECEFEB] text-[#4D5952]">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">Sheet Field</th>
                      <th className="py-2.5 px-4 font-medium">Entry Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECEFEB] text-[#111814]">
                    {[
                      pendingWriteRecord.submittedAt,
                      pendingWriteRecord.inquiryId,
                      pendingWriteRecord.trekName,
                      pendingWriteRecord.region,
                      pendingWriteRecord.duration,
                      pendingWriteRecord.preferredWindow,
                      String(pendingWriteRecord.groupSize),
                      `₹${pendingWriteRecord.tariffPerTrekkerInr.toLocaleString('en-IN')}`,
                      `₹${pendingWriteRecord.estimatedTotalInr.toLocaleString('en-IN')}`,
                      pendingWriteRecord.fullName,
                      pendingWriteRecord.phone,
                      pendingWriteRecord.email,
                      pendingWriteRecord.preferences,
                    ].map((value, idx) => (
                      <tr key={SHEET_FIELD_HEADERS[idx]}>
                        <td className="py-2 px-4 font-medium text-[#46524B] whitespace-nowrap">
                          {SHEET_FIELD_HEADERS[idx]}
                        </td>
                        <td className="py-2 px-4 font-mono text-xs sm:text-sm tabular-nums break-words">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sheetsError && (
                <p role="alert" className="text-xs font-medium text-[#991B1B] bg-[#FEE2E2] px-3 py-2 rounded-lg">
                  {sheetsError}
                </p>
              )}

              <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSavingToSheet}
                  onClick={() => setPendingWriteRecord(null)}
                  className="px-5 py-2.5 min-h-[42px] text-sm font-medium text-[#46524B] hover:text-[#111814] bg-[#E7EAE4] hover:bg-[#DCE0D9] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingToSheet}
                  onClick={handleConfirmSheetWrite}
                  className="px-6 py-2.5 min-h-[42px] text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSavingToSheet ? 'Saving to Sheet...' : 'Confirm & Save to Sheet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
