'use strict';
/**
 * TanyaRuang — Mesin Kuis Adaptif (agen UI-2)
 * ---------------------------------------------------------------
 * Vanilla JS, tanpa fetch. Data soal di-embed langsung sebagai
 * konstanta SOAL (32 soal) supaya build statis Astro tidak kena
 * masalah path base.
 *
 * Kontrak DOM (wadah disiapkan agen UI-1; kalau belum ada, file
 * ini membuatnya sendiri):
 *   #kuis-app        — wadah utama kuis (dibuat bila belum ada)
 *   #stempel-akhir   — stempel besar di akhir sesi (dibuat bila
 *                      belum ada; diberi class "tercap")
 *   #skor-akhir      — teks skor akhir "X/5"
 *   #stempel-rahasia — elemen footer (klik 3x = easter egg)
 *   #stiker-bus      — stiker easter egg (dibuat bila belum ada)
 *   [data-salin] + .ringkasan-teks — tombol salin ringkasan
 *
 * Pendaftaran di index.astro (oleh agen UI-1 / pemilik file):
 *   <script src="/scripts/kuis.js" defer></script>
 *   — letakkan sebelum </body>. File ini jalan sebagai script
 *   biasa (bukan module), jadi path absolut /scripts/kuis.js
 *   dipakai karena Astro menyalin src/scripts ke dist? TIDAK.
 *   PENDAFTARAN YANG BENAR: salin file ini ke public/scripts/
 *   ATAU import dari Astro:
 *     <script>import '../scripts/kuis.js';</script>
 *   Lihat catatan pendaftaran di akhir laporan agen UI-2.
 *
 * Semua teks soal dirender via textContent / createElement —
 * TIDAK PERNAH innerHTML untuk data soal.
 */

