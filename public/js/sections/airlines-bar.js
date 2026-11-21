window.DhakaFlights.registerSection("airlines-bar", (root) => {
  const track = root.querySelector("[data-marquee-track]");
  if (!track) return;

  const AIRLINES = [
    { code: "BG", name: "Biman Bangladesh" },
    { code: "BS", name: "US-Bangla" },
    { code: "EK", name: "Emirates" },
    { code: "QR", name: "Qatar Airways" },
    { code: "SQ", name: "Singapore Airlines" },
    { code: "MH", name: "Malaysia Airlines" },
    { code: "TK", name: "Turkish Airlines" },
    { code: "SV", name: "Saudia" }
  ];

  function createGroup(isClone) {
    const group = document.createElement("div");
    group.className = "flex items-center gap-3 pr-3";
    if (isClone) group.setAttribute("aria-hidden", "true");

    AIRLINES.forEach(({ code, name }) => {
      const card = document.createElement("div");
      card.className = "inline-flex items-center gap-2.5 bg-slate-50/80 hover:bg-[#eef3fb] border border-slate-200/80 rounded-xl px-3.5 py-2 shrink-0 transition";

      const img = document.createElement("img");
      img.src = `https://images.kiwi.com/airlines/64/${code}.png`;
      img.alt = isClone ? "" : name;
      img.width = 26;
      img.height = 26;
      img.loading = "lazy";
      img.className = "w-[26px] h-[26px] object-contain rounded-sm shrink-0";

      const badge = document.createElement("span");
      badge.className = "hidden w-[26px] h-[26px] rounded-md bg-[#082454] text-white text-[10px] font-extrabold items-center justify-center shrink-0";
      badge.textContent = code;

      img.addEventListener("error", () => {
        if (!img.dataset.fb) {
          img.dataset.fb = "1";
          img.src = `https://pics.avs.io/64/64/${code}.png`;
        } else {
          img.classList.add("hidden");
          badge.classList.remove("hidden");
          badge.classList.add("flex");
        }
      });

      const label = document.createElement("span");
      label.className = "text-xs font-bold text-[#082454] whitespace-nowrap";
      label.textContent = name;

      card.append(img, badge, label);
      group.appendChild(card);
    });

    return group;
  }

  track.innerHTML = "";
  track.append(createGroup(false), createGroup(true));
});
