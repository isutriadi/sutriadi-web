#!/usr/bin/env python3
"""Beri versi (timestamp) pada semua aset lokal agar browser langsung memuat yang terbaru.

Jalankan SEBELUM setiap commit/push:   python3 tools/stamp.py
- index.html : style.css, app.js, favicon, gambar lokal -> ?v=<timestamp>
- app.js     : konstanta ASSET_V (dipakai untuk gambar ikon aplikasi)
"""
import re, sys, time, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
v = time.strftime("%Y%m%d%H%M%S", time.gmtime())

# href/src ke file lokal (bukan http/https/#/mailto), dengan atau tanpa ?v=
pat = re.compile(r'((?:href|src)=")((?!https?:|//|#|mailto:)[^"?#]+\.(?:css|js|png|svg|jpe?g|webp|ico))(?:\?v=\w+)?(")')
html_path = root / "index.html"
html = html_path.read_text(encoding="utf-8")
html, n = pat.subn(lambda m: f"{m.group(1)}{m.group(2)}?v={v}{m.group(3)}", html)
html_path.write_text(html, encoding="utf-8")

js_path = root / "app.js"
js = js_path.read_text(encoding="utf-8")
js, k = re.subn(r'const ASSET_V = "\w*";', f'const ASSET_V = "{v}";', js)
if k != 1:
    sys.exit("ASSET_V tidak ditemukan di app.js")
js_path.write_text(js, encoding="utf-8")

print(f"Versi {v}: {n} referensi di index.html, ASSET_V di app.js")