const SOAL = [
  {
    id: 'mat-01',
    jawaban: 2,
    level: 'mudah',
    mapel: 'Matematika',
    pembahasan: '7 × 8 = 56, karena 7 dijumlahkan 8 kali sama dengan 56.',
    pertanyaan: 'Berapakah hasil dari 7 × 8?',
    pilihan: ['48', '54', '56', '64'],
    topik: 'Perkalian',
  },
  {
    id: 'mat-02',
    jawaban: 1,
    level: 'mudah',
    mapel: 'Matematika',
    pembahasan: 'Penyebutnya sudah sama, jadi jumlahkan pembilangnya: 3 + 1 = 4, sehingga 4/4 = 1.',
    pertanyaan: 'Berapakah hasil dari 3/4 + 1/4?',
    pilihan: ['1/2', '1', '1 1/4', '2'],
    topik: 'Pecahan',
  },
  {
    id: 'mat-03',
    jawaban: 2,
    level: 'mudah',
    mapel: 'Matematika',
    pembahasan: '15% dari 200 = 15/100 × 200 = 30.',
    pertanyaan: 'Berapakah 15% dari 200?',
    pilihan: ['15', '20', '30', '45'],
    topik: 'Persen',
  },
  {
    id: 'mat-04',
    jawaban: 2,
    level: 'sedang',
    mapel: 'Matematika',
    pembahasan: '2/3 × 90 = 180/3 = 60.',
    pertanyaan: 'Berapakah 2/3 dari 90?',
    pilihan: ['30', '45', '60', '75'],
    topik: 'Pecahan',
  },
  {
    id: 'mat-05',
    jawaban: 2,
    level: 'sedang',
    mapel: 'Matematika',
    pembahasan: 'x = 15 − 7 = 8.',
    pertanyaan: 'Jika x + 7 = 15, berapakah nilai x?',
    pilihan: ['6', '7', '8', '9'],
    topik: 'Aljabar',
  },
  {
    id: 'mat-06',
    jawaban: 2,
    level: 'sedang',
    mapel: 'Matematika',
    pembahasan: 'Luas persegi panjang = panjang × lebar = 12 × 5 = 60 cm².',
    pertanyaan: 'Sebuah persegi panjang berukuran panjang 12 cm dan lebar 5 cm. Berapakah luasnya?',
    pilihan: ['17 cm²', '34 cm²', '60 cm²', '120 cm²'],
    topik: 'Bangun Datar',
  },
  {
    id: 'mat-07',
    jawaban: 2,
    level: 'sulit',
    mapel: 'Matematika',
    pembahasan: '√144 = 12 dan 3² = 9, jadi 12 + 9 = 21.',
    pertanyaan: 'Berapakah hasil dari √144 + 3²?',
    pilihan: ['15', '18', '21', '24'],
    topik: 'Akar dan Pangkat',
  },
  {
    id: 'mat-08',
    jawaban: 1,
    level: 'sulit',
    mapel: 'Matematika',
    pembahasan: 'Diskon 25% dari Rp80.000 adalah Rp20.000, jadi harga bayar = Rp80.000 − Rp20.000 = Rp60.000.',
    pertanyaan: 'Sebuah tas seharga Rp80.000 dijual dengan diskon 25%. Berapa harga yang harus dibayar pembeli?',
    pilihan: ['Rp55.000', 'Rp60.000', 'Rp65.000', 'Rp70.000'],
    topik: 'Diskon',
  },
  {
    id: 'ipa-01',
    jawaban: 1,
    level: 'mudah',
    mapel: 'IPA',
    pembahasan: 'Satuan gaya dalam SI adalah Newton (N), diambil dari nama Isaac Newton.',
    pertanyaan: 'Apa satuan SI untuk gaya?',
    pilihan: ['Joule', 'Newton', 'Watt', 'Pascal'],
    topik: 'Gaya',
  },
  {
    id: 'ipa-02',
    jawaban: 1,
    level: 'mudah',
    mapel: 'IPA',
    pembahasan:
      'Dalam fotosintesis, tumbuhan menyerap karbon dioksida dan menghasilkan oksigen sebagai produk samping.',
    pertanyaan: 'Gas apakah yang dihasilkan tumbuhan selama proses fotosintesis?',
    pilihan: ['Karbon dioksida', 'Oksigen', 'Nitrogen', 'Hidrogen'],
    topik: 'Fotosintesis',
  },
  {
    id: 'ipa-03',
    jawaban: 2,
    level: 'mudah',
    mapel: 'IPA',
    pembahasan: 'Jantung memompa darah melalui pembuluh darah ke seluruh tubuh.',
    pertanyaan: 'Organ tubuh manusia manakah yang berfungsi memompa darah ke seluruh tubuh?',
    pilihan: ['Hati', 'Paru-paru', 'Jantung', 'Ginjal'],
    topik: 'Sistem Organ Tubuh',
  },
  {
    id: 'ipa-04',
    jawaban: 0,
    level: 'sedang',
    mapel: 'IPA',
    pembahasan: 'Itu adalah Hukum I Newton, yang dikenal sebagai hukum kelembaman (inersia).',
    pertanyaan:
      'Benda yang diam akan tetap diam dan benda yang bergerak akan tetap bergerak lurus beraturan jika tidak ada gaya luar yang bekerja. Pernyataan ini adalah bunyi...',
    pilihan: ['Hukum I Newton', 'Hukum II Newton', 'Hukum III Newton', 'Hukum Archimedes'],
    topik: 'Hukum Newton',
  },
  {
    id: 'ipa-05',
    jawaban: 1,
    level: 'sedang',
    mapel: 'IPA',
    pembahasan: 'Energi kinetik = ½ × m × v² = ½ × 2 × 3² = 9 joule.',
    pertanyaan: 'Sebuah benda bermassa 2 kg bergerak dengan kecepatan 3 m/s. Berapakah energi kinetiknya?',
    pilihan: ['6 joule', '9 joule', '12 joule', '18 joule'],
    topik: 'Energi',
  },
  {
    id: 'ipa-06',
    jawaban: 2,
    level: 'sedang',
    mapel: 'IPA',
    pembahasan: 'Titik didih air murni pada tekanan 1 atm adalah 100°C.',
    pertanyaan: 'Pada tekanan 1 atmosfer, air murni mendidih pada suhu...',
    pilihan: ['80°C', '90°C', '100°C', '120°C'],
    topik: 'Kalor',
  },
  {
    id: 'ipa-07',
    jawaban: 1,
    level: 'sulit',
    mapel: 'IPA',
    pembahasan: 'Menurut Hukum II Newton, a = F/m = 20/4 = 5 m/s².',
    pertanyaan: 'Sebuah benda bermassa 4 kg didorong dengan gaya 20 N. Berapakah percepatan benda tersebut?',
    pilihan: ['4 m/s²', '5 m/s²', '8 m/s²', '20 m/s²'],
    topik: 'Hukum Newton',
  },
  {
    id: 'ipa-08',
    jawaban: 2,
    level: 'sulit',
    mapel: 'IPA',
    pembahasan: 'Hukum III Newton menyatakan setiap aksi menimbulkan reaksi yang sama besar dan berlawanan arah.',
    pertanyaan:
      'Saat mendayung perahu, dayung mendorong air ke belakang dan air mendorong perahu ke depan. Peristiwa ini mencontohkan...',
    pilihan: ['Hukum I Newton', 'Hukum II Newton', 'Hukum III Newton', 'Hukum Hooke'],
    topik: 'Hukum Newton',
  },
  {
    id: 'ind-01',
    jawaban: 1,
    level: 'mudah',
    mapel: 'Bahasa Indonesia',
    pembahasan: 'Sinonim adalah kata yang memiliki makna sama atau mirip; sinonim "bahagia" adalah "gembira".',
    pertanyaan: 'Apa sinonim dari kata "bahagia"?',
    pilihan: ['Sedih', 'Gembira', 'Marah', 'Takut'],
    topik: 'Sinonim',
  },
  {
    id: 'ind-02',
    jawaban: 1,
    level: 'mudah',
    mapel: 'Bahasa Indonesia',
    pembahasan: 'Kalimat tanya digunakan untuk menanyakan sesuatu dan diakhiri tanda tanya.',
    pertanyaan: 'Kalimat yang diakhiri tanda tanya (?) disebut kalimat...',
    pilihan: ['Berita', 'Tanya', 'Perintah', 'Seru'],
    topik: 'Jenis Kalimat',
  },
  {
    id: 'ind-03',
    jawaban: 1,
    level: 'mudah',
    mapel: 'Bahasa Indonesia',
    pembahasan: 'Antonim adalah lawan kata; lawan dari "rajin" adalah "malas".',
    pertanyaan: 'Apa antonim dari kata "rajin"?',
    pilihan: ['Pintar', 'Malas', 'Tekun', 'Giat'],
    topik: 'Antonim',
  },
  {
    id: 'ind-04',
    jawaban: 2,
    level: 'sedang',
    mapel: 'Bahasa Indonesia',
    pembahasan: 'Menurut KBBI, bentuk bakunya adalah "apotek", tempat menjual obat.',
    pertanyaan: 'Manakah penulisan kata baku yang benar?',
    pilihan: ['Apotik', 'Apoteik', 'Apotek', 'Apotik'],
    topik: 'Kata Baku',
  },
  {
    id: 'ind-05',
    jawaban: 1,
    level: 'sedang',
    mapel: 'Bahasa Indonesia',
    pembahasan: 'Awalan me- bertemu huruf s luluh menjadi ny-, sehingga "sapu" menjadi "menyapu".',
    pertanyaan: 'Kata "sapu" mendapat awalan me-. Bentuk yang benar adalah...',
    pilihan: ['Mensapu', 'Menyapu', 'Mesapu', 'Menysapu'],
    topik: 'Imbuhan',
  },
  {
    id: 'ind-06',
    jawaban: 1,
    level: 'sedang',
    mapel: 'Bahasa Indonesia',
    pembahasan:
      'Teks eksposisi memaparkan gagasan dan meyakinkan pembaca dengan argumen serta fakta yang dapat dipertanggungjawabkan.',
    pertanyaan: 'Apa tujuan utama teks eksposisi?',
    pilihan: [
      'Menghibur pembaca',
      'Menjelaskan dan meyakinkan pembaca dengan argumen dan fakta',
      'Menceritakan sebuah kisah',
      'Mendeskripsikan suatu tempat',
    ],
    topik: 'Teks Eksposisi',
  },
  {
    id: 'ind-07',
    jawaban: 1,
    level: 'sulit',
    mapel: 'Bahasa Indonesia',
    pembahasan:
      'Simile membandingkan dua hal dengan kata pembanding seperti "se-" atau "bagai"; di sini hati dibandingkan dengan batu.',
    pertanyaan: 'Kalimat "Hatinya sekeras batu" menggunakan majas...',
    pilihan: ['Metafora', 'Simile', 'Personifikasi', 'Hiperbola'],
    topik: 'Majas',
  },
  {
    id: 'ind-08',
    jawaban: 1,
    level: 'sulit',
    mapel: 'Bahasa Indonesia',
    pembahasan:
      'Pilihan lain tidak baku: "para siswa-siswa" mubazir, "karena... maka" tidak boleh dipakai bersamaan, dan "oleh saya" pada kalimat pasif kurang efektif.',
    pertanyaan: 'Manakah kalimat berikut yang baku dan efektif?',
    pilihan: [
      'Para siswa-siswa pergi ke sekolah.',
      'Dia mengucapkan terima kasih kepada ibu guru.',
      'Karena hujan deras, maka pertandingan ditunda.',
      'Buku itu dibaca oleh saya kemarin pagi hari.',
    ],
    topik: 'Kalimat Efektif',
  },
  {
    id: 'ips-01',
    jawaban: 1,
    level: 'mudah',
    mapel: 'IPS',
    pembahasan: 'Jakarta adalah ibu kota negara Indonesia, tempat pusat pemerintahan berada.',
    pertanyaan: 'Apa ibu kota negara Indonesia?',
    pilihan: ['Bandung', 'Jakarta', 'Surabaya', 'Medan'],
    topik: 'Geografi Indonesia',
  },
  {
    id: 'ips-02',
    jawaban: 1,
    level: 'mudah',
    mapel: 'IPS',
    pembahasan: 'Mata uang resmi Indonesia adalah Rupiah (Rp).',
    pertanyaan: 'Apa mata uang resmi negara Indonesia?',
    pilihan: ['Ringgit', 'Rupiah', 'Baht', 'Peso'],
    topik: 'Ekonomi',
  },
  {
    id: 'ips-03',
    jawaban: 1,
    level: 'sedang',
    mapel: 'IPS',
    pembahasan: 'Sila pertama Pancasila adalah "Ketuhanan Yang Maha Esa".',
    pertanyaan: 'Apa bunyi sila pertama Pancasila?',
    pilihan: [
      'Kemanusiaan yang adil dan beradab',
      'Ketuhanan Yang Maha Esa',
      'Persatuan Indonesia',
      'Keadilan sosial bagi seluruh rakyat Indonesia',
    ],
    topik: 'Pancasila',
  },
  {
    id: 'ips-04',
    jawaban: 2,
    level: 'sedang',
    mapel: 'IPS',
    pembahasan: 'ASEAN didirikan pada 8 Agustus 1967 di Bangkok, Thailand, melalui Deklarasi Bangkok.',
    pertanyaan: 'ASEAN (Perhimpunan Bangsa-Bangsa Asia Tenggara) didirikan pada tahun...',
    pilihan: ['1945', '1955', '1967', '1975'],
    topik: 'ASEAN',
  },
  {
    id: 'eng-01',
    jawaban: 1,
    level: 'mudah',
    mapel: 'English',
    pembahasan: 'Untuk subjek orang ketiga tunggal (she) pada simple present tense, kata kerja ditambah -es: "goes".',
    pertanyaan: 'Choose the correct sentence: "She ___ to school every day."',
    pilihan: ['go', 'goes', 'going', 'gone'],
    topik: 'Simple Present Tense',
  },
  {
    id: 'eng-02',
    jawaban: 1,
    level: 'mudah',
    mapel: 'English',
    pembahasan: '"Eat" adalah kata kerja tidak beraturan; bentuk past tense-nya adalah "ate".',
    pertanyaan: 'What is the past tense of the verb "eat"?',
    pilihan: ['eated', 'ate', 'eaten', 'eating'],
    topik: 'Past Tense',
  },
  {
    id: 'eng-03',
    jawaban: 0,
    level: 'sedang',
    mapel: 'English',
    pembahasan: 'Lawan kata "expensive" (mahal) adalah "cheap" (murah).',
    pertanyaan: 'What is the opposite of the word "expensive"?',
    pilihan: ['cheap', 'costly', 'pricey', 'dear'],
    topik: 'Vocabulary',
  },
  {
    id: 'eng-04',
    jawaban: 2,
    level: 'sulit',
    mapel: 'English',
    pembahasan:
      'Dalam conditional type 2 untuk pengandaian, kata kerja "be" memakai "were" untuk semua subjek, termasuk "I".',
    pertanyaan: 'Choose the correct sentence: "If I ___ rich, I would travel the world."',
    pilihan: ['am', 'was', 'were', 'be'],
    topik: 'Conditional Sentence',
  },
];

