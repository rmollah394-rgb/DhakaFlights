const AIRPORTS = [
  { code: "DAC", city: "Dhaka", name: "Hazrat Shahjalal Intl", country: "Bangladesh", region: "asia" },
  { code: "CGP", city: "Chattogram", name: "Shah Amanat Intl", country: "Bangladesh", region: "asia" },
  { code: "ZYL", city: "Sylhet", name: "Osmani Intl", country: "Bangladesh", region: "asia" },
  { code: "CXB", city: "Cox's Bazar", name: "Cox's Bazar Airport", country: "Bangladesh", region: "asia" },
  { code: "SPD", city: "Saidpur", name: "Saidpur Airport", country: "Bangladesh", region: "asia" },
  { code: "JSR", city: "Jashore", name: "Jashore Airport", country: "Bangladesh", region: "asia" },
  { code: "RJH", city: "Rajshahi", name: "Shah Makhdum", country: "Bangladesh", region: "asia" },
  { code: "DXB", city: "Dubai", name: "Dubai Intl", country: "UAE", region: "me" },
  { code: "AUH", city: "Abu Dhabi", name: "Zayed Intl", country: "UAE", region: "me" },
  { code: "SHJ", city: "Sharjah", name: "Sharjah Intl", country: "UAE", region: "me" },
  { code: "DOH", city: "Doha", name: "Hamad Intl", country: "Qatar", region: "me" },
  { code: "RUH", city: "Riyadh", name: "King Khalid Intl", country: "Saudi Arabia", region: "me" },
  { code: "JED", city: "Jeddah", name: "King Abdulaziz Intl", country: "Saudi Arabia", region: "me" },
  { code: "DMM", city: "Dammam", name: "King Fahd Intl", country: "Saudi Arabia", region: "me" },
  { code: "KWI", city: "Kuwait City", name: "Kuwait Intl", country: "Kuwait", region: "me" },
  { code: "MCT", city: "Muscat", name: "Muscat Intl", country: "Oman", region: "me" },
  { code: "KUL", city: "Kuala Lumpur", name: "KLIA", country: "Malaysia", region: "asia" },
  { code: "SIN", city: "Singapore", name: "Changi Airport", country: "Singapore", region: "asia" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Intl", country: "Thailand", region: "asia" },
  { code: "HKT", city: "Phuket", name: "Phuket Intl", country: "Thailand", region: "asia" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose", country: "India", region: "asia" },
  { code: "DEL", city: "New Delhi", name: "Indira Gandhi Intl", country: "India", region: "asia" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji", country: "India", region: "asia" },
  { code: "KTM", city: "Kathmandu", name: "Tribhuvan Intl", country: "Nepal", region: "asia" },
  { code: "MLE", city: "Male", name: "Velana Intl", country: "Maldives", region: "asia" },
  { code: "CMB", city: "Colombo", name: "Bandaranaike Intl", country: "Sri Lanka", region: "asia" },
  { code: "LHR", city: "London", name: "Heathrow Airport", country: "UK", region: "eu" },
  { code: "MAN", city: "Manchester", name: "Manchester Airport", country: "UK", region: "eu" },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey", region: "eu" },
  { code: "JFK", city: "New York", name: "John F. Kennedy", country: "USA", region: "eu" },
  { code: "YYZ", city: "Toronto", name: "Pearson Intl", country: "Canada", region: "eu" },
  { code: "SYD", city: "Sydney", name: "Kingsford Smith", country: "Australia", region: "eu" },
  { code: "CAN", city: "Guangzhou", name: "Baiyun Intl", country: "China", region: "asia" },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong Intl", country: "Hong Kong", region: "asia" },
  { code: "ICN", city: "Seoul", name: "Incheon Intl", country: "South Korea", region: "asia" }
];

const AIRPORT_MAP = Object.fromEntries(AIRPORTS.map(a => [a.code, a]));
const AIRLINE_NAMES = {
  BG: "Biman Bangladesh", BS: "US-Bangla Airlines", EK: "Emirates", QR: "Qatar Airways",
  EY: "Etihad Airways", SV: "Saudia", SQ: "Singapore Airlines", MH: "Malaysia Airlines",
  OD: "Batik Air", AK: "AirAsia", TG: "Thai Airways", FZ: "flydubai", G9: "Air Arabia",
  TK: "Turkish Airlines", "6E": "IndiGo", AI: "Air India", UL: "SriLankan", CZ: "China Southern"
};
const CABIN_LABELS = { "": "Economy", w: "Premium Economy", c: "Business", f: "First" };

let tripType = "round";
let currentCurrency = "bdt";
let regionFilter = "all";
let allDeals = [];
const pax = { adults: 1, children: 0, infants: 0 };

function formatHumanDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
}

function formatPrice(val) {
  if (!val) return "Check Live Fare";
  const sym = currentCurrency === "usd" ? "$" : "৳";
  return `${sym} ${Number(val).toLocaleString()}`;
}

function initApp() {
  const today = new Date();
  const dep = new Date(today.getTime() + 14 * 86400000);
  const ret = new Date(today.getTime() + 21 * 86400000);
  const fmt = d => d.toISOString().split("T")[0];

  const depEl = document.getElementById("departDate");
  const retEl = document.getElementById("returnDate");
  depEl.min = fmt(today);
  depEl.value = fmt(dep);
  retEl.min = fmt(today);
  retEl.value = fmt(ret);
  document.getElementById("year").textContent = today.getFullYear();

  const monthSelect = document.getElementById("calMonth");
  for (let i = 0; i < 5; i++) {
    const mDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const val = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, "0")}`;
    const label = mDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = label;
    if (i === 1) opt.selected = true;
    monthSelect.appendChild(opt);
  }

  syncDateDisplay();
  syncPaxDisplay();
  loadDeals();
  loadCalendar();
}

function setTripType(type) {
  tripType = type;
  const tRound = document.getElementById("tabRound");
  const tOne = document.getElementById("tabOne");
  const retWrap = document.getElementById("returnDateWrap");
  if (type === "round") {
    tRound.className = "pb-2 text-sm sm:text-base font-bold text-white border-b-2 border-[#FFD200] transition";
    tOne.className = "pb-2 text-sm sm:text-base font-bold text-white/75 hover:text-white border-b-2 border-transparent transition";
    retWrap.classList.remove("hidden");
  } else {
    tOne.className = "pb-2 text-sm sm:text-base font-bold text-white border-b-2 border-[#FFD200] transition";
    tRound.className = "pb-2 text-sm sm:text-base font-bold text-white/75 hover:text-white border-b-2 border-transparent transition";
    retWrap.classList.add("hidden");
  }
  syncDateDisplay();
}

function setCurrency(curr) {
  currentCurrency = curr;
  document.getElementById("currBDT").className = curr === "bdt"
    ? "px-2.5 py-1.5 rounded-md bg-[#FFD200] text-slate-900 transition"
    : "px-2.5 py-1.5 rounded-md text-white hover:bg-white/10 transition";
  document.getElementById("currUSD").className = curr === "usd"
    ? "px-2.5 py-1.5 rounded-md bg-[#FFD200] text-slate-900 transition"
    : "px-2.5 py-1.5 rounded-md text-white hover:bg-white/10 transition";
  loadDeals();
  loadCalendar();
}

function syncDateDisplay() {
  const dep = document.getElementById("departDate").value;
  const ret = document.getElementById("returnDate").value;
  const el = document.getElementById("datesDisplay");
  el.textContent = (tripType === "round" && ret)
    ? `${formatHumanDate(dep)} - ${formatHumanDate(ret)}`
    : formatHumanDate(dep);
}

function setQuickTrip(days) {
  const depVal = document.getElementById("departDate").value;
  if (!depVal) return;
  const dep = new Date(depVal);
  const ret = new Date(dep.getTime() + days * 86400000);
  document.getElementById("returnDate").value = ret.toISOString().split("T")[0];
  setTripType("round");
  syncDateDisplay();
}

function toggleDatePopover() {
  document.getElementById("paxPopover").classList.add("hidden");
  document.getElementById("datePopover").classList.toggle("hidden");
}

function togglePaxPopover() {
  document.getElementById("datePopover").classList.add("hidden");
  document.getElementById("paxPopover").classList.toggle("hidden");
}

function updatePax(type, delta) {
  const next = pax[type] + delta;
  if (type === "adults" && (next < 1 || next > 9)) return;
  if (type !== "adults" && (next < 0 || next > 8)) return;
  if (type === "infants" && next > pax.adults) return;
  pax[type] = next;
  document.getElementById("adultsCount").textContent = pax.adults;
  document.getElementById("childrenCount").textContent = pax.children;
  document.getElementById("infantsCount").textContent = pax.infants;
  syncPaxDisplay();
}

function syncPaxDisplay() {
  const total = pax.adults + pax.children + pax.infants;
  const cabin = CABIN_LABELS[document.getElementById("cabinClass").value] || "Economy";
  const word = total === 1 ? "Adult" : "Travelers";
  document.getElementById("paxDisplay").textContent = `${total} ${word}, ${cabin}`;
}

function openDropdown(field) {
  filterAirports(field);
  document.getElementById(field + "List").classList.remove("hidden");
}

function clearDest() {
  document.getElementById("destInput").value = "";
  document.getElementById("destCode").value = "";
  openDropdown("dest");
  document.getElementById("destInput").focus();
}

function filterAirports(field) {
  const raw = document.getElementById(field + "Input").value.trim().toLowerCase();
  const listEl = document.getElementById(field + "List");
  const hiddenEl = document.getElementById(field + "Code");

  if (/^[a-z]{3}$/i.test(raw)) {
    hiddenEl.value = raw.toUpperCase();
  } else {
    const match = raw.match(/\(([a-z]{3})\)/i);
    if (match) hiddenEl.value = match[1].toUpperCase();
  }

  const query = raw.includes("(") ? "" : raw;
  const matches = AIRPORTS.filter(a =>
    !query ||
    a.city.toLowerCase().includes(query) ||
    a.code.toLowerCase().includes(query) ||
    a.country.toLowerCase().includes(query) ||
    a.name.toLowerCase().includes(query)
  ).slice(0, 8);

  listEl.innerHTML = matches.map(a => `
    <button type="button" onclick="selectAirport('${field}', '${a.code}', '${a.city.replace(/'/g, "\\'")}', '${a.country.replace(/'/g, "\\'")}')"
      class="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between border-b border-slate-100 last:border-0">
      <div>
        <div class="font-bold text-sm text-slate-900">${a.city}, ${a.country}</div>
        <div class="text-xs text-slate-500">${a.name}</div>
      </div>
      <span class="bg-blue-100 text-blue-800 text-xs font-extrabold px-2 py-1 rounded">${a.code}</span>
    </button>
  `).join("") || `<div class="px-4 py-3 text-xs text-slate-500">Type any 3-letter airport code (e.g. DAC, DXB, KUL)</div>`;
  listEl.classList.remove("hidden");
}

function selectAirport(field, code, city, country) {
  document.getElementById(field + "Input").value = `${city}, ${country} (${code})`;
  document.getElementById(field + "Code").value = code;
  document.getElementById(field + "List").classList.add("hidden");
}

function swapAirports() {
  const oIn = document.getElementById("originInput");
  const oCd = document.getElementById("originCode");
  const dIn = document.getElementById("destInput");
  const dCd = document.getElementById("destCode");
  [oIn.value, dIn.value] = [dIn.value, oIn.value];
  [oCd.value, dCd.value] = [dCd.value, oCd.value];
}

function toDDMM(dateStr) {
  const [, m, d] = dateStr.split("-");
  return `${d}${m}`;
}

function buildWhiteLabelUrl(origin, dest, depDate, retDate, cabin, adults, children, infants) {
  const paxStr = (children > 0 || infants > 0) ? `${adults}${children}${infants}` : `${adults}`;
  const retPart = retDate ? toDDMM(retDate) : "";
  return `https://search.dhakaflights.com/?flightSearch=${origin}${toDDMM(depDate)}${dest}${retPart}${cabin}${paxStr}`;
}

