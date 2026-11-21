window.DhakaFlights.registerSection("alert-modal", (root) => {
  const DF = window.DhakaFlights;
  const originEl = root.querySelector("[data-alert-origin]");
  const destEl = root.querySelector("[data-alert-dest]");
  const emailEl = root.querySelector("[data-alert-email]");
  const budgetEl = root.querySelector("[data-alert-budget]");
  const msgEl = root.querySelector("[data-alert-msg]");
  const submitBtn = root.querySelector("[data-alert-submit]");
  const form = root.querySelector("[data-alert-form]");
  const closeBtn = root.querySelector('[data-action="close-alert"]');

  const openModal = (detail = {}) => {
    if (originEl) originEl.value = detail.origin || DF.state.origin || "DAC";
    if (destEl) destEl.value = detail.destination || DF.state.destination || "DXB";
    if (msgEl) msgEl.classList.add("hidden");
    root.classList.remove("hidden");
  };

  const closeModal = () => {
    root.classList.add("hidden");
  };

  DF.on("df:open-alert", (e) => openModal(e.detail || {}));

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  root.addEventListener("click", (e) => {
    if (e.target === root) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !root.classList.contains("hidden")) closeModal();
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!submitBtn || !msgEl) return;

      submitBtn.disabled = true;
      submitBtn.textContent = "Saving...";

      try {
        const res = await fetch("/api/alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin: originEl?.value || "DAC",
            destination: destEl?.value || "DXB",
            email: emailEl?.value || "",
            targetPrice: budgetEl?.value || ""
          })
        });
        const json = await res.json();
        msgEl.className = json.ok
          ? "text-xs font-bold text-emerald-600 text-center pt-1"
          : "text-xs font-bold text-red-600 text-center pt-1";
        msgEl.textContent = json.message || json.error || "Done.";
        msgEl.classList.remove("hidden");
      } catch (_) {
        msgEl.className = "text-xs font-bold text-red-600 text-center pt-1";
        msgEl.textContent = "Network error. Please try again.";
        msgEl.classList.remove("hidden");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Activate Free Price Alert";
      }
    });
  }
});