/* ------------------------------------------------------------------ */
/* Konstanta & util                                                    */
/* ------------------------------------------------------------------ */

const LEVEL_ORDER = ['mudah', 'sedang', 'sulit'];
const JUMLAH_SOAL_SESI = 5;
const STORAGE_KEY = 'tanyaruang-v1';
const PESAN_LOKET = {
  sambut: 'Mau ke mana hari ini? Pilih tiketmu, berangkat belajar.',
  soalHabis: 'Waduh, soal lagi habis. Coba muat ulang halamannya.',
  benar: 'Betul! Tiketmu sah, lanjut ke pemberhentian berikutnya.',
  salah: 'Yah, belum tepat. Baca pembahasannya, lalu coba lagi di soal berikut.',
  boostKosong: 'Ingat rumusnya, coba hitung pelan-pelan.',
  bus: 'Bus sekolah berangkat! Tiketmu sudah dicetak, jangan sampai ketinggalan bus.',
  skorTeman: 'Temanmu dapat skor {skor}/5. Coba kalahkan!',
};

const MAPEL = Array.from(new Set(SOAL.map((s) => s.mapel)));

function acak(arr) {
  const salin = arr.slice();
  for (let i = salin.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = salin[i];
    salin[i] = salin[j];
    salin[j] = tmp;
  }
  return salin;
}

