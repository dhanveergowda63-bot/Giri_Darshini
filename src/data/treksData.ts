export interface TrekItineraryStep {
  time: string;
  title: string;
  detail: string;
}

export interface TrekPackage {
  id: string;
  name: string;
  region: string;
  elevationMeters: number;
  distanceKm: number;
  duration: '1 Day' | '2D / 1N';
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  priceInr: number;
  bestSeason: string;
  coordinates: string;
  summary: string;
  experienceHighlight: string;
  image: string;
  imageAlt: string;
  inclusions: string[];
  gearChecklist: string[];
  itinerary: TrekItineraryStep[];
}

export interface ExperienceChapter {
  id: string;
  stepCode: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  sensoryDetail: string;
  locationNote: string;
  image: string;
  imageAlt: string;
}

export interface TrailDayMoment {
  time: string;
  phase: string;
  narrative: string;
}

export interface SeasonProfile {
  id: 'monsoon' | 'post-monsoon' | 'blossom';
  name: string;
  months: string;
  tempRange: string;
  skyCharacter: string;
  description: string;
  recommendedTreks: string[];
  trailNote: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  location: string;
  category: 'Peaks & Ridges' | 'Shola & Waterfalls' | 'Camp Life';
  elevation: string;
  coordinates: string;
  cameraSpec: string;
  season: string;
  story: string;
  image: string;
  aspect: 'wide' | 'portrait' | 'standard';
}

export interface TrekkerStory {
  id: string;
  name: string;
  role: string;
  organization: string;
  trekCompleted: string;
  quote: string;
}

export const IMAGES = {
  heroRidge: '/src/assets/images/hero_chikmagalur_ridge_1795063170341.jpg',
  kudremukh: '/src/assets/images/trek_kudremukh_grasslands_1795063170800.jpg',
  netravati: '/src/assets/images/trek_netravati_ridge_1795063171330.jpg',
  bababudangiri: '/src/assets/images/trek_bababudangiri_shola_1795063171557.jpg',
  malnadCamp: '/src/assets/images/experience_malnad_camp_1795063172961.jpg',
  hebbeFalls: '/src/assets/images/gallery_hebbe_waterfall_1795063172030.jpg',
} as const;

