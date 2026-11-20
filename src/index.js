import headHtml from "./sections/head.html";
import heroSearchHtml from "./sections/hero-search.html";
import airlinesBarHtml from "./sections/airlines-bar.html";
import fareCalendarHtml from "./sections/fare-calendar.html";
import dealsGridHtml from "./sections/deals-grid.html";
import travelGuidesHtml from "./sections/travel-guides.html";
import alertModalHtml from "./sections/alert-modal.html";
import footerHtml from "./sections/footer.html";
import scheduleBoardHtml from "./sections/schedule-board.html";

const CURATED_DHAKA_DEALS = [
  { origin: "DAC", destination: "DXB", city: "Dubai", country: "UAE", region: "me", transfers: 0, airline: "EK", price: null },
  { origin: "DAC", destination: "DOH", city: "Doha", country: "Qatar", region: "me", transfers: 0, airline: "QR", price: null },
  { origin: "DAC", destination: "JED", city: "Jeddah", country: "Saudi Arabia", region: "me", transfers: 0, airline: "SV", price: null },
  { origin: "DAC", destination: "RUH", city: "Riyadh", country: "Saudi Arabia", region: "me", transfers: 0, airline: "BG", price: null },
  { origin: "DAC", destination: "KUL", city: "Kuala Lumpur", country: "Malaysia", region: "asia", transfers: 0, airline: "MH", price: null },
  { origin: "DAC", destination: "SIN", city: "Singapore", country: "Singapore", region: "asia", transfers: 0, airline: "SQ", price: null },
  { origin: "DAC", destination: "BKK", city: "Bangkok", country: "Thailand", region: "asia", transfers: 0, airline: "TG", price: null },
  { origin: "DAC", destination: "CCU", city: "Kolkata", country: "India", region: "asia", transfers: 0, airline: "6E", price: null },
  { origin: "DAC", destination: "LHR", city: "London", country: "UK", region: "eu", transfers: 0, airline: "BG", price: null },
  { origin: "DAC", destination: "IST", city: "Istanbul", country: "Turkey", region: "eu", transfers: 0, airline: "TK", price: null },
  { origin: "DAC", destination: "JFK", city: "New York", country: "USA", region: "eu", transfers: 1, airline: "QR", price: null },
  { origin: "DAC", destination: "YYZ", city: "Toronto", country: "Canada", region: "eu", transfers: 1, airline: "EK", price: null }
];

