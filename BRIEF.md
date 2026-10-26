# BRIEF — TanyaRuang — 2026-10-26

## Masalah/usecase (1 kalimat + siapa yang kena)

Pelajar SMP/SMA bingung mulai belajar dari mana — materi tersebar dan kuis monoton tanpa yang menuntun langkah demi langkah; TanyaRuang jadi satu loket: pilih tiket materi, ikuti langkah guru, uji diri lewat kuis adaptif.

## Konsep visual (1 kalimat)

Seluruh situs = papan pengumuman terminal bus penuh stiker: tiap materi adalah tiket keberangkatan, papan menampilkan jadwal, dan pengunjung "berangkat belajar" dari loket.

## Hasil seed (2026-11-04, via pick-seed)

- domain: antrean puskesmas → diadaptasi: antrean keberangkatan belajar (loket tiket)
- layout: papan pengumuman penuh stiker
- referensi: tiket bus antarkota
- constraint: tanpa shadow dan gradient
- motion: A zoom-in scroll lalu pan kanan · B marquee ikon SVG + teks · C variable font axis · D cursor senter/spotlight · E curtain wipe antar section
- ikon: pixel-art, Material Symbols
- font: Teachers (display) / Biryani (body) / Source Code Pro (aksen)
- palet: light/analogous hue 136 — bg oklch(0.95 0.045 136), surface 0.90, text 0.20, muted 0.45→disetel, accent oklch(0.61 0.190 166), accent2 oklch(0.64 0.169 106), pop oklch(0.87 0.233 333)

## 3 arah desain (2 kalimat masing-masing) + arah terpilih

1. **Papan pengumuman stiker (TERPILIH):** semua konten ditempel seperti stiker miring di papan terminal; tiket materi jadi kartu karcis berlubang. Paling jauh dari default SaaS dan paling nyambung dengan seed layout + referensi tiket.
2. **Terminal bus harfiah:** jadwal keberangkatan sebagai tabel besar + peta rute. Terlalu mirip papan jadwal KRL (build lama) — ditolak.
3. **Buku catatan guru:** garis buku tulis + coretan tangan. Manis tapi gerak zoom/pan seed tidak terpakai — ditolak.

## Keputusan berani

Tanpa navbar & tanpa hero marketing — pengunjung mendarat langsung di papan keberangkatan dan disuruh "PILIH TIKETMU, BERANGKAT SEKARANG". Navigasi = 3 loket (Guru / Kuis / Ringkasan), bukan menu.

## Persona/suara

"Pak Loket" — petugas loket tiket bus yang ramah dan to the point: "Mau ke mana hari ini?", "Tiketmu sudah dicetak, jangan sampai ketinggalan bus.", error: "Waduh, tiketnya nggak ketemu. Cek lagi nomornya, ya."

## Palet (harmoni, kenapa, psikologi warna, token final, kontras AA)

- Harmoni analogous hue 136 (hijau daun → teal → limau): hijau = tenang, tumbuh, "aman buat belajar"; pop pink 333 = stempel/stiker kejutan (<5% area).
- Token final (oklch): --bg 0.95 0.045 136 · --surface 0.90 0.040 136 · --text 0.20 0.040 136 · --muted 0.38 0.030 136 (seed 0.45 digelapkan demi AA, hue tetap) · --accent 0.61 0.190 166 · --accent2 0.64 0.169 106 · --pop 0.87 0.233 333.
- Kontras: teks 0.20 di bg 0.95 ≈ 13:1 ✓; muted 0.38 di bg ≈ 5,9:1 ✓ (diukur via qa + cek manual); aksen dipakai sebagai fill dengan teks gelap, bukan teks putih.
- Tanpa shadow & tanpa gradient (batasan seed) — kedalaman dari garis tebal, rotasi stiker, dan pola lubang karcis.

## Font (display/body/aksen, alasan, id Fontsource, variable atau bukan)

