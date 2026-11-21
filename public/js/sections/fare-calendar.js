window.DhakaFlights.registerSection("fare-calendar", (root) => {
  const DF = window.DhakaFlights;
  const originEl = root.querySelector("[data-cal-origin]");
  const destEl = root.querySelector("[data-cal-dest]");
  const monthEl = root.querySelector("[data-cal-month]");
  const summaryEl = root.querySelector("[data-cal-summary]");
  const barsEl = root.querySelector("[data-cal-bars]");
  if (!originEl || !destEl || !monthEl || !barsEl) return;

  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const mDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const val = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, "0")}`;
    const label = mDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = label;
    if (i === 1) opt.selected = true;
    monthEl.appendChild(opt);
  }

  async function loadCalendar() {
    const origin = originEl.value;
    const dest = destEl.value;
    const month = monthEl.value;
    const direct = DF.state.directOnly;

    barsEl.innerHTML = `<div class="w-full text-center text-sm text-slate-400 self-center">Loading monthly lowest fares...</div>`;
    if (summaryEl) summaryEl.innerHTML = "";

    try {
      const res = await fetch(`/api/calendar?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&month=${encodeURIComponent(month)}&currency=${DF.state.currency}&direct=${direct}`);
      const json = await res.json();
      const days = json.days || [];

      if (days.length === 0) {
        const fallbackUrl = DF.buildWhiteLabelUrl(origin, dest, `${month}-15`);
        barsEl.innerHTML = `
          <div class="w-full text-center self-center space-y-2">
            <div class="text-sm text-slate-500">Not enough recent cached searches for <b>${DF.esc(origin)} → ${DF.esc(dest)}</b> in ${DF.esc(month)}.</div>
            <a href="${DF.esc(fallbackUrl)}" class="inline-block bg-[#FFD200] text-slate-900 text-xs font-extrabold px-4 py-2 rounded-lg">Check Live Fares on Search Page →</a>
          </div>
        `;
        return;
      }

      const prices = days.map(d => d.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const cheapestDay = days.find(d => d.price === minPrice);
      const cheapestLink = DF.buildWhiteLabelUrl(origin, dest, cheapestDay.date);

      if (summaryEl) {
        summaryEl.innerHTML = `
          <div class="font-bold text-slate-700">
            Cheapest in month: <span class="text-emerald-700 font-extrabold">${DF.esc(DF.formatPrice(minPrice))}</span> on <b>${DF.esc(DF.formatHumanDate(cheapestDay.date))}</b>
          </div>
          <a href="${DF.esc(cheapestLink)}" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
            Book Cheapest Date (${DF.esc(DF.formatHumanDate(cheapestDay.date))}) →
          </a>
        `;
      }

      barsEl.innerHTML = days.map(d => {
        const ratio = maxPrice === minPrice ? 0.7 : (d.price - minPrice) / (maxPrice - minPrice);
        const heightPct = Math.round(28 + ratio * 72);
        const isCheapest = d.price === minPrice;
        const barColor = isCheapest ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-500 hover:bg-blue-700";
        const dayNum = d.date.slice(8, 10);
        const link = DF.buildWhiteLabelUrl(origin, dest, d.date);

        return `
          <a href="${DF.esc(link)}" title="${DF.esc(DF.formatHumanDate(d.date))}: ${DF.esc(DF.formatPrice(d.price))}"
            class="group flex-1 min-w-[24px] flex flex-col items-center justify-end h-full">
            <span class="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition mb-1 whitespace-nowrap">
              ${DF.esc(DF.formatPrice(d.price))}
            </span>
            <div style="height: ${heightPct}%" class="w-full rounded-t-md ${barColor} transition-all"></div>
            <span class="text-[10px] font-bold ${isCheapest ? "text-emerald-700" : "text-slate-500"} mt-1.5">${DF.esc(dayNum)}</span>
          </a>
        `;
      }).join("");
    } catch (_) {
      barsEl.innerHTML = `<div class="w-full text-center text-sm text-slate-500 self-center">Unable to load fare calendar right now.</div>`;
    }
  }

  originEl.addEventListener("change", loadCalendar);
  destEl.addEventListener("change", loadCalendar);
  monthEl.addEventListener("change", loadCalendar);
  DF.on("df:direct-change", loadCalendar);
  DF.on("df:currency-change", loadCalendar);

  loadCalendar();
});
