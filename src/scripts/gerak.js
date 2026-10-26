/**
 * gerak.js — TanyaRuang (agen UI-1).
 * Vanilla JS + CSS saja, tanpa GSAP/CDN.
 *
 * Gerak (seed):
 *  A kamera: zoom-in #papan lalu pan kanan antar loket (rAF scrub).
 *  B marquee: velocity-skew ikut kecepatan scroll.
 *  C teks: variable font axis — wght judul 400→800 ikut scroll
 *    (Teachers dideklarasi variable 400..800 di astro.config.ts).
 *  D input: cursor spotlight (pointer:fine saja).
 *  E reveal: curtain wipe antar section (IntersectionObserver + .terbuka).
 *  F toggle #gerak-toggle + localStorage 'tanyaruang-gerak' +
 *    hormati prefers-reduced-motion.
 *
 * Plus interaksi loket (bukan gerak, tapi satu-satunya script halaman
 * milik UI-1): klik tiket → buka tab guru materi itu; tombol #bagikan →
 * salin deep-link; tombol #marquee-jeda → jeda marquee.
 * Kuis (#kuis-app, #skor-akhir, #stempel-akhir, #stempel-rahasia)
 * MILIK agen UI-2 (kuis.js) — file ini tidak menyentuhnya.
 */
'use strict';

