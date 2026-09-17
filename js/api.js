const API_BASE = "https://vizzano-apparel.uz/api";

// Product photography is served statically from /assets/img, not from the API.
const STATIC_IMAGES = [
  "assets/img/parka-front.jpg",
  "assets/img/jacket-powder.jpg",
  "assets/img/jacket-graphite.jpg",
  "assets/img/overall-sand.jpg",
  "assets/img/parka-side.jpg",
  "assets/img/parka-back.jpg",
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
