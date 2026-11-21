window.DhakaFlights.registerSection("navbar", (root) => {
  const logoImg = root.querySelector("[data-logo-img]");
  const logoFallback = root.querySelector("[data-logo-fallback]");
  if (logoImg && logoFallback) {
    logoImg.addEventListener("error", () => {
      logoImg.classList.add("hidden");
      logoFallback.classList.remove("hidden");
    });
  }

  const closeAllDropdowns = () => {
    root.querySelectorAll("[data-df-menu]").forEach(menu => menu.classList.add("hidden"));
    root.querySelectorAll("[data-dropdown-btn]").forEach(btn => btn.setAttribute("aria-expanded", "false"));
  };

  root.querySelectorAll("[data-dropdown-btn]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute("data-dropdown-btn");
      const menu = targetId ? document.getElementById(targetId) : null;
      if (!menu) return;
      const isHidden = menu.classList.contains("hidden");
      closeAllDropdowns();
      if (isHidden) {
        menu.classList.remove("hidden");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  const mobileToggle = root.querySelector("[data-mobile-toggle]");
  const mobileNav = root.querySelector("[data-mobile-nav]");
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("hidden") === false;
      mobileToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.add("hidden");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-df-dropdown]")) {
      closeAllDropdowns();
    }
  });
});
