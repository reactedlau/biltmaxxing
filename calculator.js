const FAVICON = d => `https://www.google.com/s2/favicons?domain=${d}&sz=32`;

const PARTNERS = [
  { id:'hyatt',    name:'World of Hyatt',    cpp:1.80, favicon:FAVICON('hyatt.com'),            top:true },
  { id:'atmos',    name:'Atmos (Alaska)',     cpp:1.55, favicon:FAVICON('alaskaair.com'),        top:true },
  { id:'aeroplan', name:'Aeroplan',           cpp:1.50, favicon:FAVICON('aeroplan.com'),         top:true },
  { id:'jal',      name:'Japan Airlines',     cpp:1.45, favicon:FAVICON('jal.co.jp'),            top:true },
  { id:'flying',   name:'Flying Blue',        cpp:1.40, favicon:FAVICON('flyingblue.com'),       top:true },
  { id:'united',   name:'United MileagePlus', cpp:1.35, favicon:FAVICON('united.com'),           top:true },
  { id:'ba',       name:'British Airways',    cpp:1.30, favicon:FAVICON('britishairways.com'),   top:true },
  { id:'emirates', name:'Emirates Skywards',  cpp:1.20, favicon:FAVICON('emirates.com'),         top:true },
  { id:'marriott', name:'Marriott Bonvoy',    cpp:0.80, favicon:FAVICON('marriott.com'),         top:true },
  { id:'hilton',   name:'Hilton Honors',      cpp:0.50, favicon:FAVICON('hilton.com'),           top:true },
  { id:'avianca',  name:'Avianca LifeMiles',  cpp:1.30, favicon:FAVICON('avianca.com'),          top:false },
  { id:'virgin_a', name:'Virgin Atlantic',    cpp:1.25, favicon:FAVICON('virginatlantic.com'),   top:false },
  { id:'cathay',   name:'Cathay Pacific',     cpp:1.35, favicon:FAVICON('cathaypacific.com'),    top:false },
  { id:'turkish',  name:'Turkish Airlines',   cpp:1.40, favicon:FAVICON('turkishairlines.com'),  top:false },
  { id:'aer',      name:'Aer Lingus',         cpp:1.20, favicon:FAVICON('aerlingus.com'),        top:false },
  { id:'iberia',   name:'Iberia Plus',        cpp:1.25, favicon:FAVICON('iberia.com'),           top:false },
  { id:'tap',      name:'TAP Miles&Go',       cpp:1.00, favicon:FAVICON('flytap.com'),           top:false },
  { id:'southwest',name:'Southwest',          cpp:1.30, favicon:FAVICON('southwest.com'),        top:false },
  { id:'qatar',    name:'Qatar Airways',      cpp:1.35, favicon:FAVICON('qatarairways.com'),     top:false },
  { id:'etihad',   name:'Etihad Guest',       cpp:1.15, favicon:FAVICON('etihad.com'),           top:false },
  { id:'spirit',   name:'Spirit',             cpp:0.80, favicon:FAVICON('spirit.com'),           top:false },
  { id:'wyndham',  name:'Wyndham Rewards',    cpp:0.90, favicon:FAVICON('wyndhamhotels.com'),    top:false },
  { id:'accor',    name:'Accor Live',         cpp:0.75, favicon:FAVICON('accor.com'),            top:false },
];

let selected = new Set(), extraVisible = false, housingOn = true;
let progressOn = false, advOpen = false, overrideActive = false;