export const TREK_PACKAGES: TrekPackage[] = [
  {
    id: 'mullayanagiri-bababudangiri',
    name: 'Mullayanagiri to Baba Budangiri Ridge',
    region: 'Chandra Drona Parvatha Range',
    elevationMeters: 1930,
    distanceKm: 14,
    duration: '1 Day',
    difficulty: 'Moderate',
    priceInr: 1850,
    bestSeason: 'September – February',
    coordinates: '13.3909° N, 75.7213° E',
    summary:
      'Traverse Karnataka’s highest crest along a wind-swept knife-edge trail connecting Sarpadhari, Mullayanagiri summit, and the sacred Manikyadhara ridges.',
    experienceHighlight:
      'Walk above a sea of morning valley clouds at dawn, pausing at hidden stone shrines and wind-sculpted shola groves.',
    image: IMAGES.heroRidge,
    imageAlt:
      'Trekkers walking at sunrise along the emerald ridge trail of Mullayanagiri above valley clouds in Chikmagalur',
    inclusions: [
      'Certified local Chikmagalur mountain leader',
      'Forest check-post permissions and trail entry',
      'Hot Malnad breakfast & estate filter coffee',
      'Trail energy snacks and first-aid support',
    ],
    gearChecklist: [
      'High-grip trail shoes with ankle support',
      '2L reusable water bottle and windcheater',
      'Light fleece layer for early ridge winds',
      'Sun protection and personal rain poncho',
    ],
    itinerary: [
      {
        time: '05:15',
        title: 'Sarpadhari Foothill Briefing',
        detail:
          'Meet your Giri Darshini lead guide at the base trailhead with warm ginger kashaya before ascending through misty scrub forest.',
      },
      {
        time: '07:10',
        title: 'Mullayanagiri Summit at 1,930 m',
        detail:
          'Reach the highest point in Karnataka as golden sunlight breaks across the Baba Budangiri amphitheatre.',
      },
      {
        time: '10:30',
        title: 'Knife-Edge Ridge Walk',
        detail:
          'Follow the undulating grassland spine toward Baba Budangiri with uninterrupted views into the Bhadra valley.',
      },
      {
        time: '14:00',
        title: 'Estate Lunch & Dispersal',
        detail:
          'Descend to a family-run coffee estate for traditional akki rotti, bamboo shoot curry, and fresh Arabica brew.',
      },
    ],
  },
  {
    id: 'kudremukh-shola-summit',
    name: 'Kudremukh Shola Summit',
    region: 'Kudremukh National Park, Kalasa',
    elevationMeters: 1894,
    distanceKm: 20,
    duration: '2D / 1N',
    difficulty: 'Challenging',
    priceInr: 3450,
    bestSeason: 'October – February',
    coordinates: '13.1294° N, 75.2683° E',
    summary:
      'Cross crystal mountain streams, ancient shola forest corridors, and 13 rolling grass knolls to stand atop the iconic horse-face peak of the Western Ghats.',
    experienceHighlight:
      'Spend the night inside a quiet Mullodi Malnad homestay beside the Somavahini stream before a misty forest ascent.',
    image: IMAGES.kudremukh,
    imageAlt:
      'Rolling green montane grasslands and shola forest pockets leading toward Kudremukh peak in Chikmagalur',
    inclusions: [
      'Kudremukh National Park permit & forest guide fee',
      '1 night stay at our partner Mullodi estate homestay',
      '4 home-cooked Malnad meals & packed summit lunch',
      '4x4 jeep transfer from Balagal to Mullodi base',
    ],
    gearChecklist: [
      'Broken-in trekking boots & leech socks (monsoon)',
      'Quick-dry layers and dry bag for electronics',
      '2.5L hydration capacity & trekking pole',
      'Government photo ID for forest checkpoint',
    ],
    itinerary: [
      {
        time: 'Day 1 · 15:00',
        title: 'Mullodi Basecamp Arrival',
        detail:
          '4x4 jeep ride up stone-paved forest tracks to Mullodi hamlet, followed by stream walk and evening campfire briefing.',
      },
      {
        time: 'Day 2 · 05:30',
        title: 'Shola Canopy & Ontimara Crossing',
        detail:
          'Enter the protected evergreen corridor, cross clear hill streams, and pause beneath the lone landmark tree.',
      },
      {
        time: 'Day 2 · 10:15',
        title: 'Kudremukh Summit Ridge',
        detail:
          'Climb the final steep grass switchbacks to 1,894 m overlooking cascading valley walls and Arabian Sea mist.',
      },
      {
        time: 'Day 2 · 16:30',
        title: 'Homestay Return & Filter Coffee',
        detail:
          'Descend via Lobo Estate ruins for hot neeru dose, black coffee, and warm showers before departure.',
      },
    ],
  },
  {
    id: 'netravati-cloud-walk',
    name: 'Netravati Peak Cloud Walk',
    region: 'Samse & Kudremukh Buffer Zone',
    elevationMeters: 1520,
    distanceKm: 13,
    duration: '2D / 1N',
    difficulty: 'Moderate',
    priceInr: 3100,
    bestSeason: 'June – February',
    coordinates: '13.1731° N, 75.3490° E',
    summary:
      'A dramatic ridge-line ascent rising straight out of tea and coffee plantations into swirling monsoon clouds and emerald valley amphitheatres.',
    experienceHighlight:
      'Watch cloud banks drift directly across your path along the upper saddle while listening to Malabar whistling thrushes.',
    image: IMAGES.netravati,
    imageAlt:
      'Hikers ascending the sunlit green ridge of Netravati Peak above drifting white valley clouds in Chikmagalur',
    inclusions: [
      'Forest department entry & Samse jeep transfers',
      '1 night heritage estate homestay near Kalasa',
      'All Malnad vegetarian & coastal-spice meals',
      'Naturalist guide & safety radio communication',
    ],
    gearChecklist: [
      'Trail shoes with deep mud lugs',
      'Waterproof shell jacket & spare dry socks',
      '2L water bottle & small 20L daypack',
      'Headlamp for early plantation departure',
    ],
    itinerary: [
      {
        time: 'Day 1 · 16:00',
        title: 'Kalasa Estate Check-In',
        detail:
          'Settle into our hillside estate camp surrounded by areca groves and pepper vines; dusk walk to a private stream.',
      },
      {
        time: 'Day 2 · 06:00',
        title: 'Coffee Slope Ascent',
        detail:
          'Start from the plantation edge in cool morning air, climbing steadily under silver oak and cardamom shade.',
      },
      {
        time: 'Day 2 · 09:45',
        title: 'Netravati Saddle & Summit',
        detail:
          'Emerge onto the open grassy crest with panoramic views stretching across the Dakshina Kannada escarpment.',
      },
      {
        time: 'Day 2 · 15:00',
        title: 'Tea Estate Descent',
        detail:
          'Return through misty Samse tea slopes for a hot traditional Malnad lunch.',
      },
    ],
  },
  {
    id: 'bababudangiri-shola-immersion',
    name: 'Baba Budangiri & Shola Forest Trail',
    region: 'Kemmangundi — Devirammanabetta Corridor',
    elevationMeters: 1750,
    distanceKm: 12,
    duration: '1 Day',
    difficulty: 'Easy',
    priceInr: 1650,
    bestSeason: 'Year-round (Peak: Aug – Jan)',
    coordinates: '13.4241° N, 75.7644° E',
    summary:
      'Walk the birthplace of Indian coffee through mossy shola tunnels, cascading seasonal rills, and wild orchid slopes with a local estate naturalist.',
    experienceHighlight:
      'Taste freshly roasted single-estate Arabica brewed trailside after emerging from century-old misty shola canopies.',
    image: IMAGES.bababudangiri,
    imageAlt:
      'Sunbeams filtering through mossy shola trees and wild coffee bushes along a forest trail in Baba Budangiri',
    inclusions: [
      'Estate naturalist & coffee heritage walk',
      'Trailside hand-poured estate coffee tasting',
      'Mid-day Malnad lunch & mineral refills',
      'Forest permit coordination',
    ],
    gearChecklist: [
      'Comfortable walking or trail shoes',
      'Light rain layer & 1.5L water bottle',
      'Camera or binoculars for birdwatching',
    ],
    itinerary: [
      {
        time: '06:30',
        title: 'Shade-Grown Estate Entry',
        detail:
          'Begin under towering jackfruit and silver oak canopies heavy with wild pepper and ripening red coffee cherries.',
      },
      {
        time: '08:45',
        title: 'Mossy Shola Corridor',
        detail:
          'Spot endemic birds, giant Malabar squirrels, and bracket fungi along quiet, shaded earthen paths.',
      },
      {
        time: '11:00',
        title: 'Galikere High Meadow',
        detail:
          'Break out onto cool high-altitude grasslands for panoramic ridge views and freshly brewed pour-over coffee.',
      },
      {
        time: '14:30',
        title: 'Estate Courtyard Lunch',
        detail:
          'Conclude with traditional Malnad hospitality and stories of Chikmagalur’s 17th-century coffee origins.',
      },
    ],
  },
  {
    id: 'bandaje-ballalarayana-durga',
    name: 'Bandaje Arbi & Ballalarayana Durga',
    region: 'Charmadi — Mudigere Highlands',
    elevationMeters: 1509,
    distanceKm: 18,
    duration: '2D / 1N',
    difficulty: 'Challenging',
    priceInr: 3650,
    bestSeason: 'October – March',
    coordinates: '13.1035° N, 75.4321° E',
    summary:
      'Link a 12th-century Hoysala hilltop fort ruin with a dramatic cliff-edge waterfall plunge deep inside the Charmadi ridge system.',
    experienceHighlight:
      'Stand beside a 200-foot cascade dropping straight off the Western Ghats escarpment before camping under clear ridge skies.',
    image: IMAGES.malnadCamp,
    imageAlt:
      'Evening trekking basecamp with glowing campfire, canvas tents, and brass filter coffee overlooking Chikmagalur mountain ridges',
    inclusions: [
      'Forest permits for Durgadahalli — Bandaje corridor',
      '1 night highland tented basecamp & sleeping gear',
      '4 hearty mountain meals & campfire coffee',
      'Two certified mountain guides for ridge safety',
    ],
    gearChecklist: [
      'Sturdy ankle-high trekking boots',
      'Warm night layer (temperatures drop to 12°C)',
      'Headtorch, 2L hydration, & personal mug',
    ],
    itinerary: [
      {
        time: 'Day 1 · 15:30',
        title: 'Sunkasale Foothill Basecamp',
        detail:
          'Arrive at our ridge-facing campsite, pitch gear, and share hot filter coffee around the dusk fire.',
      },
      {
        time: 'Day 2 · 05:30',
        title: 'Ballalarayana Durga Fort Ascent',
        detail:
          'Climb steeply from forest cover to the weathered stone bastions of the medieval Hoysala hill fortress.',
      },
      {
        time: 'Day 2 · 09:30',
        title: 'Bandaje Arbi Escarpment',
        detail:
          'Traverse rolling ridges to the edge of Bandaje Falls, where mountain streams plunge down sheer basalt cliffs.',
      },
      {
        time: 'Day 2 · 16:00',
        title: 'Valikunja Descent',
        detail:
          'Descend through quiet woodland trails back to basecamp for warm Malnad snacks before heading home.',
      },
    ],
  },
  {
    id: 'hebbe-kemmangundi-mist',
    name: 'Kemmangundi Z-Point & Hebbe Falls',
    region: 'Bhadra Wildlife Sanctuary Edge',
    elevationMeters: 1434,
    distanceKm: 11,
    duration: '1 Day',
    difficulty: 'Easy',
    priceInr: 1550,
    bestSeason: 'August – March',
    coordinates: '13.5419° N, 75.7242° E',
    summary:
      'Pair the sweeping Shanti Falls ridge walk to Z-Point with a guided forest descent into the misty double-tiered basin of Hebbe Falls.',
    experienceHighlight:
      'Feel the cool spray of Dodda Hebbe and Chikka Hebbe waterfalls deep beneath ancient jungle canopy.',
    image: IMAGES.hebbeFalls,
    imageAlt:
      'Hebbe Falls cascading over dark basalt cliffs framed by emerald rainforest canopy and mist in Chikmagalur',
    inclusions: [
      'Sanctuary jeep permit & local forest escort',
      'Guided ridge walk to Z-Point summit',
      'Morning estate breakfast & packed lunch',
      'Leech protection & medical kit',
    ],
    gearChecklist: [
      'Wet-grip outdoor sandals or trail shoes',
      'Quick-dry towel & spare change of clothes',
      'Dry pouch for phone and camera',
    ],
    itinerary: [
      {
        time: '06:30',
        title: 'Kemmangundi Raj Bhavan Start',
        detail:
          'Walk past cool hill-station gardens onto the steep grassy spur leading to Shanti Falls and Z-Point.',
      },
      {
        time: '08:45',
        title: 'Z-Point Ridge Panorama',
        detail:
          'Take in sweeping 360-degree views across deep green gorges and drifting morning cloud layers.',
      },
      {
        time: '11:30',
        title: 'Coffee Estate Jeep Track',
        detail:
          'Transfer by 4x4 through dense wild coffee estates into the inner Bhadra buffer forest.',
      },
      {
        time: '13:00',
        title: 'Hebbe Falls Forest Immersion',
        detail:
          'Trek down wet stone paths to the roaring 168-metre cascade before returning to Chikmagalur town by dusk.',
      },
    ],
  },
];

