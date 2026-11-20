export const DEFAULT_CMS = {
  settings: {
    siteName: "DhakaFlights.com",
    heroTitle: "Explore Unbeatable\nDhaka Flight Prices.",
    heroSubtitle: "Compare cheap Dhaka flights (DAC) & worldwide airfares across 200+ airlines and travel agencies.",
    bannerEnabled: true,
    bannerText: "🔥 Check Live Dhaka Airport (DAC) Departures & Arrivals + Lowest Monthly Fares!",
    bannerLink: "/dhaka-flights-today",
    gscMeta: "",
    gaId: "",
    supportEmail: "support@dhakaflights.com",
    footerText: "Independent Dhaka Flights Comparison & Airport Information Hub."
  },
  routes: [
    {
      slug: "dhaka-to-dubai",
      origin: "DAC",
      destination: "DXB",
      city: "Dubai",
      country: "UAE",
      duration: "5h 15m",
      airlines: "Emirates, flydubai, Biman Bangladesh, US-Bangla",
      cheapestMonth: "May, June & September",
      direct: true,
      summary: "Dubai is the busiest international route from Dhaka (DAC) with multiple daily direct flights.",
      tips: "Book 30-45 days before travel and compare Terminal 1/2 departures from Hazrat Shahjalal International Airport. Emirates and Biman usually include 30kg checked baggage on Economy Flex fares.",
      published: true
    },
    {
      slug: "dhaka-to-kuala-lumpur",
      origin: "DAC",
      destination: "KUL",
      city: "Kuala Lumpur",
      country: "Malaysia",
      duration: "3h 55m",
      airlines: "Malaysia Airlines, Batik Air, AirAsia, Biman Bangladesh, US-Bangla",
      cheapestMonth: "February, March & October",
      direct: true,
      summary: "Daily direct Dhaka flights to Kuala Lumpur (KUL) for business, tourism, and student travel.",
      tips: "Low-cost carriers like AirAsia may exclude checked luggage in base fares, while Malaysia Airlines and US-Bangla typically include 20kg-30kg baggage.",
      published: true
    },
    {
      slug: "dhaka-to-singapore",
      origin: "DAC",
      destination: "SIN",
      city: "Singapore",
      country: "Singapore",
      duration: "4h 10m",
      airlines: "Singapore Airlines, Biman Bangladesh, US-Bangla",
      cheapestMonth: "March, July & September",
      direct: true,
      summary: "Direct flights from Dhaka to Singapore Changi Airport (SIN) operate every night and morning.",
      tips: "Mid-week departures (Tuesday and Wednesday) from DAC often offer lower fares than weekend departures.",
      published: true
    },
    {
      slug: "dhaka-to-bangkok",
      origin: "DAC",
      destination: "BKK",
      city: "Bangkok",
      country: "Thailand",
      duration: "2h 30m",
      airlines: "Thai Airways, Biman Bangladesh, US-Bangla, Thai AirAsia (DMK)",
      cheapestMonth: "May, August & September",
      direct: true,
      summary: "Quick 2.5-hour direct Dhaka flights to Bangkok for medical, leisure, and transit travelers.",
      tips: "Note the airport code: Suvarnabhumi (BKK) hosts full-service airlines while Don Mueang (DMK) serves Thai AirAsia.",
      published: true
    },
    {
      slug: "dhaka-to-doha",
      origin: "DAC",
      destination: "DOH",
      city: "Doha",
      country: "Qatar",
      duration: "5h 25m",
      airlines: "Qatar Airways, Biman Bangladesh, US-Bangla",
      cheapestMonth: "May & October",
      direct: true,
      summary: "Multiple daily non-stop flights from Dhaka to Doha Hamad International Airport (DOH).",
      tips: "Qatar Airways provides seamless one-stop connections from Dhaka to Europe, UK, and North America via Doha.",
      published: true
    },
    {
      slug: "dhaka-to-jeddah",
      origin: "DAC",
      destination: "JED",
      city: "Jeddah",
      country: "Saudi Arabia",
      duration: "6h 45m",
      airlines: "Saudia, Biman Bangladesh, US-Bangla, flynas",
      cheapestMonth: "May, June & October",
      direct: true,
      summary: "Direct flights from Dhaka to Jeddah (JED) for Umrah pilgrims, workers, and families.",
      tips: "During peak Ramadan and Hajj seasons, book at least 60 days ahead to lock in lower fares.",
      published: true
    },
    {
      slug: "dhaka-to-london",
      origin: "DAC",
      destination: "LHR",
      city: "London",
      country: "United Kingdom",
      duration: "10h 40m (Direct)",
      airlines: "Biman Bangladesh (Direct), Emirates, Qatar Airways, Turkish Airlines, Etihad",
      cheapestMonth: "February, March & November",
      direct: true,
      summary: "Compare non-stop Biman flights and 1-stop Middle East/Europe connections from Dhaka to London Heathrow.",
      tips: "One-stop flights via Doha, Dubai, or Istanbul are frequently cheaper if your travel dates are flexible.",
      published: true
    },
    {
      slug: "dhaka-to-kolkata",
      origin: "DAC",
      destination: "CCU",
      city: "Kolkata",
      country: "India",
      duration: "50m",
      airlines: "IndiGo, Air India, Biman Bangladesh, US-Bangla",
      cheapestMonth: "Year-round budget fares",
      direct: true,
      summary: "Short 50-minute direct flights connecting Dhaka (DAC) and Kolkata (CCU) every day.",
      tips: "Compare both morning and evening flights as last-minute fares can vary sharply between carriers.",
      published: true
    },
    {
      slug: "dhaka-to-coxs-bazar",
      origin: "DAC",
      destination: "CXB",
      city: "Cox's Bazar",
      country: "Bangladesh",
      duration: "1h 00m",
      airlines: "Biman Bangladesh, US-Bangla, Novoair, Air Astra",
      cheapestMonth: "May to September",
      direct: true,
      summary: "Bangladesh's most popular domestic air route from Dhaka Domestic Terminal to Cox's Bazar (CXB).",
      tips: "Winter weekends (November to February) sell out fast. Thursday evening departures are usually highest; Tuesday/Wednesday flights are cheapest.",
      published: true
    },
    {
      slug: "dhaka-to-chattogram",
      origin: "DAC",
      destination: "CGP",
      city: "Chattogram",
      country: "Bangladesh",
      duration: "50m",
      airlines: "Biman Bangladesh, US-Bangla, Novoair, Air Astra",
      cheapestMonth: "Year-round daily departures",
      direct: true,
      summary: "Frequent hourly domestic flights from Dhaka to Shah Amanat International Airport, Chattogram (CGP).",
      tips: "Early morning and late evening flights often have lower ticket prices for business travelers.",
      published: true
    }
  ],
  guides: [
    {
      slug: "dhaka-airport-dac-terminal-guide",
      title: "Hazrat Shahjalal International Airport (DAC) Terminal & Travel Guide",
      category: "Airport Guide",
      summary: "Complete guide to Terminals 1, 2, Domestic Terminal, Terminal 3 updates, check-in timing, lounges, and transport at Dhaka Airport.",
      body: "Hazrat Shahjalal International Airport (IATA: DAC) is Bangladesh's primary international gateway located in Kurmitola, Dhaka.\n\nTerminals Overview: International departures and arrivals currently operate through Terminal 1 and Terminal 2, while domestic routes to Cox's Bazar, Chattogram, Sylhet, Saidpur, Jashore, and Rajshahi operate from the adjacent Domestic Terminal. The newly built Terminal 3 is preparing for phased partial operations starting December 2026 to dramatically increase passenger capacity and modern boarding bridges.\n\nRecommended Check-in Timing: Arrive at least 3 hours before international flights and 90 minutes before domestic flights. Keep your passport, visa copy, BMET/e-ticket printout, and boarding documents accessible before entering the terminal gate.\n\nAirport Facilities: Dhaka Airport offers priority lounges (Balaka Executive Lounge, Skylounge), currency exchange counters, local SIM card booths (Grameenphone, Robi, Banglalink), baggage wrapping services, and 24/7 taxi/ride-share pickup points outside the arrival concourse.",
      published: true
    },
    {
      slug: "biman-us-bangla-baggage-allowance",
      title: "Dhaka Flights Baggage Allowance Guide: Biman, US-Bangla, Emirates & Qatar",
      category: "Baggage Rules",
      summary: "Compare hand carry and checked luggage limits (kg) for popular airlines flying out of Dhaka (DAC).",
      body: "Checking baggage rules before booking cheap Dhaka flights can save you thousands of Taka at the airport check-in counter.\n\nBiman Bangladesh Airlines: Most international Economy tickets include 30kg-40kg checked baggage (20kg on domestic routes) plus 7kg cabin carry-on. Middle East and London flights often offer generous seasonal allowances.\n\nUS-Bangla Airlines: Typically offers 20kg checked baggage on domestic routes and 30kg-40kg on Middle East/Southeast Asia flights, with 7kg hand baggage.\n\nEmirates & Qatar Airways: Standard Economy Saver/Value fares include 20kg-30kg checked luggage (2x23kg on US/Canada routes) plus 7kg hand carry. Always verify your exact fare class before payment.\n\nLow-Cost Carriers (AirAsia, flydubai, Air Arabia, IndiGo): Base promotional fares may include only 7kg hand carry or 20kg checked baggage. Adding extra weight online during booking is up to 50% cheaper than paying at Dhaka Airport.",
      published: true
    },
    {
      slug: "cheapest-time-to-book-dhaka-flights",
      title: "When Is the Cheapest Time to Book Flights from Dhaka?",
      category: "Money Saving Tips",
      summary: "Data-backed booking windows and seasonal tips to find the lowest airfares from Dhaka (DAC).",
      body: "Airfares from Dhaka fluctuate depending on school holidays, Eid/Puja travel rushes, Umrah demand, and airline seat inventory.\n\nInternational Short-Haul (Dubai, Doha, Kuala Lumpur, Singapore, Bangkok): Booking 30 to 45 days in advance usually captures the lowest fare tier.\n\nLong-Haul (London, Toronto, New York, Sydney): Start tracking prices 60 to 90 days before departure using our When-to-Fly Fare Calendar and Price Drop Alerts.\n\nBest Days to Depart DAC: Flying out on Tuesday or Wednesday is commonly 10%-20% cheaper than departing on Thursday night or Saturday morning.",
      published: true
    }
  ],
  faqs: [
    {
      q: "When is the cheapest time to book international flights from Dhaka?",
      a: "Typically 30 to 45 days before departure for Middle East and Southeast Asia routes (Dubai, Kuala Lumpur, Singapore, Bangkok), and 60+ days ahead for London, Toronto, or New York."
    },
    {
      q: "Does DhakaFlights.com charge any booking fee?",
      a: "No! DhakaFlights is 100% free to search and compare. Once you choose your preferred airline or agency deal, you book directly on the partner site with zero hidden markup."
    },
    {
      q: "Can I check today's Dhaka Airport (DAC) flight schedule here?",
      a: "Yes! Visit our Live DAC Board (/dhaka-flights-today) to track today's departures, arrivals, terminals, delays, and compare airfares for every route."
    }
  ]
};

