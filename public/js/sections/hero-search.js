window.DhakaFlights.registerSection("hero-search", (root) => {
  const DF = window.DhakaFlights;
  const $ = sel => root.querySelector(sel);

  const bgImg = $("[data-hero-bg-img]");
  const bgOverlay = $("[data-hero-bg-overlay]");
  if (bgImg) {
    bgImg.addEventListener("error", () => {
      bgImg.classList.add("hidden");
      if (bgOverlay) bgOverlay.classList.add("hidden");
    });
  }

  const form = $("[data-search-form]");
  const originInput = $("#originInput");
  const originCode = $("#originCode");
  const originList = $('[data-airport-list="origin"]');
  const destInput = $("#destInput");
  const destCode = $("#destCode");
  const destList = $('[data-airport-list="dest"]');
  const departDate = $("#departDate");
  const returnDate = $("#returnDate");
  const returnWrap = $("[data-return-wrap]");
  const datesDisplay = $("[data-dates-display]");
  const datePopover = $('[data-popover="date"]');
  const paxDisplay = $("[data-pax-display]");
  const paxPopover = $('[data-popover="pax"]');
  const cabinClass = $("#cabinClass");
  const directCheck = $("[data-direct-toggle]");
  const errEl = $("[data-form-error]");

  let tripType = "round";
  const pax = { adults: 1, children: 0, infants: 0 };

  const today = new Date();
  const dep = new Date(today.getTime() + 14 * 86400000);
  const ret = new Date(today.getTime() + 21 * 86400000);

  if (departDate) {
    departDate.min = DF.toLocalIsoDate(today);
    departDate.value = DF.toLocalIsoDate(dep);
  }
  if (returnDate) {
    returnDate.min = DF.toLocalIsoDate(today);
    returnDate.value = DF.toLocalIsoDate(ret);
  }

  function syncDateDisplay() {
    if (!datesDisplay || !departDate) return;
    const dVal = departDate.value;
    const rVal = returnDate ? returnDate.value : "";
    datesDisplay.textContent = (tripType === "round" && rVal)
      ? `${DF.formatHumanDate(dVal)} - ${DF.formatHumanDate(rVal)}`
      : DF.formatHumanDate(dVal);
  }

  function setTripType(type) {
    tripType = type;
    const tRound = $('[data-trip-btn="round"]');
    const tOne = $('[data-trip-btn="oneway"]');
    if (tRound && tOne) {
      const activeCls = "pb-2 text-sm sm:text-base font-bold text-white border-b-2 border-[#FFD200] transition";
      const idleCls = "pb-2 text-sm sm:text-base font-bold text-white/75 hover:text-white border-b-2 border-transparent transition";
      tRound.className = type === "round" ? activeCls : idleCls;
      tOne.className = type === "oneway" ? activeCls : idleCls;
    }
    if (returnWrap) returnWrap.classList.toggle("hidden", type !== "round");
    syncDateDisplay();
  }

  function syncPaxDisplay() {
    if (!paxDisplay) return;
    const total = pax.adults + pax.children + pax.infants;
    const cabin = DF.CABIN_LABELS[cabinClass ? cabinClass.value : ""] || "Economy";
    const word = total === 1 ? "Adult" : "Travelers";
    paxDisplay.textContent = `${total} ${word}, ${cabin}`;
  }

  function updateAirportInput(field, code, city, country) {
    const input = field === "origin" ? originInput : destInput;
    const hidden = field === "origin" ? originCode : destCode;
    const list = field === "origin" ? originList : destList;
    if (input) input.value = `${city}, ${country} (${code})`;
    if (hidden) hidden.value = code;
    if (list) list.classList.add("hidden");
    DF.state[field === "origin" ? "origin" : "destination"] = code;
  }

  function resolveAirportText(field) {
    const input = field === "origin" ? originInput : destInput;
    const hidden = field === "origin" ? originCode : destCode;
    if (!input || !hidden) return;
    const raw = input.value.trim();
    if (/^[a-z]{3}$/i.test(raw)) {
      hidden.value = raw.toUpperCase();
    } else {
      const match = raw.match(/\(([a-z]{3})\)/i);
      if (match) {
        hidden.value = match[1].toUpperCase();
      } else {
        const lower = raw.toLowerCase();
        const found = DF.AIRPORTS.find(a => a.city.toLowerCase() === lower || a.code.toLowerCase() === lower);
        if (found) hidden.value = found.code;
      }
    }
    DF.state[field === "origin" ? "origin" : "destination"] = hidden.value;
  }

  function renderAirportList(field) {
    const input = field === "origin" ? originInput : destInput;
    const list = field === "origin" ? originList : destList;
    if (!input || !list) return;

    resolveAirportText(field);
    const raw = input.value.trim().toLowerCase();
    const query = raw.includes("(") ? "" : raw;

    const matches = DF.AIRPORTS.filter(a =>
      !query ||
      a.city.toLowerCase().includes(query) ||
      a.code.toLowerCase().includes(query) ||
      a.country.toLowerCase().includes(query) ||
      a.name.toLowerCase().includes(query)
    ).slice(0, 8);

    list.innerHTML = matches.map(a => `
      <button type="button"
        data-pick-airport="${field}"
        data-code="${DF.esc(a.code)}"
        data-city="${DF.esc(a.city)}"
        data-country="${DF.esc(a.country)}"
        class="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between border-b border-slate-100 last:border-0">
        <div>
          <div class="font-bold text-sm text-slate-900">${DF.esc(a.city)}, ${DF.esc(a.country)}</div>
          <div class="text-xs text-slate-500">${DF.esc(a.name)}</div>
        </div>
        <span class="bg-blue-100 text-blue-800 text-xs font-extrabold px-2 py-1 rounded">${DF.esc(a.code)}</span>
      </button>
    `).join("") || `<div class="px-4 py-3 text-xs text-slate-500">Type any 3-letter airport code (e.g. DAC, DXB, KUL)</div>`;

    list.classList.remove("hidden");
  }

  root.querySelectorAll("[data-trip-btn]").forEach(btn => {
    btn.addEventListener("click", () => setTripType(btn.getAttribute("data-trip-btn")));
  });

  [
    { field: "origin", input: originInput, list: originList },
    { field: "dest", input: destInput, list: destList }
  ].forEach(({ field, input, list }) => {
    if (!input || !list) return;
    input.addEventListener("focus", () => renderAirportList(field));
    input.addEventListener("input", () => renderAirportList(field));
    list.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-pick-airport]");
      if (!btn) return;
      updateAirportInput(
        btn.getAttribute("data-pick-airport"),
        btn.getAttribute("data-code"),
        btn.getAttribute("data-city"),
        btn.getAttribute("data-country")
      );
    });
  });

  const clearBtn = $("[data-clear-dest]");
  if (clearBtn && destInput && destCode) {
    clearBtn.addEventListener("click", () => {
      destInput.value = "";
      destCode.value = "";
      renderAirportList("dest");
      destInput.focus();
    });
  }

  const swapBtn = $("[data-swap-btn]");
  if (swapBtn && originInput && originCode && destInput && destCode) {
    swapBtn.addEventListener("click", () => {
      [originInput.value, destInput.value] = [destInput.value, originInput.value];
      [originCode.value, destCode.value] = [destCode.value, originCode.value];
      DF.state.origin = originCode.value;
      DF.state.destination = destCode.value;
    });
  }

  if (departDate) departDate.addEventListener("change", syncDateDisplay);
  if (returnDate) returnDate.addEventListener("change", syncDateDisplay);

  root.querySelectorAll("[data-quick-trip]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!departDate || !departDate.value || !returnDate) return;
      const days = Number(btn.getAttribute("data-quick-trip"));
      const [y, m, d] = departDate.value.split("-").map(Number);
      const depDt = new Date(y, m - 1, d);
      const retDt = new Date(depDt.getTime() + days * 86400000);
      returnDate.value = DF.toLocalIsoDate(retDt);
      setTripType("round");
    });
  });

  root.querySelectorAll("[data-popover-trigger]").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const target = trigger.getAttribute("data-popover-trigger");
      if (target === "date") {
        if (paxPopover) paxPopover.classList.add("hidden");
        if (datePopover) datePopover.classList.toggle("hidden");
      } else if (target === "pax") {
        if (datePopover) datePopover.classList.add("hidden");
        if (paxPopover) paxPopover.classList.toggle("hidden");
      }
    });
  });

  root.querySelectorAll("[data-popover-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-popover-close");
      const pop = $(`[data-popover="${target}"]`);
      if (pop) pop.classList.add("hidden");
    });
  });

  root.querySelectorAll("[data-pax-btn]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [type, deltaStr] = btn.getAttribute("data-pax-btn").split(":");
      const next = pax[type] + Number(deltaStr);
      if (type === "adults" && (next < 1 || next > 9)) return;
      if (type !== "adults" && (next < 0 || next > 8)) return;
      if (type === "infants" && next > pax.adults) return;
      pax[type] = next;
      const countEl = $(`[data-pax-count="${type}"]`);
      if (countEl) countEl.textContent = String(next);
      syncPaxDisplay();
    });
  });

  if (cabinClass) cabinClass.addEventListener("change", syncPaxDisplay);

  if (directCheck) {
    directCheck.addEventListener("change", () => {
      DF.state.directOnly = directCheck.checked;
      DF.emit("df:direct-change", { directOnly: directCheck.checked });
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (errEl) errEl.classList.add("hidden");
      resolveAirportText("origin");
      resolveAirportText("dest");

      const origin = (originCode?.value || "").trim().toUpperCase();
      const dest = (destCode?.value || "").trim().toUpperCase();
      const depVal = departDate?.value || "";
      const retVal = tripType === "round" ? (returnDate?.value || "") : "";
      const cabin = cabinClass?.value || "";

      const showErr = (msg) => {
        if (!errEl) return;
        errEl.textContent = msg;
        errEl.classList.remove("hidden");
      };

      if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(dest)) {
        return showErr("Please select valid 3-letter departure and destination airports.");
      }
      if (origin === dest) {
        return showErr("Departure and destination airports cannot be the same.");
      }
      if (!depVal) {
        return showErr("Please select a departure date.");
      }
      if (tripType === "round" && retVal && retVal < depVal) {
        return showErr("Return date must be on or after the departure date.");
      }

      window.location.href = DF.buildWhiteLabelUrl(origin, dest, depVal, retVal, cabin, pax.adults, pax.children, pax.infants);
    });
  }

  document.addEventListener("click", (e) => {
    if (originList && !e.target.closest("#originInput") && !e.target.closest('[data-airport-list="origin"]')) {
      originList.classList.add("hidden");
    }
    if (destList && !e.target.closest("#destInput") && !e.target.closest('[data-airport-list="dest"]')) {
      destList.classList.add("hidden");
    }
    if (datePopover && !e.target.closest('[data-popover="date"]') && !e.target.closest('[data-popover-trigger="date"]')) {
      datePopover.classList.add("hidden");
    }
    if (paxPopover && !e.target.closest('[data-popover="pax"]') && !e.target.closest('[data-popover-trigger="pax"]')) {
      paxPopover.classList.add("hidden");
    }
  });

  syncDateDisplay();
  syncPaxDisplay();
});