/** Helper kecil pembuat elemen — tanpa innerHTML. */
function h(tag, opts, ...anak) {
  const el = document.createElement(tag);
  if (opts) {
    if (opts.id) el.id = opts.id;
    if (opts.cls) el.className = opts.cls;
    if (opts.text !== undefined && opts.text !== null) el.textContent = opts.text;
    if (opts.type) el.type = opts.type;
    if (opts.aria) {
      for (const [k, v] of Object.entries(opts.aria)) el.setAttribute('aria-' + k, v);
    }
    if (opts.attrs) {
      for (const [k, v] of Object.entries(opts.attrs)) el.setAttribute(k, v);
    }
    if (opts.dataset) {
      for (const [k, v] of Object.entries(opts.dataset)) el.dataset[k] = v;
    }
  }
  for (const a of anak) {
    if (a === null || a === undefined) continue;
    el.append(a);
  }
  return el;
}

/* ------------------------------------------------------------------ */
/* Penyimpanan lokal (localStorage, tervalidasi)                        */
/* ------------------------------------------------------------------ */

function muatProgres() {
  const kosong = { terbaik: {}, sesi: 0 };
  try {
    const mentah = window.localStorage.getItem(STORAGE_KEY);
    if (!mentah) return kosong;
    const data = JSON.parse(mentah);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('skema rusak');
    const terbaik = {};
    if (data.terbaik && typeof data.terbaik === 'object' && !Array.isArray(data.terbaik)) {
      for (const [k, v] of Object.entries(data.terbaik)) {
        if (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= JUMLAH_SOAL_SESI) {
          terbaik[k] = Math.floor(v);
        }
      }
    }
    const sesi =
      typeof data.sesi === 'number' && Number.isFinite(data.sesi) && data.sesi >= 0 ? Math.floor(data.sesi) : 0;
    return { terbaik, sesi };
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* abaikan */
    }
    return kosong;
  }
}

function simpanProgres(progres) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progres));
  } catch {
    /* penyimpanan penuh / privat: kuis tetap jalan */
  }
}

/* ------------------------------------------------------------------ */
/* Salin teks (clipboard + fallback textarea)                           */
/* ------------------------------------------------------------------ */

function salinTeks(teks) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(teks).then(
      () => true,
      () => salinFallback(teks)
    );
  }
  return Promise.resolve(salinFallback(teks));
}

