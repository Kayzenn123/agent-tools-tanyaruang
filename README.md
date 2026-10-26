# TanyaRuang — Ruang Belajar Pelajar Indonesia

Papan keberangkatan belajar: pilih tiket materi, ikuti langkah guru, uji diri lewat kuis adaptif. Tanpa akun, tanpa server — semua jalan di browser.

**Live:** https://kayzenn123.github.io/agent-tools-tanyaruang/

## Fitur

- **Loket Guru** — 4 materi langkah-demi-langkah (Pecahan & Persen, Hukum Newton, Teks Eksposisi, Interaksi Sosial), 22 langkah + contoh soal. Klik tiket materi → loket guru terbuka di materi itu.
- **Loket Kuis** — kuis adaptif 5 soal per sesi, 32 soal (Matematika, IPA, Bahasa Indonesia, IPS, English). Benar beruntun → naik level; salah → turun level. Tombol Boost memberi hint (langkah guru, bukan bocoran jawaban). Feedback instan + pembahasan tiap soal. Skor terbaik per mapel tersimpan di `localStorage` (`tanyaruang-v1`).
- **Loket Ringkasan** — 4 ringkasan materi + tombol salin.
- **Deep-link** — `?mapel=matematika` langsung mulai sesi mapel itu; `?mapel=&skor=` untuk berbagi hasil.
- **Stempel "SAH BERANGKAT"** menghantam layar saat sesi selesai; easter egg: klik stempel footer 3x.
- **Aksesibilitas** — skip-link, keyboard 1–4 untuk menjawab, `aria-live` untuk feedback, tombol jeda marquee, toggle Gerak nyala/mati + `prefers-reduced-motion`.

## Tech

Astro 7 + Tailwind CSS v4 (template AstroWind) · TypeScript · vanilla JS (tanpa GSAP/CDN — rAF + IntersectionObserver) · font Teachers / Biryani / Source Code Pro (Astro Fonts API, self-host saat build).

## Skor

| | Mobile | Desktop |
| --- | --- | --- |
| Performance | 92 | 100 |
| Accessibility | 90 | 90 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

- `tools/qa.js`: exit 0 — tanpa overflow di 360/390/768/1280, 0 tap-target < 44px, 0 console error, reduced-motion 0 animasi berjalan.
- FPS CPU throttle 4x: 56.9–60.4.
- Kontras AA: teks 15.73:1, muted 8.66:1, teks-di-aksen 5.20:1.
- Total transfer: 208 KiB · LCP 2.4–2.6 dtk · CLS 0.

## Cara jalanin

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output ke dist/
npm run check    # astro check + ESLint + Prettier
```

Endpoint: `GET /api/health` → `{ "ok": true, "app": "tanyaruang", "soal": 32, "materi": 4 }`.

## Kredit

- Font: Teachers, Biryani, Source Code Pro (OFL, via Google Fonts / Astro Fonts API).
- Ikon SVG digambar sendiri; gambar OG buatan sendiri.
- Soal & materi: kurikulum Indonesia (Matematika/IPA/Bahasa Indonesia/IPS/English SMP–SMA).
- Konsep visual: papan pengumuman terminal + tiket bus antarkota (seed 2026-11-04, Daily Build Standard v2–v5).

## Catatan

- English hanya tersedia di kuis (4 soal), belum ada materi gurunya.
- Skor Lighthouse diukur lokal dengan Chromium Playwright (`CHROME_PATH`); aksesibilitas 90 — lihat `CRITIQUE.md`.
