window.DhakaFlights.registerSection("schedule-board", (root) => {
  const DF = window.DhakaFlights;
  const $ = sel => root.querySelector(sel);

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

  const clockEl = $("[data-dhaka-clock]");
  const cacheStatusEl = $("[data-cache-status]");
  const sampleBannerEl = $("[data-sample-banner]");
  const colAirportEl = $("[data-col-airport]");
  const colGateEl = $("[data-col-gate]");
  const filterInput = $("[data-flight-filter]");
  const statusSelect = $("[data-status-filter]");
  const hideCsCheck = $("[data-hide-codeshares]");
  const bodyEl = $("[data-board-body]");

  let currentType = "departures";
  let timeWindow = "upcoming";
  let rawFlights = [];

  function getDhakaCutoffStr(offsetMins = -30) {
    return new Date(Date.now() + 6 * 3600000 + offsetMins * 60000)
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
  }

  function format12Hour(timeStr) {
    if (!timeStr || timeStr.length < 16) return "--:--";
    let h = parseInt(timeStr.slice(11, 13), 10);
    const m = timeStr.slice(14, 16);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  function formatTerminal(term, isDep, gateOrBelt) {
    let tLabel = "";
    if (term === "D" || term === "DOM") tLabel = "Domestic";
    else if (term) tLabel = `Terminal ${term}`;
    const extra = isDep
      ? (gateOrBelt ? `Gate ${gateOrBelt}` : "")
      : (gateOrBelt ? `Belt ${gateOrBelt}` : "");
    return [tLabel, extra].filter(Boolean).join(" • ") || "—";
  }

  function startDhakaClock() {
    if (!clockEl) return;
    const update = () => {
      clockEl.textContent = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Asia/Dhaka",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    };
    update();
    setInterval(update, 1000);
  }

  function setTimeWindow(mode) {
    timeWindow = mode;
    root.querySelectorAll("[data-time-window]").forEach(btn => {
      const active = btn.getAttribute("data-time-window") === mode;
      btn.className = active
        ? "px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 transition"
        : "px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition";
    });
    renderBoard();
  }

  function switchBoard(type) {
    currentType = type;
    if (colAirportEl) colAirportEl.textContent = type === "departures" ? "Destination" : "Origin";
    if (colGateEl) colGateEl.textContent = type === "departures" ? "Terminal / Gate" : "Terminal / Belt";
    root.querySelectorAll("[data-board-tab]").forEach(btn => {
      const active = btn.getAttribute("data-board-tab") === type;
      btn.className = active
        ? "px-4 py-2.5 rounded-xl text-sm font-extrabold bg-[#003580] text-white transition"
        : "px-4 py-2.5 rounded-xl text-sm font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 transition";
    });
    loadBoard();
  }

  function updateSummaryStats() {
    const operating = rawFlights.filter(f => !f.cs_flight_iata);
    const delayedCount = operating.filter(f => (currentType === "departures" ? f.dep_delayed : f.arr_delayed) > 10).length;
    const activeCount = operating.filter(f => (f.status || "").toLowerCase() === "active").length;
    const onTimeCount = Math.max(0, operating.length - delayedCount);

    const setStat = (k, val) => {
      const el = $(`[data-stat="${k}"]`);
      if (el) el.textContent = String(val);
    };
    setStat("total", operating.length);
    setStat("ontime", onTimeCount);
    setStat("active", activeCount);
    setStat("delayed", delayedCount);
  }

  function getStatusBadge(f, delayedMins, estHHMM) {
    const st = (f.status || "scheduled").toLowerCase();
    if (st === "cancelled") {
      return `<span class="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>Cancelled</span>`;
    }
    if (delayedMins && delayedMins > 15) {
      return `<span class="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Delayed +${DF.esc(delayedMins)}m</span>`;
    }
    if (st === "active" || st === "en-route") {
      const label = estHHMM ? `Est ${DF.esc(estHHMM)}` : "In Air";
      return `<span class="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-full text-xs font-bold"><span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>${label}</span>`;
    }
    if (st === "landed") {
      const label = estHHMM ? `Landed ${DF.esc(estHHMM)}` : "Landed";
      return `<span class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>${label}</span>`;
    }
    return `<span class="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-bold"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Scheduled</span>`;
  }

  function buildSearchLink(origin, dest, timeStr) {
    const today = new Date(Date.now() + 7 * 86400000);
    const datePart = (timeStr && /^\d{4}-\d{2}-\d{2}/.test(timeStr))
      ? `${timeStr.slice(8, 10)}${timeStr.slice(5, 7)}`
      : `${String(today.getDate()).padStart(2, "0")}${String(today.getMonth() + 1).padStart(2, "0")}`;
    return `https://search.dhakaflights.com/?flightSearch=${encodeURIComponent(origin + datePart + dest + "1")}`;
  }

  function renderBoard() {
    if (!bodyEl) return;
    const q = (filterInput?.value || "").trim().toLowerCase();
    const statusPick = statusSelect?.value || "all";
    const hideCodeshares = hideCsCheck ? hideCsCheck.checked : true;
    const cutoff = getDhakaCutoffStr(-30);

    const filtered = rawFlights
      .filter(f => {
        if (hideCodeshares && f.cs_flight_iata) return false;
        const isDep = currentType === "departures";
        const schedTime = isDep ? f.dep_time : f.arr_time;
        const st = (f.status || "scheduled").toLowerCase();

        if (timeWindow === "upcoming" && !q && statusPick === "all") {
          if (schedTime && schedTime < cutoff && st !== "active") return false;
        }

        const otherCode = isDep ? f.arr_iata : f.dep_iata;
        const city = (CITY_MAP[otherCode] || "").toLowerCase();
        const airline = (AIRLINE_MAP[f.airline_iata] || f.airline_iata || "").toLowerCase();
        const flightNo = (f.flight_iata || "").toLowerCase();

        if (q && !flightNo.includes(q) && !city.includes(q) && !airline.includes(q) && !(otherCode || "").toLowerCase().includes(q)) {
          return false;
        }

        const delayed = isDep ? f.dep_delayed : f.arr_delayed;
        if (statusPick === "delayed" && !(delayed > 15)) return false;
        if (statusPick !== "all" && statusPick !== "delayed" && st !== statusPick) return false;
        return true;
      })
      .sort((a, b) => {
        const tA = currentType === "departures" ? (a.dep_time || "") : (a.arr_time || "");
        const tB = currentType === "departures" ? (b.dep_time || "") : (b.arr_time || "");
        return tA.localeCompare(tB);
      });

    if (filtered.length === 0) {
      bodyEl.innerHTML = `
        <tr>
          <td colspan="6" class="py-12 text-center text-slate-500">
            <div class="mb-2 font-medium">No upcoming flights match this filter.</div>
            <button type="button" data-action="show-all-times" class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-4 py-2 rounded-lg">
              Show All Flights Today
            </button>
          </td>
        </tr>`;
      return;
    }

    bodyEl.innerHTML = filtered.slice(0, 80).map(f => {
      const isDep = currentType === "departures";
      const schedTime = isDep ? f.dep_time : f.arr_time;
      const estTime = isDep ? (f.dep_actual || f.dep_estimated) : (f.arr_actual || f.arr_estimated);
      const delayedMins = isDep ? f.dep_delayed : f.arr_delayed;

      const time12 = format12Hour(schedTime);
      const est12 = (estTime && estTime !== schedTime) ? format12Hour(estTime) : "";

      const otherCode = (isDep ? f.arr_iata : f.dep_iata) || "---";
      const city = CITY_MAP[otherCode] || otherCode;
      const airlineCode = (f.airline_iata || "").toUpperCase();
      const airlineName = AIRLINE_MAP[airlineCode] || airlineCode || "Airline";

      const terminal = isDep ? f.dep_terminal : f.arr_terminal;
      const gateOrBelt = isDep ? f.dep_gate : f.arr_baggage;
      const termText = formatTerminal(terminal, isDep, gateOrBelt);

      const originForFare = isDep ? "DAC" : otherCode;
      const destForFare = isDep ? otherCode : "DAC";
      const fareUrl = buildSearchLink(originForFare, destForFare, schedTime);

      const logoHtml = airlineCode
        ? `<div class="w-24 h-8 flex items-center shrink-0" data-logo-wrap>
             <img src="https://pics.avs.io/140/44/${DF.esc(airlineCode)}.png" alt="${DF.esc(airlineName)}" loading="lazy"
               data-airline-logo class="max-h-7 max-w-[90px] object-contain" />
             <span data-airline-fallback class="hidden items-center justify-center w-9 h-7 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-extrabold">${DF.esc(airlineCode)}</span>
           </div>`
        : "";

      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="py-3.5 px-5 whitespace-nowrap">
            <div class="text-sm font-extrabold text-slate-900">${DF.esc(time12)}</div>
            ${est12 ? `<div class="text-[11px] font-medium text-slate-400">Est ${DF.esc(est12)}</div>` : ""}
          </td>
          <td class="py-3.5 px-4">
            <div class="flex items-center gap-3">
              ${logoHtml}
              <div>
                <div class="font-extrabold text-slate-900">${DF.esc(f.flight_iata || "--")}</div>
                <div class="text-xs text-slate-500">${DF.esc(airlineName)}</div>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <span class="font-bold text-slate-900">${DF.esc(city)}</span>
            <span class="text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-sm ml-1.5">${DF.esc(otherCode)}</span>
          </td>
          <td class="py-3.5 px-4 text-xs font-semibold text-slate-600 whitespace-nowrap">${DF.esc(termText)}</td>
          <td class="py-3.5 px-4 whitespace-nowrap">${getStatusBadge(f, delayedMins, est12)}</td>
          <td class="py-3.5 px-5 text-right whitespace-nowrap">
            <a href="${DF.esc(fareUrl)}" class="inline-block bg-[#FFD200] hover:bg-[#f2c600] text-slate-900 text-xs font-extrabold px-3.5 py-2 rounded-lg shadow-xs transition">
              Compare Fare →
            </a>
          </td>
        </tr>
      `;
    }).join("");

    bodyEl.querySelectorAll("[data-airline-logo]").forEach(img => {
      img.addEventListener("error", () => {
        img.classList.add("hidden");
        const fallback = img.closest("[data-logo-wrap]")?.querySelector("[data-airline-fallback]");
        if (fallback) {
          fallback.classList.remove("hidden");
          fallback.classList.add("inline-flex");
        }
      });
    });
  }

  async function loadBoard() {
    if (!bodyEl) return;
    bodyEl.innerHTML = `<tr><td colspan="6" class="py-12 text-center text-slate-400 font-medium">Loading Dhaka (DAC) ${DF.esc(currentType)}...</td></tr>`;

    try {
      const res = await fetch(`/api/schedule?type=${currentType}`);
      const json = await res.json();
      rawFlights = json.flights || [];

      const minsAgo = Math.max(0, Math.round((Date.now() - (json.updatedAt || Date.now())) / 60000));
      if (cacheStatusEl) {
        cacheStatusEl.textContent = json.source === "sample"
          ? "Preview Mode (Sample Data)"
          : `Updated ${minsAgo === 0 ? "just now" : minsAgo + "m ago"} • Cached (3h)`;
      }
      if (sampleBannerEl) sampleBannerEl.classList.toggle("hidden", json.source !== "sample");

      updateSummaryStats();
      renderBoard();
    } catch (_) {
      bodyEl.innerHTML = `<tr><td colspan="6" class="py-12 text-center text-red-500 font-medium">Unable to load flight board right now.</td></tr>`;
    }
  }

  root.querySelectorAll("[data-board-tab]").forEach(btn => {
    btn.addEventListener("click", () => switchBoard(btn.getAttribute("data-board-tab")));
  });
  root.querySelectorAll("[data-time-window]").forEach(btn => {
    btn.addEventListener("click", () => setTimeWindow(btn.getAttribute("data-time-window")));
  });
  if (filterInput) filterInput.addEventListener("input", renderBoard);
  if (statusSelect) statusSelect.addEventListener("change", renderBoard);
  if (hideCsCheck) hideCsCheck.addEventListener("change", renderBoard);
  if (bodyEl) {
    bodyEl.addEventListener("click", (e) => {
      if (e.target.closest('[data-action="show-all-times"]')) setTimeWindow("all");
    });
  }

  startDhakaClock();
  loadBoard();
});