function salinFallback(teks) {
  try {
    const area = document.createElement('textarea');
    area.value = teks;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-9999px';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** Ubah label tombol jadi "Tersalin!" selama 2 detik, lalu kembalikan. */
function tandaiTersalin(tombol, labelAsal) {
  tombol.textContent = 'Tersalin!';
  tombol.disabled = true;
  window.setTimeout(() => {
    tombol.textContent = labelAsal;
    tombol.disabled = false;
  }, 2000);
}

/* ------------------------------------------------------------------ */
/* State sesi                                                          */
/* ------------------------------------------------------------------ */

const state = {
  mapel: null, // mapel sesi berjalan
  soalDipakai: [], // id soal yang sudah ditampilkan sesi ini
  soalAktif: null, // soal yang sedang dijawab
  nomor: 0, // 1..5
  skor: 0,
  level: 'mudah', // level soal berikutnya
  rentetanBenar: 0, // jumlah jawaban benar beruntun
  sudahDijawab: false,
  boostDipakai: false,
  skorTeman: null, // dari ?skor= — hanya ditampilkan
};

let progres = muatProgres();

/* ------------------------------------------------------------------ */
/* Wadah & gaya                                                        */
/* ------------------------------------------------------------------ */

function dapatkanWadah() {
  let wadah = document.getElementById('kuis-app');
  if (wadah) return wadah;
  wadah = h('section', { id: 'kuis-app', cls: 'kuis-app', attrs: { 'aria-label': 'Kuis TanyaRuang' } });
  const utama = document.querySelector('main') || document.body;
  utama.appendChild(wadah);
  return wadah;
}

function suntikGaya() {
  if (document.getElementById('kuis-gaya')) return;
  const css = [
    '.kuis-app{max-width:44rem;margin:0 auto;padding:1rem}',
    '.kuis-judul{font-size:1.5rem;font-weight:800;margin:0 0 .25rem}',
    '.kuis-loket{margin:0 0 1rem}',
    '.kuis-tiket{display:grid;gap:.75rem;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr))}',
    '.kuis-tombol{font:inherit;cursor:pointer;border:3px solid #1e3a24;background:#fff;color:#1e3a24;padding:.75rem 1rem;border-radius:.75rem;text-align:left}',
    '.kuis-tombol:hover,.kuis-tombol:focus-visible{outline:3px solid #0e9f7a;outline-offset:2px}',
    '.kuis-tombol:disabled{opacity:.55;cursor:default}',
    '.kuis-tombol .kuis-skor-terbaik{display:block;font-size:.85rem;margin-top:.25rem}',
    '.kuis-kartu{border:3px solid #1e3a24;border-radius:1rem;background:#fff;padding:1.25rem}',
    '.kuis-meta{display:flex;justify-content:space-between;gap:1rem;font-size:.9rem;margin-bottom:.5rem}',
    '.kuis-progress{height:.75rem;border:2px solid #1e3a24;border-radius:999px;overflow:hidden;margin-bottom:1rem}',
    '.kuis-progress-isi{height:100%;background:#0e9f7a;width:0%}',
    '.kuis-pertanyaan{font-size:1.15rem;font-weight:700;margin:.5rem 0 1rem}',
    '.kuis-pilihan{display:grid;gap:.5rem}',
    '.kuis-pilihan .kuis-tombol{display:flex;gap:.75rem;align-items:baseline}',
    '.kuis-pilihan .kuis-kunci{font-weight:800;border:2px solid #1e3a24;border-radius:.375rem;padding:0 .4rem;font-size:.85rem}',
    '.kuis-pilihan .kuis-tombol.benar{border-color:#0e7a4d;background:#dcf5e5}',
    '.kuis-pilihan .kuis-tombol.salah{border-color:#c22727;background:#fde3e3}',
    '.kuis-stempel{display:inline-block;font-weight:800;border:4px solid currentColor;border-radius:.5rem;padding:.25rem .75rem;transform:rotate(-4deg);margin:.75rem 0;text-transform:uppercase;letter-spacing:.05em}',
    '.kuis-stempel.benar{color:#0e7a4d}',
    '.kuis-stempel.salah{color:#c22727}',
    '.kuis-stempel.tercap{font-size:2rem;border-width:6px;color:#c22727}',
    '.kuis-pembahasan{margin:.5rem 0}',
    '.kuis-hint{margin:.5rem 0;padding:.5rem .75rem;border:2px dashed #0e9f7a;border-radius:.5rem}',
    '.kuis-aksi{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem}',
    '.kuis-hasil{text-align:center}',
    '.kuis-hasil .kuis-skor-besar{font-size:2.5rem;font-weight:800;margin:.5rem 0}',
    '.kuis-catatan{font-size:.9rem;margin-top:1rem}',
    '#stiker-bus{display:inline-block;border:3px dashed #0e9f7a;border-radius:.75rem;padding:.5rem 1rem;font-weight:800;margin-top:1rem}',
  ].join('\n');
  const gaya = h('style', { id: 'kuis-gaya', text: css });
  document.head.appendChild(gaya);
}

function bersihkanWadah(wadah) {
  while (wadah.firstChild) wadah.removeChild(wadah.firstChild);
}

/* ------------------------------------------------------------------ */
/* Logika adaptif                                                      */
/* ------------------------------------------------------------------ */

/** Pilih soal berikutnya sesuai level; fallback ke level terdekat,
 *  lalu (bila mapel kehabisan soal unik) pakai ulang soal lama. */
function pilihSoalBerikutnya() {
  const pool = SOAL.filter((s) => s.mapel === state.mapel);
  const belum = pool.filter((s) => !state.soalDipakai.includes(s.id));
  const sumber = belum.length > 0 ? belum : pool.filter((s) => s.id !== (state.soalAktif && state.soalAktif.id));
  if (sumber.length === 0) return null;
  const jarak = (lvl) => Math.abs(LEVEL_ORDER.indexOf(lvl) - LEVEL_ORDER.indexOf(state.level));
  const urut = sumber.slice().sort((a, b) => jarak(a.level) - jarak(b.level));
  const levelTerbaik = jarak(urut[0].level);
  const kandidat = urut.filter((s) => jarak(s.level) === levelTerbaik);
  return acak(kandidat)[0];
}

/** Sesuaikan level setelah satu jawaban. */
function sesuaikanLevel(benar) {
  const idx = LEVEL_ORDER.indexOf(state.level);
  if (benar) {
    state.rentetanBenar += 1;
    if (state.rentetanBenar >= 2 && idx < LEVEL_ORDER.length - 1) {
      state.level = LEVEL_ORDER[idx + 1];
      state.rentetanBenar = 0;
    }
  } else {
    state.rentetanBenar = 0;
    if (idx > 0) state.level = LEVEL_ORDER[idx - 1];
  }
}

/* ------------------------------------------------------------------ */
/* Tampilan: pilih mapel                                               */
/* ------------------------------------------------------------------ */

function tampilPilihMapel() {
  const wadah = dapatkanWadah();
  bersihkanWadah(wadah);
  state.mapel = null;

  const judul = h('h2', { cls: 'kuis-judul', text: 'Pilih tiket kuismu' });
  const loket = h('p', { cls: 'kuis-loket', text: 'Pak Loket: ' + PESAN_LOKET.sambut });
  wadah.append(judul, loket);

  if (state.skorTeman !== null) {
    const catatan = h('p', {
      cls: 'kuis-catatan',
      text: 'Pak Loket: ' + PESAN_LOKET.skorTeman.replace('{skor}', String(state.skorTeman)),
    });
    wadah.appendChild(catatan);
  }

  const daftar = h('div', { cls: 'kuis-tiket' });
  for (const mapel of MAPEL) {
    const tombol = h('button', { cls: 'kuis-tombol', type: 'button', text: mapel });
    const terbaik = progres.terbaik[mapel];
    if (typeof terbaik === 'number') {
      tombol.appendChild(
        h('span', {
          cls: 'kuis-skor-terbaik',
          text: 'Skor terbaikmu: ' + terbaik + '/' + JUMLAH_SOAL_SESI,
        })
      );
    }
    tombol.addEventListener('click', () => mulaiSesi(mapel));
    daftar.appendChild(tombol);
  }
  wadah.appendChild(daftar);

  const sesi = h('p', {
    cls: 'kuis-catatan',
    text: 'Pak Loket: Kamu sudah naik ' + progres.sesi + ' sesi. Tiap sesi 5 soal, makin benar makin sulit.',
  });
  wadah.appendChild(sesi);
}

/* ------------------------------------------------------------------ */
/* Tampilan: soal                                                      */
/* ------------------------------------------------------------------ */

function mulaiSesi(mapel) {
  state.mapel = mapel;
  state.soalDipakai = [];
  state.soalAktif = null;
  state.nomor = 0;
  state.skor = 0;
  state.level = 'mudah';
  state.rentetanBenar = 0;
  tampilSoal();
}

function tampilSoal() {
  const wadah = dapatkanWadah();
  const soal = pilihSoalBerikutnya();
  if (!soal) {
    bersihkanWadah(wadah);
    wadah.appendChild(h('p', { cls: 'kuis-loket', text: 'Pak Loket: ' + PESAN_LOKET.soalHabis }));
    return;
  }
  state.soalAktif = soal;
  state.soalDipakai.push(soal.id);
  state.nomor += 1;
  state.sudahDijawab = false;
  state.boostDipakai = false;

  bersihkanWadah(wadah);

  const kartu = h('article', { cls: 'kuis-kartu' });

  const meta = h('div', { cls: 'kuis-meta' });
  meta.append(
    h('span', { text: 'Soal ' + state.nomor + ' dari ' + JUMLAH_SOAL_SESI }),
    h('span', { text: 'Skor: ' + state.skor })
  );
  kartu.appendChild(meta);

  const bar = h('div', {
    cls: 'kuis-progress',
    attrs: {
      role: 'progressbar',
      'aria-valuemin': '0',
      'aria-valuemax': String(JUMLAH_SOAL_SESI),
      'aria-valuenow': String(state.nomor),
      'aria-label': 'Kemajuan kuis',
    },
  });
  const isiBar = h('div', { cls: 'kuis-progress-isi' });
  isiBar.style.width = Math.round((state.nomor / JUMLAH_SOAL_SESI) * 100) + '%';
  bar.appendChild(isiBar);
  kartu.appendChild(bar);

  kartu.appendChild(h('p', { cls: 'kuis-meta', text: state.mapel + ' · ' + soal.topik + ' · ' + soal.level }));
  kartu.appendChild(h('h3', { cls: 'kuis-pertanyaan', text: soal.pertanyaan }));

  const daftarPilihan = h('div', { cls: 'kuis-pilihan' });
  const tombolPilihan = [];
  soal.pilihan.forEach((teks, i) => {
    const tombol = h('button', {
      cls: 'kuis-tombol',
      type: 'button',
      attrs: { 'aria-label': 'Pilihan ' + (i + 1) + ': ' + teks },
    });
    tombol.append(h('span', { cls: 'kuis-kunci', text: String(i + 1) }));
    tombol.append(document.createTextNode(teks));
    tombol.addEventListener('click', () => jawab(i, tombolPilihan, kartu));
    tombolPilihan.push(tombol);
    daftarPilihan.appendChild(tombol);
  });
  kartu.appendChild(daftarPilihan);

  // Daerah feedback — aria-live supaya pembaca layar mendengar hasilnya.
  const umpan = h('div', { cls: 'kuis-umpan', aria: { live: 'polite' } });
  kartu.appendChild(umpan);

  const aksi = h('div', { cls: 'kuis-aksi' });
  const tombolBoost = h('button', { cls: 'kuis-tombol', type: 'button', text: 'Boost (hint)' });
  tombolBoost.addEventListener('click', () => beriHint(soal, umpan, tombolBoost));
  const tombolLanjut = h('button', { cls: 'kuis-tombol', type: 'button', text: 'Soal berikutnya' });
  tombolLanjut.style.display = 'none';
  tombolLanjut.addEventListener('click', () => {
    if (state.nomor >= JUMLAH_SOAL_SESI) tampilHasil();
    else tampilSoal();
  });
  aksi.append(tombolBoost, tombolLanjut);
  kartu.appendChild(aksi);

  wadah.appendChild(kartu);

  // Keyboard 1-4 — terdaftar sekali per kartu, dicopot saat kartu diganti.
  const tanganiKunci = (e) => {
    if (state.sudahDijawab) return;
    const angka = ['1', '2', '3', '4'].indexOf(e.key);
    if (angka >= 0 && tombolPilihan[angka]) {
      e.preventDefault();
      jawab(angka, tombolPilihan, kartu);
    }
  };
  document.addEventListener('keydown', tanganiKunci, { once: true });
  kartu.addEventListener('DOMNodeRemoved', () => {
    document.removeEventListener('keydown', tanganiKunci);
  });
}

function jawab(indeks, tombolPilihan, kartu) {
  if (state.sudahDijawab || !state.soalAktif) return;
  state.sudahDijawab = true;
  const soal = state.soalAktif;
  const benar = indeks === soal.jawaban;
  if (benar) state.skor += 1;

  tombolPilihan.forEach((t, i) => {
    t.disabled = true;
    if (i === soal.jawaban) t.classList.add('benar');
    else if (i === indeks) t.classList.add('salah');
  });

  const umpan = kartu.querySelector('.kuis-umpan');
  const stempel = h('span', {
    cls: 'kuis-stempel ' + (benar ? 'benar' : 'salah'),
    text: benar ? 'Betul!' : 'Salah',
  });
  umpan.appendChild(stempel);
  umpan.appendChild(
    h('p', {
      text: 'Pak Loket: ' + (benar ? PESAN_LOKET.benar : PESAN_LOKET.salah),
    })
  );
  if (!benar) {
    umpan.appendChild(h('p', { cls: 'kuis-pembahasan', text: 'Pembahasan: ' + soal.pembahasan }));
  }

  sesuaikanLevel(benar);

  const tombolLanjut = Array.from(kartu.querySelectorAll('.kuis-tombol')).find(
    (t) => t.textContent === 'Soal berikutnya'
  );
  if (tombolLanjut) {
    tombolLanjut.textContent = state.nomor >= JUMLAH_SOAL_SESI ? 'Lihat hasil' : 'Soal berikutnya';
    tombolLanjut.style.display = '';
    tombolLanjut.focus();
  }
}

/** Boost: tampilkan kalimat pertama pembahasan sebagai hint. */
function beriHint(soal, umpan, tombolBoost) {
  if (state.boostDipakai || state.sudahDijawab) return;
  state.boostDipakai = true;
  tombolBoost.disabled = true;
  const pembahasan = (soal.pembahasan || '').trim();
  const titik = pembahasan.indexOf('.');
  let hint;
  if (titik > 0 && titik < pembahasan.length - 1) {
    hint = pembahasan.slice(0, titik + 1);
  } else if (titik === pembahasan.length - 1 && pembahasan.length > 0) {
    hint = PESAN_LOKET.boostKosong;
  } else if (pembahasan.length === 0) {
    hint = PESAN_LOKET.boostKosong;
  } else {
    hint = pembahasan;
  }
  umpan.appendChild(h('p', { cls: 'kuis-hint', text: 'Hint dari Pak Loket: ' + hint }));
}

/* ------------------------------------------------------------------ */
/* Tampilan: hasil                                                     */
/* ------------------------------------------------------------------ */

function tampilHasil() {
  const wadah = dapatkanWadah();
  bersihkanWadah(wadah);

  // Simpan progres: skor terbaik per mapel + jumlah sesi.
  const terbaikLama = progres.terbaik[state.mapel];
  if (typeof terbaikLama !== 'number' || state.skor > terbaikLama) {
    progres.terbaik[state.mapel] = state.skor;
  }
  progres.sesi += 1;
  simpanProgres(progres);

  const kartu = h('article', { cls: 'kuis-kartu kuis-hasil' });
  kartu.appendChild(h('h2', { cls: 'kuis-judul', text: 'Sesi selesai!' }));

  // Stempel akhir — pakai yang sudah ada di halaman bila tersedia.
  let stempel = document.getElementById('stempel-akhir');
  if (stempel) {
    stempel.textContent = 'SAH BERANGKAT';
    stempel.classList.add('tercap');
    stempel.removeAttribute('aria-hidden');
  } else {
    stempel = h('div', { id: 'stempel-akhir', cls: 'kuis-stempel tercap', text: 'SAH BERANGKAT' });
  }
  kartu.appendChild(stempel);

  let skorEl = document.getElementById('skor-akhir');
  if (skorEl) {
    skorEl.textContent = state.skor + '/' + JUMLAH_SOAL_SESI;
  } else {
    skorEl = h('p', { id: 'skor-akhir', cls: 'kuis-skor-besar', text: state.skor + '/' + JUMLAH_SOAL_SESI });
  }
  kartu.appendChild(skorEl);

  const pesan =
    state.skor === JUMLAH_SOAL_SESI
      ? 'Sempurna! Semua tiketmu sah. Pak Loket bangga.'
      : state.skor >= 3
        ? 'Bagus! Kamu sudah sampai setengah perjalanan. Ulangi lagi biar makin lancar.'
        : 'Tidak apa-apa, bus berikutnya segera berangkat. Pelajari lagi materinya, lalu coba lagi.';
  kartu.appendChild(h('p', { text: 'Pak Loket: ' + pesan }));

  const aksi = h('div', { cls: 'kuis-aksi' });
  const tombolUlang = h('button', { cls: 'kuis-tombol', type: 'button', text: 'Main lagi' });
  tombolUlang.addEventListener('click', () => tampilPilihMapel());
  const tombolBagikan = h('button', { cls: 'kuis-tombol', type: 'button', text: 'Bagikan skorku' });
  tombolBagikan.addEventListener('click', () => {
    const tautan =
      window.location.origin +
      window.location.pathname +
      '?mapel=' +
      encodeURIComponent(state.mapel) +
      '&skor=' +
      state.skor;
    salinTeks(tautan).then((ok) => {
      tandaiTersalin(tombolBagikan, 'Bagikan skorku');
      if (!ok) {
        window.alert('Tautan skor: ' + tautan);
      }
    });
  });
  aksi.append(tombolUlang, tombolBagikan);
  kartu.appendChild(aksi);
  wadah.appendChild(kartu);
}

/* ------------------------------------------------------------------ */
/* Salin ringkasan (milik section ringkasan, agen UI-1)                */
/* ------------------------------------------------------------------ */

function tanganiSalinRingkasan(e) {
  const tombol = e.target instanceof Element ? e.target.closest('[data-salin]') : null;
  if (!tombol) return;
  let teksEl = null;
  const wadah = tombol.closest('section, article, div');
  if (wadah) teksEl = wadah.querySelector('.ringkasan-teks');
  if (!teksEl) teksEl = document.querySelector('.ringkasan-teks');
  if (!teksEl) return;
  const labelAsal = tombol.textContent;
  const teks = teksEl.textContent.trim();
  if (!teks) return;
  salinTeks(teks).then((ok) => {
    if (ok) tandaiTersalin(tombol, labelAsal);
    else window.alert('Gagal menyalin. Salin manual dari layar, ya.');
  });
}

/* ------------------------------------------------------------------ */
/* Easter egg: stempel rahasia 3x → stiker bus                         */
/* ------------------------------------------------------------------ */

let hitungStempel = 0;

function tanganiStempelRahasia(e) {
  const target = e.target instanceof Element ? e.target.closest('#stempel-rahasia') : null;
  if (!target) return;
  hitungStempel += 1;
  if (hitungStempel < 3) return;
  hitungStempel = 0;
  let stiker = document.getElementById('stiker-bus');
  if (!stiker) {
    stiker = h('div', { id: 'stiker-bus', text: 'BUS SEKOLAH • BERANGKAT!' });
    target.insertAdjacentElement('afterend', stiker);
  }
  stiker.style.display = '';
  let pesan = stiker.nextElementSibling;
  if (!pesan || !pesan.classList.contains('kuis-pesan-bus')) {
    pesan = h('p', { cls: 'kuis-pesan-bus', text: 'Pak Loket: ' + PESAN_LOKET.bus });
    stiker.insertAdjacentElement('afterend', pesan);
  }
}

/* ------------------------------------------------------------------ */
/* Deep-link & init                                                    */
/* ------------------------------------------------------------------ */

function bacaParam() {
  const params = new URLSearchParams(window.location.search);
  const mapelParam = params.get('mapel');
  let mapel = null;
  if (mapelParam) {
    const cocok = MAPEL.find((m) => m.toLowerCase() === mapelParam.trim().toLowerCase());
    if (cocok) mapel = cocok;
  }
  const skorParam = params.get('skor');
  let skor = null;
  if (skorParam !== null) {
    const n = Number(skorParam);
    if (Number.isInteger(n) && n >= 0 && n <= JUMLAH_SOAL_SESI) skor = n;
  }
  return { mapel, skor };
}

function init() {
  suntikGaya();
  const wadah = dapatkanWadah();

  if (!Array.isArray(SOAL) || SOAL.length === 0 || MAPEL.length === 0) {
    bersihkanWadah(wadah);
    wadah.appendChild(h('p', { cls: 'kuis-loket', text: 'Pak Loket: ' + PESAN_LOKET.soalHabis }));
    return;
  }

  document.addEventListener('click', tanganiSalinRingkasan);
  document.addEventListener('click', tanganiStempelRahasia);

  const { mapel, skor } = bacaParam();
  state.skorTeman = skor;
  if (mapel) mulaiSesi(mapel);
  else tampilPilihMapel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
