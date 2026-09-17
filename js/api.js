const API_BASE = "https://vizzano-apparel.uz/api";

// Product photography is served statically from /assets/img, not from the API.
// Ayol va erkak modellari navbatma-navbat keladi, shuningdek rang va fason
// ham almashib boradi — shunda yonma-yon turgan kartalar bir-biriga o'xshamaydi.
const STATIC_IMAGES = [
  "assets/img/parka-front.jpg",
  "assets/img/mens-parka-cheget-olive.webp",
  "assets/img/coat-ottaa-navy.webp",
  "assets/img/mens-jacket-tommot-light.webp",
  "assets/img/parka-sahayana-green.webp",
  "assets/img/mens-parka-tuygun-sand.webp",
  "assets/img/coat-jatta-white.webp",
  "assets/img/mens-jacket-tommot-black.webp",
  "assets/img/jacket-powder.jpg",
  "assets/img/mens-parka-cheget-olive-side.webp",
  "assets/img/coat-irana-navy.webp",
  "assets/img/mens-parka-tuygun-sand-side.webp",
  "assets/img/coat-tuluna-pinkbej.webp",
  "assets/img/mens-jacket-tommot-light-back.webp",
  "assets/img/coat-arktika-black.webp",
  "assets/img/mens-parka-tuygun-sand-model.webp",
  "assets/img/parka-lena-lightblue.webp",
  "assets/img/mens-jacket-tommot-black-open.webp",
  "assets/img/jacket-graphite.jpg",
  "assets/img/mens-parka-cheget-olive-back.webp",
  "assets/img/coat-gracia-navy.webp",
  "assets/img/jacket-honey-white.webp",
  "assets/img/coat-lena-grey.webp",
  "assets/img/overall-sand.jpg",
  "assets/img/coat-nadina-navy.webp",
  "assets/img/coat-tuluna-powder.webp",
  "assets/img/coat-cola-graphite.webp",
  "assets/img/parka-side.jpg",
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