export const EXPERIENCE_CHAPTERS: ExperienceChapter[] = [
  {
    id: 'predawn-ascents',
    stepCode: '01',
    number: '01. Pre-Dawn Shola Ascents',
    title: 'Step onto the ridge before the valley wakes',
    subtitle: 'Quiet starts at 05:15 AM from hillside estates',
    description:
      'We avoid crowded midday tourist convoys. Every Giri Darshini trek departs before first light with steaming ginger-jaggery kashaya, reaching the upper grass ridges just as low mist parts over the Bhadra and Tunga valleys.',
    sensoryDetail: 'Cool 14°C ridge wind · Woodsmoke and wet moss · First gold over Mullayanagiri',
    locationNote: 'Chandra Drona & Kudremukh Sectors',
    image: IMAGES.heroRidge,
    imageAlt:
      'Golden sunrise piercing low mountain clouds as trekkers walk along the Mullayanagiri ridge trail in Chikmagalur',
  },
  {
    id: 'coffee-spice-trails',
    stepCode: '02',
    number: '02. Living Coffee & Spice Trails',
    title: 'Walk beneath 100-year-old silver oak and wild cardamom',
    subtitle: 'Guided by Malnad naturalists who grew up on these slopes',
    description:
      'Chikmagalur is more than peaks—it is a living tapestry of shade-grown Arabica, wild cardamom, Malabar giant squirrels, and endemic shola orchids. Our local guides interpret bird calls, forest flora, and centuries-old estate lore along every kilometre.',
    sensoryDetail: 'Wild pepper aroma · Silver oak canopy · Birdsong in rain-washed ravines',
    locationNote: 'Baba Budangiri & Kalasa Highlands',
    image: IMAGES.bababudangiri,
    imageAlt:
      'Morning sunbeams filtering through mossy shola trees and wild Arabica coffee bushes along a Chikmagalur trail',
  },
  {
    id: 'malnad-hospitality',
    stepCode: '03',
    number: '03. Fireside Malnad Hospitality',
    title: 'Unwind by woodfire with single-estate brass filter coffee',
    subtitle: 'Brass davara filter coffee & wood-fired estate kitchens',
    description:
      'A great mountain day ends slowly. Back at our partner family homestays and ridge camps, dry boots come off beside an evening fire while freshly roasted Chikmagalur Arabica, hot akki rotti, and kadabu are served under crisp mountain stars.',
    sensoryDetail: 'Single-estate Arabica · Charcoal hearth warmth · Night sky at 1,200 m',
    locationNote: 'Mullodi, Samse & Mudigere Camps',
    image: IMAGES.malnadCamp,
    imageAlt:
      'Dusk trekker basecamp in Chikmagalur with glowing campfire, canvas tents, and steaming brass filter coffee cups',
  },
  {
    id: 'trail-stewardship',
    stepCode: '04',
    number: '04. Small-Batch Trail Stewardship',
    title: 'Small groups, quiet trails, and zero-plastic packing',
    subtitle: 'Capped at 12 trekkers with permits handled end-to-end',
    description:
      'Fragile shola grasslands cannot sustain megabus tourism. We cap departures at 12 guests, secure all Karnataka Forest Department permits in advance, brief every group on zero-plastic packing, and maintain certified wilderness first-aid kits on every hike.',
    sensoryDetail: '1:6 guide-to-trekker ratio · Zero single-use plastics · Certified mountain leads',
    locationNote: 'All Western Ghats Protected Corridors',
    image: IMAGES.kudremukh,
    imageAlt:
      'Untouched rolling shola grasslands and winding narrow footpath leading toward Kudremukh peak in the Western Ghats',
  },
];

