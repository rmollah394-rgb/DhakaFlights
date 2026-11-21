(function () {
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

  const state = {
    currency: "bdt",
    directOnly: false,
    origin: "DAC",
    destination: "DXB"
  };

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function toLocalIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function formatHumanDate(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return "";
    const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
  }

  function formatPrice(val, currency = state.currency) {
    if (!val) return "Check Live Fare";
    const sym = currency === "usd" ? "$" : "৳";
    return `${sym} ${Number(val).toLocaleString()}`;
  }

  function toDDMM(dateStr) {
    const [, m, d] = dateStr.split("-");
    return `${d}${m}`;
  }

  function buildWhiteLabelUrl(origin, dest, depDate, retDate = "", cabin = "", adults = 1, children = 0, infants = 0) {
    const paxStr = (children > 0 || infants > 0) ? `${adults}${children}${infants}` : `${adults}`;
    const retPart = retDate ? toDDMM(retDate) : "";
    return `https://search.dhakaflights.com/?flightSearch=${encodeURIComponent(origin + toDDMM(depDate) + dest + retPart + cabin + paxStr)}`;
  }

  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function on(name, handler) {
    window.addEventListener(name, handler);
  }

  function registerSection(name, initFn) {
    const run = () => {
      document.querySelectorAll(`[data-section="${name}"]`).forEach(root => {
        try {
          initFn(root);
        } catch (err) {
          console.error(`[DhakaFlights:${name}]`, err);
        }
      });
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
  }

  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest('[data-action="open-alert"]');
    if (openBtn) {
      emit("df:open-alert", { origin: state.origin, destination: state.destination });
    }
  });

  registerSection("footer", (root) => {
    const yEl = root.querySelector("[data-year]");
    if (yEl) yEl.textContent = String(new Date().getFullYear());
  });

  window.DhakaFlights = {
    AIRPORTS,
    AIRPORT_MAP,
    AIRLINE_NAMES,
    CABIN_LABELS,
    state,
    esc,
    toLocalIsoDate,
    formatHumanDate,
    formatPrice,
    buildWhiteLabelUrl,
    emit,
    on,
    registerSection
  };
})();
