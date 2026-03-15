// ============================================================
//  CARTIER DASHBOARD — DATA FILE
//  This is where all your data lives.
//  Later this will connect to your Google Sheet automatically.
//  For now, edit the numbers here to match your real event data.
// ============================================================

const DATA = {

  // ── EVENT META ──────────────────────────────────────────────
  eventName: "La Nuit des Pierres Précieuses",
  eventDate: "15 March 2026",
  eventVenue: "Hôtel de Crillon, Paris",

  // ── OVERVIEW KPIs ───────────────────────────────────────────
  overview: {
    totalInvited: 120,
    rsvpRate: 84,
    attendanceRate: 71,
    uhnwGuests: 38,
    avgNetWorthM: 47,
    piecesShowcased: 64,
    piecesReserved: 11
  },

  // ── ATTENDANCE FUNNEL ────────────────────────────────────────
  attendanceFunnel: [
    { label: "Invited",      value: 120, pct: 100 },
    { label: "RSVP'd",       value: 101, pct: 84  },
    { label: "Attended",     value: 85,  pct: 71  },
    { label: "Engaged HJ",   value: 65,  pct: 54  },
    { label: "Reserved",     value: 11,  pct: 13  }
  ],

  // ── GUEST COMPOSITION ────────────────────────────────────────
  guestComposition: [
    { label: "Existing Clients", value: 58, color: "#B8975A" },
    { label: "New Prospects",    value: 27, color: "#4A7FA5" }
  ],

  wealthSegment: [
    { label: "UHNW ($30M+)", value: 38, color: "#B8975A" },
    { label: "HNW ($5–30M)", value: 32, color: "#7A6540" },
    { label: "Affluent",     value: 15, color: "#3D4A5C" }
  ],

  // ── GUEST KPIs ───────────────────────────────────────────────
  guestKpis: [
    { label: "Existing Clients",  value: "58",    unit: "",    delta: "" },
    { label: "New Prospects",     value: "27",    unit: "",    delta: "" },
    { label: "Self-made Wealth",  value: "61",    unit: "%",   delta: "" },
    { label: "Avg Age Group",     value: "42",    unit: "–54", delta: "" }
  ],

  // ── PERSONAS ────────────────────────────────────────────────
  personas: [
    { label: "Altman",  value: 28, color: "#B8975A" },
    { label: "Lily",    value: 22, color: "#4A7FA5" },
    { label: "Miranda", value: 19, color: "#7EC8A0" },
    { label: "Blair",   value: 16, color: "#C87E7E" }
  ],

  // ── INDUSTRY ────────────────────────────────────────────────
  industries: [
    { label: "PE / VC",       value: 24 },
    { label: "Family Office", value: 18 },
    { label: "Tech",          value: 14 },
    { label: "Finance",       value: 13 },
    { label: "Real Estate",   value: 9  },
    { label: "Other",         value: 7  }
  ],

  // ── RELATIONSHIP MANAGERS ────────────────────────────────────
  relationshipManagers: [
    { name: "Alexandre Moreau",  referred: 14, uhnw: 7, converted: 3 },
    { name: "Isabelle Fontaine", referred: 11, uhnw: 5, converted: 2 },
    { name: "Ravi Mehta",        referred: 9,  uhnw: 4, converted: 2 },
    { name: "Charlotte Dupont",  referred: 8,  uhnw: 2, converted: 1 },
    { name: "Jin-woo Park",      referred: 7,  uhnw: 3, converted: 0 }
  ],

  // ── ENGAGEMENT KPIs ──────────────────────────────────────────
  engagementKpis: [
    { label: "Appointments Booked",   value: "42",  unit: "",    delta: "" },
    { label: "Pieces Tried On",       value: "138", unit: "",    delta: "" },
    { label: "Pieces Reserved",       value: "11",  unit: "",    delta: "" },
    { label: "Private Consultations", value: "23",  unit: "",    delta: "" },
    { label: "Follow-ups Scheduled",  value: "34",  unit: "",    delta: "" },
    { label: "Avg Salon Dwell",       value: "47",  unit: "min", delta: "" }
  ],

  // ── ENGAGEMENT FUNNEL ────────────────────────────────────────
  engagementFunnel: [
    { label: "Attended",      value: 85, pct: 100 },
    { label: "Entered Salon", value: 65, pct: 76  },
    { label: "Tried a Piece", value: 49, pct: 58  },
    { label: "Consultation",  value: 23, pct: 27  },
    { label: "Reserved",      value: 11, pct: 13  }
  ],

  // ── JEWELLERY RANKS ──────────────────────────────────────────
  jewelleryRanks: [
    { name: "Étoile de Mer Necklace",       tries: 28, pct: 82 },
    { name: "Panthère Bracelet — Emerald",  tries: 24, pct: 71 },
    { name: "Midnight Saphir Tiara",        tries: 21, pct: 62 },
    { name: "Rouge Flamme Ring",            tries: 19, pct: 56 },
    { name: "Les Ciels Brooch",             tries: 14, pct: 41 },
    { name: "Clarte du Jour Earrings",      tries: 12, pct: 35 }
  ],

  // ── SALES KPIs ───────────────────────────────────────────────
  salesKpis: [
    { label: "Day-of Sales",       value: "€2.4", unit: "M",   delta: "3 transactions",  deltaClass: "pos" },
    { label: "30-Day Pipeline",    value: "€4.1", unit: "M",   delta: "8 qualified",     deltaClass: "pos" },
    { label: "60-Day Pipeline",    value: "€2.7", unit: "M",   delta: "5 warm leads",    deltaClass: "" },
    { label: "Conversion Rate",    value: "3.5",  unit: "%",   delta: "Guest → Buyer",   deltaClass: "pos" },
    { label: "Avg Purchase",       value: "€800", unit: "K",   delta: "",                deltaClass: "" },
    { label: "Revenue / Guest",    value: "€28",  unit: "K",   delta: "",                deltaClass: "" }
  ],

  // ── REVENUE FUNNEL ───────────────────────────────────────────
  revenueFunnel: [
    { label: "Day-of",         value: 2400000 },
    { label: "30-Day",         value: 4100000 },
    { label: "60-Day",         value: 2700000 },
    { label: "Bespoke",        value: 800000  }
  ],

  // ── PERSONA SALES ────────────────────────────────────────────
  personaSales: [
    { label: "Altman",  value: 1390000, color: "#B8975A" },
    { label: "Miranda", value: 580000,  color: "#4A7FA5" },
    { label: "Lily",    value: 310000,  color: "#7EC8A0" },
    { label: "Blair",   value: 120000,  color: "#C87E7E" }
  ],

  // ── TOP PIECES ───────────────────────────────────────────────
  topPieces: [
    { name: "Étoile de Mer Necklace",       category: "High Jewellery", price: "€1.2M",  status: "Sold",     statusClass: "badge-green" },
    { name: "Panthère Bracelet — Emerald",  category: "Bracelet",       price: "€780K",  status: "Sold",     statusClass: "badge-green" },
    { name: "Midnight Saphir Tiara",        category: "Tiara",          price: "€420K",  status: "Reserved", statusClass: "badge-gold"  },
    { name: "Rouge Flamme Ring",            category: "Ring",           price: "€310K",  status: "Reserved", statusClass: "badge-gold"  },
    { name: "Les Ciels Brooch",             category: "Brooch",         price: "€195K",  status: "Pipeline", statusClass: "badge-blue"  }
  ],

  // ── ROI ──────────────────────────────────────────────────────
  roi: 3.8,

  roiKpis: [
    { label: "Venue & Décor",          value: "€380", unit: "K", delta: "" },
    { label: "Production",             value: "€220", unit: "K", delta: "" },
    { label: "Catering",               value: "€95",  unit: "K", delta: "" },
    { label: "Logistics & Security",   value: "€65",  unit: "K", delta: "" },
    { label: "Marketing & Invitations",value: "€40",  unit: "K", delta: "" },
    { label: "Total Event Cost",       value: "€800", unit: "K", delta: "" },
    { label: "Cost per Guest",         value: "€9.4", unit: "K", delta: "" },
    { label: "Cost per Acquisition",   value: "€267", unit: "K", delta: "" }
  ],

  roiChart: [
    { label: "Total Cost",     value: 800000  },
    { label: "Day-of Revenue", value: 2400000 },
    { label: "30d Pipeline",   value: 4100000 },
    { label: "60d Pipeline",   value: 2700000 },
    { label: "Total Pipeline", value: 9200000 }
  ],

  // ── RELATIONSHIPS ────────────────────────────────────────────
  relKpis: [
    { label: "Repeat Clients",     value: "41",  unit: "",     delta: "Attended prev. event", deltaClass: "" },
    { label: "New UHNW Leads",     value: "12",  unit: "",     delta: "First contact",        deltaClass: "pos" },
    { label: "Family Office Intros",value: "7",  unit: "",     delta: "",                     deltaClass: "" },
    { label: "Avg Engagement Score",value: "7.4",unit: "/10",  delta: "",                     deltaClass: "" }
  ],

  relGrowth: {
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Mar 26"],
    data:   [38,    42,    45,    50,    52,    58,    65]
  },

  clientScores: [
    { name: "Madame L. Beaumont", score: 9.2 },
    { name: "Mr T. Okafor",       score: 8.8 },
    { name: "Signora M. Rossi",   score: 8.4 },
    { name: "Lord P. Ashworth",   score: 7.9 },
    { name: "Ms Y. Chen",         score: 7.6 }
  ],

  // ── JEWELLERY INTELLIGENCE ───────────────────────────────────
  categories: [
    { label: "Necklace",  value: 32, color: "#B8975A" },
    { label: "Bracelet",  value: 21, color: "#4A7FA5" },
    { label: "Ring",      value: 18, color: "#7EC8A0" },
    { label: "Earrings",  value: 12, color: "#C87E7E" },
    { label: "Tiara",     value: 10, color: "#9B8BC4" },
    { label: "Brooch",    value: 7,  color: "#7A9B8C" }
  ],

  gemstones: [
    { label: "Emerald",     value: 38, color: "#7EC8A0" },
    { label: "Diamond",     value: 22, color: "rgba(242,236,226,0.6)" },
    { label: "Sapphire",    value: 17, color: "#4A7FA5" },
    { label: "Multi-stone", value: 12, color: "#B8975A" },
    { label: "Ruby",        value: 11, color: "#C87E7E" }
  ],

  priceBands: [
    { label: "<€100K",    value: 8  },
    { label: "€100–300K", value: 19 },
    { label: "€300–800K", value: 34 },
    { label: "€800K–2M",  value: 22 },
    { label: ">€2M",      value: 9  }
  ],

  mostViewed: [
    { name: "Étoile de Mer Necklace",      views: 68 },
    { name: "Panthère Bracelet Emerald",   views: 54 },
    { name: "Midnight Saphir Tiara",       views: 47 },
    { name: "Les Ciels Brooch",            views: 41 },
    { name: "Clarte du Jour Earrings",     views: 38 }
  ],

  // ── FOLLOW-UP ────────────────────────────────────────────────
  followupKpis: [
    { label: "Follow-up Meetings",      value: "34", unit: "", delta: "" },
    { label: "Personal Shopper Consult",value: "18", unit: "", delta: "" },
    { label: "Private Viewings Req.",   value: "11", unit: "", delta: "" },
    { label: "Bespoke Commissions",     value: "4",  unit: "", delta: "" }
  ],

  followupActions: [
    { client: "Madame L. Beaumont", action: "Private Viewing — Étoile Collection", rm: "A. Moreau",   date: "22 Mar", status: "Confirmed", statusClass: "badge-gold"  },
    { client: "Mr T. Okafor",       action: "Bespoke Commission Discussion",       rm: "I. Fontaine", date: "25 Mar", status: "Confirmed", statusClass: "badge-gold"  },
    { client: "Mme A. Nguyen",      action: "Personal Shopper — Bracelets",        rm: "R. Mehta",    date: "28 Mar", status: "Scheduled", statusClass: "badge-blue"  },
    { client: "Lord P. Ashworth",   action: "Follow-up Meeting",                   rm: "C. Dupont",   date: "1 Apr",  status: "Scheduled", statusClass: "badge-blue"  },
    { client: "Ms Y. Chen",         action: "Sapphire Tiara Private Viewing",      rm: "J. Park",     date: "3 Apr",  status: "Pending",   statusClass: "badge-red"   },
    { client: "Signora M. Rossi",   action: "Bespoke Necklace Brief",              rm: "A. Moreau",   date: "5 Apr",  status: "Pending",   statusClass: "badge-red"   }
  ],

  // ── STRATEGIC INSIGHTS ───────────────────────────────────────
  insights: [
    {
      label: "Best-Performing Persona",
      text: "Altman — Self-Made Entrepreneur drove the highest conversion rate at 14.3%, accounting for 58% of total day-of revenue.",
      sub: "Recommended: Increase Altman-profile invitee share by 20% for the next Maison event."
    },
    {
      label: "Best-Performing Category",
      text: "High Jewellery Necklaces generated 3× more reserved interest than any other category, led by statement emerald and sapphire pieces.",
      sub: "Consider increasing necklace representation from 22% to 30% of showcased collection at future events."
    },
    {
      label: "Highest Conversion Segment",
      text: "Guests referred by Alexandre Moreau converted at 21.4% — more than double the event average — suggesting a strong alignment between his portfolio and the HJ offering.",
      sub: "Prioritise Moreau's client list for targeted follow-up in the 30-day pipeline window."
    },
    {
      label: "Gemstone Demand Signal",
      text: "Emerald interest outpaced sapphire 2.3:1 across all trial and reservation activity. Demand concentrated in the €300K–€800K price band.",
      sub: "Emerald-led pieces should anchor the next private viewing curated for Altman-profile clients."
    },
    {
      label: "ROI Perspective",
      text: "Even discounting the 60-day pipeline entirely, day-of revenue alone delivers a 3.0× return. Full pipeline realisation projects 11.5× ROI.",
      sub: "Event format should be retained and scaled for Q4 2026 with a focus on Dubai and Singapore markets."
    }
  ]

};