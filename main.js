// ============================================================
//  CARTIER DASHBOARD — MAIN RENDERER
//  Reads from DATA (data.js) and builds all charts + tables
// ============================================================

const RED      = '#C8102E';
const RED_L    = '#F2C0C7';
const CHARCOAL = '#2E2E2E';
const GOLD     = '#C6A45A';
const LIGHT    = '#D9D9D9';
const MUTED    = 'rgba(17,17,17,0.08)';
const TICK     = '#6E6E6E';

function setTab(i) {
  document.querySelectorAll('.section').forEach((s, j) => s.classList.toggle('active', j === i));
  document.querySelectorAll('.nav-tab').forEach((t, j) => t.classList.toggle('active', j === i));
}

// ── HELPERS ─────────────────────────────────────────────────
function kpiHTML(items, accentFirst) {
  return items.map((k, i) => `
    <div class="kpi ${(accentFirst && i === 0) ? 'kpi-accent' : ''}">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}<span class="kpi-unit">${k.unit || ''}</span></div>
      ${k.delta ? `<div class="kpi-delta ${k.deltaClass || ''}">${k.delta}</div>` : ''}
    </div>`).join('');
}

function funnelHTML(items) {
  const shades = ['rgba(200,16,46,0.25)', 'rgba(200,16,46,0.4)', 'rgba(200,16,46,0.58)', 'rgba(200,16,46,0.75)', '#C8102E'];
  return items.map((f, i) => `
    <div class="funnel-row">
      <div class="funnel-label">${f.label}</div>
      <div class="funnel-bar-wrap">
        <div class="funnel-bar" style="width:${f.pct}%;background:${shades[Math.min(i, shades.length - 1)]}">
          <span class="funnel-bar-val">${f.value}</span>
        </div>
      </div>
      <div class="funnel-pct">${f.pct}%</div>
    </div>`).join('');
}

function doughnut(id, data) {
  new Chart(document.getElementById(id), {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.label),
      datasets: [{ data: data.map(d => d.value), backgroundColor: data.map(d => d.color), borderWidth: 2, borderColor: '#FFFFFF', hoverOffset: 4 }]
    },
    options: { plugins: { legend: { display: false } }, cutout: '72%', responsive: true, maintainAspectRatio: false }
  });
}

function pieLegend(items) {
  return items.map(d => `
    <div class="pie-legend-item">
      <span class="pie-dot" style="background:${d.color}"></span>
      ${d.label}
      <span class="pie-val">${d.value}</span>
    </div>`).join('');
}

function barH(id, labels, values, colors) {
  new Chart(document.getElementById(id), {
    type: 'bar',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderRadius: 1, borderSkipped: false }] },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: MUTED }, ticks: { color: TICK, font: { size: 11, family: 'Inter' } } },
        y: { grid: { display: false }, ticks: { color: TICK, font: { size: 11, family: 'Inter' } } }
      },
      responsive: true, maintainAspectRatio: false
    }
  });
}

function barV(id, labels, values, colors, fmt) {
  new Chart(document.getElementById(id), {
    type: 'bar',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderRadius: 1, borderSkipped: false }] },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: TICK, font: { size: 11, family: 'Inter' } } },
        y: { grid: { color: MUTED }, ticks: { color: TICK, font: { size: 11, family: 'Inter' }, callback: fmt || (v => v) } }
      },
      responsive: true, maintainAspectRatio: false
    }
  });
}

function rankList(items, nameKey, valueKey, pctKey) {
  return items.map((item, i) => `
    <div class="rank-item">
      <span class="rank-num" style="min-width:28px">0${i + 1}</span>
      <span style="flex:1;font-size:13px;font-weight:300;color:var(--text)">${item[nameKey]}</span>
      <div class="rank-bar-outer">
        <div class="rank-bar-inner" style="width:${pctKey ? item[pctKey] : (item[valueKey] / items[0][valueKey] * 100).toFixed(0)}%"></div>
      </div>
      <span style="font-size:12px;color:var(--muted);min-width:36px;text-align:right;font-weight:300">${item[valueKey]}</span>
    </div>`).join('');
}