- Display "Teachers" (id: teachers) — huruf guru papan tulis, hangat tapi tegas; cek variable: kalau bukan variable, gerak C diganti split-flip.
- Body "Biryani" (id: biryani) — humanis, x-height besar, terbaca di 390px.
- Aksen "Source Code Pro" (id: source-code-pro) — nomor tiket, stempel, kode soal.
- Maks 3 family, latin subset, font-display swap.

## Ikon (gaya, sumber, daftar 12+ ikon, 3+ custom)

- Gaya: pixel-art (Material Symbols sebagai basis, di-render tegas/piksel via SVG kotak).
- Daftar: tiket, loket, guru/papan tulis, kuis/tanda tanya, ringkasan/buku, jam, stempel, stiker, bus, peta/rute, bintang, ceklis, silang, panah, lonceng, koin/skor.
- Custom (digambar sendiri): karcis berlubang, stempel "SAH BERANGKAT", stiker bus sekolah.

## Gerak (kategori A-F, narasi, MODE RINGAN)

- A kamera: scroll = berjalan masuk terminal — zoom-in ke papan, lalu pan kanan menyusuri loket-loket.
- B marquee: 2 band (jadwal keberangkatan + kata penyemangat) ikon SVG + teks, kecepatan ikut velocity scroll.
- C teks: variable font axis (weight Teachers berubah saat scroll) / fallback split-flip.
- D input: cursor spotlight (mask radial mengikuti kursor, mati di touch).
- E reveal: curtain wipe antar section (loket berganti seperti tirai terminal).
- F dipangkas. Narasi pemersatu: "kamu berjalan masuk terminal, memilih tiket, naik bus belajar".
- MODE RINGAN: matikan A zoom, B marquee jadi statis, D mati; toggle "Gerak: nyala/mati" + hormati prefers-reduced-motion.

## Storyboard hero moment

| Scroll | Yang terlihat                                                         | Kamera (zoom/pan)         | Marquee           | Teks                        | Interaksi                       |
| ------ | --------------------------------------------------------------------- | ------------------------- | ----------------- | --------------------------- | ------------------------------- |
| 0%     | Papan keberangkatan penuh: judul raksasa "TANYARUANG", 4 tiket materi | zoom-in perlahan ke papan | band jadwal jalan | "PILIH TIKETMU" weight naik | klik tiket → loket guru         |
| 25%    | Loket GURU: langkah-langkah materi                                    | pan kanan ke loket 1      | band penyemangat  | langkah muncul per kartu    | klik langkah → buka isi         |
| 50%    | Loket KUIS: kartu soal + skor                                         | pan kanan ke loket 2      | —                 | soal flip 3D                | jawab → stempel BENAR/SALAH     |
| 75%    | Loket RINGKASAN: kartu ringkas + salin                                | pan kanan ke loket 3      | band jadwal lagi  | ringkasan wipe              | salin ringkasan / unduh JSON    |
| 100%   | Penutup: stempel besar "SAH BERANGKAT" + skor akhir                   | zoom-out ke seluruh papan | —                 | stempel slam                | bagikan deep-link ?mapel=&soal= |

- Pertunjukan utama: stempel "SAH BERANGKAT" menghantam layar saat kuis selesai (slam + getar ringan).
- 5 detik pertama: judul raksasa + 4 tiket materi sudah terlihat; pengunjung paham ini tempat belajar, bukan landing page SaaS.

## Konten (15+ item nyata, easter egg)

- 32 soal kuis (8/mapel: Matematika, IPA, Bahasa Indonesia, IPS) + 4 materi guru langkah-demi-langkah + 4 ringkasan. Semua faktual kurikulum Indonesia.
- Easter egg: klik stempel di footer 3x → stiker bus sekolah muncul + pesan Pak Loket.

## Teknik visual orisinal (2+)

1. Pola lubang karcis (perforation): deretan lingkaran bg di tepi kartu tiket via radial-gradient mask — murni CSS.
2. Grain/noise feTurbulence di papan + stiker miring rotasi -3°..3° acak.

## Suara

Tidak.