const SAMPLE_DAC_SCHEDULE = {
  departures: [
    { flight_iata: "EK585", airline_iata: "EK", dep_iata: "DAC", arr_iata: "DXB", dep_time: "2026-11-20 01:40", dep_terminal: "2", dep_gate: "A3", status: "scheduled", dep_delayed: null },
    { flight_iata: "QR639", airline_iata: "QR", dep_iata: "DAC", arr_iata: "DOH", dep_time: "2026-11-20 03:30", dep_terminal: "1", dep_gate: "B2", status: "scheduled", dep_delayed: null },
    { flight_iata: "BG147", airline_iata: "BG", dep_iata: "DAC", arr_iata: "DXB", dep_time: "2026-11-20 19:45", dep_terminal: "2", dep_gate: "C1", status: "active", dep_delayed: 15 },
    { flight_iata: "SQ447", airline_iata: "SQ", dep_iata: "DAC", arr_iata: "SIN", dep_time: "2026-11-20 23:55", dep_terminal: "2", dep_gate: "A1", status: "scheduled", dep_delayed: null },
    { flight_iata: "MH197", airline_iata: "MH", dep_iata: "DAC", arr_iata: "KUL", dep_time: "2026-11-20 00:35", dep_terminal: "1", dep_gate: "B4", status: "landed", dep_delayed: null },
    { flight_iata: "BS341", airline_iata: "BS", dep_iata: "DAC", arr_iata: "DXB", dep_time: "2026-11-20 18:10", dep_terminal: "1", dep_gate: "C3", status: "active", dep_delayed: null }
  ],
  arrivals: [
    { flight_iata: "EK584", airline_iata: "EK", dep_iata: "DXB", arr_iata: "DAC", arr_time: "2026-11-20 19:15", arr_terminal: "2", arr_baggage: "4", status: "active", arr_delayed: null },
    { flight_iata: "QR638", airline_iata: "QR", dep_iata: "DOH", arr_iata: "DAC", arr_time: "2026-11-20 02:00", arr_terminal: "1", arr_baggage: "2", status: "landed", arr_delayed: null },
    { flight_iata: "SQ446", airline_iata: "SQ", dep_iata: "SIN", arr_iata: "DAC", arr_time: "2026-11-20 22:40", arr_terminal: "2", arr_baggage: "3", status: "scheduled", arr_delayed: null },
    { flight_iata: "TK712", airline_iata: "TK", dep_iata: "IST", arr_iata: "DAC", arr_time: "2026-11-20 05:25", arr_terminal: "1", arr_baggage: "1", status: "scheduled", arr_delayed: 10 }
  ]
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Homepage (all sections combined)
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = [
        headHtml,
        heroSearchHtml,
        airlinesBarHtml,
        fareCalendarHtml,
        dealsGridHtml,
        travelGuidesHtml,
        alertModalHtml,
        footerHtml
      ].join("\n");

      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300"
        }
      });
    }

    // Live Dhaka Airport (DAC) Flight Board page
    if (url.pathname === "/dhaka-flights-today" || url.pathname === "/schedule") {
      return new Response(scheduleBoardHtml, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300"
        }
      });
    }

    // Backend API endpoints
    if (url.pathname === "/api/deals") return handleDeals(request, env, ctx, url);
    if (url.pathname === "/api/calendar") return handleCalendar(request, env, ctx, url);
    if (url.pathname === "/api/alert" && request.method === "POST") return handleAlert(request, env);
    if (url.pathname === "/api/schedule") return handleSchedule(request, env, url);

    // Serve static files (/js/app.js, /js/schedule.js, etc.)
    return env.ASSETS.fetch(request);
  }
};

async function handleDeals(request, env, ctx, url) {
  const origin = (url.searchParams.get("origin") || "DAC").toUpperCase().slice(0, 3);
  const currency = (url.searchParams.get("currency") || "bdt").toLowerCase() === "usd" ? "usd" : "bdt";
  const direct = url.searchParams.get("direct") === "true";

  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) return cachedResponse;

  let deals = [];
  let source = "curated";

  if (env.TRAVELPAYOUTS_TOKEN) {
    const directParam = direct ? "&direct=true" : "";
    const endpoints = [
      `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&currency=${currency}&market=us&sorting=price&unique=true&limit=24${directParam}`,
      `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&currency=${currency}&sorting=price&unique=true&limit=24${directParam}`
    ];

    for (const apiUrl of endpoints) {
      try {
        const res = await fetch(apiUrl, {
          headers: {
            "X-Access-Token": env.TRAVELPAYOUTS_TOKEN,
            "Accept-Encoding": "gzip, deflate"
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            deals = json.data;
            source = "live";
            break;
          }
        }
      } catch (_) {}
    }
  }

  if (deals.length === 0) {
    const defaultDep = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    deals = CURATED_DHAKA_DEALS
      .filter(d => !direct || d.transfers === 0)
      .map(d => ({ ...d, origin, departure_at: defaultDep }));
  }

  const response = new Response(
    JSON.stringify({ ok: true, source, origin, currency, deals }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }
    }
  );
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

