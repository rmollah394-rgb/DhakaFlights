const CITY_MAP = {
  DAC: "Dhaka", CGP: "Chattogram", ZYL: "Sylhet", CXB: "Cox's Bazar", SPD: "Saidpur",
  JSR: "Jashore", RJH: "Rajshahi", BZL: "Barishal",
  DXB: "Dubai", AUH: "Abu Dhabi", SHJ: "Sharjah", DOH: "Doha", RUH: "Riyadh",
  JED: "Jeddah", DMM: "Dammam", MED: "Madinah", KWI: "Kuwait", MCT: "Muscat", BAH: "Bahrain",
  KUL: "Kuala Lumpur", SIN: "Singapore", BKK: "Bangkok", DMK: "Bangkok (DMK)", HKT: "Phuket",
  CCU: "Kolkata", DEL: "New Delhi", BOM: "Mumbai", MAA: "Chennai",
  KTM: "Kathmandu", CMB: "Colombo", MLE: "Male", CAN: "Guangzhou", KMG: "Kunming", HKG: "Hong Kong",
  LHR: "London", MAN: "Manchester", IST: "Istanbul", FCO: "Rome", YYZ: "Toronto", JFK: "New York"
};

const AIRLINE_MAP = {
  BG: "Biman Bangladesh", BS: "US-Bangla Airlines", VQ: "Novoair", "2A": "Air Astra",
  EK: "Emirates", QR: "Qatar Airways", EY: "Etihad Airways", SV: "Saudia", XY: "flynas",
  SQ: "Singapore Airlines", MH: "Malaysia Airlines", OD: "Batik Air", AK: "AirAsia",
  TG: "Thai Airways", FZ: "flydubai", G9: "Air Arabia", WY: "Oman Air", KU: "Kuwait Airways",
  GF: "Gulf Air", TK: "Turkish Airlines", "6E": "IndiGo", AI: "Air India", UL: "SriLankan",
  CZ: "China Southern", MU: "China Eastern", CX: "Cathay Pacific", H9: "Himalaya Airlines"
};

let currentType = "departures";
let rawFlights = [];

