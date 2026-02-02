function formatMoneyNGN(amount){
  return "₦" + amount.toLocaleString("en-NG");
}

function getQueryParam(key){
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

function renderCards(list, container){
  container.innerHTML = "";
  if(list.length === 0){
    container.innerHTML = `<div class="panel">No properties match your search/filters.</div>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <a href="property.html?id=${p.id}">
        <img src="${p.image}" alt="${p.title}">
      </a>
      <div class="card-body">
        <div class="price">${formatMoneyNGN(p.price)} <span style="color:var(--muted);font-size:14px;font-weight:600">(${p.status})</span></div>
        <div style="margin-top:6px;font-weight:700">${p.title}</div>
        <div class="meta">
          <span class="pill">${p.type}</span>
          <span class="pill">${p.location}</span>
          ${p.beds ? `<span class="pill">${p.beds} bed</span>` : ``}
          ${p.baths ? `<span class="pill">${p.baths} bath</span>` : ``}
        </div>
        <a class="tag" href="property.html?id=${p.id}">View Details</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// LISTINGS PAGE LOGIC
function initListingsPage(){
  const grid = document.getElementById("listingsGrid");
  if(!grid) return;

  const q = document.getElementById("q");
  const type = document.getElementById("type");
  const status = document.getElementById("status");
  const min = document.getElementById("min");
  const max = document.getElementById("max");
  const btn = document.getElementById("apply");

  function applyFilters(){
    const query = (q.value || "").trim().toLowerCase();
    const t = type.value;
    const s = status.value;
    const minVal = Number(min.value) || 0;
    const maxVal = Number(max.value) || Number.MAX_SAFE_INTEGER;

    const filtered = PROPERTIES.filter(p => {
      const textMatch =
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query);

      const typeMatch = (t === "All") ? true : p.type === t;
      const statusMatch = (s === "All") ? true : p.status === s;
      const priceMatch = p.price >= minVal && p.price <= maxVal;

      return textMatch && typeMatch && statusMatch && priceMatch;
    });

    renderCards(filtered, grid);
  }

  btn.addEventListener("click", applyFilters);
  q.addEventListener("input", applyFilters);

  // initial render
  renderCards(PROPERTIES, grid);
}

// PROPERTY DETAILS PAGE LOGIC
function initPropertyPage(){
  const holder = document.getElementById("propertyHolder");
  if(!holder) return;

  const id = Number(getQueryParam("id"));
  const p = PROPERTIES.find(x => x.id === id) || PROPERTIES[0];

  holder.innerHTML = `
    <div class="card">
      <img src="${p.image}" alt="${p.title}">
      <div class="card-body">
        <div class="price">${formatMoneyNGN(p.price)} <span style="color:var(--muted);font-size:14px;font-weight:600">(${p.status})</span></div>
        <h2 style="margin:10px 0 6px">${p.title}</h2>
        <div class="meta">
          <span class="pill">${p.type}</span>
          <span class="pill">${p.location}</span>
          ${p.beds ? `<span class="pill">${p.beds} bed</span>` : ``}
          ${p.baths ? `<span class="pill">${p.baths} bath</span>` : ``}
        </div>

        <div class="kv">
          <div class="pill"><b>Status:</b> ${p.status}</div>
          <div class="pill"><b>Type:</b> ${p.type}</div>
          <div class="pill"><b>Beds:</b> ${p.beds}</div>
          <div class="pill"><b>Baths:</b> ${p.baths}</div>
        </div>

        <p class="note" style="margin-top:14px">${p.description}</p>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
          <a href="contact.html"><button>Contact Agent</button></a>
          <a href="listings.html" class="pill" style="display:inline-flex;align-items:center;gap:8px;padding:11px 14px">← Back to Listings</a>
        </div>
      </div>
    </div>
  `;
}

// CONTACT FORM (simple validation)
function initContactPage(){
  const form = document.getElementById("contactForm");
  if(!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const msg = form.querySelector("#message").value.trim();

    if(!name || !email || !msg){
      alert("Please fill in all fields.");
      return;
    }
    alert("Message sent (demo). For a real project, this would submit to a server.");
    form.reset();
  });
}

function initHeroCarousel() {
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const prev = document.getElementById("heroPrev");
  const next = document.getElementById("heroNext");
  const dotsWrap = document.getElementById("heroDots");

  if (slides.length === 0 || !prev || !next || !dotsWrap) return;

  let index = 0;
  let timer = null;
  const intervalMs = 4500;

  // create dots
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.className = i === 0 ? "is-active" : "";
    b.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(b);
  });

  const dots = Array.from(dotsWrap.querySelectorAll("button"));

  function show(i) {
    slides.forEach(s => s.classList.remove("is-active"));
    dots.forEach(d => d.classList.remove("is-active"));
    slides[i].classList.add("is-active");
    dots[i].classList.add("is-active");
  }

  function goTo(i, restart) {
    index = (i + slides.length) % slides.length;
    show(index);
    if (restart) restartAuto();
  }

  function goNext() { goTo(index + 1, false); }
  function goPrev() { goTo(index - 1, false); }

  prev.addEventListener("click", () => goTo(index - 1, true));
  next.addEventListener("click", () => goTo(index + 1, true));

  function startAuto() {
    timer = setInterval(() => goTo(index + 1, false), intervalMs);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function restartAuto() {
    stopAuto();
    startAuto();
  }

  // pause on hover
  const carousel = document.querySelector(".hero-carousel");
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  // init
  show(index);
  startAuto();
}


// Run initializers
document.addEventListener("DOMContentLoaded", () => {
  initListingsPage();
  initPropertyPage();
  initContactPage();
  initHeroCarousel();
});