async function handleCalendar(request, env, ctx, url) {
  const origin = (url.searchParams.get("origin") || "DAC").toUpperCase().slice(0, 3);
  const dest = (url.searchParams.get("destination") || "DXB").toUpperCase().slice(0, 3);
  const currency = (url.searchParams.get("currency") || "bdt").toLowerCase() === "usd" ? "usd" : "bdt";
  const direct = url.searchParams.get("direct") === "true";

  const now = new Date();
  const defaultMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().slice(0, 7);
  const month = (url.searchParams.get("month") || defaultMonth).slice(0, 7);

  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) return cachedResponse;

  let days = [];
  let source = "live";

  if (env.TRAVELPAYOUTS_TOKEN) {
    const directParam = direct ? "&direct=true" : "";
    const endpoints = [
      `https://api.travelpayouts.com/aviasales/v3/grouped_prices?origin=${origin}&destination=${dest}&group_by=departure_at&departure_at=${month}&currency=${currency}&market=us${directParam}`,
      `https://api.travelpayouts.com/aviasales/v3/grouped_prices?origin=${origin}&destination=${dest}&group_by=departure_at&departure_at=${month}&currency=${currency}${directParam}`
    ];

    for (const apiUrl of endpoints) {
      try {
        const res = await fetch(apiUrl, {
          headers: {
            "X-Access-Token": env.TRAVELPAYOUTS_TOKEN,
            "Accept-Encoding": "gzip, deflate"
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && Object.keys(json.data).length > 0) {
            days = Object.entries(json.data)
              .map(([dateKey, item]) => ({
                date: (item.departure_at || dateKey).slice(0, 10),
                price: item.price,
                airline: item.airline || "",
                transfers: item.transfers ?? 0
              }))
              .sort((a, b) => a.date.localeCompare(b.date));
            break;
          }
        }
      } catch (_) {}
    }
  }

  if (days.length === 0) source = "empty";

  const response = new Response(
    JSON.stringify({ ok: true, source, origin, destination: dest, month, currency, days }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }
    }
  );
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

async function handleAlert(request, env) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const origin = (body.origin || "DAC").toUpperCase().slice(0, 3);
    const destination = (body.destination || "DXB").toUpperCase().slice(0, 3);
    const targetPrice = Number(body.targetPrice || 0);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Please enter a valid email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const record = { email, origin, destination, targetPrice, createdAt: new Date().toISOString() };
    if (env.ALERTS_KV) {
      await env.ALERTS_KV.put(`alert:${origin}-${destination}:${email}`, JSON.stringify(record));
    }

    return new Response(
      JSON.stringify({ ok: true, storedInKV: Boolean(env.ALERTS_KV), message: `Price alert active for ${origin} → ${destination}!` }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (_) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid request data." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

async function handleSchedule(request, env, url) {
  const type = url.searchParams.get("type") === "arrivals" ? "arrivals" : "departures";
  const param = type === "arrivals" ? "arr_iata" : "dep_iata";
  const kvKey = `dac:${type}`;
  const CACHE_TTL_MS = 3 * 60 * 60 * 1000;

  let cached = null;
  if (env.SCHEDULE_KV) {
    try {
      cached = await env.SCHEDULE_KV.get(kvKey, "json");
    } catch (_) {}
  }

  if (cached && cached.updatedAt && (Date.now() - cached.updatedAt) < CACHE_TTL_MS) {
    return new Response(
      JSON.stringify({ ok: true, airport: "DAC", type, source: "kv-cache", updatedAt: cached.updatedAt, flights: cached.flights }),
      { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=600" } }
    );
  }

  if (env.AIRLABS_API_KEY) {
    try {
      const apiUrl = `https://airlabs.co/api/v9/schedules?${param}=DAC&api_key=${encodeURIComponent(env.AIRLABS_API_KEY)}`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        const json = await res.json();
        if (!json.error && Array.isArray(json.response) && json.response.length > 0) {
          const payload = { updatedAt: Date.now(), flights: json.response };
          if (env.SCHEDULE_KV) {
            await env.SCHEDULE_KV.put(kvKey, JSON.stringify(payload));
          }
          return new Response(
            JSON.stringify({ ok: true, airport: "DAC", type, source: "live", updatedAt: payload.updatedAt, flights: payload.flights }),
            { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=600" } }
          );
        }
      }
    } catch (_) {}
  }

  if (cached && Array.isArray(cached.flights)) {
    return new Response(
      JSON.stringify({ ok: true, airport: "DAC", type, source: "stale-cache", updatedAt: cached.updatedAt, flights: cached.flights }),
      { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=300" } }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, airport: "DAC", type, source: "sample", updatedAt: Date.now(), flights: SAMPLE_DAC_SCHEDULE[type] }),
    { headers: { "Content-Type": "application/json; charset=utf-8" } }
  );
}