export const TRAIL_DAY_TIMELINE: TrailDayMoment[] = [
  {
    time: '05:15',
    phase: 'Warm Kashaya & Trailhead Briefing',
    narrative: 'Headlamps on, lace up boots over hot ginger-pepper decoction while mist hangs low in the areca valley.',
  },
  {
    time: '07:30',
    phase: 'Above the Cloud Inversion',
    narrative: 'Break out of dense shola tree-line onto open montane grasslands as sunlight sweeps the eastern ridges.',
  },
  {
    time: '12:30',
    phase: 'Stream Crossing & Estate Lunch',
    narrative: 'Cool your feet in clear Western Ghats hill water and unpack banana-leaf parcels of Malnad fare.',
  },
  {
    time: '18:30',
    phase: 'Brass Tumbler Filter Coffee',
    narrative: 'Watch blue twilight settle over the coffee slopes with slow-dripped dark roast and warm campfire embers.',
  },
];

export const CHIKMAGALUR_SEASONS: SeasonProfile[] = [
  {
    id: 'monsoon',
    name: 'Monsoon Emerald',
    months: 'June – September',
    tempRange: '16°C – 22°C',
    skyCharacter: 'Fast-moving silver mist & dramatic rain squalls',
    description:
      'The Western Ghats turn impossibly saturated green. Dozens of seasonal cascades burst down every basalt ravine while clouds surge right across the Netravati and Baba Budangiri ridges.',
    recommendedTreks: ['Netravati Peak Cloud Walk', 'Kemmangundi Z-Point & Hebbe Falls'],
    trailNote: 'Waterproof shell & leech socks provided by our camp team.',
  },
  {
    id: 'post-monsoon',
    name: 'Post-Monsoon Mist & Ridge Clearings',
    months: 'October – January',
    tempRange: '12°C – 24°C',
    skyCharacter: 'Crisp valley cloud inversions & starlit nights',
    description:
      'Peak trekking season across Chikmagalur. Streams remain full, mountain grasses sway waist-high in golden-green hues, and dawn sunrises reveal unbroken views for 60 kilometres.',
    recommendedTreks: ['Kudremukh Shola Summit', 'Mullayanagiri to Baba Budangiri Ridge', 'Bandaje Arbi'],
    trailNote: 'High permit demand — book 2 to 3 weeks ahead for weekend batches.',
  },
  {
    id: 'blossom',
    name: 'Coffee Blossom & Golden Ridges',
    months: 'February – May',
    tempRange: '17°C – 29°C',
    skyCharacter: 'Clear high-altitude horizons & fragrant estate evenings',
    description:
      'Early summer showers trigger the iconic white coffee blossoms across Chikmagalur’s hills, filling shaded estate trails with a jasmine-like fragrance and crisp visibility at summit crests.',
    recommendedTreks: ['Baba Budangiri & Shola Forest Trail', 'Mullayanagiri Dawn Traverse'],
    trailNote: 'Early 05:00 AM starts keep every ascent cool and shaded.',
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-mullayanagiri-dawn',
    title: 'First Light on the Sarpadhari Spine',
    location: 'Mullayanagiri Ridge, Chikmagalur',
    category: 'Peaks & Ridges',
    elevation: '1,930 m',
    coordinates: '13.3909° N, 75.7213° E',
    cameraSpec: '35mm · f/8 · 1/320s · ISO 160',
    season: 'November Inversion',
    story:
      'A small batch of seven trekkers traverses the upper stone ridge twenty minutes after sunrise while dense cloud blankets the valleys below.',
    image: IMAGES.heroRidge,
    aspect: 'wide',
  },
  {
    id: 'gal-hebbe-cascade',
    title: 'Basalt Veil at Dodda Hebbe',
    location: 'Bhadra Sanctuary Edge, Kemmangundi',
    category: 'Shola & Waterfalls',
    elevation: '1,120 m',
    coordinates: '13.5419° N, 75.7242° E',
    cameraSpec: '28mm · f/11 · 1/15s · ISO 100',
    season: 'Late Monsoon',
    story:
      'Tucked deep inside wild coffee groves and evergreen ferns, Hebbe drops in two hushed stages into a cold emerald rock pool.',
    image: IMAGES.hebbeFalls,
    aspect: 'portrait',
  },
  {
    id: 'gal-kudremukh-waves',
    title: 'Thirteen Hills to the Horse-Face Peak',
    location: 'Kudremukh National Park',
    category: 'Peaks & Ridges',
    elevation: '1,894 m',
    coordinates: '13.1294° N, 75.2683° E',
    cameraSpec: '24mm · f/9 · 1/250s · ISO 200',
    season: 'October Mist',
    story:
      'Wild purple kurinji and monsoon grass border the narrow footpath winding between dark pockets of pristine shola forest.',
    image: IMAGES.kudremukh,
    aspect: 'standard',
  },
  {
    id: 'gal-netravati-clouds',
    title: 'Saddle Above the Dakshina Escarpment',
    location: 'Netravati Peak, Samse',
    category: 'Peaks & Ridges',
    elevation: '1,520 m',
    coordinates: '13.1731° N, 75.3490° E',
    cameraSpec: '24mm · f/8 · 1/400s · ISO 100',
    season: 'Post-Monsoon',
    story:
      'Morning updrafts push white coastal clouds vertically against the steep western face while the crest trail stays bathed in sun.',
    image: IMAGES.netravati,
    aspect: 'standard',
  },
  {
    id: 'gal-bababudangiri-rays',
    title: 'Sunbeams in the Coffee Shola',
    location: 'Baba Budangiri Slopes',
    category: 'Shola & Waterfalls',
    elevation: '1,610 m',
    coordinates: '13.4241° N, 75.7644° E',
    cameraSpec: '35mm · f/5.6 · 1/125s · ISO 400',
    season: 'December Dawn',
    story:
      'Mist lingers beneath ancient moss-draped trees as estate trails wake to the scent of wet earth and ripening Arabica.',
    image: IMAGES.bababudangiri,
    aspect: 'standard',
  },
  {
    id: 'gal-malnad-dusk',
    title: 'Brass Davara & Blue Ridges at Camp',
    location: 'Mudigere Highland Basecamp',
    category: 'Camp Life',
    elevation: '1,240 m',
    coordinates: '13.1035° N, 75.4321° E',
    cameraSpec: '35mm · f/2.8 · 1/60s · ISO 800',
    season: 'January Twilight',
    story:
      'Steaming Chikmagalur filter coffee poured in traditional brass tumblers as dusk settles over the layered silhouettes of Charmadi.',
    image: IMAGES.malnadCamp,
    aspect: 'wide',
  },
];