function startDhakaClock() {
  const el = document.getElementById("dhakaClock");
  const update = () => {
    el.textContent = new Date().toLocaleTimeString("en-GB", {
      timeZone: "Asia/Dhaka",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };
  update();
  setInterval(update, 1000);
  document.getElementById("year").textContent = new Date().getFullYear();
}

function switchBoard(type) {
  currentType = type;
  const tabDep = document.getElementById("tabDep");
  const tabArr = document.getElementById("tabArr");
  document.getElementById("colAirport").textContent = type === "departures" ? "Destination" : "Origin";
  document.getElementById("colGate").textContent = type === "departures" ? "Terminal / Gate" : "Terminal / Belt";

  if (type === "departures") {
    tabDep.className = "px-5 py-2.5 rounded-xl text-sm font-extrabold bg-[#0a3673] text-white transition";
    tabArr.className = "px-5 py-2.5 rounded-xl text-sm font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 transition";
  } else {
    tabArr.className = "px-5 py-2.5 rounded-xl text-sm font-extrabold bg-[#0a3673] text-white transition";
    tabDep.className = "px-5 py-2.5 rounded-xl text-sm font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 transition";
  }
  loadBoard();
}

async function loadBoard() {
  const body = document.getElementById("boardBody");
  body.innerHTML = `<tr><td colspan="6" class="py-12 text-center text-blue-200">Loading Dhaka (DAC) ${currentType}...</td></tr>`;

  try {
    const res = await fetch(`/api/schedule?type=${currentType}`);
    const json = await res.json();
    rawFlights = json.flights || [];

    const minsAgo = Math.max(0, Math.round((Date.now() - (json.updatedAt || Date.now())) / 60000));
    const statusText = json.source === "sample"
      ? "Preview Mode (Sample Data)"
      : `Updated ${minsAgo === 0 ? "just now" : minsAgo + "m ago"} • Cached (3h)`;
    document.getElementById("cacheStatus").textContent = statusText;
    document.getElementById("sampleBanner").classList.toggle("hidden", json.source !== "sample");

    renderBoard();
  } catch (_) {
    body.innerHTML = `<tr><td colspan="6" class="py-12 text-center text-red-300">Unable to load flight board right now.</td></tr>`;
  }
}

function getStatusBadge(f, delayedMins) {
  const st = (f.status || "scheduled").toLowerCase();
  if (st === "cancelled") {
    return `<span class="inline-flex items-center gap-1.5 bg-red-500/20 text-red-300 border border-red-400/30 px-2.5 py-1 rounded-full text-xs font-bold">Cancelled</span>`;
  }
  if (delayedMins && delayedMins > 0) {
    return `<span class="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full text-xs font-bold">Delayed +${delayedMins}m</span>`;
  }
  if (st === "active" || st === "en-route") {
    return `<span class="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2.5 py-1 rounded-full text-xs font-bold"><span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>In Air</span>`;
  }
  if (st === "landed") {
    return `<span class="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full text-xs font-bold">Landed</span>`;
  }
  return `<span class="inline-flex items-center gap-1.5 bg-slate-500/25 text-slate-200 border border-white/15 px-2.5 py-1 rounded-full text-xs font-bold">Scheduled</span>`;
}

function buildSearchLink(origin, dest, timeStr) {
  const today = new Date(Date.now() + 7 * 86400000);
  const datePart = (timeStr && /^\d{4}-\d{2}-\d{2}/.test(timeStr))
    ? `${timeStr.slice(8, 10)}${timeStr.slice(5, 7)}`
    : `${String(today.getDate()).padStart(2, "0")}${String(today.getMonth() + 1).padStart(2, "0")}`;
  return `https://search.dhakaflights.com/?flightSearch=${origin}${datePart}${dest}1`;
}

function renderBoard() {
  const body = document.getElementById("boardBody");
  const q = document.getElementById("flightFilter").value.trim().toLowerCase();
  const statusPick = document.getElementById("statusFilter").value;
  const hideCodeshares = document.getElementById("hideCodeshares").checked;

  const filtered = rawFlights
    .filter(f => {
      if (hideCodeshares && f.cs_flight_iata) return false;
      const otherCode = currentType === "departures" ? f.arr_iata : f.dep_iata;
      const city = (CITY_MAP[otherCode] || "").toLowerCase();
      const airline = (AIRLINE_MAP[f.airline_iata] || f.airline_iata || "").toLowerCase();
      const flightNo = (f.flight_iata || "").toLowerCase();

      if (q && !flightNo.includes(q) && !city.includes(q) && !airline.includes(q) && !(otherCode || "").toLowerCase().includes(q)) {
        return false;
      }

      const delayed = currentType === "departures" ? f.dep_delayed : f.arr_delayed;
      const st = (f.status || "scheduled").toLowerCase();
      if (statusPick === "delayed" && !(delayed > 0)) return false;
      if (statusPick !== "all" && statusPick !== "delayed" && st !== statusPick) return false;
      return true;
    })
    .sort((a, b) => {
      const tA = currentType === "departures" ? (a.dep_time || "") : (a.arr_time || "");
      const tB = currentType === "departures" ? (b.dep_time || "") : (b.arr_time || "");
      return tA.localeCompare(tB);
    });

  if (filtered.length === 0) {
    body.innerHTML = `<tr><td colspan="6" class="py-12 text-center text-blue-200">No matching flights found for this filter.</td></tr>`;
    return;
  }

  body.innerHTML = filtered.slice(0, 80).map(f => {
    const isDep = currentType === "departures";
    const schedTime = isDep ? f.dep_time : f.arr_time;
    const estTime = isDep ? (f.dep_actual || f.dep_estimated) : (f.arr_actual || f.arr_estimated);
    const delayedMins = isDep ? f.dep_delayed : f.arr_delayed;

    const hhmm = schedTime ? schedTime.slice(11, 16) : "--:--";
    const dateLabel = schedTime ? schedTime.slice(5, 10) : "";
    const estHHMM = (estTime && estTime !== schedTime) ? estTime.slice(11, 16) : "";

    const otherCode = (isDep ? f.arr_iata : f.dep_iata) || "---";
    const city = CITY_MAP[otherCode] || otherCode;
    const airlineName = AIRLINE_MAP[f.airline_iata] || f.airline_iata || "Airline";

    const terminal = isDep ? f.dep_terminal : f.arr_terminal;
    const gateOrBelt = isDep ? (f.dep_gate ? `Gate ${f.dep_gate}` : "") : (f.arr_baggage ? `Belt ${f.arr_baggage}` : "");
    const termText = [terminal ? `T${terminal}` : "", gateOrBelt].filter(Boolean).join(" • ") || "TBA";

    const originForFare = isDep ? "DAC" : otherCode;
    const destForFare = isDep ? otherCode : "DAC";
    const fareUrl = buildSearchLink(originForFare, destForFare, schedTime);

    return `
      <tr class="hover:bg-white/5 transition">
        <td class="py-3.5 px-5 whitespace-nowrap">
          <div class="text-base font-mono font-extrabold text-[#FFD200]">${hhmm}</div>
          <div class="text-[11px] text-blue-200">${estHHMM ? `Est ${estHHMM}` : dateLabel}</div>
        </td>
        <td class="py-3.5 px-4">
          <div class="font-extrabold text-white">${f.flight_iata || "--"}</div>
          <div class="text-xs text-blue-200">${airlineName}</div>
        </td>
        <td class="py-3.5 px-4">
          <div class="font-bold text-white">${city} <span class="text-xs font-mono bg-white/10 px-1.5 py-0.5 rounded text-[#FFD200] ml-1">${otherCode}</span></div>
        </td>
        <td class="py-3.5 px-4 text-xs font-semibold text-blue-100 whitespace-nowrap">${termText}</td>
        <td class="py-3.5 px-4 whitespace-nowrap">${getStatusBadge(f, delayedMins)}</td>
        <td class="py-3.5 px-5 text-right whitespace-nowrap">
          <a href="${fareUrl}" class="inline-block bg-[#FFD200] hover:bg-[#f2c600] text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg transition">
            Compare Fare →
          </a>
        </td>
      </tr>
    `;
  }).join("");
}

startDhakaClock();
loadBoard();
