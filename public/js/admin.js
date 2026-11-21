(function () {
  let cmsData = { settings: {}, routes: [], guides: [], faqs: [] };
  let alertsCache = [];

  const $ = id => document.getElementById(id);

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function showTab(name) {
    ["settings", "routes", "guides", "faqs", "alerts", "tools"].forEach(t => {
      const panel = $("panel-" + t);
      const tab = $("tab-" + t);
      if (panel) panel.classList.toggle("hidden", t !== name);
      if (tab) {
        tab.className = t === name
          ? "w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-[#003580] text-white"
          : "w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-white text-slate-700 hover:bg-slate-50";
      }
    });
  }

  function showToast(msg = "Saved!") {
    const el = $("saveToast");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 2500);
  }

  async function pushCmsData() {
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cmsData)
    });
    const json = await res.json();
    if (json.ok) {
      cmsData = json.data;
      populateAll();
      showToast("Saved & Live!");
    } else {
      alert(json.error || "Save failed");
    }
  }

  function populateAll() {
    const s = cmsData.settings || {};
    $("set_heroTitle").value = s.heroTitle || "";
    $("set_heroSubtitle").value = s.heroSubtitle || "";
    $("set_bannerEnabled").checked = Boolean(s.bannerEnabled);
    $("set_bannerText").value = s.bannerText || "";
    $("set_bannerLink").value = s.bannerLink || "";
    $("set_gscMeta").value = s.gscMeta || "";
    $("set_gaId").value = s.gaId || "";
    $("set_supportEmail").value = s.supportEmail || "";
    $("set_footerText").value = s.footerText || "";

    $("routesList").innerHTML = cmsData.routes.map((r, i) => `
      <div class="flex flex-wrap items-center justify-between gap-2 p-3 border rounded-xl bg-slate-50">
        <div>
          <span class="font-bold text-sm">${esc(r.origin)} → ${esc(r.city)} (${esc(r.destination)})</span>
          <span class="text-xs text-slate-500 ml-2">/flights/${esc(r.slug)}</span>
          ${r.published === false ? '<span class="ml-2 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-sm font-bold">Draft</span>' : ""}
        </div>
        <div class="flex gap-2">
          <a href="/flights/${esc(r.slug)}" target="_blank" class="text-xs font-bold text-blue-700 px-2 py-1">View ↗</a>
          <button type="button" data-action="edit-route" data-index="${i}" class="text-xs font-bold bg-white border px-3 py-1 rounded-lg">Edit</button>
          <button type="button" data-action="delete-route" data-index="${i}" class="text-xs font-bold text-red-600 px-2 py-1">Delete</button>
        </div>
      </div>`).join("");

    $("guidesList").innerHTML = cmsData.guides.map((g, i) => `
      <div class="flex flex-wrap items-center justify-between gap-2 p-3 border rounded-xl bg-slate-50">
        <div>
          <div class="font-bold text-sm">${esc(g.title)}</div>
          <div class="text-xs text-slate-500">/guides/${esc(g.slug)} • ${esc(g.category || "Guide")}</div>
        </div>
        <div class="flex gap-2">
          <a href="/guides/${esc(g.slug)}" target="_blank" class="text-xs font-bold text-blue-700 px-2 py-1">View ↗</a>
          <button type="button" data-action="edit-guide" data-index="${i}" class="text-xs font-bold bg-white border px-3 py-1 rounded-lg">Edit</button>
          <button type="button" data-action="delete-guide" data-index="${i}" class="text-xs font-bold text-red-600 px-2 py-1">Delete</button>
        </div>
      </div>`).join("");

    $("faqsList").innerHTML = cmsData.faqs.map((f, i) => `
      <div class="p-3 border rounded-xl bg-slate-50 flex justify-between gap-3">
        <div>
          <div class="font-bold text-sm">${esc(f.q)}</div>
          <div class="text-xs text-slate-600 mt-1">${esc(f.a)}</div>
        </div>
        <button type="button" data-action="delete-faq" data-index="${i}" class="text-xs font-bold text-red-600 shrink-0">Delete</button>
      </div>`).join("");
  }

  async function loadAlerts() {
    const res = await fetch("/api/admin/alerts");
    const json = await res.json();
    alertsCache = json.alerts || [];
    $("alertsCount").textContent = String(alertsCache.length);
    $("alertsTableBody").innerHTML = alertsCache.map(a => `
      <tr>
        <td class="py-2 font-semibold">${esc(a.email || "-")}</td>
        <td>${esc(a.origin || "DAC")} → ${esc(a.destination || "-")}</td>
        <td>${esc(a.targetPrice || "-")}</td>
        <td class="text-xs text-slate-500">${esc(String(a.createdAt || "").slice(0, 10))}</td>
        <td><button type="button" data-action="delete-alert" data-key="${esc(a.key)}" class="text-xs text-red-600 font-bold">Remove</button></td>
      </tr>`).join("") || `<tr><td colspan="5" class="py-6 text-center text-slate-400">No subscribers yet.</td></tr>`;
  }

  function exportAlertsCsv() {
    const csvCell = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      "Email,Origin,Destination,TargetPrice,Date",
      ...alertsCache.map(a => [a.email, a.origin, a.destination, a.targetPrice || "", a.createdAt].map(csvCell).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dhakaflights-alerts.csv";
    link.click();
  }

  async function initAdmin() {
    try {
      const res = await fetch("/api/admin/data");
      if (res.status === 401) {
        $("loginView")?.classList.remove("hidden");
        return;
      }
      const json = await res.json();
      if (json.ok) {
        cmsData = json.data;
        $("loginView")?.classList.add("hidden");
        $("dashView")?.classList.remove("hidden");
        populateAll();
        loadAlerts();
      }
    } catch (_) {}
  }

  function boot() {
    const loginForm = $("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const errEl = $("loginError");
        const btn = $("loginBtn");
        errEl.classList.add("hidden");
        btn.disabled = true;
        btn.textContent = "Checking...";
        try {
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: $("adminPassInput").value })
          });
          const json = await res.json();
          if (json.ok) location.reload();
          else {
            errEl.textContent = json.error || "Login failed.";
            errEl.classList.remove("hidden");
          }
        } catch (_) {
          errEl.textContent = "Network error.";
          errEl.classList.remove("hidden");
        } finally {
          btn.disabled = false;
          btn.textContent = "Sign In to Dashboard";
        }
      });
    }

    const dashView = $("dashView");
    if (dashView) {
      dashView.addEventListener("click", async (e) => {
        const tabBtn = e.target.closest("[data-tab-btn]");
        if (tabBtn) {
          showTab(tabBtn.getAttribute("data-tab-btn"));
          return;
        }

        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const action = btn.getAttribute("data-action");
        const idx = Number(btn.getAttribute("data-index"));

        if (action === "logout") {
          await fetch("/api/admin/logout", { method: "POST" });
          location.reload();
        } else if (action === "save-settings") {
          cmsData.settings = {
            ...cmsData.settings,
            heroTitle: $("set_heroTitle").value,
            heroSubtitle: $("set_heroSubtitle").value,
            bannerEnabled: $("set_bannerEnabled").checked,
            bannerText: $("set_bannerText").value,
            bannerLink: $("set_bannerLink").value,
            gscMeta: $("set_gscMeta").value.trim(),
            gaId: $("set_gaId").value.trim(),
            supportEmail: $("set_supportEmail").value.trim(),
            footerText: $("set_footerText").value
          };
          pushCmsData();
        } else if (action === "new-route") {
          $("rt_idx").value = "-1";
          ["rt_slug", "rt_dest", "rt_city", "rt_country", "rt_duration", "rt_airlines", "rt_cheapestMonth", "rt_summary", "rt_tips"].forEach(id => {
            $(id).value = "";
          });
          $("rt_origin").value = "DAC";
          $("rt_direct").checked = true;
          $("rt_published").checked = true;
          $("routeEditor").classList.remove("hidden");
        } else if (action === "edit-route") {
          if (Number.isNaN(idx)) return;
          const r = cmsData.routes[idx];
          if (!r) return;
          $("rt_idx").value = String(idx);
          $("rt_slug").value = r.slug;
          $("rt_origin").value = r.origin;
          $("rt_dest").value = r.destination;
          $("rt_city").value = r.city;
          $("rt_country").value = r.country;
          $("rt_duration").value = r.duration;
          $("rt_airlines").value = r.airlines;
          $("rt_cheapestMonth").value = r.cheapestMonth;
          $("rt_summary").value = r.summary;
          $("rt_tips").value = r.tips;
          $("rt_direct").checked = Boolean(r.direct);
          $("rt_published").checked = r.published !== false;
          $("routeEditor").classList.remove("hidden");
        } else if (action === "save-route") {
          const i = Number($("rt_idx").value);
          const item = {
            slug: $("rt_slug").value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
            origin: $("rt_origin").value.trim().toUpperCase(),
            destination: $("rt_dest").value.trim().toUpperCase(),
            city: $("rt_city").value.trim(),
            country: $("rt_country").value.trim(),
            duration: $("rt_duration").value.trim(),
            airlines: $("rt_airlines").value.trim(),
            cheapestMonth: $("rt_cheapestMonth").value.trim(),
            summary: $("rt_summary").value.trim(),
            tips: $("rt_tips").value.trim(),
            direct: $("rt_direct").checked,
            published: $("rt_published").checked
          };
          if (i >= 0) cmsData.routes[i] = item;
          else cmsData.routes.push(item);
          $("routeEditor").classList.add("hidden");
          pushCmsData();
        } else if (action === "close-route-editor") {
          $("routeEditor").classList.add("hidden");
        } else if (action === "delete-route") {
          if (Number.isNaN(idx) || !confirm("Delete this route page?")) return;
          cmsData.routes.splice(idx, 1);
          pushCmsData();
        } else if (action === "new-guide") {
          $("gd_idx").value = "-1";
          ["gd_slug", "gd_category", "gd_title", "gd_summary", "gd_body"].forEach(id => { $(id).value = ""; });
          $("gd_published").checked = true;
          $("guideEditor").classList.remove("hidden");
        } else if (action === "edit-guide") {
          if (Number.isNaN(idx)) return;
          const g = cmsData.guides[idx];
          if (!g) return;
          $("gd_idx").value = String(idx);
          $("gd_slug").value = g.slug;
          $("gd_category").value = g.category || "";
          $("gd_title").value = g.title;
          $("gd_summary").value = g.summary;
          $("gd_body").value = g.body;
          $("gd_published").checked = g.published !== false;
          $("guideEditor").classList.remove("hidden");
        } else if (action === "save-guide") {
          const i = Number($("gd_idx").value);
          const item = {
            slug: $("gd_slug").value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
            category: $("gd_category").value.trim() || "Guide",
            title: $("gd_title").value.trim(),
            summary: $("gd_summary").value.trim(),
            body: $("gd_body").value.trim(),
            published: $("gd_published").checked
          };
          if (i >= 0) cmsData.guides[i] = item;
          else cmsData.guides.unshift(item);
          $("guideEditor").classList.add("hidden");
          pushCmsData();
        } else if (action === "close-guide-editor") {
          $("guideEditor").classList.add("hidden");
        } else if (action === "delete-guide") {
          if (Number.isNaN(idx) || !confirm("Delete this guide?")) return;
          cmsData.guides.splice(idx, 1);
          pushCmsData();
        } else if (action === "add-faq") {
          const q = $("faq_q").value.trim();
          const a = $("faq_a").value.trim();
          if (!q || !a) return;
          cmsData.faqs.push({ q, a });
          $("faq_q").value = "";
          $("faq_a").value = "";
          pushCmsData();
        } else if (action === "delete-faq") {
          if (Number.isNaN(idx)) return;
          cmsData.faqs.splice(idx, 1);
          pushCmsData();
        } else if (action === "delete-alert") {
          const key = btn.getAttribute("data-key");
          if (!key) return;
          await fetch(`/api/admin/alerts?key=${encodeURIComponent(key)}`, { method: "DELETE" });
          loadAlerts();
        } else if (action === "export-alerts") {
          exportAlertsCsv();
        } else if (action === "clear-cache") {
          const res = await fetch("/api/admin/cache-clear", { method: "POST" });
          const json = await res.json();
          $("clearStatus").textContent = json.message || "Cleared!";
        }
      });
    }

    initAdmin();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
