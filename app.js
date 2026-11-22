/* ===== KONFIGURASI — edit bagian ini ===== */
const CONFIG = {
  whatsapp: "6280000000000",      // GANTI: nomor WhatsApp format internasional tanpa + (contoh 62812xxxxxxx)
  email: "halo@sutriadi.com"      // GANTI: alamat email penerima pesanan
};

/* Daftar aplikasi — CONTOH, ganti dengan aplikasi Anda.
   status: "live" | "dev"   |   url / repo boleh dikosongkan ("") */
const APPS = [
  { name: "Aplikasi Contoh 1", icon: "📋", category: "Sistem Informasi", status: "live",
    desc: "Deskripsi singkat aplikasi: apa masalah yang diselesaikan dan siapa penggunanya.",
    tags: ["PHP", "MySQL"], url: "", repo: "" },
  { name: "Aplikasi Contoh 2", icon: "📊", category: "Dashboard", status: "live",
    desc: "Dashboard data dengan grafik dan ekspor laporan agar keputusan lebih cepat.",
    tags: ["JavaScript", "Chart"], url: "", repo: "" },
  { name: "Aplikasi Contoh 3", icon: "🛒", category: "Web App", status: "dev",
    desc: "Aplikasi pencatatan dan transaksi sederhana untuk usaha kecil.",
    tags: ["Python", "SQLite"], url: "", repo: "" },
  { name: "Aplikasi Contoh 4", icon: "🌐", category: "Website", status: "live",
    desc: "Website profil responsif dengan halaman promosi dan formulir kontak.",
    tags: ["HTML", "CSS"], url: "", repo: "" }
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
  return el("article", { class: "app" },
    el("div", { class: "ico", "aria-hidden": "true" }, a.icon || "🧩"),
    el("span", { class: "status " + (live ? "live" : "dev") }, live ? "● Sudah live" : "● Dalam pengembangan"),
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

/* Formulir pesanan -> WhatsApp / Email */
let via = "wa";
document.querySelectorAll("#order button[type=submit]").forEach(b => b.addEventListener("click", () => via = b.dataset.via));
$("#order").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, nama = f.nama.value.trim(), pesan = f.pesan.value.trim();
  $("#err").hidden = !!(nama && pesan);
  if (!nama || !pesan) return;
  const text = `Halo, saya ${nama}.\nJenis aplikasi: ${f.jenis.value}\n\n${pesan}`;
  const url = via === "wa"
    ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`
    : `mailto:${CONFIG.email}?subject=${encodeURIComponent("Pesan aplikasi: " + f.jenis.value)}&body=${encodeURIComponent(text)}`;
  window.open(url, via === "wa" ? "_blank" : "_self", "noopener");
});