export function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function getCmsData(env) {
  let stored = null;
  if (env.CMS_KV) {
    try {
      stored = await env.CMS_KV.get("cms:site", "json");
    } catch (_) {}
  }
  if (!stored) return structuredClone(DEFAULT_CMS);
  return {
    settings: { ...DEFAULT_CMS.settings, ...(stored.settings || {}) },
    routes: Array.isArray(stored.routes) ? stored.routes : DEFAULT_CMS.routes,
    guides: Array.isArray(stored.guides) ? stored.guides : DEFAULT_CMS.guides,
    faqs: Array.isArray(stored.faqs) ? stored.faqs : DEFAULT_CMS.faqs
  };
}

// --- Secure Admin Cookie Auth (HMAC-SHA256) ---
async function signValue(secret, text) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(text));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getCookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return "";
}

export async function verifyAdminSession(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const token = getCookie(request, "df_admin");
  if (!token || !token.includes(".")) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Date.now() > Number(exp)) return false;
  const expected = await signValue(env.ADMIN_PASSWORD, exp);
  return sig === expected;
}

export async function handleAdminApi(request, env, url) {
  const path = url.pathname;

  if (path === "/api/admin/login" && request.method === "POST") {
    if (!env.ADMIN_PASSWORD) {
      return jsonRes({ ok: false, error: "ADMIN_PASSWORD secret is not configured in Cloudflare yet." }, 500);
    }
    const body = await request.json().catch(() => ({}));
    const submitted = String(body.password || "");
    const h1 = await signValue("df-check", submitted);
    const h2 = await signValue("df-check", env.ADMIN_PASSWORD);
    if (h1 !== h2) {
      return jsonRes({ ok: false, error: "Incorrect admin password." }, 401);
    }
    const exp = String(Date.now() + 7 * 86400000);
    const sig = await signValue(env.ADMIN_PASSWORD, exp);
    const secure = url.protocol === "https:" ? "; Secure" : "";
    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `df_admin=${exp}.${sig}; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=604800`
      }
    });
  }

  if (path === "/api/admin/logout" && request.method === "POST") {
    const secure = url.protocol === "https:" ? "; Secure" : "";
    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `df_admin=; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=0`
      }
    });
  }

  const isAuth = await verifyAdminSession(request, env);
  if (!isAuth) return jsonRes({ ok: false, error: "Unauthorized" }, 401);

  if (path === "/api/admin/data" && request.method === "GET") {
    const data = await getCmsData(env);
    return jsonRes({ ok: true, hasKV: Boolean(env.CMS_KV), data });
  }

  if (path === "/api/admin/data" && request.method === "POST") {
    if (!env.CMS_KV) return jsonRes({ ok: false, error: "CMS_KV binding missing in wrangler.jsonc" }, 500);
    const body = await request.json();
    const current = await getCmsData(env);
    const next = {
      settings: body.settings ? { ...current.settings, ...body.settings } : current.settings,
      routes: Array.isArray(body.routes) ? body.routes : current.routes,
      guides: Array.isArray(body.guides) ? body.guides : current.guides,
      faqs: Array.isArray(body.faqs) ? body.faqs : current.faqs
    };
    await env.CMS_KV.put("cms:site", JSON.stringify(next));
    return jsonRes({ ok: true, data: next });
  }

  if (path === "/api/admin/alerts" && request.method === "GET") {
    if (!env.CMS_KV) return jsonRes({ ok: true, alerts: [] });
    const list = await env.CMS_KV.list({ prefix: "alert:", limit: 200 });
    const alerts = list.keys.map(k => ({ key: k.name, ...(k.metadata || {}) }))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    return jsonRes({ ok: true, alerts });
  }

  if (path === "/api/admin/alerts" && request.method === "DELETE") {
    if (!env.CMS_KV) return jsonRes({ ok: true });
    const key = url.searchParams.get("key");
    if (key && key.startsWith("alert:")) await env.CMS_KV.delete(key);
    return jsonRes({ ok: true });
  }

  if (path === "/api/admin/cache-clear" && request.method === "POST") {
    if (env.SCHEDULE_KV) {
      await Promise.all([
        env.SCHEDULE_KV.delete("dac:departures"),
        env.SCHEDULE_KV.delete("dac:arrivals")
      ]);
    }
    return jsonRes({ ok: true, message: "Live DAC schedule cache cleared!" });
  }

  return jsonRes({ ok: false, error: "Unknown admin endpoint" }, 404);
}