export const TREKKER_STORIES: TrekkerStory[] = [
  {
    id: 'story-ananya',
    name: 'Ananya Deshpande',
    role: 'Architectural Photographer',
    organization: 'Bengaluru Studio Collective',
    trekCompleted: 'Kudremukh Shola Summit · 2D / 1N',
    quote:
      'Starting at 5:30 AM from Mullodi meant we had the shola stream crossings almost to ourselves. Our guide knew every ridge wind pattern and timed our summit arrival right as the cloud wall parted.',
  },
  {
    id: 'story-rohan',
    name: 'Rohan & Kavya Nair',
    role: 'Product Lead & Botanist',
    organization: 'Mysuru',
    trekCompleted: 'Mullayanagiri to Baba Budangiri Ridge',
    quote:
      'We wanted more than a hurried selfie at Mullayanagiri. Giri Darshini paced the 14 km ridge traverse effortlessly, showed us wild ground orchids along the way, and ended with the best estate akki rotti we have ever eaten.',
  },
  {
    id: 'story-vikram',
    name: 'Vikramaditya Hegde',
    role: 'Endurance Cyclist',
    organization: 'Mangaluru Trail Club',
    trekCompleted: 'Bandaje Arbi & Ballalarayana Durga',
    quote:
      'Permits, jeep transfers, sleeping tents, and hot brass-tumbler coffee were handled without a single hiccup. Their 12-person group cap completely changed how peaceful the Western Ghats felt.',
  },
];
