export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname === "/api/deals") {
      return handleDeals(request, env, ctx, url);
    }

    // Serve static frontend files from /public
    return env.ASSETS.fetch(request);
  },
};

const CURATED_DHAKA_DEALS = [
  { origin: "DAC", destination: "DXB", city: "Dubai", country: "UAE", transfers: 0, airline: "EK", price: null },
  { origin: "DAC", destination: "KUL", city: "Kuala Lumpur", country: "Malaysia", transfers: 0, airline: "MH", price: null },
  { origin: "DAC", destination: "SIN", city: "Singapore", country: "Singapore", transfers: 0, airline: "SQ", price: null },
  { origin: "DAC", destination: "BKK", city: "Bangkok", country: "Thailand", transfers: 0, airline: "TG", price: null },
  { origin: "DAC", destination: "DOH", city: "Doha", country: "Qatar", transfers: 0, airline: "QR", price: null },
  { origin: "DAC", destination: "JED", city: "Jeddah", country: "Saudi Arabia", transfers: 0, airline: "SV", price: null },
  { origin: "DAC", destination: "CCU", city: "Kolkata", country: "India", transfers: 0, airline: "6E", price: null },
  { origin: "DAC", destination: "LHR", city: "London", country: "UK", transfers: 0, airline: "BG", price: null },
];

async function handleDeals(request, env, ctx, url) {
  const origin = (url.searchParams.get("origin") || "DAC").toUpperCase().slice(0, 3);
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);

  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  let deals = [];
  let source = "curated";

  if (env.TRAVELPAYOUTS_TOKEN) {
    // Try default market first, fallback to US/global English market if empty
    const endpoints = [
      `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&currency=bdt&sorting=price&unique=true&limit=12`,
      `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&currency=bdt&market=us&sorting=price&unique=true&limit=12`,
    ];

    for (const apiUrl of endpoints) {
      try {
        const res = await fetch(apiUrl, {
          headers: {
            "X-Access-Token": env.TRAVELPAYOUTS_TOKEN,
            "Accept-Encoding": "gzip, deflate",
          },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            deals = json.data;
            source = "live";
            break;
          }
        }
      } catch (err) {
        // Continue to fallback
      }
    }
  }

  if (deals.length === 0) {
    const defaultDep = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    deals = CURATED_DHAKA_DEALS.map((d) => ({
      ...d,
      origin,
      departure_at: defaultDep,
    }));
  }

  const response = new Response(
    JSON.stringify({ ok: true, source, origin, deals }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );

  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
