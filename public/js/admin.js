let cmsData = { settings: {}, routes: [], guides: [], faqs: [] };
let alertsCache = [];

async function initAdmin() {
  try {
    const res = await fetch("/api/admin/data");
    if (res.status === 401) {
      document.getElementById("loginView").classList.remove("hidden");
      return;
    }
    const json = await res.json();
    if (json.ok) {
      cmsData = json.data;
      document.getElementById("loginView").classList.add("hidden");
      document.getElementById("dashView").classList.remove("hidden");
      populateAll();
      loadAlerts();
    }
  } catch (_) {}
}

async function doLogin(e) {
  e.preventDefault();
  const errEl = document.getElementById("loginError");
  const btn = document.getElementById("loginBtn");
  errEl.classList.add("hidden");
  btn.disabled = true;
  btn.textContent = "Checking...";

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: document.getElementById("adminPassInput").value })
    });
    const json = await res.json();
    if (json.ok) {
      location.reload();
    } else {
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
}

async function doLogout() {
  await fetch("/api/admin/logout", { method: "POST" });
  location.reload();
}

function showTab(name) {
  ["settings", "routes", "guides", "faqs", "alerts", "tools"].forEach(t => {
    document.getElementById("panel-" + t).classList.toggle("hidden", t !== name);
    document.getElementById("tab-" + t).className = t === name
      ? "w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-[#003580] text-white"
      : "w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-white text-slate-700 hover:bg-slate-50";
  });
}

function showToast(msg = "Saved!") {
  const el = document.getElementById("saveToast");
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
  document.getElementById("set_heroTitle").value = s.heroTitle || "";
  document.getElementById("set_heroSubtitle").value = s.heroSubtitle || "";
  document.getElementById("set_bannerEnabled").checked = Boolean(s.bannerEnabled);
  document.getElementById("set_bannerText").value = s.bannerText || "";
  document.getElementById("set_bannerLink").value = s.bannerLink || "";
  document.getElementById("set_gscMeta").value = s.gscMeta || "";
  document.getElementById("set_gaId").value = s.gaId || "";
  document.getElementById("set_supportEmail").value = s.supportEmail || "";
  document.getElementById("set_footerText").value = s.footerText || "";

  document.getElementById("routesList").innerHTML = cmsData.routes.map((r, i) => `
    <div class="flex flex-wrap items-center justify-between gap-2 p-3 border rounded-xl bg-slate-50">
      <div>
        <span class="font-bold text-sm">${r.origin} → ${r.city} (${r.destination})</span>
        <span class="text-xs text-slate-500 ml-2">/flights/${r.slug}</span>
        ${r.published === false ? '<span class="ml-2 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Draft</span>' : ""}
      </div>
      <div class="flex gap-2">
        <a href="/flights/${r.slug}" target="_blank" class="text-xs font-bold text-blue-700 px-2 py-1">View ↗</a>
        <button onclick="editRoute(${i})" class="text-xs font-bold bg-white border px-3 py-1 rounded-lg">Edit</button>
        <button onclick="deleteRoute(${i})" class="text-xs font-bold text-red-600 px-2 py-1">Delete</button>
      </div>
    </div>`).join("");

  document.getElementById("guidesList").innerHTML = cmsData.guides.map((g, i) => `
    <div class="flex flex-wrap items-center justify-between gap-2 p-3 border rounded-xl bg-slate-50">
      <div>
        <div class="font-bold text-sm">${g.title}</div>
        <div class="text-xs text-slate-500">/guides/${g.slug} • ${g.category || "Guide"}</div>
      </div>
      <div class="flex gap-2">
        <a href="/guides/${g.slug}" target="_blank" class="text-xs font-bold text-blue-700 px-2 py-1">View ↗</a>
        <button onclick="editGuide(${i})" class="text-xs font-bold bg-white border px-3 py-1 rounded-lg">Edit</button>
        <button onclick="deleteGuide(${i})" class="text-xs font-bold text-red-600 px-2 py-1">Delete</button>
      </div>
    </div>`).join("");

  document.getElementById("faqsList").innerHTML = cmsData.faqs.map((f, i) => `
    <div class="p-3 border rounded-xl bg-slate-50 flex justify-between gap-3">
      <div><div class="font-bold text-sm">${f.q}</div><div class="text-xs text-slate-600 mt-1">${f.a}</div></div>
      <button onclick="deleteFaq(${i})" class="text-xs font-bold text-red-600 shrink-0">Delete</button>
    </div>`).join("");
}

function saveSettings() {
  cmsData.settings = {
    ...cmsData.settings,
    heroTitle: document.getElementById("set_heroTitle").value,
    heroSubtitle: document.getElementById("set_heroSubtitle").value,
    bannerEnabled: document.getElementById("set_bannerEnabled").checked,
    bannerText: document.getElementById("set_bannerText").value,
    bannerLink: document.getElementById("set_bannerLink").value,
    gscMeta: document.getElementById("set_gscMeta").value.trim(),
    gaId: document.getElementById("set_gaId").value.trim(),
    supportEmail: document.getElementById("set_supportEmail").value.trim(),
    footerText: document.getElementById("set_footerText").value
  };
  pushCmsData();
}

