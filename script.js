/* ===== VION site configuration — edit here ===== */
const CONFIG = {
  // Create a free form at https://formspree.io and paste its endpoint, e.g. "https://formspree.io/f/xxxxxxx".
  // Until set, the form never claims delivery; it opens an email draft instead.
  formEndpoint: "",
  email: "vionemirates07@gmail.com",
  // WhatsApp number in international format, digits only. Leave "" to hide the WhatsApp button.
  // Confirm this number is an active WhatsApp Business/personal line before publishing.
  whatsapp: "971503691327"
};
const SERVICES = [
  ["Floor & Wall Tiling Works","Floor and wall tile installation and related finishing works."],
  ["False Ceiling & Light Partitions Installation","Installation of false ceilings and lightweight partition systems."],
  ["Electrical Fittings & Fixtures Repairing & Maintenance","Repair and maintenance of electrical fittings and fixtures."],
  ["Wallpaper Fixing Works","Wallpaper installation and wall-surface finishing."],
  ["Engraving & Ornamentation Works","Decorative engraving and ornamentation works."],
  ["Plumbing & Sanitary Installation","Plumbing works and sanitary fixture installation."],
  ["Plaster Works","Plastering and associated surface preparation and finishing."],
  ["Carpentry & Wood Flooring Works","Carpentry services and wood flooring installation works."],
  ["Electromechanical Equipment Installation and Maintenance","Installation and maintenance of electromechanical equipment."],
  ["Air-Conditioning, Ventilations & Air Filtration Installation & Maintenance","Installation and maintenance of air-conditioning, ventilation and air-filtration systems."]
];
const $ = s => document.querySelector(s);
const sel = $("#service-select");
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const heroSlideButtons = Array.from(document.querySelectorAll(".hero-slide-dot"));
if (heroSlides.length > 1 && heroSlideButtons.length === heroSlides.length) {
  let activeHeroSlide = 0;
  let heroTimer;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const showHeroSlide = index => {
    activeHeroSlide = index;
    heroSlides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    heroSlideButtons.forEach((button, i) => {
      button.classList.toggle("is-active", i === index);
      button.setAttribute("aria-pressed", String(i === index));
    });
  };
  const stopHeroTimer = () => window.clearInterval(heroTimer);
  const startHeroTimer = () => {
    stopHeroTimer();
    if (!reducedMotion && !document.hidden) {
      heroTimer = window.setInterval(() => showHeroSlide((activeHeroSlide + 1) % heroSlides.length), 6000);
    }
  };
  heroSlideButtons.forEach((button, index) => button.addEventListener("click", () => {
    showHeroSlide(index);
    startHeroTimer();
  }));
  const hero = $("#home");
  hero.addEventListener("mouseenter", stopHeroTimer);
  hero.addEventListener("mouseleave", startHeroTimer);
  hero.addEventListener("focusin", stopHeroTimer);
  hero.addEventListener("focusout", event => {
    if (!hero.contains(event.relatedTarget)) startHeroTimer();
  });
  document.addEventListener("visibilitychange", startHeroTimer);
  startHeroTimer();
}
const serviceRows = [4, 3, 3].map((count, rowIndex) => {
  const row = document.createElement("div");
  row.className = `service-row service-row-${count}`;
  $("#service-grid").appendChild(row);
  return row;
});

SERVICES.forEach(([name, description], index) => {
  const c = document.createElement("article"); c.className = "card";
  c.innerHTML = `<div class="service-mark" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div><h3></h3><p></p><a href="#enquiry">Enquire about this service</a>`;
  c.querySelector("h3").textContent = name;
  c.querySelector("p").textContent = description;
  c.querySelector("a").addEventListener("click", () => { sel.value = name; });
  const rowIndex = index < 4 ? 0 : index < 7 ? 1 : 2;
  serviceRows[rowIndex].appendChild(c);
  sel.add(new Option(name, name));
});
sel.add(new Option("Other / not sure","Other"));

// Project placeholders — replace with real approved projects
for (let n = 1; n <= 6; n++) {
  const c = document.createElement("article"); c.className = "card project-card";
  c.innerHTML = `<div class="project-preview" aria-hidden="true"><span>PROJECT&nbsp; ${String(n).padStart(2, "0")}</span></div><h3>Project Showcase ${String(n).padStart(2, "0")}</h3><p>Add an approved project photo, location and scope of work.</p>`;
  $("#project-grid").appendChild(c);
}

$("#yr").textContent = new Date().getFullYear();
if (CONFIG.whatsapp) {
  const whatsappUrl = "https://wa.me/" + CONFIG.whatsapp;
  const floatingWhatsapp = $("#wa-float");
  if (floatingWhatsapp) floatingWhatsapp.href = whatsappUrl;
}

// Mobile menu
const btn = $(".menu-btn"), nav = $("#nav");
btn.addEventListener("click", () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", false); } });

// Enquiry form
const form = $("#enquiry"), status = $("#status");
const say = (m, k) => { status.textContent = m; status.className = k || ""; };
form.addEventListener("submit", async e => {
  e.preventDefault();
  let bad = null;
  ["name","email","phone","service","message"].forEach(n => {
    const f = form.elements[n], ok = f.value.trim() && (n !== "email" || /^\S+@\S+\.\S+$/.test(f.value));
    f.setAttribute("aria-invalid", !ok); if (!ok && !bad) bad = f;
  });
  if (bad) { say("Please complete the highlighted fields.", "err"); bad.focus(); return; }
  if (form.elements.website.value) return; // honeypot: bots only
  const data = Object.fromEntries(new FormData(form)); delete data.website;
  if (!CONFIG.formEndpoint) {
    const body = Object.entries(data).map(([k,v]) => `${k}: ${v}`).join("\n");
    say("Online sending is not set up yet, so nothing was sent. Opening your email app instead…", "err");
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Quote request: " + data.service)}&body=${encodeURIComponent(body)}`;
    return;
  }
  say("Sending…");
  try {
    const r = await fetch(CONFIG.formEndpoint, {method:"POST", headers:{"Content-Type":"application/json",Accept:"application/json"}, body:JSON.stringify(data)});
    if (!r.ok) throw new Error();
    form.reset(); say("Thank you. Your enquiry was received and we will contact you soon.", "ok");
  } catch { say("Your enquiry could not be sent. Please call +971 50 3691327 or email " + CONFIG.email + ".", "err"); }
});
