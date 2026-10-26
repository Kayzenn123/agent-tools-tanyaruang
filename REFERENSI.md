# REFERENSI — TanyaRuang (build 2026-10-26)

Riset referensi desain untuk asisten belajar pelajar: mode guru langkah-demi-langkah,
kuis adaptif, ringkasan. Arah visual seed: layout "papan pengumuman penuh stiker",
estetika "tiket bus antarkota", font display Teachers + body Biryani, palet hijau
muda analogous (oklch hue 136, light), ikon pixel-art, tanpa shadow dan gradient.

---

## 1. Kuis adaptif — Quizizz

**URL utama:** https://www.edu.com/blog/how-quizizz-works-a-complete-guide-for-k-6-teachers-and-parents
**URL pendukung (fitur adaptif):** https://blog.truegeometry.com/api/exploreHTML/987257c36f6a4ec6036e5801883cfbd2.exploreHTML

### Yang bisa ditiru (spesifik)

1. **Diagnostik singkat dulu, baru adaptasi.** Quizizz mulai dengan kuis diagnostik
   pendek, lalu memantau jawaban + kecepatan + akurasi dan menaikkan/menurunkan
   kesulitan soal berikutnya secara dinamis. Untuk TanyaRuang: 3 soal pemanasan
   menentukan level awal, tiap jawaban salah menurunkan 1 tingkat kesulitan,
   2 benar beruntun menaikkan 1 tingkat.
2. **Tombol "Boost" saat kesulitan.** Kalau pelajar mentok, ada tombol Boost yang
   memunculkan petunjuk/hint atau soal lebih mudah — bukan langsung jawaban.
   Ini pasangan alami mode guru langkah-demi-langkah: hint = langkah berikutnya,
   bukan bocoran jawaban.
3. **Feedback instan + koreksi lembut per soal.** Jawaban benar dirayakan
   (animasi/meme singkat), jawaban salah langsung menunjukkan jawaban benar
   dengan penjelasan 1 kalimat. Ditambah progress bar dan leaderboard ringan
   (peringkat tanpa tekanan — "nilai pertumbuhan, bukan sekadar akurasi").

### Yang harus DIHINDARI

- **Jangan jadikan leaderboard sebagai pusat.** Quizizz sendiri menekankan
  "promote learning over competition" — peringkat yang terlalu menonjol bikin
  pelajar lemah cemas dan berhenti. Di TanyaRuang: skor/streak boleh ada, tapi
  jangan tampilkan peringkat publik; tonjolkan progres pribadi ("kamu naik 2
  level minggu ini").

---

## 2. Estetika tiket bus / karcis — CSS Tickets (FreeFrontend) + Dribbble

**URL utama:** https://freefrontend.com/css-tickets/
**URL pendukung:** https://dribbble.com/tags/bus-ticket
(contoh arsip visual: "1980's bus ticket in Korea" oleh Dongkyu Lim — karcis
vintage dengan tipografi padat dan nomor seri besar)

### Yang bisa ditiru (spesifik)

1. **Garis perforasi putus-putus sebagai pemisah konten.** Trik CSS-nya:
   `linear-gradient` pada pseudo-element untuk garis sobek, atau `border`
   dashed sederhana. Di TanyaRuang: kartu soal/ringkasan dipisah jadi "tiket
   utama + stub" oleh garis perforasi — stub berisi nomor soal / kode topik.
2. **Notch (potongan setengah lingkaran) di tepi kartu.** Dibuat dengan
   `clip-path: polygon()` untuk sudut terpangkas, atau lingkaran berwarna
   latar di atas kartu sebagai masker (efek "tiket disobek"). Ini memberi
   bentuk karcis yang langsung dikenali tanpa perlu gambar.
3. **Struktur data tiket yang kaku dan terbaca:** label kecil huruf kapital
   (mis. "DARI / KE / JAM / KURSI") di atas nilai besar dan tebal — persis
   boarding pass (contoh di FreeFrontend: kode bandara besar BWI → SAN +
   tabel detail di bawah). Terapkan ke kartu belajar: label kecil
   "TOPIK / LEVEL / WAKTU" di atas judul soal besar. Barcode bisa dibuat
   CSS-only dari `box-shadow` berulang pada pseudo-element — cocok untuk
   "kode kuis" di stub tiket (tanpa aset gambar, tanpa shadow/gradient).

### Yang harus DIHINDARI

- **Jangan pakai bayangan besar dan gradient untuk "realisme" tiket.**
  Banyak contoh di FreeFrontend memakai `box-shadow: 5px 5px 30px` dan
  background kuning cerah yang norak — bertentangan dengan batasan
  "tanpa shadow dan gradient". Karcis TanyaRuang harus flat: border tebal
  2px + notch + garis perforasi saja, warna dari palet hijau analogous.

---

## 3. Papan pengumuman / sticker-board — Milanote

**URL utama:** https://creadir.com/milanote/
**URL pendukung (UX review):** https://buymeacoffee.com/funficient/ux-review-productivity-collaboration-tool-milanote

### Yang bisa ditiru (spesifik)

1. **Kartu berukuran sama sebagai unit dasar.** Review UX Milanote
   menekankan "equal-sized cards as basic building blocks" — kartu seragam
   membuat papan terasa rapi meski isinya bebas. Untuk TanyaRuang: semua
   stiker/kartu topik di papan pengumuman pakai ukuran grid yang sama
   (mis. 2 varian ukuran saja), bedakan lewat warna stiker + rotasi kecil
   (-2°/+1,5°) bukan lewat ukuran acak.
2. **Satu halaman = semua konten, tanpa hierarki dokumen.** Milanote
   menaruh teks, gambar, checklist, dan link dalam satu board dengan
   breadcrumb di atas untuk navigasi antar-board. Terapkan: halaman utama
   TanyaRuang adalah satu papan (topik sebagai stiker), klik stiker masuk
   ke "board" materi/kuis dengan breadcrumb "Papan › Matematika › Kuis 3".
3. **Desain bersih dan minim gangguan.** Milanote dipuji karena "clean,
   minimalist design that reduces distractions" — papan boleh ramai stiker,
   tapi chrome UI (header, tombol) harus tenang dan sedikit. Stiker yang
   ramai + UI yang kalem = papan terbaca, bukan pasar malam.

### Yang harus DIHINDARI

- **Jangan tiru infinite canvas bebas (drag bebas ke mana saja).**
  Milanote kuat di desktop tapi "mobile experience is more limited...
  full drag-and-drop functionality is best suited for larger screens".
  TanyaRuang dipakai pelajar di HP: pakai grid responsif yang tersusun
  otomatis (masonry/grid rapi), bukan canvas bebas yang berantakan dan
  sulit dipakai di layar 390px. Rotasi stiker boleh, posisi acak jangan.

---

## Ringkasan silang untuk build

| Elemen TanyaRuang                                                    | Sumber tiruan                             |
| -------------------------------------------------------------------- | ----------------------------------------- |
| Kuis adaptif (diagnostik → naik/turun level → Boost hint)            | Quizizz (#1)                              |
| Kartu soal/ringkasan bentuk karcis (notch + perforasi + stub kode)   | CSS Tickets / Dribbble (#2)               |
| Halaman utama papan stiker (kartu seragam, rotasi kecil, breadcrumb) | Milanote (#3)                             |
| Batasan keras: flat, tanpa shadow/gradient                           | Dilanggar contoh tiket (#2) — jangan ikut |

Riset selesai: 2026-10-26 08:0x WIB. Hanya file ini yang ditulis.
