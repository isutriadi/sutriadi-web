/* ===== KONFIGURASI — edit bagian ini ===== */
const CONFIG = {
  whatsapp: "628114550260"        // nomor WhatsApp pemesanan, format internasional tanpa +
};

/* Daftar aplikasi.
   status: "live" | "dev" | "" (kosong = lencana status disembunyikan)   |   url / repo boleh dikosongkan ("") */
const APPS = [
  { name: "SONIK", icon: "📨", category: "Pemerintahan", status: "live",
    desc: "Aplikasi Disposisi Elektronik. Digunakan di Pemerintah Kota Kotamobagu.",
    tags: ["Disposisi Elektronik", "Pemkot Kotamobagu"], url: "", repo: "" },
  { name: "AKUOI", icon: "🔑", category: "Pemerintahan", status: "live",
    desc: "Akun Kotamobagu Terintegrasi. Digunakan di Pemerintah Kota Kotamobagu.",
    tags: ["Akun Terintegrasi", "Pemkot Kotamobagu"], url: "", repo: "" },
  { name: "Jago Basisdata", icon: "🗄️", category: "Android", status: "",
    desc: "Klien SQL untuk Android.",
    tags: ["Android", "SQL"], url: "", repo: "" },
  { name: "Jago Kode", icon: "📝", category: "Android", status: "",
    desc: "Editor teks dan kode untuk Android.",
    tags: ["Android", "Editor"], url: "", repo: "" }
];
/* ========================================== */

const $ = (s, el = document) => el.querySelector(s);
const grid = $("#grid"), filters = $("#filters"), empty = $("#empty");
let active = "Semua";

function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) k === "class" ? n.className = v : n.setAttribute(k, v);
  kids.flat().forEach(k => n.append(k));
  return n;
}

function card(a) {
  const links = el("div", { class: "links" });
  if (a.url) links.append(el("a", { href: a.url, target: "_blank", rel: "noopener" }, "Buka →"));
  if (a.repo) links.append(el("a", { href: a.repo, target: "_blank", rel: "noopener" }, "Kode"));
  const live = a.status === "live";
  const badge = a.status ? el("span", { class: "status " + (live ? "live" : "dev") }, live ? "● Sudah live" : "● Dalam pengembangan") : "";
  return el("article", { class: "app" },
    el("div", { class: "ico", "aria-hidden": "true" }, a.icon || "🧩"),
    badge,
    el("h3", {}, a.name),
    el("p", {}, a.desc),
    el("div", { class: "tags" }, a.tags.map(t => el("span", { class: "tag" }, t))),
    links
  );
}

function render() {
  grid.replaceChildren();
  const list = APPS.filter(a => active === "Semua" || a.category === active);
  list.forEach(a => grid.append(card(a)));
  empty.hidden = list.length > 0;
  filters.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.cat === active)));
}

["Semua", ...new Set(APPS.map(a => a.category))].forEach(cat => {
  const b = el("button", { class: "chip", type: "button", "data-cat": cat, "aria-pressed": "false" }, cat);
  b.addEventListener("click", () => { active = cat; render(); });
  filters.append(b);
});
render();

$("#stat-apps").textContent = APPS.length;
$("#stat-live").textContent = APPS.filter(a => a.status === "live").length;
$("#year").textContent = new Date().getFullYear();

/* Menu mobile */
const toggle = $(".nav-toggle"), menu = $("#menu");
toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", String(menu.classList.toggle("open"))));
menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); } });

/* Formulir pesanan -> WhatsApp */
$("#order").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, nama = f.nama.value.trim(), pesan = f.pesan.value.trim();
  $("#err").hidden = !!(nama && pesan);
  if (!nama || !pesan) return;
  const text = `Halo, saya ${nama}.\nJenis aplikasi: ${f.jenis.value}\n\n${pesan}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});