function jsonRes(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

// --- Homepage Injection Helpers ---
export function renderHomepageHtml(parts, cms) {
  const s = cms.settings;
  const publishedRoutes = cms.routes.filter(r => r.published !== false);
  const publishedGuides = cms.guides.filter(g => g.published !== false);

  const gscTag = s.gscMeta ? `<meta name="google-site-verification" content="${esc(s.gscMeta)}" />` : "";
  const gaValid = /^G-[A-Z0-9]+$/i.test((s.gaId || "").trim()) ? s.gaId.trim() : "";
  const gaTag = gaValid
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${gaValid}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaValid}');</script>`
    : "";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": cms.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DhakaFlights.com",
    "url": "https://dhakaflights.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://search.dhakaflights.com/?flightSearch={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const seoHeadExtra = [
    `<link rel="canonical" href="https://dhakaflights.com/" />`,
    gscTag,
    gaTag,
    `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`
  ].filter(Boolean).join("\n  ");

  const bannerHtml = s.bannerEnabled && s.bannerText
    ? `<div class="bg-[#FFD200] text-slate-900 text-xs sm:text-sm font-extrabold text-center py-2 px-4">
         <a href="${esc(s.bannerLink || "/dhaka-flights-today")}" class="hover:underline">${esc(s.bannerText)}</a>
       </div>`
    : "";

  const routesPills = publishedRoutes.map(r =>
    `<a href="/flights/${esc(r.slug)}" class="bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-800 text-xs font-bold px-3.5 py-2 rounded-xl transition">
       ${esc(r.origin)} → ${esc(r.city)} (${esc(r.destination)})
     </a>`
  ).join("");

  const guideLinks = publishedGuides.map(g =>
    `<a href="/guides/${esc(g.slug)}" class="block p-3.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 transition">
       <div class="text-[11px] font-extrabold uppercase text-blue-700">${esc(g.category || "Guide")}</div>
       <div class="font-bold text-sm text-slate-900 mt-0.5">${esc(g.title)}</div>
     </a>`
  ).join("");

  const faqsHtml = cms.faqs.map((f, i) =>
    `<details ${i === 0 ? "open" : ""} class="bg-slate-50 border border-slate-200 rounded-2xl p-5">
       <summary class="font-bold text-slate-900 cursor-pointer">${esc(f.q)}</summary>
       <p class="text-sm text-slate-600 mt-2">${esc(f.a)}</p>
     </details>`
  ).join("");

  const heroTitleHtml = esc(s.heroTitle).replace(/\n/g, "<br />");

  return parts.join("\n")
    .replace("{{SEO_HEAD_EXTRA}}", seoHeadExtra)
    .replace("{{ANNOUNCEMENT_BAR}}", bannerHtml)
    .replace("{{HERO_TITLE}}", heroTitleHtml)
    .replace("{{HERO_SUBTITLE}}", esc(s.heroSubtitle))
    .replace("{{POPULAR_ROUTES_LINKS}}", `<div class="flex flex-wrap gap-2 mt-4">${routesPills}</div><div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">${guideLinks}</div>`)
    .replace("{{DYNAMIC_FAQS}}", faqsHtml)
    .replace("{{FOOTER_TEXT}}", esc(s.footerText));
}

