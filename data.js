// ============================================================
//  CARTIER DASHBOARD — LIVE DATA
//  Fetches directly from your Google Sheet every page load.
//  To update the dashboard: just edit your Google Sheet.
// ============================================================

const SHEET_ID = '2PACX-1vQJwloWB8Q6m4L1pH5fxKvPJzC0KyOd1vKGZx2NGnEK68XtYV2mHc_fnI9LrcL82XbUQSZeAYVokNoa';

const GIDS = {
  overview:   '2144379246',
  guests:     '1064793331',
  engagement: '1858925354',
  sales:      '280814822',
  financial:  '260781785',
  timeline:   '689648100',
  followup:   '674002843'
};

function csvURL(gid) {
  return `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;
}

// ── CSV PARSER ───────────────────────────────────────────────
function parseCSV(text) {
  const rows = [];
  const lines = text.split('\n');
  for (const line of lines) {
    const row = [];
    let cell = '', inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { row.push(cell.trim()); cell = ''; }
      else { cell += ch; }
    }
    row.push(cell.trim());
    rows.push(row);
  }
  return rows;
}

function val(rows, row, col) {
  try { return (rows[row][col] || '').replace(/[€$,]/g, '').trim(); } catch { return ''; }
}
function num(rows, row, col) {
  const n = parseFloat(val(rows, row, col));
  return isNaN(n) ? 0 : n;
}
function str(rows, row, col) { return val(rows, row, col); }

// ── FALLBACK DATA ────────────────────────────────────────────
const FB = {
  eventName: "La Nuit des Pierres Précieuses",
  eventDate: "15 March 2026",
  eventVenue: "Hôtel de Crillon, Paris",
  ov: { totalInvited:120, rsvpConfirmed:101, attendance:85, uhnwGuests:38, hnwGuests:32, affluentGuests:15, existingClients:58, newProspects:27, avgNetWorth:47, piecesShowcased:64, piecesTried:138, piecesReserved:11, dayOfSales:2400000, pipeline30:4100000, pipeline60:2700000, bespoke:800000 },
  pieces: [
    { name:"Étoile de Mer Necklace",      category:"High Jewellery", price:"€1.2M", status:"Sold",     statusClass:"badge-green", rawPrice:1200000 },
    { name:"Panthère Bracelet — Emerald", category:"Bracelet",       price:"€780K", status:"Sold",     statusClass:"badge-green", rawPrice:780000  },
    { name:"Midnight Saphir Tiara",       category:"Tiara",          price:"€420K", status:"Reserved", statusClass:"badge-gold",  rawPrice:420000  },
    { name:"Rouge Flamme Ring",           category:"Ring",           price:"€310K", status:"Reserved", statusClass:"badge-gold",  rawPrice:310000  },
    { name:"Les Ciels Brooch",            category:"Brooch",         price:"€195K", status:"Pipeline", statusClass:"badge-blue",  rawPrice:195000  }
  ],
  fu: [
    { client:"Madame L. Beaumont", action:"Private Viewing — Étoile Collection", rm:"A. Moreau",   date:"22 Mar", status:"Confirmed", statusClass:"badge-green" },
    { client:"Mr T. Okafor",       action:"Bespoke Commission Discussion",       rm:"I. Fontaine", date:"25 Mar", status:"Confirmed", statusClass:"badge-green" },
    { client:"Mme A. Nguyen",      action:"Personal Shopper — Bracelets",        rm:"R. Mehta",    date:"28 Mar", status:"Scheduled", statusClass:"badge-blue"  },
    { client:"Lord P. Ashworth",   action:"Follow-up Meeting",                   rm:"C. Dupont",   date:"1 Apr",  status:"Scheduled", statusClass:"badge-blue"  },
    { client:"Ms Y. Chen",         action:"Sapphire Tiara Private Viewing",      rm:"J. Park",     date:"3 Apr",  status:"Pending",   statusClass:"badge-grey"  }
  ],
  fin: { totalBudget:800000, roi:3.8 }
};

// ── SHEET PARSERS ────────────────────────────────────────────
function parseOverview(rows) {
  return {
    eventName:       str(rows,4,1)  || FB.eventName,
    eventDate:       str(rows,5,1)  || FB.eventDate,
    eventVenue:      str(rows,6,1)  || FB.eventVenue,
    totalInvited:    num(rows,10,1) || FB.ov.totalInvited,
    rsvpConfirmed:   num(rows,11,1) || FB.ov.rsvpConfirmed,
    attendance:      num(rows,12,1) || FB.ov.attendance,
    uhnwGuests:      num(rows,13,1) || FB.ov.uhnwGuests,
    hnwGuests:       num(rows,14,1) || FB.ov.hnwGuests,
    affluentGuests:  num(rows,15,1) || FB.ov.affluentGuests,
    existingClients: num(rows,16,1) || FB.ov.existingClients,
    newProspects:    num(rows,17,1) || FB.ov.newProspects,
    avgNetWorth:     num(rows,18,1) || FB.ov.avgNetWorth,
    piecesShowcased: num(rows,19,1) || FB.ov.piecesShowcased,
    piecesTried:     num(rows,20,1) || FB.ov.piecesTried,
    piecesReserved:  num(rows,21,1) || FB.ov.piecesReserved,
    dayOfSales:      num(rows,22,1) || FB.ov.dayOfSales,
    pipeline30:      num(rows,23,1) || FB.ov.pipeline30,
    pipeline60:      num(rows,24,1) || FB.ov.pipeline60,
    bespoke:         num(rows,25,1) || FB.ov.bespoke
  };
}

function parseSales(rows) {
  const pieces = [];
  for (let r = 4; r < rows.length; r++) {
    const name = str(rows, r, 0);
    if (!name) continue;
    const status = str(rows, r, 6);
    const statusClass = status==='Sold' ? 'badge-green' : status==='Reserved' ? 'badge-gold' : status==='Pipeline' ? 'badge-blue' : 'badge-grey';
    const price = num(rows, r, 2);
    pieces.push({ name, category:str(rows,r,1), price: price>=1000000 ? '€'+(price/1000000).toFixed(1)+'M' : '€'+(price/1000).toFixed(0)+'K', gemstone:str(rows,r,3), persona:str(rows,r,4), rm:str(rows,r,5), status, statusClass, rawPrice:price });
  }
  return pieces.length > 0 ? pieces : FB.pieces;
}

function parseFinancial(rows) {
  const costColors = ['#111111','#C8102E','#C6A45A','#6E6E6E','#2E2E2E','#D9D9D9','#E5E5E5','#F0EDED'];
  const costs = [];
  for (let r = 4; r < 12; r++) {
    const label = str(rows, r, 0);
    if (!label) continue;
    costs.push({ label, value: num(rows,r,2), color: costColors[r-4] });
  }
  const totalBudget = num(rows,12,2) || costs.reduce((s,c)=>s+c.value,0) || FB.fin.totalBudget;
  const rev = [];
  for (let r = 16; r < 21; r++) {
    const label = str(rows, r, 0);
    if (!label) continue;
    const v = num(rows,r,1);
    rev.push({ label, value: v>=1000000 ? '€'+(v/1000000).toFixed(1)+'M' : '€'+(v/1000).toFixed(0)+'K', rawVal:v });
  }
  const totalRev = rev.reduce((s,r)=>s+r.rawVal,0);
  if (rev.length) rev.push({ label:'Total Projected', value:'€'+(totalRev/1000000).toFixed(1)+'M' });
  const roi = totalBudget > 0 ? parseFloat((totalRev/totalBudget).toFixed(1)) : FB.fin.roi;
  return { costs, totalBudget, rev, roi };
}

function parseFollowUp(rows) {
  const actions = [];
  for (let r = 4; r < rows.length; r++) {
    const client = str(rows,r,0);
    if (!client) continue;
    const status = str(rows,r,4);
    const statusClass = status==='Confirmed'||status==='Completed' ? 'badge-green' : status==='Scheduled' ? 'badge-blue' : 'badge-grey';
    actions.push({ client, action:str(rows,r,1), rm:str(rows,r,2), date:str(rows,r,3), status, statusClass });
  }
  return actions.length > 0 ? actions : FB.fu;
}

// ── BUILD DATA OBJECT ────────────────────────────────────────
function buildDATA(ov, sales, fin, fu) {
  const rsvpRate   = ov.totalInvited > 0 ? Math.round(ov.rsvpConfirmed/ov.totalInvited*100) : 84;
  const attendRate = ov.totalInvited > 0 ? Math.round(ov.attendance/ov.totalInvited*100)    : 71;
  const resRate    = ov.attendance   > 0 ? ((ov.piecesReserved/ov.attendance)*100).toFixed(1) : '0';
  const fmt = v => v>=1000000 ? '€'+(v/1000000).toFixed(1)+'M' : '€'+(v/1000).toFixed(0)+'K';
  const soldPieces  = sales.filter(p=>p.status==='Sold');
  const totalSold   = soldPieces.reduce((s,p)=>s+p.rawPrice,0);
  const convRate    = ov.attendance>0 ? ((soldPieces.length/ov.attendance)*100).toFixed(1) : '0';
  const avgPurchase = soldPieces.length>0 ? totalSold/soldPieces.length : 800000;
  const revPerGuest = ov.attendance>0 ? totalSold/ov.attendance : 28000;

  return {
    eventName: ov.eventName, eventDate: ov.eventDate, eventVenue: ov.eventVenue,
    overview: { totalInvited:ov.totalInvited, rsvpRate, attendanceRate:attendRate, uhnwGuests:ov.uhnwGuests, avgNetWorthM:ov.avgNetWorth, piecesShowcased:ov.piecesShowcased, piecesReserved:ov.piecesReserved },
    attendanceFunnel: [
      { label:"Invited",    value:ov.totalInvited,  pct:100 },
      { label:"RSVP'd",     value:ov.rsvpConfirmed, pct:rsvpRate },
      { label:"Attended",   value:ov.attendance,    pct:attendRate },
      { label:"Engaged HJ", value:Math.round(ov.attendance*0.76), pct:Math.round(attendRate*0.76) },
      { label:"Reserved",   value:ov.piecesReserved, pct:Math.round(ov.piecesReserved/Math.max(ov.totalInvited,1)*100) }
    ],
    guestComposition: [
      { label:"Existing Clients", value:ov.existingClients, color:"#C8102E" },
      { label:"New Prospects",    value:ov.newProspects,    color:"#D9D9D9" }
    ],
    wealthSegment: [
      { label:"UHNW ($30M+)", value:ov.uhnwGuests,     color:"#111111" },
      { label:"HNW ($5–30M)", value:ov.hnwGuests,      color:"#C8102E" },
      { label:"Affluent",     value:ov.affluentGuests,  color:"#D9D9D9" }
    ],
    guestKpis: [
      { label:"Existing Clients", value:String(ov.existingClients), unit:"", delta:"" },
      { label:"New Prospects",    value:String(ov.newProspects),    unit:"", delta:"" },
      { label:"Self-made Wealth", value:"61", unit:"%", delta:"" },
      { label:"Avg Age Group",    value:"42", unit:"–54", delta:"" }
    ],
    personas: [
      { label:"Altman",  value:28, color:"#C8102E" },
      { label:"Lily",    value:22, color:"#2E2E2E" },
      { label:"Miranda", value:19, color:"#C6A45A" },
      { label:"Blair",   value:16, color:"#D9D9D9" }
    ],
    industries: [
      { label:"PE / VC",       value:24 },{ label:"Family Office", value:18 },
      { label:"Tech",          value:14 },{ label:"Finance",       value:13 },
      { label:"Real Estate",   value:9  },{ label:"Other",         value:7  }
    ],
    relationshipManagers: [
      { name:"Alexandre Moreau",  referred:14, uhnw:7, converted:3 },
      { name:"Isabelle Fontaine", referred:11, uhnw:5, converted:2 },
      { name:"Ravi Mehta",        referred:9,  uhnw:4, converted:2 },
      { name:"Charlotte Dupont",  referred:8,  uhnw:2, converted:1 },
      { name:"Jin-woo Park",      referred:7,  uhnw:3, converted:0 }
    ],
    engagementKpis: [
      { label:"Appointments Booked",   value:"42",                      unit:"",     delta:"" },
      { label:"Pieces Tried On",       value:String(ov.piecesTried),    unit:"",     delta:"" },
      { label:"Pieces Reserved",       value:String(ov.piecesReserved), unit:"",     delta:"" },
      { label:"Private Consultations", value:"23",                      unit:"",     delta:"" },
      { label:"Follow-ups Scheduled",  value:String(fu.length),         unit:"",     delta:"" },
      { label:"Avg Salon Dwell",       value:"47",                      unit:" min", delta:"" }
    ],
    engagementFunnel: [
      { label:"Attended",      value:ov.attendance,                        pct:100 },
      { label:"Entered Salon", value:Math.round(ov.attendance*0.76),       pct:76  },
      { label:"Tried a Piece", value:Math.round(ov.attendance*0.58),       pct:58  },
      { label:"Consultation",  value:Math.round(ov.attendance*0.27),       pct:27  },
      { label:"Reserved",      value:ov.piecesReserved, pct:Math.round(ov.piecesReserved/Math.max(ov.attendance,1)*100) }
    ],
    jewelleryRanks: [
      { name:"Étoile de Mer Necklace",      tries:28, pct:82 },
      { name:"Panthère Bracelet — Emerald", tries:24, pct:71 },
      { name:"Midnight Saphir Tiara",       tries:21, pct:62 },
      { name:"Rouge Flamme Ring",           tries:19, pct:56 },
      { name:"Les Ciels Brooch",            tries:14, pct:41 },
      { name:"Clarte du Jour Earrings",     tries:12, pct:35 }
    ],
    salesKpis: [
      { label:"Day-of Sales",    value:fmt(ov.dayOfSales),  unit:"", delta:soldPieces.length+" transactions", deltaClass:"pos" },
      { label:"30-Day Pipeline", value:fmt(ov.pipeline30),  unit:"", delta:"Qualified leads", deltaClass:"pos" },
      { label:"60-Day Pipeline", value:fmt(ov.pipeline60),  unit:"", delta:"Warm leads",      deltaClass:"" },
      { label:"Conversion Rate", value:convRate,             unit:"%",delta:"Guest → Buyer",   deltaClass:"pos" },
      { label:"Avg Purchase",    value:fmt(avgPurchase),    unit:"", delta:"",                 deltaClass:"" },
      { label:"Revenue / Guest", value:fmt(revPerGuest),    unit:"", delta:"",                 deltaClass:"" }
    ],
    revenueFunnel: [
      { label:"Day-of",  value:ov.dayOfSales },
      { label:"30-Day",  value:ov.pipeline30 },
      { label:"60-Day",  value:ov.pipeline60 },
      { label:"Bespoke", value:ov.bespoke    }
    ],
    personaSales: [
      { label:"Altman",  value:Math.round(totalSold*0.58), color:"#C8102E" },
      { label:"Miranda", value:Math.round(totalSold*0.24), color:"#2E2E2E" },
      { label:"Lily",    value:Math.round(totalSold*0.13), color:"#C6A45A" },
      { label:"Blair",   value:Math.round(totalSold*0.05), color:"#D9D9D9" }
    ],
    topPieces: sales.slice(0,7),
    financialStructure: {
      totalBudget:   fin.totalBudget,
      roi:           fin.roi,
      dayOfRevenue:  ov.dayOfSales,
      totalPipeline: ov.pipeline30+ov.pipeline60+ov.bespoke,
      costCategories: fin.costs,
      topCostDrivers: ["Venue transformation & set design","Private dining & culinary program","Jewellery logistics & insurance","Guest travel & hospitality packages","Security & private viewing arrangements"],
      revenueProjections: fin.rev,
      roiChart: [
        { label:"Event Cost",     value:fin.totalBudget },
        { label:"Day-of Revenue", value:ov.dayOfSales   },
        { label:"30d Pipeline",   value:ov.pipeline30   },
        { label:"60d Pipeline",   value:ov.pipeline60   },
        { label:"Total Pipeline", value:ov.pipeline30+ov.pipeline60+ov.bespoke }
      ]
    },
    relKpis: [
      { label:"Repeat Clients",       value:"41",  unit:"",    delta:"Attended prev. event", deltaClass:"" },
      { label:"New UHNW Leads",       value:"12",  unit:"",    delta:"First contact",        deltaClass:"pos" },
      { label:"Family Office Intros", value:"7",   unit:"",    delta:"",                     deltaClass:"" },
      { label:"Avg Engagement Score", value:"7.4", unit:"/10", delta:"",                     deltaClass:"" }
    ],
    relGrowth: { labels:["Jan","Mar","May","Jul","Sep","Nov","Mar 26"], data:[38,42,45,50,52,58,65] },
    clientScores: [
      { name:"Madame L. Beaumont", score:9.2 },{ name:"Mr T. Okafor",       score:8.8 },
      { name:"Signora M. Rossi",   score:8.4 },{ name:"Lord P. Ashworth",   score:7.9 },
      { name:"Ms Y. Chen",         score:7.6 }
    ],
    categories: [
      { label:"Necklace", value:32, color:"#C8102E" },{ label:"Bracelet", value:21, color:"#2E2E2E" },
      { label:"Ring",     value:18, color:"#C6A45A" },{ label:"Earrings", value:12, color:"#6E6E6E" },
      { label:"Tiara",    value:10, color:"#D9D9D9" },{ label:"Brooch",   value:7,  color:"#E5E5E5" }
    ],
    gemstones: [
      { label:"Emerald",     value:38, color:"#2E5E3E" },{ label:"Diamond",     value:22, color:"#D9D9D9" },
      { label:"Sapphire",    value:17, color:"#1A3A6B" },{ label:"Multi-stone", value:12, color:"#C6A45A" },
      { label:"Ruby",        value:11, color:"#C8102E" }
    ],
    priceBands: [
      { label:"<€100K",    value:8  },{ label:"€100–300K", value:19 },
      { label:"€300–800K", value:34 },{ label:"€800K–2M",  value:22 },
      { label:">€2M",      value:9  }
    ],
    mostViewed: [
      { name:"Étoile de Mer Necklace",    views:68 },{ name:"Panthère Bracelet Emerald", views:54 },
      { name:"Midnight Saphir Tiara",     views:47 },{ name:"Les Ciels Brooch",          views:41 },
      { name:"Clarte du Jour Earrings",   views:38 }
    ],
    followupKpis: [
      { label:"Follow-up Meetings",       value:String(fu.length), unit:"", delta:"" },
      { label:"Personal Shopper Consult", value:"18",              unit:"", delta:"" },
      { label:"Private Viewings Req.",    value:"11",              unit:"", delta:"" },
      { label:"Bespoke Commissions",      value:"4",               unit:"", delta:"" }
    ],
    followupActions: fu,
    trackerKpis: [
      { label:"Guests Invited",         value:String(ov.totalInvited),   unit:"", delta:"" },
      { label:"RSVP Confirmed",         value:String(ov.rsvpConfirmed),  unit:"", delta:rsvpRate+"% rate",   deltaClass:"pos" },
      { label:"Appointments Scheduled", value:"42",                       unit:"", delta:"" },
      { label:"Pieces Reserved",        value:String(ov.piecesReserved), unit:"", delta:resRate+"%",          deltaClass:"pos" },
      { label:"Concierge Requests",     value:"8",                        unit:"", delta:"" },
      { label:"Bespoke Commissions",    value:"4",                        unit:"", delta:"" }
    ],
    timeline: [
      { phase:"6 Months Before", date:"Sep 2025",      status:"done",     cost:"€380K", milestones:[{text:"Venue selection & contract",status:"done"},{text:"Guest shortlist finalised",status:"done"},{text:"Event concept design",status:"done"}] },
      { phase:"4 Months Before", date:"Nov 2025",      status:"done",     cost:"€235K", milestones:[{text:"Save-the-date invitations",status:"done"},{text:"HJ piece curation confirmed",status:"done"},{text:"Production partner briefed",status:"done"}] },
      { phase:"2 Months Before", date:"Jan 2026",      status:"done",     cost:"€180K", milestones:[{text:"Formal invitations sent",status:"done"},{text:"Client travel coordination",status:"done"},{text:"Security logistics confirmed",status:"done"}] },
      { phase:"Event Week",      date:"10–15 Mar 2026",status:"done",     cost:"€5K",   milestones:[{text:"Collection installation",status:"done"},{text:"Private preview appointments",status:"done"},{text:"Client appointments",status:"done"}] },
      { phase:"Post-Event",      date:"Mar–May 2026",  status:"progress", cost:"",      milestones:[{text:"Follow-up meetings",status:"progress"},{text:"Private showings",status:"progress"},{text:"Bespoke commission briefs",status:"pending"}] }
    ],
    insights: [
      { label:"Best-Performing Persona",    text:"Altman — Self-Made Entrepreneur drove the highest conversion rate at 14.3%, accounting for 58% of total day-of revenue.",                                                  sub:"Recommended: Increase Altman-profile invitee share by 20% for the next Maison event." },
      { label:"Best-Performing Category",   text:"High Jewellery Necklaces generated 3× more reserved interest than any other category, led by statement emerald and sapphire pieces.",                                     sub:"Consider increasing necklace representation from 22% to 30% of showcased collection at future events." },
      { label:"Highest Conversion Segment", text:"Guests referred by Alexandre Moreau converted at 21.4% — more than double the event average.",                                                                            sub:"Prioritise Moreau's client list for targeted follow-up in the 30-day pipeline window." },
      { label:"Gemstone Demand Signal",     text:"Emerald interest outpaced sapphire 2.3:1 across all trial and reservation activity. Demand concentrated in the €300K–€800K price band.",                                sub:"Emerald-led pieces should anchor the next private viewing for Altman-profile clients." },
      { label:"ROI Perspective",            text:`Day-of revenue alone delivers a ${(ov.dayOfSales/Math.max(fin.totalBudget,1)).toFixed(1)}× return. Full pipeline realisation projects ${fin.roi}× ROI.`,                sub:"Event format should be scaled for Q4 2026 with a focus on Dubai and Singapore markets." }
    ]
  };
}

// ── LOADING STATE ────────────────────────────────────────────
function showLoading() {
  const el = document.getElementById('overview-kpis');
  if (el) el.innerHTML = `<div style="grid-column:1/-1;padding:48px;text-align:center;color:var(--muted);font-size:12px;letter-spacing:0.14em;text-transform:uppercase">Loading live data from Google Sheets…</div>`;
}

// ── FETCH + RENDER ───────────────────────────────────────────
async function loadAndRender() {
  showLoading();
  try {
    const [ovCSV, salesCSV, finCSV, fuCSV] = await Promise.all([
      fetch(csvURL(GIDS.overview)).then(r => r.text()),
      fetch(csvURL(GIDS.sales)).then(r => r.text()),
      fetch(csvURL(GIDS.financial)).then(r => r.text()),
      fetch(csvURL(GIDS.followup)).then(r => r.text())
    ]);
    const ov  = parseOverview(parseCSV(ovCSV));
    const sal = parseSales(parseCSV(salesCSV));
    const fin = parseFinancial(parseCSV(finCSV));
    const fu  = parseFollowUp(parseCSV(fuCSV));
    window.DATA = buildDATA(ov, sal, fin, fu);
    render();
  } catch (err) {
    console.warn('Google Sheets fetch failed — using fallback data.', err);
    window.DATA = buildDATA(
      { ...FB.ov, eventName:FB.eventName, eventDate:FB.eventDate, eventVenue:FB.eventVenue },
      FB.pieces, { costs:[], totalBudget:FB.fin.totalBudget, rev:[], roi:FB.fin.roi }, FB.fu
    );
    render();
  }
}

loadAndRender();