function newRoute() {
  document.getElementById("rt_idx").value = "-1";
  ["rt_slug", "rt_dest", "rt_city", "rt_country", "rt_duration", "rt_airlines", "rt_cheapestMonth", "rt_summary", "rt_tips"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("rt_origin").value = "DAC";
  document.getElementById("rt_direct").checked = true;
  document.getElementById("rt_published").checked = true;
  document.getElementById("routeEditor").classList.remove("hidden");
}

function editRoute(i) {
  const r = cmsData.routes[i];
  document.getElementById("rt_idx").value = i;
  document.getElementById("rt_slug").value = r.slug;
  document.getElementById("rt_origin").value = r.origin;
  document.getElementById("rt_dest").value = r.destination;
  document.getElementById("rt_city").value = r.city;
  document.getElementById("rt_country").value = r.country;
  document.getElementById("rt_duration").value = r.duration;
  document.getElementById("rt_airlines").value = r.airlines;
  document.getElementById("rt_cheapestMonth").value = r.cheapestMonth;
  document.getElementById("rt_summary").value = r.summary;
  document.getElementById("rt_tips").value = r.tips;
  document.getElementById("rt_direct").checked = Boolean(r.direct);
  document.getElementById("rt_published").checked = r.published !== false;
  document.getElementById("routeEditor").classList.remove("hidden");
}

function saveRoute() {
  const idx = Number(document.getElementById("rt_idx").value);
  const item = {
    slug: document.getElementById("rt_slug").value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    origin: document.getElementById("rt_origin").value.trim().toUpperCase(),
    destination: document.getElementById("rt_dest").value.trim().toUpperCase(),
    city: document.getElementById("rt_city").value.trim(),
    country: document.getElementById("rt_country").value.trim(),
    duration: document.getElementById("rt_duration").value.trim(),
    airlines: document.getElementById("rt_airlines").value.trim(),
    cheapestMonth: document.getElementById("rt_cheapestMonth").value.trim(),
    summary: document.getElementById("rt_summary").value.trim(),
    tips: document.getElementById("rt_tips").value.trim(),
    direct: document.getElementById("rt_direct").checked,
    published: document.getElementById("rt_published").checked
  };
  if (idx >= 0) cmsData.routes[idx] = item;
  else cmsData.routes.push(item);
  document.getElementById("routeEditor").classList.add("hidden");
  pushCmsData();
}

function deleteRoute(i) {
  if (!confirm("Delete this route page?")) return;
  cmsData.routes.splice(i, 1);
  pushCmsData();
}

function newGuide() {
  document.getElementById("gd_idx").value = "-1";
  ["gd_slug", "gd_category", "gd_title", "gd_summary", "gd_body"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("gd_published").checked = true;
  document.getElementById("guideEditor").classList.remove("hidden");
}

function editGuide(i) {
  const g = cmsData.guides[i];
  document.getElementById("gd_idx").value = i;
  document.getElementById("gd_slug").value = g.slug;
  document.getElementById("gd_category").value = g.category || "";
  document.getElementById("gd_title").value = g.title;
  document.getElementById("gd_summary").value = g.summary;
  document.getElementById("gd_body").value = g.body;
  document.getElementById("gd_published").checked = g.published !== false;
  document.getElementById("guideEditor").classList.remove("hidden");
}

function saveGuide() {
  const idx = Number(document.getElementById("gd_idx").value);
  const item = {
    slug: document.getElementById("gd_slug").value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    category: document.getElementById("gd_category").value.trim() || "Guide",
    title: document.getElementById("gd_title").value.trim(),
    summary: document.getElementById("gd_summary").value.trim(),
    body: document.getElementById("gd_body").value.trim(),
    published: document.getElementById("gd_published").checked
  };
  if (idx >= 0) cmsData.guides[idx] = item;
  else cmsData.guides.unshift(item);
  document.getElementById("guideEditor").classList.add("hidden");
  pushCmsData();
}

function deleteGuide(i) {
  if (!confirm("Delete this guide?")) return;
  cmsData.guides.splice(i, 1);
  pushCmsData();
}

function addFaq() {
  const q = document.getElementById("faq_q").value.trim();
  const a = document.getElementById("faq_a").value.trim();
  if (!q || !a) return;
  cmsData.faqs.push({ q, a });
  document.getElementById("faq_q").value = "";
  document.getElementById("faq_a").value = "";
  pushCmsData();
}

function deleteFaq(i) {
  cmsData.faqs.splice(i, 1);
  pushCmsData();
}

async function loadAlerts() {
  const res = await fetch("/api/admin/alerts");
  const json = await res.json();
  alertsCache = json.alerts || [];
  document.getElementById("alertsCount").textContent = alertsCache.length;
  document.getElementById("alertsTableBody").innerHTML = alertsCache.map(a => `
    <tr>
      <td class="py-2 font-semibold">${a.email || "-"}</td>
      <td>${a.origin || "DAC"} → ${a.destination || "-"}</td>
      <td>${a.targetPrice || "-"}</td>
      <td class="text-xs text-slate-500">${String(a.createdAt || "").slice(0, 10)}</td>
      <td><button onclick="deleteAlert('${a.key}')" class="text-xs text-red-600 font-bold">Remove</button></td>
    </tr>`).join("") || `<tr><td colspan="5" class="py-6 text-center text-slate-400">No subscribers yet.</td></tr>`;
}

async function deleteAlert(key) {
  await fetch(`/api/admin/alerts?key=${encodeURIComponent(key)}`, { method: "DELETE" });
  loadAlerts();
}

function exportAlertsCsv() {
  const csv = ["Email,Origin,Destination,TargetPrice,Date", ...alertsCache.map(a => `${a.email},${a.origin},${a.destination},${a.targetPrice || ""},${a.createdAt}`)].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dhakaflights-alerts.csv";
  link.click();
}

async function clearScheduleCache() {
  const res = await fetch("/api/admin/cache-clear", { method: "POST" });
  const json = await res.json();
  document.getElementById("clearStatus").textContent = json.message || "Cleared!";
}

initAdmin();
