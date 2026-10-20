export type Equipment = {
  slug: string;
  image: string;
  brand: string;
  name: string;
  category: "Wireless" | "Digital mixing" | "Keys";
  type: string;
  description: string;
  overview: string;
  features: readonly string[];
  uses: readonly string[];
};

export const equipment: readonly Equipment[] = [
  {
    slug: "sennheiser-ew-iem-g4", image: "/site/equipment/iem-g4.webp", brand: "Sennheiser", name: "EW IEM G4", category: "Wireless", type: "In-ear monitoring",
    description: "Wireless in-ear monitoring for live performance. A dependable stage monitoring system for artists and production teams.",
    overview: "Sennheiser’s evolution wireless G4 in-ear system pairs the half-rack SR IEM G4 stereo transmitter with the EK IEM G4 bodypack receiver. It gives each performer a consistent personal mix from soundcheck to encore, without wedges crowding the stage or bleeding into vocal mics.",
    features: [
      "SR IEM G4 transmitter sends a stereo or mono mix to each bodypack",
      "EK IEM G4 receiver with limiter and Focus mode for balancing two mix sources",
      "Infrared sync for fast frequency setup between transmitter and receiver",
      "Up to 1,680 tunable frequencies across a 42 MHz switching range",
      "Network monitoring and control through Sennheiser Wireless Systems Manager",
    ],
    uses: ["Vocalists and band members on personal mixes", "Click and cue feeds for drummers and musical directors", "Presenters and hosts who need program audio and producer cues"],
  },
  {
    slug: "sennheiser-ew-500-g4", image: "/site/equipment/ew-500.webp", brand: "Sennheiser", name: "EW-500 G4", category: "Wireless", type: "Handhelds & bodypacks",
    description: "Handheld and bodypack wireless systems for vocal and instrument applications.",
    overview: "The 500 series is the top tier of Sennheiser’s analog evolution wireless G4 line. Handheld SKM 500 G4 and bodypack SK 500 G4 transmitters feed the true-diversity EM 300-500 G4 receiver — a proven combination for vocals, speeches, lavalier and instrument work.",
    features: [
      "True-diversity EM 300-500 G4 receiver with balanced XLR and 1/4-inch outputs",
      "Wide 88 MHz switching range for flexible frequency planning",
      "Handheld transmitters accept Sennheiser evolution microphone capsules",
      "Bodypacks for lavalier, headset and instrument-cable applications",
      "Ethernet networking for Sennheiser Wireless Systems Manager",
    ],
    uses: ["Lead and background vocals", "Keynotes, panels and award presentations", "Wireless guitar and bass via instrument cable"],
  },
  {
    slug: "sennheiser-ew-dx", image: "/site/equipment/ew-dx.webp", brand: "Sennheiser", name: "EW-DX", category: "Wireless", type: "Digital wireless",
    description: "Digital UHF wireless microphone and instrument bodypack systems for demanding live productions.",
    overview: "EW-DX is Sennheiser’s digital evolution wireless platform. It delivers clean digital audio over UHF with low latency, an equidistant channel grid that makes multi-channel planning far simpler than analog, and optional AES-256 encryption for confidential events.",
    features: [
      "Digital UHF transmission with roughly 1.9 ms of latency",
      "Equidistant frequency grid for straightforward multi-channel coordination",
      "Link Density mode for high channel counts in crowded spectrum",
      "Optional AES-256 encryption",
      "Handheld and bodypack transmitters for vocals, lavalier, headset and instruments",
    ],
    uses: ["High-channel-count shows and festivals", "Corporate events that require encrypted audio", "Wireless instruments where latency matters"],
  },
  {
    slug: "midas-m32r", image: "/site/equipment/m32r.webp", brand: "Midas", name: "M32R", category: "Digital mixing", type: "Digital console",
    description: "Compact digital live mixing console with Midas preamps, motorized faders, and onboard processing.",
    overview: "The M32R puts the full M32 engine — 40 input channels and 25 mix buses — into a console small enough for tight FOH positions and side-stage monitor worlds. Add a DL32 stage box over AES50 and it scales to a full band production.",
    features: [
      "40 input channels and 25 mix buses",
      "16 Midas PRO microphone preamps and 8 XLR outputs onboard",
      "17 motorized faders",
      "Two AES50 ports for stage boxes such as the DL32",
      "Eight stereo effects engines, plus remote mixing from M32-Mix on iPad",
    ],
    uses: ["Front-of-house for clubs, showcases and private events", "Side-stage monitor mixing", "Multitrack recording and virtual soundcheck"],
  },
  {
    slug: "midas-m32c", image: "/site/equipment/m32c.webp", brand: "Midas", name: "M32C", category: "Digital mixing", type: "Rack-mount mixer",
    description: "The M32 mixing platform in a compact rack-mount format. Pair with a stage box for remote mixing.",
    overview: "The M32C is the M32 processing engine in a rack-mount chassis. Pair it with a DL32 stage box over AES50 and mix from a laptop or tablet anywhere in the room — ideal when there is no space, or no sightline, for a full console.",
    features: [
      "Same 40-input, 25-bus engine as the M32 consoles",
      "Two AES50 ports for Midas stage boxes",
      "Control from M32-Edit on a computer or M32-Mix on iPad",
      "Show files interchangeable with M32 consoles",
      "Compact rack footprint for fly packs and tight positions",
    ],
    uses: ["Tablet-mixed corporate and private events", "Monitor engines in a rack beside the stage", "Compact fly packs for touring"],
  },
  {
    slug: "midas-dl32", image: "/site/equipment/dl32.webp", brand: "Midas", name: "DL32", category: "Digital mixing", type: "Digital stage box",
    description: "32-input, 16-output stage box with Midas preamps and AES50 connectivity.",
    overview: "The DL32 replaces a heavy analog snake with a single shielded Cat5e run. It puts 32 Midas PRO preamps and 16 outputs on stage and connects to any M32 console or M32C over AES50.",
    features: [
      "32 Midas PRO microphone preamps",
      "16 XLR outputs for wedges, amps and side-fills",
      "Two AES50 ports for a second stage box or a shared monitor console",
      "Single shielded Cat5e connection of up to 100 m",
      "Remote preamp control from the console",
    ],
    uses: ["Stage I/O for M32R and M32C systems", "Long FOH runs in ballrooms and outdoor venues", "Splitting inputs between FOH and monitors"],
  },
  {
    slug: "allen-heath-dlive-c1500", image: "/site/equipment/c1500.webp", brand: "Allen & Heath", name: "C1500", category: "Digital mixing", type: "Mixing surface",
    description: "Compact mixing surface for live audio productions. Ask us about compatible system configurations.",
    overview: "The C1500 is the most compact surface in Allen & Heath’s dLive C Class. It brings dLive’s 96 kHz processing and workflow to small footprints: 12 fader strips, a 12-inch touchscreen and a gigaACE link to a MixRack such as the CDM48.",
    features: [
      "12 fader strips across multiple layers",
      "12-inch capacitive touchscreen",
      "Connects to a dLive MixRack over a single gigaACE link",
      "Remote control from dLive Director software and the MixPad app",
      "dLive show files move between surfaces and MixRacks",
    ],
    uses: ["Engineers who request dLive on their rider", "Monitor mixing for touring acts", "Theater, corporate and broadcast-style productions"],
  },
  {
    slug: "allen-heath-dlive-cdm48", image: "/site/equipment/cdm48.webp", brand: "Allen & Heath", name: "CDM48", category: "Digital mixing", type: "Mix engine",
    description: "Digital mix engine for live sound configurations. Contact us to discuss your production’s I/O requirements.",
    overview: "The CDM48 is a dLive C Class MixRack: the processing core and stage I/O of a dLive system. It runs the same XCVI engine as Allen & Heath’s largest dLive racks and connects to C Class or S Class surfaces over gigaACE.",
    features: [
      "dLive XCVI core with 128 input channels and 64 configurable mix buses",
      "96 kHz processing",
      "48 mic/line inputs and 24 outputs on the rack",
      "gigaACE connection to the control surface",
      "Expansion for additional I/O and networking cards",
    ],
    uses: ["Pairing with the C1500 surface", "Rider-specified dLive systems", "Large input counts in a compact rack"],
  },
  {
    slug: "nord-stage-3", image: "/site/equipment/stage-3.webp", brand: "Nord", name: "Stage 3", category: "Keys", type: "Stage piano",
    description: "Weighted stage piano with piano, organ, and synthesizer engines. A familiar instrument for the live stage.",
    overview: "The Nord Stage 3 is one of the most requested keyboards on touring riders. Piano, organ and synth sections live in one red instrument, so most players can rebuild their sounds from a backup and play the show without learning a new board.",
    features: [
      "88-note weighted hammer-action keybed",
      "Piano section using the Nord Piano Library",
      "Organ section with B3, Vox, Farfisa and pipe organ models",
      "Synth section with virtual analog engines and Nord Sample Library playback",
      "Seamless transitions between programs, plus four audio outputs",
    ],
    uses: ["Touring keyboard players working from their own backups", "Musical directors and session players", "Worship, theater and corporate bands"],
  },
];

export const categories = ["All equipment", "Wireless", "Digital mixing", "Keys"] as const;

export const findEquipment = (slug: string) => equipment.find(item => item.slug === slug);