// --- Shared Header/Footer for SEO Subpages ---
function subpageShell(title, desc, canonical, bodyHtml, cms, schemaObj = null) {
  const s = cms.settings;
  const gscTag = s.gscMeta ? `<meta name="google-site-verification" content="${esc(s.gscMeta)}" />` : "";
  const schemaTag = schemaObj ? `<script type="application/ld+json">${JSON.stringify(schemaObj)}</script>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  ${gscTag}
  ${schemaTag}
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#f3f6fa] text-slate-800 font-sans antialiased">
  <header class="bg-[#003580] text-white border-b border-white/15">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2.5">
        <svg class="w-8 h-8 shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 19.5L19.5 6H32C33.1 6 34 6.9 34 8V20.5L20.5 34C19.7 34.8 18.4 34.8 17.6 34L6 22.4C5.2 21.6 5.2 20.3 6 19.5Z" stroke="#FFD200" stroke-width="2.6" stroke-linejoin="round"/>
          <circle cx="28" cy="12" r="2.2" fill="#FFD200"/>
          <path d="M13 22L24 16L19 25L17 22L13 22Z" fill="#FFD200"/>
        </svg>
        <span class="text-lg font-extrabold tracking-tight">DhakaFlights<span class="text-[#FFD200]">.com</span></span>
      </a>
      <nav class="hidden md:flex items-center gap-6 text-sm font-semibold">
        <a href="/" class="text-white/85 hover:text-[#FFD200]">Search Flights</a>
        <a href="/dhaka-flights-today" class="text-white/85 hover:text-[#FFD200]">Live DAC Board</a>
        <a href="/guides" class="text-white/85 hover:text-[#FFD200]">Travel Guides</a>
      </nav>
      <a href="/" class="bg-[#FFD200] hover:bg-[#f2c600] text-slate-900 px-4 py-2 rounded-lg text-xs font-extrabold">Compare Flights →</a>
    </div>
  </header>
  ${bodyHtml}
  <footer class="bg-[#051d40] text-slate-300 py-10 px-4 mt-12">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
      <div><span class="text-white font-extrabold">DhakaFlights<span class="text-[#FFD200]">.com</span></span> — ${esc(s.footerText)}</div>
      <div class="flex flex-wrap gap-4 text-blue-200">
        <a href="/dhaka-flights-today" class="hover:text-[#FFD200]">Live DAC Board</a>
        <a href="/guides" class="hover:text-[#FFD200]">Guides</a>
        <a href="/about" class="hover:text-[#FFD200]">About</a>
        <a href="/contact" class="hover:text-[#FFD200]">Contact</a>
        <a href="/privacy-policy" class="hover:text-[#FFD200]">Privacy</a>
        <a href="/terms" class="hover:text-[#FFD200]">Terms</a>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

export async function renderRoutePage(slug, cms, env) {
  const route = cms.routes.find(r => r.slug === slug && r.published !== false);
  if (!route) return null;

  const depDefault = new Date(Date.now() + 14 * 86400000);
  const ddmm = `${String(depDefault.getDate()).padStart(2, "0")}${String(depDefault.getMonth() + 1).padStart(2, "0")}`;
  const searchUrl = `https://search.dhakaflights.com/?flightSearch=${route.origin}${ddmm}${route.destination}1`;

  let livePrice = null;
  if (env.TRAVELPAYOUTS_TOKEN) {
    try {
      const apiUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${route.origin}&destination=${route.destination}&currency=bdt&market=us&sorting=price&limit=1`;
      const res = await fetch(apiUrl, { headers: { "X-Access-Token": env.TRAVELPAYOUTS_TOKEN } });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.[0]?.price) livePrice = json.data[0].price;
      }
    } catch (_) {}
  }

  const otherRoutes = cms.routes.filter(r => r.slug !== slug && r.published !== false).slice(0, 6);
  const title = `Cheap Dhaka to ${route.city} Flights (${route.origin} to ${route.destination}) | DhakaFlights.com`;
  const desc = `Compare cheap flights from Dhaka (${route.origin}) to ${route.city} (${route.destination}). Flight time ${route.duration}, airlines: ${route.airlines}.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Dhaka Flights", "item": "https://dhakaflights.com/" },
      { "@type": "ListItem", "position": 2, "name": `Dhaka to ${route.city}`, "item": `https://dhakaflights.com/flights/${route.slug}` }
    ]
  };

  const body = `
    <section class="bg-gradient-to-r from-[#003580] to-[#1a73c9] text-white py-12 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-xs font-bold text-blue-200 mb-2"><a href="/" class="hover:underline">Dhaka Flights</a> / Dhaka to ${esc(route.city)}</div>
        <h1 class="text-3xl sm:text-4xl font-extrabold">Cheap Flights from Dhaka (${esc(route.origin)}) to ${esc(route.city)} (${esc(route.destination)})</h1>
        <p class="text-blue-100 mt-2 max-w-2xl">${esc(route.summary)}</p>
        <div class="mt-6 flex flex-wrap items-center gap-4">
          <a href="${searchUrl}" class="bg-[#FFD200] hover:bg-[#f2c600] text-slate-900 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition">
            ${livePrice ? `Compare Fares from ৳ ${Number(livePrice).toLocaleString()} →` : `Search Live ${route.origin} → ${route.destination} Fares →`}
          </a>
          <a href="/dhaka-flights-today" class="bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold px-5 py-3.5 rounded-xl text-sm">
            Check Today's DAC Schedule
          </a>
        </div>
      </div>
    </section>

    <main class="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200">
          <div class="text-xs font-bold text-slate-400 uppercase">Route</div>
          <div class="text-lg font-extrabold text-slate-900 mt-1">${esc(route.origin)} → ${esc(route.destination)}</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200">
          <div class="text-xs font-bold text-slate-400 uppercase">Flight Duration</div>
          <div class="text-lg font-extrabold text-slate-900 mt-1">${esc(route.duration)}</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200">
          <div class="text-xs font-bold text-slate-400 uppercase">Direct Flights</div>
          <div class="text-lg font-extrabold text-emerald-700 mt-1">${route.direct ? "Available" : "1+ Stops"}</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200">
          <div class="text-xs font-bold text-slate-400 uppercase">Cheapest Months</div>
          <div class="text-sm font-extrabold text-blue-800 mt-1">${esc(route.cheapestMonth)}</div>
        </div>
      </div>

      <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
        <h2 class="text-xl font-extrabold text-slate-900">Airlines &amp; Travel Tips for Dhaka to ${esc(route.city)}</h2>
        <p class="text-sm text-slate-700"><b>Operating Airlines:</b> ${esc(route.airlines)}</p>
        <p class="text-sm text-slate-600 leading-relaxed">${esc(route.tips)}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 class="font-extrabold text-slate-900 mb-3">More Popular Dhaka Flights</h3>
        <div class="flex flex-wrap gap-2">
          ${otherRoutes.map(r => `<a href="/flights/${esc(r.slug)}" class="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold px-3.5 py-2 rounded-xl">${esc(r.origin)} → ${esc(r.city)} (${esc(r.destination)})</a>`).join("")}
        </div>
      </div>
    </main>`;

  return subpageShell(title, desc, `https://dhakaflights.com/flights/${route.slug}`, body, cms, schema);
}

