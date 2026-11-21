window.DhakaFlights.registerSection("deals-grid", (root) => {
  const DF = window.DhakaFlights;
  const grid = root.querySelector("[data-deals-grid]");
  const originEl = root.querySelector("[data-deals-origin]");
  const regionBtns = root.querySelectorAll("[data-region-btn]");
  if (!grid || !originEl) return;

  let regionFilter = "all";
  let allDeals = [];

  function updateFilterStyles() {
    regionBtns.forEach(btn => {
      const active = btn.getAttribute("data-region-btn") === regionFilter;
      btn.className = active
        ? "px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0a3673] text-white"
        : "px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100";
    });
  }

  function renderDeals() {
    const origin = originEl.value;
    const filtered = allDeals.filter(item => {
      if (regionFilter === "all") return true;
      const info = DF.AIRPORT_MAP[item.destination] || {};
      return (item.region || info.region || "asia") === regionFilter;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="col-span-full text-center py-8 text-slate-500">No cached deals found for this filter. Try searching directly above!</div>`;
      return;
    }

    grid.innerHTML = filtered.slice(0, 8).map(item => {
      const info = DF.AIRPORT_MAP[item.destination] || {};
      const city = item.city || info.city || item.destination;
      const country = item.country || info.country || "";
      const depRaw = (item.departure_at || DF.toLocalIsoDate(new Date(Date.now() + 14 * 86400000))).slice(0, 10);
      const airline = DF.AIRLINE_NAMES[item.airline] || item.airline || "Top Airlines";
      const stops = item.transfers === 0 ? "Direct" : `${item.transfers || 1} Stop`;
      const stopBadge = item.transfers === 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700";
      const wlLink = DF.buildWhiteLabelUrl(origin, item.destination, depRaw);

      return `
        <a href="${DF.esc(wlLink)}" class="group bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-xs hover:shadow-xl transition flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs font-bold mb-3">
              <span class="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md">${DF.esc(origin)} ✈ ${DF.esc(item.destination)}</span>
              <span class="${stopBadge} px-2.5 py-1 rounded-full">${DF.esc(stops)}</span>
            </div>
            <h3 class="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition">${DF.esc(city)}</h3>
            <p class="text-xs text-slate-500 mb-4">${country ? `${DF.esc(country)} • ` : ""}${DF.esc(airline)}</p>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div class="text-[11px] text-slate-400">Depart ${DF.esc(DF.formatHumanDate(depRaw))}</div>
              <div class="text-lg font-extrabold text-[#0a3673]">${DF.esc(DF.formatPrice(item.price))}</div>
            </div>
            <span class="bg-[#FFD200] group-hover:bg-[#f2c600] text-slate-900 text-xs font-extrabold px-3.5 py-2 rounded-lg transition">Compare →</span>
          </div>
        </a>
      `;
    }).join("");
  }

  async function loadDeals() {
    const origin = originEl.value;
    const direct = DF.state.directOnly;
    grid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-400 font-medium">Loading live airfares...</div>`;

    try {
      const res = await fetch(`/api/deals?origin=${encodeURIComponent(origin)}&currency=${DF.state.currency}&direct=${direct}`);
      const json = await res.json();
      allDeals = json.deals || [];
      renderDeals();
    } catch (_) {
      grid.innerHTML = `<div class="col-span-full text-center py-8 text-slate-500">Could not load deals right now. Use the search bar above!</div>`;
    }
  }

  regionBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      regionFilter = btn.getAttribute("data-region-btn") || "all";
      updateFilterStyles();
      renderDeals();
    });
  });

  originEl.addEventListener("change", loadDeals);
  DF.on("df:direct-change", loadDeals);
  DF.on("df:currency-change", loadDeals);

  loadDeals();
});
