/* ─────────── HEADER / NAV ─────────── */
const hdr = document.getElementById("hdr");
const burger = document.getElementById("burger");
const mnav = document.getElementById("mnav");

const onScroll = () => hdr.classList.toggle("solid", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

function setMenu(open) {
  mnav.classList.toggle("open", open);
  burger.classList.toggle("x", open);
  burger.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("locked", open);
}
burger.addEventListener("click", () => setMenu(!mnav.classList.contains("open")));
mnav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => setMenu(false)),
);

// Active section highlight
const links = [...document.querySelectorAll(".nav a")];
const sections = links
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const navObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) =>
        a.classList.toggle("on", a.getAttribute("href") === `#${e.target.id}`),
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
sections.forEach((s) => navObs.observe(s));

/* ─────────── REVEAL ON SCROLL ─────────── */
const revealObs = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      obs.unobserve(e.target);
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
);
const watchReveal = (root = document) =>
  root.querySelectorAll(".reveal:not(.in)").forEach((el) => revealObs.observe(el));
watchReveal();

/* ─────────── LANGUAGE ─────────── */
document.getElementById("lang").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-lang]");
  if (btn) I18N.set(btn.dataset.lang);
});
I18N.set(I18N.stored());
document.getElementById("year").textContent = new Date().getFullYear();

/* ─────────── HERO VIDEO ─────────── */
const vid = document.getElementById("heroVid");
const soundBtn = document.getElementById("sound");

API.background()
  .then((bg) => {
    if (!bg || !bg.file || !bg.status) return;
    vid.addEventListener("canplay", () => {
      vid.classList.add("ready");
      soundBtn.hidden = false;
    });
    vid.preload = "auto";
    vid.src = bg.file;
    const play = vid.play();
    if (play) play.catch(() => {});
  })
  .catch(() => {});

soundBtn.addEventListener("click", () => {
  vid.muted = !vid.muted;
  soundBtn.classList.toggle("muted", vid.muted);
  const label = soundBtn.querySelector("span:last-child");
  label.dataset.i18n = vid.muted ? "hero.unmute" : "hero.mute";
  label.textContent = I18N.t(label.dataset.i18n);
});

/* ─────────── COLLECTIONS ─────────── */
const grid = document.getElementById("collGrid");
const chips = document.getElementById("chips");

// Fallback line-ups shown alongside (or instead of) API collections.
const SHOWCASE = [
  { titleKey: "s3.h", subKey: "s3.s" },
  { titleKey: "s2.h", subKey: "s2.s" },
  { titleKey: "s1.h", subKey: "s1.s" },
  { titleKey: "s5.h", subKey: "s5.s" },
  { titleKey: "s4.h", subKey: "s4.s" },
];

let categories = [];
let items = [];
let activeCat = "all";

function buildItems(apiCollections) {
  const live = apiCollections
    .filter((c) => c.status !== false)
    .map((c, i) => ({
      image: STATIC_IMAGES[i % STATIC_IMAGES.length],
      title: c.model_name || "",
      brand: c.contragent_name || "",
      catId: c.category_id ?? null,
    }));

  const filler = SHOWCASE.slice(0, Math.max(0, STATIC_IMAGES.length - live.length)).map(
    (s, i) => ({
      image: STATIC_IMAGES[(live.length + i) % STATIC_IMAGES.length],
      titleKey: s.titleKey,
      subKey: s.subKey,
      catId: null,
    }),
  );

  return [...live, ...filler];
}

function catName(id) {
  const c = categories.find((x) => x.id === id);
  return c ? c.name : "";
}

function renderChips() {
  if (!categories.length) {
    chips.hidden = true;
    return;
  }
  chips.hidden = false;
  chips.innerHTML =
    `<button type="button" class="chip${activeCat === "all" ? " on" : ""}" data-cat="all">${I18N.t("coll.all")}</button>` +
    categories
      .map(
        (c) =>
          `<button type="button" class="chip${activeCat === c.id ? " on" : ""}" data-cat="${c.id}">${esc(c.name)}</button>`,
      )
      .join("");
}