export function renderGuidesIndex(cms) {
  const published = cms.guides.filter(g => g.published !== false);
  const cards = published.map(g => `
    <a href="/guides/${esc(g.slug)}" class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition block">
      <span class="text-[11px] font-extrabold uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">${esc(g.category || "Guide")}</span>
      <h2 class="text-lg font-extrabold text-slate-900 mt-3">${esc(g.title)}</h2>
      <p class="text-sm text-slate-600 mt-2">${esc(g.summary)}</p>
      <span class="inline-block mt-4 text-xs font-extrabold text-blue-700">Read Full Guide →</span>
    </a>`).join("");

  const body = `
    <section class="bg-[#003580] text-white py-10 px-4">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-3xl font-extrabold">Dhaka Flights &amp; Airport Travel Guides</h1>
        <p class="text-blue-100 text-sm mt-1">Terminal guides, baggage allowances, and airfare tips for Bangladesh travelers.</p>
      </div>
    </section>
    <main class="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-5">${cards}</main>`;

  return subpageShell("Dhaka Flights Travel Guides | DhakaFlights.com", "Airport terminal guides, airline baggage limits, and cheap flight booking tips from Dhaka.", "https://dhakaflights.com/guides", body, cms);
}

export function renderGuidePage(slug, cms) {
  const guide = cms.guides.find(g => g.slug === slug && g.published !== false);
  if (!guide) return null;
  const paragraphs = String(guide.body || "").split(/\n+/).filter(Boolean).map(p => `<p class="text-slate-700 leading-relaxed">${esc(p)}</p>`).join("");

  const body = `
    <main class="max-w-3xl mx-auto px-4 py-10">
      <div class="text-xs font-bold text-blue-700 mb-3"><a href="/" class="hover:underline">Home</a> / <a href="/guides" class="hover:underline">Guides</a></div>
      <article class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <span class="text-xs font-extrabold uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-full">${esc(guide.category || "Guide")}</span>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">${esc(guide.title)}</h1>
        <p class="text-slate-500 text-sm font-medium border-b border-slate-100 pb-4">${esc(guide.summary)}</p>
        <div class="space-y-4 text-[15px]">${paragraphs}</div>
        <div class="pt-6 border-t border-slate-100 flex flex-wrap gap-3">
          <a href="/" class="bg-[#FFD200] text-slate-900 font-extrabold text-sm px-5 py-3 rounded-xl">Search Dhaka Flights →</a>
          <a href="/dhaka-flights-today" class="bg-slate-100 text-slate-800 font-bold text-sm px-5 py-3 rounded-xl">Live DAC Airport Board</a>
        </div>
      </article>
    </main>`;

  return subpageShell(`${guide.title} | DhakaFlights.com`, guide.summary, `https://dhakaflights.com/guides/${guide.slug}`, body, cms);
}