function fmt(n) { return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtPts(n) { return Math.round(n).toLocaleString('en-US'); }

function buildChips() {
  const grid = document.getElementById('chipGrid');
  grid.innerHTML = '';
  PARTNERS.forEach(p => {
    if (!p.top && !extraVisible) return;
    const c = document.createElement('div');
    c.className = 'chip' + (selected.has(p.id) ? ' selected' : '');
    c.onclick = () => togglePartner(p.id);
    c.innerHTML = `<img class="chip-logo" src="${p.favicon}" alt="${p.name}" width="16" height="16" /><span class="chip-name">${p.name}</span><span class="chip-cpp">${p.cpp.toFixed(2)}¢</span>`;
    grid.appendChild(c);
  });
}

function togglePartner(id) {
  selected.has(id) ? selected.delete(id) : selected.add(id);
  overrideActive = false;
  buildChips(); updateBlend(); calc();
}

function getBlendedCpp() {
  if (overrideActive) return parseFloat(document.getElementById('cppOverride').value) || 1.80;
  const sel = PARTNERS.filter(p => selected.has(p.id));
  return sel.length === 0 ? 1.80 : sel.reduce((s, p) => s + p.cpp, 0) / sel.length;
}

function updateBlend() {
  const cpp = getBlendedCpp();
  if (!overrideActive) document.getElementById('cppOverride').value = cpp.toFixed(2);
  const sel = PARTNERS.filter(p => selected.has(p.id));
  const bt = document.getElementById('blendText'), bs = document.getElementById('blendSub');
  if (overrideActive) { bt.textContent = 'Custom value'; bs.textContent = 'Partner selection overridden'; }
  else if (sel.length === 0) { bt.textContent = 'No partners selected'; bs.textContent = 'Default: Hyatt at 1.80¢'; }
  else if (sel.length === 1) { bt.textContent = sel[0].name; bs.textContent = sel[0].cpp.toFixed(2) + '¢ per point'; }
  else { bt.textContent = `Avg of ${sel.length}: ${sel.map(p => p.name.split(' ')[0]).join(', ')}`; bs.textContent = cpp.toFixed(2) + '¢ blended average'; }
  document.getElementById('advHint').textContent = `using ${cpp.toFixed(2)}¢` + (overrideActive ? ' custom' : sel.length > 0 ? ' · your picks' : ' default');
}

function onOverride() { overrideActive = true; selected.clear(); buildChips(); updateBlend(); calc(); }

function toggleExtra() {
  extraVisible = !extraVisible;
  document.getElementById('showMoreLink').textContent = extraVisible ? '− Show fewer' : '+ Show all partners';
  buildChips();
}

function toggleAdv() {
  advOpen = !advOpen;
  document.getElementById('advDisclosure').className = 'disclosure' + (advOpen ? ' open' : '');
  document.getElementById('advChevron').className = 'dt-chevron' + (advOpen ? ' open' : '');
  document.getElementById('advTrigger').setAttribute('aria-expanded', advOpen);
}

function toggleHousing() {
  housingOn = !housingOn;
  document.getElementById('housingToggle').className = 'toggle' + (housingOn ? ' on' : '');
  document.getElementById('toggleRow').className = 'toggle-row' + (housingOn ? ' on' : ' off');
  calc();
}

function toggleProgress() {
  progressOn = !progressOn;
  document.getElementById('progressBox').className = 'opt-box' + (progressOn ? ' on' : '');
  document.getElementById('progressBox').textContent = progressOn ? '✓' : '';
  document.getElementById('progressSection').style.display = progressOn ? 'block' : 'none';
  updateHousing();
}

function updateHousing() {
  const h = parseFloat(document.getElementById('housing').value) || 0;
  const threshold = h * 0.75;
  document.getElementById('tcVal').textContent = h > 0 ? '$' + Math.round(threshold).toLocaleString('en-US') : '—';
  if (h === 0) {
    document.getElementById('hmBadge').textContent = 'Enter rent below';
    const i = document.getElementById('hmInsight');
    i.style.cssText = 'color:var(--ink-3);font-style:italic;font-size:13px;';
    i.textContent = 'Enter your housing payment to see your unlock threshold.';
    return;
  }
  const sf = progressOn ? (parseFloat(document.getElementById('soFar').value) || 0) : 0;
  const needed = Math.max(0, threshold - sf);
  document.getElementById('hmBadge').textContent = needed === 0 ? '✓ Fully unlocked' : '$' + Math.round(needed).toLocaleString('en-US') + ' to go';
  const insight = document.getElementById('hmInsight');
  insight.style.cssText = '';
  if (!progressOn) {
    insight.innerHTML = `Charge <strong>$${Math.round(threshold).toLocaleString('en-US')}</strong> in other bills this month to fully unlock points on your $${Math.round(h).toLocaleString('en-US')} housing payment.`;
  } else {
    const pct = Math.min(sf / threshold * 100, 100);
    const fill = document.getElementById('pFill');
    fill.style.width = pct.toFixed(1) + '%';
    fill.className = 'progress-fill' + (sf >= threshold ? ' over' : pct < 50 ? ' low' : '');
    document.getElementById('pLeft').textContent = '$' + Math.round(sf).toLocaleString('en-US') + ' charged';
    document.getElementById('pRight').textContent = sf >= threshold ? '✓ Done' : '$' + Math.round(needed).toLocaleString('en-US') + ' to go';
    insight.innerHTML = sf >= threshold
      ? `Housing points are <strong>fully unlocked</strong> for the month.`
      : `<strong>$${Math.round(needed).toLocaleString('en-US')} more</strong> to fully unlock your housing points.`;
  }
}

function syncFee(from) {
  const amt = parseFloat(document.getElementById('amount').value) || 0;
  if (from === 'pct') {
    document.getElementById('feeDollar').value = amt > 0 ? (amt * (parseFloat(document.getElementById('feePct').value) || 0) / 100).toFixed(2) : '';
  } else if (from === 'dollar') {
    const d = parseFloat(document.getElementById('feeDollar').value) || 0;
    document.getElementById('feePct').value = amt > 0 ? (d / amt * 100).toFixed(2) : '';
  } else {
    document.getElementById('feeDollar').value = amt > 0 ? (amt * (parseFloat(document.getElementById('feePct').value) || 0) / 100).toFixed(2) : '';
  }
  calc();
}

function calc() {
  const amt = parseFloat(document.getElementById('amount').value) || 0;
  const feePct = parseFloat(document.getElementById('feePct').value) || 0;
  const feeDollar = parseFloat(document.getElementById('feeDollar').value) || (amt * feePct / 100);
  const mult = parseFloat(document.getElementById('category').value) || 1;
  const cpp = getBlendedCpp();
  const directPts = Math.round(amt * mult);
  const housingPts = housingOn ? Math.round(amt) : 0;
  const totalPts = directPts + housingPts;
  const ptDollar = totalPts * cpp / 100;
  const net = ptDollar - feeDollar;

  document.getElementById('bDirect').textContent = fmtPts(directPts);
  document.getElementById('bHousing').textContent = '+' + fmtPts(housingPts);
  document.getElementById('bTotal').textContent = fmtPts(totalPts);
  document.getElementById('bValue').textContent = fmt(ptDollar);
  document.getElementById('bFee').textContent = '−' + fmt(feeDollar);
  document.getElementById('netV').textContent = (net >= 0 ? '+' : '−') + fmt(net);
  document.getElementById('netV').className = 'net-v' + (net >= 0 ? '' : ' neg');

  const sel = PARTNERS.filter(p => selected.has(p.id));
  document.getElementById('cppContext').textContent = overrideActive
    ? `Using ${cpp.toFixed(2)}¢/pt · custom value`
    : sel.length === 0 ? `Using ${cpp.toFixed(2)}¢/pt · World of Hyatt default`
    : sel.length === 1 ? `Using ${cpp.toFixed(2)}¢/pt · ${sel[0].name}`
    : `Using ${cpp.toFixed(2)}¢/pt · blended across ${sel.length} partners`;

  const vm = document.getElementById('verdictMain'), vs = document.getElementById('verdictSub');
  if (net > 0.50) { vm.textContent = 'Worth it.'; vm.className = 'verdict-main yes'; vs.innerHTML = `You net <strong>${fmt(net)}</strong> after the fee.`; }
  else if (net < -0.50) { vm.textContent = 'Skip it.'; vm.className = 'verdict-main no'; vs.innerHTML = `Fee costs <strong>${fmt(Math.abs(net))}</strong> more than the points are worth.`; }
  else { vm.textContent = 'Borderline.'; vm.className = 'verdict-main neutral'; vs.innerHTML = `Nearly a wash — only ${fmt(Math.abs(net))} difference.`; }

  updateBlend();
}

buildChips(); syncFee(); calc(); updateHousing();