(function () {
  var SIMPANAN = 'tanyaruang-gerak';
  var root = document.documentElement;
  var kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tersimpan = null;
  try {
    tersimpan = window.localStorage.getItem(SIMPANAN);
  } catch {
    /* abaikan: localStorage tidak tersedia */
  }
  // Default: nyala, kecuali prefers-reduced-motion atau pernah dimatikan.
  var gerakNyala = tersimpan === 'mati' || (tersimpan === null && kurangiGerak) ? false : tersimpan !== 'mati';

  var papan = document.getElementById('papan');
  var judul = document.getElementById('judul-utama');
  var spotlight = document.getElementById('spotlight');
  var tombolGerak = document.getElementById('gerak-toggle');
  var tombolJeda = document.getElementById('marquee-jeda');
  var marquees = Array.prototype.slice.call(document.querySelectorAll('.marquee'));
  var lokets = Array.prototype.slice.call(document.querySelectorAll('.loket'));

  var terakhirY = window.scrollY || 0;
  var kecepatan = 0;
  var dijadwalkan = false;

  function clamp(nilai, min, maks) {
    return Math.min(maks, Math.max(min, nilai));
  }

  function terapkanToggle() {
    if (tombolGerak) {
      tombolGerak.textContent = gerakNyala ? 'Gerak: nyala' : 'Gerak: mati';
      tombolGerak.setAttribute('aria-pressed', gerakNyala ? 'true' : 'false');
    }
    root.classList.toggle('gerak-aktif', gerakNyala);
    if (!gerakNyala) resetGerak();
  }

  function resetGerak() {
    if (papan) papan.style.transform = '';
    if (judul) judul.style.fontVariationSettings = '';
    marquees.forEach(function (m) {
      m.style.transform = '';
    });
    lokets.forEach(function (s) {
      s.style.transform = '';
    });
    if (spotlight) spotlight.classList.remove('spotlight-aktif');
  }

  // (A) zoom-in papan + (C) wght judul + pan kanan loket + (B) skew marquee.
  function saatScroll() {
    var y = window.scrollY || 0;
    var vh = window.innerHeight || 1;
    kecepatan = y - terakhirY;
    terakhirY = y;

    if (!gerakNyala) {
      dijadwalkan = false;
      return;
    }

    // A: zoom-in #papan 1 -> 1.06 selama satu viewport pertama.
    if (papan) {
      var pPapan = clamp(y / vh, 0, 1);
      papan.style.transform = 'scale(' + (1 + 0.06 * pPapan).toFixed(4) + ')';
    }

    // C: wght judul 400 -> 800 ikut scroll.
    if (judul) {
      var pJudul = clamp(y / (vh * 0.8), 0, 1);
      judul.style.fontVariationSettings = '"wght" ' + Math.round(400 + 400 * pJudul);
    }

    // A lanjutan: pan kanan — tiap loket bergeser dari +32px ke 0 saat masuk layar.
    lokets.forEach(function (s) {
      if (s.id === 'papan') return;
      var rect = s.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      var t = clamp((vh - rect.top) / vh, 0, 1);
      s.style.transform = 'translateX(' + ((1 - t) * 32).toFixed(1) + 'px)';
    });

    // B: velocity-skew marquee — kecepatan scroll -> skewX, dibatasi +-10deg.
    var skew = clamp(kecepatan * 0.12, -10, 10);
    marquees.forEach(function (m) {
      m.style.transform = 'skewX(' + skew.toFixed(2) + 'deg)';
    });

    dijadwalkan = false;
  }

  function mintaFrame() {
    if (!dijadwalkan) {
      dijadwalkan = true;
      window.requestAnimationFrame(saatScroll);
    }
  }

  // Indikator fokus keyboard: radio tab 0-px, cincin tampil di labelnya.
  Array.prototype.forEach.call(document.querySelectorAll('.guru-tab'), function (tab) {
    var label = document.querySelector('label[for="' + tab.id + '"]');
    if (!label) return;
    tab.addEventListener('focus', function () {
      label.classList.add('guru-fokus');
    });
    tab.addEventListener('blur', function () {
      label.classList.remove('guru-fokus');
    });
  });

  // (E) curtain wipe: amati section, clip ada di anak .tirai (bukan di
  // elemen yang diobserve — clip-path di elemen teramati bikin IO buta).
  var observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('terbuka');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    lokets.forEach(function (s) {
      observer.observe(s);
    });
  } else {
    lokets.forEach(function (s) {
      s.classList.add('terbuka');
    });
  }

  // (D) cursor spotlight — pointer halus saja, mati di touch.
  if (spotlight && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener(
      'mousemove',
      function (e) {
        if (!gerakNyala) return;
        spotlight.classList.add('spotlight-aktif');
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
      },
      { passive: true }
    );
  }

  // (F) toggle gerak.
  if (tombolGerak) {
    tombolGerak.addEventListener('click', function () {
      gerakNyala = !gerakNyala;
      try {
        window.localStorage.setItem(SIMPANAN, gerakNyala ? 'nyala' : 'mati');
      } catch {
        /* abaikan: penyimpanan tidak tersedia */
      }
      terapkanToggle();
      if (gerakNyala) mintaFrame();
    });
  }

  // Jeda marquee (independen dari toggle gerak).
  if (tombolJeda) {
    tombolJeda.addEventListener('click', function () {
      var jeda = root.classList.toggle('marquee-jeda');
      tombolJeda.setAttribute('aria-pressed', jeda ? 'true' : 'false');
      tombolJeda.textContent = jeda ? 'Jalankan marquee' : 'Jeda marquee';
    });
  }

  // Klik tiket -> buka tab guru materi itu (anchor mengurus scroll).
  Array.prototype.forEach.call(document.querySelectorAll('.tiket'), function (tiket) {
    tiket.addEventListener('click', function () {
      var radio = document.getElementById('tab-' + tiket.getAttribute('data-materi'));
      if (radio) radio.checked = true;
    });
  });

  // Bagikan deep-link: ?mapel=<materi aktif di Loket Guru>.
  // Param soal milik kuis.js — agen itu yang menambahkan bila perlu.
  var tombolBagikan = document.getElementById('bagikan');
  if (tombolBagikan) {
    tombolBagikan.addEventListener('click', function () {
      var aktif = document.querySelector('.guru-tab:checked');
      var mapel = aktif ? aktif.id.replace(/^tab-/, '') : '';
      var url =
        window.location.origin + window.location.pathname + (mapel ? '?mapel=' + encodeURIComponent(mapel) : '');
      var teksAwal = tombolBagikan.textContent;
      var selesai = function () {
        tombolBagikan.textContent = 'Tautan disalin!';
        window.setTimeout(function () {
          tombolBagikan.textContent = teksAwal;
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(selesai, function () {
          window.prompt('Salin tautan ini:', url);
        });
      } else {
        window.prompt('Salin tautan ini:', url);
      }
    });
  }

  window.addEventListener('scroll', mintaFrame, { passive: true });
  window.addEventListener('resize', mintaFrame, { passive: true });

  terapkanToggle();
  mintaFrame();
})();
