// ============================================================
//  CARTIER DASHBOARD — MAIN RENDERER
//  Reads from DATA (data.js) and builds all charts + tables
// ============================================================

const gold = '#B8975A', gold2 = '#7A6540', blue = '#4A7FA5';
const green = '#7EC8A0', red = '#C87E7E';
const muted = 'rgba(255,255,255,0.06)';
const text  = 'rgba(242,236,226,0.55)';

// ── TAB SWITCHER ────────────────────────────────────────────
function setTab(i) {
  document.querySelectorAll('.section').forEach((s, j) => s.classList.toggle('active', j === i));
  document.querySelectorAll('.nav-tab').forEach((t, j) => t.classList.toggle('active', j === i));
}

// ── HELPERS ─────────────────────────────────────────────────
function kpiHTML(items) {
  return items.map(k => `
    <div class="kpi">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}<span class="kpi-unit">${k.unit || ''}</span></div>
      ${k.delta ? `<div class="kpi-delta ${k.deltaClass || ''}">${k.delta}</div>` : ''}
    </div>`).join('');
}

function funnelHTML(items) {
  const colors = [
    'rgba(184,151,90,0.3)', 'rgba(184,151,90,0.45)',
    'rgba(184,151,90,0.62)', 'rgba(184,151,90,0.78)', '#B8975A'
  ];
  return items.map((f, i) => `
    <div class="funnel-row">
      <div class="funnel-label">${f.label}</div>
      <div class="funnel-bar-wrap">
        <div class="funnel-bar" style="width:${f.pct}%;background:${colors[Math.min(i, colors.length-1)]}">
          <span class="funnel-bar-val">${f.value}</span>
        </div>
      </div>
      <div class="funnel-pct">${f.pct}%</div>
    </div>`).join('');
}

function pieChart(id, data) {
  new Chart(document.getElementById(id), {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.label),
      datasets: [{ data: data.map(d => d.value), backgroundColor: data.map(d => d.color), borderWidth: 0, hoverOffset: 4 }]
    },
    options: { plugins: { legend: { display: false } }, cutout: '68%', responsive: true, maintainAspectRatio: false }
  });
}

function pieLegendHTML(items) {
  return items.map(d => `
    <div class="pie-legend-item">
      <span class="pie-dot" style="background:${d.color}"></span>
      ${d.label}
      <span class="pie-val">${d.value}</span>
    </div>`).join('');
}

function barChart(id, labels, values, colors, horizontal) {
  new Chart(document.getElementById(id), {
    type: 'bar',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderRadius: 2, borderSkipped: false }] },
    options: {
      indexAxis: horizontal ? 'y' : 'x',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: muted }, ticks: { color: text, font: { size: 10 } } },
        y: { grid: { color: muted }, ticks: { color: text, font: { size: 10 } } }
      },
      responsive: true, maintainAspectRatio: false
    }
  });
}

function rankListHTML(items, nameKey, valueKey, pctKey) {
  return items.map((item, i) => `
    <div class="rank-item">
      <span class="rank-num" style="min-width:28px">0${i + 1}</span>
      <span style="flex:1;font-size:12px;color:var(--cream)">${item[nameKey]}</span>
      <div class="rank-bar-outer"><div class="rank-bar-inner" style="width:${item[pctKey] || (item[valueKey]/items[0][valueKey]*100).toFixed(0)}%"></div></div>
      <span style="font-size:11px;color:var(--text-muted);min-width:36px;text-align:right">${item[valueKey]}</span>
    </div>`).join('');
}

// ── GAUGE ───────────────────────────────────────────────────
function drawGauge(id, val, max) {
  const c = document.getElementById(id);
  if (!c) return;
  const ctx = c.getContext('2d');
  const cx = 100, cy = 100, r = 70, sw = 14;
  ctx.clearRect(0, 0, 200, 110);
  ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = sw; ctx.lineCap = 'round'; ctx.stroke();
  const pct = Math.min(val / max, 1);
  ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, Math.PI + pct * Math.PI);
  ctx.strokeStyle = gold; ctx.lineWidth = sw; ctx.lineCap = 'round'; ctx.stroke();
}

