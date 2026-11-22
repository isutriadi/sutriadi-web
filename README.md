# sutriadi-web

Repositori untuk website [sutriadi.com](https://sutriadi.com), yaitu daftar aplikasi, portofolio, dan halaman promosi pemesanan aplikasi karya Sutriadi.

## Struktur branch

| Branch | Isi |
|--------|-----|
| `main` | Hanya README ini |
| `website` | Kode website (HTML, CSS, JavaScript) yang dihosting di GitHub Pages |

## Menjalankan website

Checkout branch `website`, lalu buka `index.html` di browser. Tidak ada proses build.

```bash
git checkout website
```

## Deploy

Aktifkan GitHub Pages di **Settings → Pages**, pilih branch `website` dan folder `/ (root)`. Domain `sutriadi.com` diatur lewat file `CNAME` di branch tersebut.
