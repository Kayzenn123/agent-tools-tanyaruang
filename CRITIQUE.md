# CRITIQUE — TanyaRuang — 2026-10-26

## Slop test (v3) + 3 hal paling template + yang dirombak
- **Slop test:** logo ditutup — papan hijau + karcis berlubang + marquee jadwal + stempel pink tetap terbaca sebagai "terminal belajar", bukan SaaS generik. LULUS.
- **3 hal paling template:**
  1. Header menumpuk 3 baris di mobile 390px (logo + 3 loket + tombol gerak) — mirip nav template.
  2. Kartu ringkasan masih grid kartu seragam (judul + paragraf + tombol).
  3. Marquee band 2 ("BERANGKAT BELAJAR…") nyaris identik dengan band 1 secara visual.
- **Yang dirombak (putaran 1):** judul raksasa 18vw → 13.5vw (terpotong di 390px dan 1280px); token `--muted`/`--accent` yang diam-diam ditimpa shadcn.css (label kontras 1.36:1, marquee pink) → ditegaskan di akhir stylesheet (kontras muted 8.66:1, aksen hijau pulih); stempel awal `scale(2.4)` yang bikin overflowX di semua viewport → `scale(1)` + keyframe 1.6.
- **Putaran 2:** Lighthouse mobile perf 82 → tambah `content-visibility: auto` di `.loket` bawah fold → perf 92, FPS 4x tetap 56.9, reveal IO tetap jalan (terverifikasi).
- **Keputusan berani & signature moment kelihatan dalam 5 detik?** Ya — judul raksasa + 4 tiket karcis + marquee jadwal langsung terlihat; stempel "SAH BERANGKAT" menghantam saat kuis selesai (terverifikasi via Playwright).

## Gerbang gerak (v4)
- Lapisan gerak: 5 dari 5 kategori — A zoom-in papan + pan kanan loket; B 2 marquee berlawanan + skew velocity; C variable font axis (Teachers terkonfirmasi variable, wght 400→800); D cursor spotlight; E curtain wipe antar section. F dipangkas (sesuai rencana).
- Zoom: ya. Pan horizontal: ya (translateX loket saat masuk). 2 marquee: ya.
- Font/palet/gaya ikon beda dari 7 build terakhir: ya (Teachers/Biryani/Source Code Pro; light/analogous hue 136; pixel-art — cek LOG.md).
- Kontras AA lolos: muted 8.66:1, teks 15.73:1, teks-di-aksen 5.20:1, teks-di-pop 11.00:1.
- Body font terbaca di 390px: ya (Biryani, screenshot terverifikasi).
- FPS CPU throttle 4x: 56.9–60.4 (3 run qa.js).
- Reduced-motion dites: ya — 0 animasi berjalan, layout tetap utuh.

## Gerbang v5
- Tes bandingkan (vs 3 build terakhir: TaksirLoak, GraphLihat, AntreSehat): tidak sekeluarga — hijau kertas + karcis + marquee jadwal vs pasar loak/kartu remi/papan RT.
- Tes blur: komposisi (judul raksasa + deret tiket + 2 pita marquee) masih punya identitas.
- Tes 3 detik: orang asing paham ini tempat belajar dari tiket materi + "Pilih tiketmu, berangkat sekarang".
- Keyboard-only: kuis bisa dijawab tombol 1–4; tab guru dapat fokus (cincin pink di label via JS); skip-link ada. LULUS.
- Reduced-motion: lulus (di atas).
- MODE RINGAN: toggle "Gerak: nyala/mati" + `prefers-reduced-motion` mematikan zoom/pan/marquee/spotlight; konten tetap lengkap.
- Budget (ATURAN 6): total transfer 208 KiB; JS ≤ 250KB gzip; CSS 21KB; font 49KB; LCP 2.4–2.6 dtk; CLS 0; INP tidak terukur di run ini (tidak ada interaksi berat saat load).
- Keamanan (ATURAN 9): data URL params + localStorage divalidasi (skema + versi key, rusak → reset); tanpa innerHTML untuk data soal; tanpa API key; tanpa tracker.
- Lisensi (ATURAN 10): font OFL (Teachers/Biryani/Source Code Pro via Astro Fonts); ikon SVG digambar sendiri; gambar OG buatan sendiri; data soal/materi faktual kurikulum (bukan klaim palsu).

## Budget performa + Lighthouse
- Mobile: Performance 92, Accessibility 90, Best Practices 100, SEO 100 (CHROME_PATH = Chromium Playwright; run ke-2 setelah content-visibility).
- Desktop: Performance 100, Accessibility 90, Best Practices 100, SEO 100.
- LCP 2.4–2.6 dtk, CLS 0. Aksesibilitas 90 (bukan 100 — lihat "belum terbukti").

## Skor 1-10
- Karakter: 9 — papan terminal + karcis + persona Pak Loket konsisten sampai pesan error.
- Keunikan: 8 — seed layout + referensi tiket jarang dipakai; tapi kartu ringkasan masih konvensional.
- Kerapian: 8 — rapi di 360/390/768/1280; header mobile 3 baris masih agak ramai.

## Keputusan konflik aturan
- ATURAN 0 v5 butir 5: kombinasi (mode + harmoni) light/analogous tidak dipakai 7 build terakhir — dipenuhi via pick-seed (seed 2026-11-04).
- Domain seed "antrean puskesmas" diadaptasi jadi "antrean keberangkatan belajar" (loket tiket) agar cocok dengan ide TanyaRuang — v3 ATURAN 1 ("cocokkan ide ke konstrain").
- v5 ATURAN 6 soal font self-host: Astro Fonts API men-subset + self-host otomatis saat build (file woff2 di dist/_astro/fonts/) — dipenuhi lewat jalur template.

## Dipangkas
- Lapisan F (shader/fisika): tidak dibutuhkan konsep.
- Mode "guru" berbasis LLM: di luar cakupan MVP — diganti bank materi langkah-demi-langkah lokal (4 materi, 22 langkah).
- English hanya ada di kuis (4 soal), tanpa materi guru — tidak ada materi English di materi.json; dicatat sebagai kekurangan, bukan disembunyikan.
- Video hero moment (capture.js): tidak dibuat — keterbatasan waktu; screenshot + og-image sudah ada.

## Belum terbukti / belum terverifikasi
- Lighthouse Accessibility 90 (bukan 100): audit spesifik belum dibedah — kemungkinan kontras elemen kecil / nama aksesibel. Tidak diklaim 100.
- Verifikasi live di URL GitHub Pages menyusul setelah deploy (qa.js live + HTTP 200 + hash).