// ── RENDER ──────────────────────────────────────────────────
function render() {
  const D = DATA;

  // Header
  document.getElementById('event-date').textContent =
    `${D.eventDate} · ${D.eventVenue}`;

  // ① Overview
  document.getElementById('overview-kpis').innerHTML = kpiHTML([
    { label: "Total Invited",      value: D.overview.totalInvited,    unit: "",    delta: "Exclusive selection" },
    { label: "RSVP Rate",          value: D.overview.rsvpRate,        unit: "%",   delta: "+12% vs last event", deltaClass: "pos" },
    { label: "Attendance Rate",    value: D.overview.attendanceRate,  unit: "%",   delta: "+8% vs last event",  deltaClass: "pos" },
    { label: "UHNW Guests",        value: D.overview.uhnwGuests,      unit: "",    delta: "Net worth $30M+" },
    { label: "Avg Net Worth",      value: "€" + D.overview.avgNetWorthM, unit: "M", delta: "Per attendee segment" },
    { label: "Pieces Showcased",   value: D.overview.piecesShowcased, unit: "",    delta: "HJ Collection 2026" },
    { label: "Pieces Reserved",    value: D.overview.piecesReserved,  unit: "",    delta: "17.2% reservation rate", deltaClass: "pos" }
  ]);
  document.getElementById('overview-funnel').innerHTML = funnelHTML(D.attendanceFunnel);
  pieChart('c-comp', D.guestComposition);
  document.getElementById('comp-legend').innerHTML = pieLegendHTML(D.guestComposition);
  pieChart('c-wealth', D.wealthSegment);
  document.getElementById('wealth-legend').innerHTML = pieLegendHTML(D.wealthSegment);

  // ② Guests
  document.getElementById('guest-kpis').innerHTML = kpiHTML(D.guestKpis);
  pieChart('c-persona', D.personas);
  document.getElementById('persona-legend').innerHTML = pieLegendHTML(D.personas);
  barChart('c-industry',
    D.industries.map(d => d.label),
    D.industries.map(d => d.value),
    Array(D.industries.length).fill(gold),
    true
  );
  document.getElementById('rm-table').innerHTML = D.relationshipManagers.map((rm, i) => `
    <tr>
      <td class="rank-num">0${i + 1}</td>
      <td>${rm.name}</td>
      <td>${rm.referred}</td>
      <td><span class="badge ${rm.uhnw >= 5 ? 'badge-gold' : 'badge-blue'}">${rm.uhnw} UHNW</span></td>
      <td>${rm.converted > 0 ? `<span class="badge badge-green">${rm.converted} reserved</span>` : '—'}</td>
    </tr>`).join('');

  // ③ Engagement
  document.getElementById('engagement-kpis').innerHTML = kpiHTML(D.engagementKpis);
  document.getElementById('jewelry-ranks').innerHTML = rankListHTML(D.jewelleryRanks, 'name', 'tries', 'pct');
  document.getElementById('engagement-funnel').innerHTML = funnelHTML(D.engagementFunnel);

  // ④ Sales
  document.getElementById('sales-kpis').innerHTML = kpiHTML(D.salesKpis);
  new Chart(document.getElementById('c-rev'), {
    type: 'bar',
    data: {
      labels: D.revenueFunnel.map(d => d.label),
      datasets: [{ data: D.revenueFunnel.map(d => d.value), backgroundColor: [gold, gold2, '#4A6040', '#364840'], borderRadius: 2 }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: muted }, ticks: { color: text, font: { size: 10 } } },
        y: { grid: { color: muted }, ticks: { color: text, font: { size: 10 }, callback: v => '€' + (v / 1000000).toFixed(1) + 'M' } }
      },
      responsive: true, maintainAspectRatio: false
    }
  });
  pieChart('c-persona-sales', D.personaSales);
  document.getElementById('sales-table').innerHTML = D.topPieces.map((p, i) => `
    <tr>
      <td class="rank-num">0${i + 1}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.price}</td>
      <td><span class="badge ${p.statusClass}">${p.status}</span></td>
    </tr>`).join('');

  // ⑤ ROI
  document.getElementById('roi-value').textContent = D.roi + '×';
  setTimeout(() => drawGauge('c-gauge', D.roi, 6), 200);
  document.getElementById('roi-kpis').innerHTML = kpiHTML(D.roiKpis);
  new Chart(document.getElementById('c-roi-bar'), {
    type: 'bar',
    data: {
      labels: D.roiChart.map(d => d.label),
      datasets: [{ data: D.roiChart.map(d => d.value), backgroundColor: ['#4A3030', gold, gold2, '#4A6040', '#26382E'], borderRadius: 2 }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: muted }, ticks: { color: text, font: { size: 9 } } },
        y: { grid: { color: muted }, ticks: { color: text, font: { size: 10 }, callback: v => '€' + (v / 1000000).toFixed(1) + 'M' } }
      },
      responsive: true, maintainAspectRatio: false
    }
  });

  // ⑥ Relationships
  document.getElementById('rel-kpis').innerHTML = kpiHTML(D.relKpis);
  new Chart(document.getElementById('c-rel'), {
    type: 'line',
    data: {
      labels: D.relGrowth.labels,
      datasets: [{
        data: D.relGrowth.data,
        borderColor: gold, backgroundColor: 'rgba(184,151,90,0.1)',
        borderWidth: 1.5, pointBackgroundColor: gold, pointRadius: 3, tension: 0.3, fill: true
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: muted }, ticks: { color: text, font: { size: 10 } } },
        y: { grid: { color: muted }, ticks: { color: text, font: { size: 10 } } }
      },
      responsive: true, maintainAspectRatio: false
    }
  });
  document.getElementById('rel-scores').innerHTML = D.clientScores.map(c => `
    <div class="rank-item">
      <span style="flex:1;font-size:12px;color:var(--cream)">${c.name}</span>
      <div class="rank-bar-outer" style="width:80px"><div class="rank-bar-inner" style="width:${c.score * 10}%"></div></div>
      <span style="font-size:12px;color:var(--gold-light);font-family:'Cormorant Garamond',serif;min-width:28px;text-align:right">${c.score}</span>
    </div>`).join('');

  // ⑦ Jewellery
  pieChart('c-cat', D.categories);
  pieChart('c-gem', D.gemstones);
  barChart('c-price', D.priceBands.map(d => d.label), D.priceBands.map(d => d.value), Array(D.priceBands.length).fill(gold), false);
  document.getElementById('viewed-pieces').innerHTML = rankListHTML(D.mostViewed, 'name', 'views', null);

  // ⑧ Follow-Up
  document.getElementById('followup-kpis').innerHTML = kpiHTML(D.followupKpis);
  document.getElementById('followup-table').innerHTML = D.followupActions.map(a => `
    <tr>
      <td>${a.client}</td>
      <td>${a.action}</td>
      <td>${a.rm}</td>
      <td>${a.date}</td>
      <td><span class="badge ${a.statusClass}">${a.status}</span></td>
    </tr>`).join('');

  // ⑨ Insights
  document.getElementById('insights-list').innerHTML = D.insights.map(ins => `
    <div class="insight-card">
      <div class="insight-label">${ins.label}</div>
      <div class="insight-text">${ins.text}</div>
      <div class="insight-sub">${ins.sub}</div>
    </div>`).join('');
}

render();