export function renderTrustPage(type, cms) {
  const email = esc(cms.settings.supportEmail || "support@dhakaflights.com");
  const pages = {
    about: {
      title: "About DhakaFlights.com",
      html: `<p>DhakaFlights.com is an independent flight metasearch and Bangladesh aviation information platform built to help travelers compare airfares from Hazrat Shahjalal International Airport (DAC), Chattogram (CGP), Sylhet (ZYL), and worldwide destinations.</p><p>We compare prices across 200+ airlines and trusted online travel agencies so passengers never overpay. We do not sell tickets directly or charge hidden booking fees.</p>`
    },
    contact: {
      title: "Contact DhakaFlights.com",
      html: `<p>Have questions about flight schedules, partnerships, or feedback for DhakaFlights.com?</p><p>Email us anytime at: <a href="mailto:${email}" class="text-blue-700 font-bold underline">${email}</a></p>`
    },
    "privacy-policy": {
      title: "Privacy Policy",
      html: `<p>DhakaFlights.com respects your privacy. We use essential caching and cookies to display faster airfare results. If you subscribe to Price Drop Alerts, your email is stored solely to notify you about route fare updates and is never sold to third parties.</p><p>When you click through to book a ticket on partner sites (such as Travelpayouts partners), their respective privacy policies apply.</p>`
    },
    terms: {
      title: "Terms of Service",
      html: `<p>DhakaFlights.com provides flight comparison prices and airport timetable information for informational purposes. Final ticket prices, baggage allowances, and schedule changes are confirmed directly by the operating airline or booking agency at checkout.</p>`
    }
  };
  const p = pages[type];
  if (!p) return null;

  const body = `
    <main class="max-w-3xl mx-auto px-4 py-12">
      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h1 class="text-3xl font-extrabold text-slate-900">${p.title}</h1>
        <div class="space-y-4 text-sm text-slate-700 leading-relaxed">${p.html}</div>
      </div>
    </main>`;
  return subpageShell(`${p.title} | DhakaFlights.com`, p.title, `https://dhakaflights.com/${type}`, body, cms);
}

export function renderSitemap(cms) {
  const urls = [
    { loc: "https://dhakaflights.com/", priority: "1.0" },
    { loc: "https://dhakaflights.com/dhaka-flights-today", priority: "0.9" },
    { loc: "https://dhakaflights.com/guides", priority: "0.8" },
    ...cms.routes.filter(r => r.published !== false).map(r => ({ loc: `https://dhakaflights.com/flights/${r.slug}`, priority: "0.9" })),
    ...cms.guides.filter(g => g.published !== false).map(g => ({ loc: `https://dhakaflights.com/guides/${g.slug}`, priority: "0.8" })),
    { loc: "https://dhakaflights.com/about", priority: "0.4" },
    { loc: "https://dhakaflights.com/contact", priority: "0.4" },
    { loc: "https://dhakaflights.com/privacy-policy", priority: "0.3" },
    { loc: "https://dhakaflights.com/terms", priority: "0.3" }
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;
}
