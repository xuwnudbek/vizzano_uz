# Vizzano.uz

Vizzano — O'zbekistondagi premium tikuvchilik ishlab chiqaruvchisi — uchun korporativ veb-sayt.
Namangandagi 3 ta fabrika, 700+ xodim; premium kostyumlar va qishki kiyimlar, B2B hamkorlik.

Sayt — **build step'siz statik sahifa**: toza HTML, CSS va vanilla JavaScript.
Framework, bundler yoki npm bog'liqliklari yo'q.

## Ishga tushirish

Faylni to'g'ridan-to'g'ri ochish mumkin, lekin API chaqiruvlari (CORS) uchun local server tavsiya etiladi:

```bash
python -m http.server 8000
# keyin: http://localhost:8000
```

## Tuzilishi

```
index.html        Bir sahifali sayt (Hero → About → Why Us → Collections → Contact → Find Us)
css/style.css     Dizayn tokenlari (CSS o'zgaruvchilari), tipografiya, responsive layout
js/i18n.js        EN / RU / UZ tarjimalari va til almashtirish runtime'i
js/api.js         Backend API wrapper
js/main.js        Navigatsiya, scroll-reveal, hero video, kolleksiya gridi, lightbox, forma
assets/img/       Logotip va mahsulot fotosuratlari
```

## Backend

API manzili: `https://vizzano-apparel.uz/api` (`js/api.js` ichida `API_BASE`)

| Endpoint | Metod | Vazifasi |
| --- | --- | --- |
| `/backgrounds` | GET | Hero bo'limidagi fon videosi |
| `/categories` | GET | Kolleksiya filtrlari (chip'lar) |
| `/collections` | GET | Mahsulot ro'yxati |
| `/contact-us` | POST | Aloqa formasi (`full_name`, `company_name`, `email`, `message`) |

Mahsulot fotosuratlari API'dan emas — `assets/img/` ichidan statik olinadi va
kolleksiya yozuvlariga navbat bilan biriktiriladi (`js/api.js` → `STATIC_IMAGES`).

API javob bermasa, sayt bo'sh ko'rinmaydi: `js/main.js` ichidagi `SHOWCASE`
fallback ro'yxati gridni to'ldiradi.

## Tillar

EN, RU va UZ qo'llab-quvvatlanadi. Tanlangan til brauzerda `vz-lang` kaliti
ostida saqlanadi. Matnlar HTML'da `data-i18n`, `data-i18n-html` va
`data-i18n-ph` atributlari orqali biriktirilgan — yangi matn qo'shganda
`js/i18n.js` ichidagi uchala tilga ham kalit qo'shish kerak.