// ── RENDER ──────────────────────────────────────────────────
function render() {
  const D = DATA;

document.getElementById('event-date').textContent = `${D.eventDate} · ${D.eventVenue}`;
document.getElementById('event-title').textContent = D.eventName;
  // ① OVERVIEW
  document.getElementById('overview-kpis').innerHTML = kpiHTML([
    { label: "Total Invited",    value: D.overview.totalInvited,   unit: "",    delta: "Exclusive selection" },
    { label: "RSVP Rate",        value: D.overview.rsvpRate,       unit: "%",   delta: "+12% vs last event", deltaClass: "pos" },
    { label: "Attendance Rate",  value: D.overview.attendanceRate, unit: "%",   delta: "+8% vs last event",  deltaClass: "pos" },
    { label: "UHNW Guests",      value: D.overview.uhnwGuests,     unit: "",    delta: "Net worth $30M+" },
    { label: "Avg Net Worth",    value: "€" + D.overview.avgNetWorthM, unit: "M", delta: "Per attendee" },
    { label: "Pieces Showcased", value: D.overview.piecesShowcased,unit: "",    delta: "HJ Collection 2026" },
    { label: "Pieces Reserved",  value: D.overview.piecesReserved, unit: "",    delta: "17.2% reservation", deltaClass: "pos" }
  ]);
  document.getElementById('overview-funnel').innerHTML = funnelHTML(D.attendanceFunnel);
  doughnut('c-comp', D.guestComposition);
  document.getElementById('comp-legend').innerHTML = pieLegend(D.guestComposition);
  doughnut('c-wealth', D.wealthSegment);
  document.getElementById('wealth-legend').innerHTML = pieLegend(D.wealthSegment);

  // ② GUESTS
  document.getElementById('guest-kpis').innerHTML = kpiHTML(D.guestKpis);
  doughnut('c-persona', D.personas);
  document.getElementById('persona-legend').innerHTML = pieLegend(D.personas);
  barH('c-industry', D.industries.map(d => d.label), D.industries.map(d => d.value),
    D.industries.map((_, i) => i === 0 ? RED : LIGHT));
  document.getElementById('rm-table').innerHTML = D.relationshipManagers.map((rm, i) => `
    <tr>
      <td class="rank-num">0${i + 1}</td>
      <td style="font-weight:400">${rm.name}</td>
      <td>${rm.referred}</td>
      <td><span class="badge ${rm.uhnw >= 5 ? 'badge-red' : 'badge-grey'}">${rm.uhnw} UHNW</span></td>
      <td>${rm.converted > 0 ? `<span class="badge badge-green">${rm.converted} reserved</span>` : '—'}</td>
    </tr>`).join('');

  // ③ ENGAGEMENT
  document.getElementById('engagement-kpis').innerHTML = kpiHTML(D.engagementKpis);
  document.getElementById('jewelry-ranks').innerHTML = rankList(D.jewelleryRanks, 'name', 'tries', 'pct');
  document.getElementById('engagement-funnel').innerHTML = funnelHTML(D.engagementFunnel);

  // ④ SALES
  document.getElementById('sales-kpis').innerHTML = kpiHTML(D.salesKpis, true);
  barV('c-rev',
    D.revenueFunnel.map(d => d.label),
    D.revenueFunnel.map(d => d.value),
    [RED, CHARCOAL, GOLD, LIGHT],
    v => '€' + (v / 1000000).toFixed(1) + 'M'
  );
  doughnut('c-persona-sales', D.personaSales);
  document.getElementById('sales-table').innerHTML = D.topPieces.map((p, i) => `
    <tr>
      <td class="rank-num">0${i + 1}</td>
      <td style="font-weight:400">${p.name}</td>
      <td style="color:var(--muted)">${p.category}</td>
      <td style="font-weight:500">${p.price}</td>
      <td><span class="badge ${p.statusClass}">${p.status}</span></td>
    </tr>`).join('');

  // ⑤ FINANCIAL STRUCTURE
  const F = D.financialStructure;
  document.getElementById('fin-budget').textContent = '€' + (F.totalBudget / 1000).toFixed(0) + 'K';
  document.getElementById('fin-budget-sub').textContent = 'Actual event spend';
  document.getElementById('fin-roi').textContent = F.roi + '×';
  document.getElementById('fin-dayof').textContent = '€' + (F.dayOfRevenue / 1000000).toFixed(1) + 'M';
  document.getElementById('fin-pipeline').textContent = '€' + (F.totalPipeline / 1000000).toFixed(1) + 'M';

  doughnut('c-cost-pie', F.costCategories);
  document.getElementById('cost-legend').innerHTML = F.costCategories.map(d => `
    <div class="pie-legend-item">
      <span class="pie-dot" style="background:${d.color}"></span>
      ${d.label}
      <span class="pie-val">€${(d.value/1000).toFixed(0)}K</span>
    </div>`).join('');

  new Chart(document.getElementById('c-roi-bar'), {
    type: 'bar',
    data: {
      labels: F.roiChart.map(d => d.label),
      datasets: [{ data: F.roiChart.map(d => d.value), backgroundColor: [CHARCOAL, RED, CHARCOAL, GOLD, LIGHT], borderRadius: 1 }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: TICK, font: { size: 10 } } },
        y: { grid: { color: MUTED }, ticks: { color: TICK, font: { size: 10 }, callback: v => '€' + (v/1000000).toFixed(1) + 'M' } }
      },
      responsive: true, maintainAspectRatio: false
    }
  });

  document.getElementById('cost-drivers').innerHTML = F.topCostDrivers.map(d => `
    <div class="cost-driver-item">
      <span class="cost-driver-dot"></span>
      <span class="cost-driver-text">${d}</span>
    </div>`).join('');

  document.getElementById('roi-kpis').innerHTML = F.revenueProjections.map(r => `
    <div class="rev-proj-item">
      <span class="rev-proj-label">${r.label}</span>
      <span class="rev-proj-value">${r.value}</span>
    </div>`).join('');

  // ⑥ RELATIONSHIPS
  document.getElementById('rel-kpis').innerHTML = kpiHTML(D.relKpis);
  new Chart(document.getElementById('c-rel'), {
    type: 'line',
    data: {
      labels: D.relGrowth.labels,
      datasets: [{
        data: D.relGrowth.data,
        borderColor: RED,
        backgroundColor: 'rgba(200,16,46,0.06)',
        borderWidth: 1.5,
        pointBackgroundColor: RED,
        pointRadius: 4,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: TICK, font: { size: 11 } } },
        y: { grid: { color: MUTED }, ticks: { color: TICK, font: { size: 11 } } }
      },
      responsive: true, maintainAspectRatio: false
    }
  });
  document.getElementById('rel-scores').innerHTML = D.clientScores.map(c => `
    <div class="rank-item">
      <span style="flex:1;font-size:13px;font-weight:300;color:var(--text)">${c.name}</span>
      <div class="rank-bar-outer" style="width:80px">
        <div class="rank-bar-inner" style="width:${c.score * 10}%"></div>
      </div>
      <span style="font-family:var(--serif);font-size:16px;color:var(--text);min-width:32px;text-align:right">${c.score}</span>
    </div>`).join('');

  // ⑦ JEWELLERY
  doughnut('c-cat', D.categories);
  doughnut('c-gem', D.gemstones);
  barV('c-price', D.priceBands.map(d => d.label), D.priceBands.map(d => d.value),
    D.priceBands.map((_, i) => i === 2 ? RED : LIGHT));
  document.getElementById('viewed-pieces').innerHTML = rankList(D.mostViewed, 'name', 'views', null);

  // ⑧ FOLLOW-UP
  document.getElementById('followup-kpis').innerHTML = kpiHTML(D.followupKpis);
  document.getElementById('followup-table').innerHTML = D.followupActions.map(a => `
    <tr>
      <td style="font-weight:400">${a.client}</td>
      <td style="font-weight:300">${a.action}</td>
      <td style="color:var(--muted)">${a.rm}</td>
      <td style="color:var(--muted)">${a.date}</td>
      <td><span class="badge ${a.statusClass}">${a.status}</span></td>
    </tr>`).join('');

  // ⑨ TIMELINE & TRACKER
  document.getElementById('tracker-kpis').innerHTML = kpiHTML(D.trackerKpis);

  document.getElementById('timeline').innerHTML = D.timeline.map(phase => `
    <div class="timeline-phase">
      <span class="timeline-dot ${phase.status}"></span>
      <div class="timeline-phase-title">${phase.phase}</div>
      <div class="timeline-phase-date">${phase.date}</div>
      <div class="timeline-milestones">
        ${phase.milestones.map(m => `
          <div class="timeline-milestone ${m.status}">${m.text}</div>
        `).join('')}
      </div>
      ${phase.cost ? `<div class="timeline-cost">${phase.cost}</div>` : ''}
    </div>`).join('');

  // ⑩ INSIGHTS
  document.getElementById('insights-list').innerHTML = D.insights.map(ins => `
    <div class="insight-card">
      <div class="insight-label">${ins.label}</div>
      <div class="insight-text">${ins.text}</div>
      <div class="insight-sub">${ins.sub}</div>
    </div>`).join('');
}

render();