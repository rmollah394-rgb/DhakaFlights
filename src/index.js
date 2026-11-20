import { handleDeals, handleCalendar, handleAlert } from "./api.js";
import headHtml from "./sections/head.html";
import heroSearchHtml from "./sections/hero-search.html";
import airlinesBarHtml from "./sections/airlines-bar.html";
import fareCalendarHtml from "./sections/fare-calendar.html";
import dealsGridHtml from "./sections/deals-grid.html";
import travelGuidesHtml from "./sections/travel-guides.html";
import alertModalHtml from "./sections/alert-modal.html";
import footerHtml from "./sections/footer.html";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Assemble modular homepage sections
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = [
        headHtml,
        heroSearchHtml,
        airlinesBarHtml,
        fareCalendarHtml,
        dealsGridHtml,
        travelGuidesHtml,
        alertModalHtml,
        footerHtml,
      ].join("\n");

      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    // API endpoints
    if (url.pathname === "/api/deals") return handleDeals(request, env, ctx, url);
    if (url.pathname === "/api/calendar") return handleCalendar(request, env, ctx, url);
    if (url.pathname === "/api/alert" && request.method === "POST") return handleAlert(request, env);

    // Serve static files like /js/app.js
    return env.ASSETS.fetch(request);
  },
};