function submitSearch(e) {
  e.preventDefault();
  const errEl = document.getElementById("formError");
  errEl.classList.add("hidden");

  const origin = document.getElementById("originCode").value.trim().toUpperCase();
  const dest = document.getElementById("destCode").value.trim().toUpperCase();
  const depDate = document.getElementById("departDate").value;
  const retDate = tripType === "round" ? document.getElementById("returnDate").value : "";
  const cabin = document.getElementById("cabinClass").value;

  if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(dest)) {
    errEl.textContent = "Please select valid 3-letter departure and destination airports.";
    errEl.classList.remove("hidden");
    return;
  }
  if (origin === dest) {
    errEl.textContent = "Departure and destination airports cannot be the same.";
    errEl.classList.remove("hidden");
    return;
  }
  if (tripType === "round" && retDate < depDate) {
    errEl.textContent = "Return date must be on or after the departure date.";
    errEl.classList.remove("hidden");
    return;
  }

  window.location.href = buildWhiteLabelUrl(origin, dest, depDate, retDate, cabin, pax.adults, pax.children, pax.infants);
}

function onDirectToggle() {
  loadDeals();
  loadCalendar();
}

function setRegionFilter(reg) {
  regionFilter = reg;
  ["all", "me", "asia", "eu"].forEach(r => {
    document.getElementById("reg-" + r).className = r === reg
      ? "px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0a3673] text-white"
      : "px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100";
  });
  renderDeals();
}

