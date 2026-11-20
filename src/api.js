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

export async function handleDeals(request, env, ctx, url) {
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
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

export async function handleCalendar(request, env, ctx, url) {
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
            "Accept-Encoding": "gzip, deflate",
          },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && Object.keys(json.data).length > 0) {
            days = Object.entries(json.data)
              .map(([dateKey, item]) => ({
                date: (item.departure_at || dateKey).slice(0, 10),
                price: item.price,
                airline: item.airline || "",
                transfers: item.transfers ?? 0,
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
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

export async function handleAlert(request, env) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const origin = (body.origin || "DAC").toUpperCase().slice(0, 3);
    const destination = (body.destination || "DXB").toUpperCase().slice(0, 3);
    const targetPrice = Number(body.targetPrice || 0);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Please enter a valid email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const record = {
      email,
      origin,
      destination,
      targetPrice,
      createdAt: new Date().toISOString(),
    };

    if (env.ALERTS_KV) {
      await env.ALERTS_KV.put(`alert:${origin}-${destination}:${email}`, JSON.stringify(record));
    }

    return new Response(
      JSON.stringify({
        ok: true,
        storedInKV: Boolean(env.ALERTS_KV),
        message: `Price alert active for ${origin} → ${destination}!`,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (_) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid request data." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