function visibleItems() {
  return activeCat === "all"
    ? items
    : items.filter((it) => it.catId === activeCat);
}

function renderGrid() {
  const list = visibleItems();
  grid.innerHTML = list
    .map((it, i) => {
      const title = it.title || I18N.t(it.titleKey);
      const sub = it.brand
        ? `${I18N.t("coll.byline")} ${esc(it.brand)}`
        : I18N.t(it.subKey || "");
      const tag = it.catId ? catName(it.catId) : "";
      return `
        <article class="ccard reveal" data-i="${i}">
          <div class="ccard-img">
            <img src="${it.image}" alt="${esc(title)}" loading="lazy" />
            ${tag ? `<span class="ccard-tag">${esc(tag)}</span>` : ""}
          </div>
          <div class="ccard-body">
            <h3>${esc(title)}</h3>
            <p>${sub}</p>
          </div>
        </article>`;
    })
    .join("");
  watchReveal(grid);
}

chips.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeCat = btn.dataset.cat === "all" ? "all" : Number(btn.dataset.cat);
  renderChips();
  renderGrid();
});

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".ccard");
  if (card) openLightbox(Number(card.dataset.i));
});

function loadCollections() {
  grid.innerHTML = `<p class="grid-note">${I18N.t("coll.loading")}</p>`;

  Promise.all([
    API.categories().catch(() => []),
    API.collections().catch(() => null),
  ]).then(([cats, cols]) => {
    categories = Array.isArray(cats) ? cats : [];
    items = buildItems(Array.isArray(cols) ? cols : []);
    renderChips();
    renderGrid();
  });
}
loadCollections();

document.addEventListener("langchange", () => {
  if (!items.length) return;
  renderChips();
  renderGrid();
});

function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

/* ─────────── LIGHTBOX ─────────── */
const lb = document.getElementById("lb");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = i;
  paintLightbox();
  lb.hidden = false;
  document.body.classList.add("locked");
}
function paintLightbox() {
  const list = visibleItems();
  const it = list[lbIndex];
  if (!it) return;
  lbImg.src = it.image;
  const title = it.title || I18N.t(it.titleKey);
  lbImg.alt = title;
  lbCap.textContent = title;
}
function stepLightbox(d) {
  const n = visibleItems().length;
  lbIndex = (lbIndex + d + n) % n;
  paintLightbox();
}
function closeLightbox() {
  lb.hidden = true;
  document.body.classList.remove("locked");
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => stepLightbox(-1));
document.getElementById("lbNext").addEventListener("click", () => stepLightbox(1));
lb.addEventListener("click", (e) => {
  if (e.target === lb) closeLightbox();
});

/* ─────────── CONTACT FORM ─────────── */
const form = document.getElementById("form");
const submitBtn = document.getElementById("submitBtn");
const formErr = document.getElementById("formErr");
const ok = document.getElementById("ok");

function showErr(key) {
  formErr.textContent = I18N.t(key);
  formErr.hidden = false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formErr.hidden = true;

  const data = Object.fromEntries(new FormData(form));
  const payload = {
    name: data.name.trim(),
    company: data.company.trim(),
    email: data.email.trim(),
    message: data.message.trim(),
  };

  if (!payload.name || !payload.company || !payload.email || !payload.message)
    return showErr("f.required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return showErr("f.email");

  const label = submitBtn.querySelector("span");
  const original = label.textContent;
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  label.textContent = I18N.t("f.sending");

  try {
    await API.sendContact(payload);
    form.reset();
    ok.hidden = false;
    document.body.classList.add("locked");
  } catch {
    showErr("f.failed");
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    label.textContent = original;
  }
});

function closeOk() {
  ok.hidden = true;
  document.body.classList.remove("locked");
}
document.getElementById("okClose").addEventListener("click", closeOk);
ok.addEventListener("click", (e) => {
  if (e.target === ok) closeOk();
});

/* ─────────── KEYBOARD ─────────── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!lb.hidden) closeLightbox();
    if (!ok.hidden) closeOk();
    if (mnav.classList.contains("open")) setMenu(false);
  }
  if (!lb.hidden) {
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  }
});