async function loadDeals() {
  const origin = document.getElementById("dealsOrigin").value;
  const direct = document.getElementById("directOnlyCheck").checked;
  const grid = document.getElementById("dealsGrid");
  grid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-400 font-medium">Loading live airfares...</div>`;

  try {
    const res = await fetch(`/api/deals?origin=${origin}&currency=${currentCurrency}&direct=${direct}`);
    const json = await res.json();
    allDeals = json.deals || [];
    renderDeals();
  } catch (_) {
    grid.innerHTML = `<div class="col-span-full text-center py-8 text-slate-500">Could not load deals right now. Use the search bar above!</div>`;
  }
}

function renderDeals() {
  const origin = document.getElementById("dealsOrigin").value;
  const grid = document.getElementById("dealsGrid");

  const filtered = allDeals.filter(item => {
    if (regionFilter === "all") return true;
    const info = AIRPORT_MAP[item.destination] || {};
    return (item.region || info.region || "asia") === regionFilter;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-8 text-slate-500">No cached deals found for this filter. Try searching directly above!</div>`;
    return;
  }

  grid.innerHTML = filtered.slice(0, 8).map(item => {
    const info = AIRPORT_MAP[item.destination] || {};
    const city = item.city || info.city || item.destination;
    const country = item.country || info.country || "";
    const depRaw = (item.departure_at || new Date(Date.now() + 14 * 86400000).toISOString()).slice(0, 10);
    const airline = AIRLINE_NAMES[item.airline] || item.airline || "Top Airlines";
    const stops = item.transfers === 0 ? "Direct" : `${item.transfers || 1} Stop`;
    const stopBadge = item.transfers === 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700";
    const wlLink = buildWhiteLabelUrl(origin, item.destination, depRaw, "", "", 1, 0, 0);

    return `
      <a href="${wlLink}" class="group bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs font-bold mb-3">
            <span class="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md">${origin} ✈ ${item.destination}</span>
            <span class="${stopBadge} px-2.5 py-1 rounded-full">${stops}</span>
          </div>
          <h3 class="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition">${city}</h3>
          <p class="text-xs text-slate-500 mb-4">${country ? country + " • " : ""}${airline}</p>
        </div>
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div class="text-[11px] text-slate-400">Depart ${formatHumanDate(depRaw)}</div>
            <div class="text-lg font-extrabold text-[#0a3673]">${formatPrice(item.price)}</div>
          </div>
          <span class="bg-[#FFD200] group-hover:bg-[#f2c600] text-slate-900 text-xs font-extrabold px-3.5 py-2 rounded-lg transition">Compare →</span>
        </div>
      </a>
    `;
  }).join("");
}

async function loadCalendar() {
  const origin = document.getElementById("calOrigin").value;
  const dest = document.getElementById("calDest").value;
  const month = document.getElementById("calMonth").value;
  const direct = document.getElementById("directOnlyCheck").checked;
  const barsEl = document.getElementById("calendarBars");
  const summaryEl = document.getElementById("calendarSummary");

  barsEl.innerHTML = `<div class="w-full text-center text-sm text-slate-400 self-center">Loading monthly lowest fares...</div>`;
  summaryEl.innerHTML = "";

  try {
    const res = await fetch(`/api/calendar?origin=${origin}&destination=${dest}&month=${month}&currency=${currentCurrency}&direct=${direct}`);
    const json = await res.json();
    const days = json.days || [];

    if (days.length === 0) {
      const fallbackUrl = buildWhiteLabelUrl(origin, dest, `${month}-15`, "", "", 1, 0, 0);
      barsEl.innerHTML = `
        <div class="w-full text-center self-center space-y-2">
          <div class="text-sm text-slate-500">Not enough recent cached searches for <b>${origin} → ${dest}</b> in ${month}.</div>
          <a href="${fallbackUrl}" class="inline-block bg-[#FFD200] text-slate-900 text-xs font-extrabold px-4 py-2 rounded-lg">Check Live Fares on Search Page →</a>
        </div>
      `;
      return;
    }

    const prices = days.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const cheapestDay = days.find(d => d.price === minPrice);
    const cheapestLink = buildWhiteLabelUrl(origin, dest, cheapestDay.date, "", "", 1, 0, 0);

    summaryEl.innerHTML = `
      <div class="font-bold text-slate-700">
        Cheapest in month: <span class="text-emerald-700 font-extrabold">${formatPrice(minPrice)}</span> on <b>${formatHumanDate(cheapestDay.date)}</b>
      </div>
      <a href="${cheapestLink}" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
        Book Cheapest Date (${formatHumanDate(cheapestDay.date)}) →
      </a>
    `;

    barsEl.innerHTML = days.map(d => {
      const ratio = maxPrice === minPrice ? 0.7 : (d.price - minPrice) / (maxPrice - minPrice);
      const heightPct = Math.round(28 + ratio * 72);
      const isCheapest = d.price === minPrice;
      const barColor = isCheapest ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-500 hover:bg-blue-700";
      const dayNum = d.date.slice(8, 10);
      const link = buildWhiteLabelUrl(origin, dest, d.date, "", "", 1, 0, 0);

      return `
        <a href="${link}" title="${formatHumanDate(d.date)}: ${formatPrice(d.price)}"
          class="group flex-1 min-w-[24px] flex flex-col items-center justify-end h-full">
          <span class="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition mb-1 whitespace-nowrap">
            ${formatPrice(d.price)}
          </span>
          <div style="height: ${heightPct}%" class="w-full rounded-t-md ${barColor} transition-all"></div>
          <span class="text-[10px] font-bold ${isCheapest ? 'text-emerald-700' : 'text-slate-500'} mt-1.5">${dayNum}</span>
        </a>
      `;
    }).join("");
  } catch (_) {
    barsEl.innerHTML = `<div class="w-full text-center text-sm text-slate-500 self-center">Unable to load fare calendar right now.</div>`;
  }
}

function openAlertModal() {
  document.getElementById("alertOrigin").value = document.getElementById("originCode").value || "DAC";
  document.getElementById("alertDest").value = document.getElementById("destCode").value || "DXB";
  document.getElementById("alertMsg").classList.add("hidden");
  document.getElementById("alertModal").classList.remove("hidden");
}

function closeAlertModal() {
  document.getElementById("alertModal").classList.add("hidden");
}

async function submitAlert(e) {
  e.preventDefault();
  const msgEl = document.getElementById("alertMsg");
  const btn = document.getElementById("alertSubmitBtn");
  btn.disabled = true;
  btn.textContent = "Saving...";

  try {
    const res = await fetch("/api/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: document.getElementById("alertOrigin").value,
        destination: document.getElementById("alertDest").value,
        email: document.getElementById("alertEmail").value,
        targetPrice: document.getElementById("alertBudget").value,
      }),
    });
    const json = await res.json();
    msgEl.className = json.ok ? "text-xs font-bold text-emerald-600 text-center pt-1" : "text-xs font-bold text-red-600 text-center pt-1";
    msgEl.textContent = json.message || json.error;
    msgEl.classList.remove("hidden");
  } catch (_) {
    msgEl.className = "text-xs font-bold text-red-600 text-center pt-1";
    msgEl.textContent = "Network error. Please try again.";
    msgEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = "Activate Free Price Alert";
  }
}

document.addEventListener("click", (e) => {
  if (!e.target.closest("#originInput") && !e.target.closest("#originList")) {
    document.getElementById("originList").classList.add("hidden");
  }
  if (!e.target.closest("#destInput") && !e.target.closest("#destList")) {
    document.getElementById("destList").classList.add("hidden");
  }
  if (!e.target.closest("#datePopover") && !e.target.closest("#datesDisplay")) {
    document.getElementById("datePopover").classList.add("hidden");
  }
  if (!e.target.closest("#paxPopover") && !e.target.closest("#paxDisplay")) {
    document.getElementById("paxPopover").classList.add("hidden");
  }
});

initApp();
