const API_BASE = "https://vizzano-apparel.uz/api";

// Product photography is served statically from /assets/img, not from the API.
// Order mixes models and colours so neighbouring grid cards stay visually distinct.
const STATIC_IMAGES = [
  "assets/img/parka-front.jpg",
  "assets/img/coat-ottaa-navy.webp",
  "assets/img/parka-sahayana-green.webp",
  "assets/img/coat-jatta-white.webp",
  "assets/img/jacket-powder.jpg",
  "assets/img/coat-irana-navy.webp",
  "assets/img/coat-tuluna-pinkbej.webp",
  "assets/img/coat-arktika-black.webp",
  "assets/img/parka-lena-lightblue.webp",
  "assets/img/jacket-graphite.jpg",
  "assets/img/coat-gracia-navy.webp",
  "assets/img/jacket-honey-white.webp",
  "assets/img/coat-lena-grey.webp",
  "assets/img/overall-sand.jpg",
  "assets/img/coat-nadina-navy.webp",
  "assets/img/coat-tuluna-powder.webp",
  "assets/img/coat-cola-graphite.webp",
  "assets/img/parka-side.jpg",
  "assets/img/coat-ottaa-navy-back.webp",
  "assets/img/parka-sahayana-green-model.webp",
  "assets/img/coat-jatta-white-back.webp",
  "assets/img/coat-irana-navy-back.webp",
  "assets/img/coat-tuluna-pinkbej-model.webp",
  "assets/img/coat-arktika-black-side.webp",
  "assets/img/parka-lena-lightblue-side.webp",
  "assets/img/coat-gracia-navy-back.webp",
  "assets/img/jacket-honey-white-back.webp",
  "assets/img/coat-lena-grey-back.webp",
  "assets/img/parka-back.jpg",
  "assets/img/coat-nadina-navy-back.webp",
  "assets/img/coat-tuluna-powder-model.webp",
  "assets/img/coat-cola-graphite-back.webp",
];

const API = {
  async get(path) {
    const res = await fetch(`${API_BASE}/${path}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
    return res.json();
  },

  background() {
    return this.get("backgrounds");
  },

  categories() {
    return this.get("categories");
  },

  collections() {
    return this.get("collections");
  },

  async sendContact({ name, company, email, message }) {
    const res = await fetch(`${API_BASE}/contact-us`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        full_name: name,
        company_name: company,
        email,
        message,
      }),
    });
    if (!res.ok) throw new Error(`POST contact-us → ${res.status}`);
    return res.json().catch(() => ({}));
  },
};
