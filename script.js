/* =========================================================
   SiagaCacar Asrama — script.js
   Bagian 1: DATA + LOGIKA MURNI (bisa diuji di Node)
   Bagian 2: INISIALISASI DOM (hanya jalan di browser)
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   BAGIAN 1A — DATA
   --------------------------------------------------------- */

const SYMPTOM_GROUPS = [
  {
    id: 'gejala', title: 'Gejala yang kamu alami', danger: false,
    items: [
      ['demam', 'Demam atau badan terasa panas'],
      ['lemas', 'Lemas, sakit kepala, atau nafsu makan menurun'],
      ['ruam', 'Muncul bintik/ruam kemerahan di kulit'],
      ['gatal', 'Ruam terasa sangat gatal'],
      ['lenting', 'Ada lenting (lepuh kecil) berisi cairan bening']
    ]
  },
  {
    id: 'paparan', title: 'Riwayat paparan', danger: false,
    items: [
      ['kontak', 'Dalam 3 minggu terakhir, kontak dekat/sekamar dengan penderita cacar air atau cacar ular (herpes zoster)'],
      ['belumImun', 'Belum pernah cacar air dan belum divaksin varisela (atau tidak yakin)']
    ]
  },
  {
    id: 'risiko', title: 'Kondisi berisiko (kamu atau orang di dekatmu)', danger: false,
    items: [
      ['hamil', 'Hamil, atau sekamar/dekat dengan ibu hamil'],
      ['imunLemah', 'Daya tahan tubuh lemah (mis. kemoterapi, steroid jangka panjang, HIV), atau sekamar dengan orang seperti itu']
    ]
  },
  {
    id: 'bahaya', title: 'Tanda bahaya', danger: true,
    items: [
      ['sesak', 'Sesak napas atau batuk berat'],
      ['demamTinggi', 'Demam di atas 39 °C atau lebih dari 4 hari'],
      ['mata', 'Ruam di dekat atau di dalam mata'],
      ['kejang', 'Kejang, sangat mengantuk, bingung, atau leher kaku'],
      ['infeksi', 'Lenting bengkak, merah, nyeri, atau bernanah'],
      ['muntah', 'Muntah terus-menerus atau tidak bisa minum']
    ]
  }
];

const RED_FLAGS = ['sesak', 'demamTinggi', 'mata', 'kejang', 'infeksi', 'muntah'];

const CHECKLIST = [
  {
    title: 'Kebiasaan pribadi',
    items: [
      ['p1', 'Cuci tangan dengan sabun ≥ 20 detik sebelum makan dan setelah dari toilet'],
      ['p2', 'Tidak berbagi handuk, alat makan, sikat gigi, atau pakaian'],
      ['p3', 'Menutup mulut dan hidung saat batuk atau bersin'],
      ['p4', 'Memotong kuku pendek dan menjaganya bersih'],
      ['p5', 'Sudah mengecek riwayat cacar air/vaksin varisela (tanya orang tua atau puskesmas)']
    ]
  },
  {
    title: 'Kamar & lingkungan',
    items: [
      ['k1', 'Membuka jendela/ventilasi kamar tiap pagi minimal 15 menit'],
      ['k2', 'Mengganti seprai dan menjemur kasur/bantal tiap minggu'],
      ['k3', 'Membersihkan gagang pintu, saklar, dan keran dengan lap bersih'],
      ['k4', 'Tempat sampah tertutup dan dibuang rutin'],
      ['k5', 'Sabun cuci tangan tersedia di kamar mandi/wastafel']
    ]
  },
  {
    title: 'Peduli & literasi digital',
    items: [
      ['c1', 'Tahu ke siapa harus melapor (pembina/UKS) jika bergejala'],
      ['c2', 'Mengecek sumber sebelum meneruskan info kesehatan ke grup chat'],
      ['c3', 'Mendukung teman yang sakit tanpa mengucilkan atau menyebar gosip']
    ]
  }
];

/* Opsi pertama pada tiap pertanyaan = jawaban benar (diacak saat ditampilkan). */
const QUIZ = [
  { q: 'Berapa lama masa inkubasi cacar air setelah kontak dengan penderita?',
    opts: ['Sekitar 10–21 hari', 'Sekitar 1–2 hari', 'Sekitar 2–3 bulan', 'Langsung muncul dalam hitungan jam'],
    why: 'Gejala biasanya baru muncul 10–21 hari setelah kontak, sehingga pemantauan perlu berlangsung sampai sekitar 3 minggu.' },
  { q: 'Kapan seseorang mulai dapat menularkan cacar air?',
    opts: ['1–2 hari sebelum ruam muncul', 'Hanya setelah lenting pecah', 'Hanya saat demam tinggi', 'Setelah semua ruam sembuh'],
    why: 'Penularan dimulai sekitar 1–2 hari sebelum ruam, sehingga bisa terjadi saat penderita belum sadar dirinya sakit.' },
  { q: 'Kapan masa isolasi penderita dapat berakhir?',
    opts: ['Setelah semua lenting berkeropeng/kering', 'Begitu demam turun', 'Setelah 2 hari sejak ruam muncul', 'Setelah gatalnya hilang'],
    why: 'Penderita menular sampai semua lenting berkeropeng, biasanya sekitar 5–7 hari setelah ruam muncul. Keputusan akhir ada pada tenaga kesehatan.' },
  { q: 'Bagaimana cara utama cacar air menular?',
    opts: ['Lewat percikan/udara dan kontak cairan lenting', 'Lewat makanan matang', 'Lewat air minum kemasan', 'Hanya lewat gigitan nyamuk'],
    why: 'Virusnya menyebar lewat percikan pernapasan/udara dan kontak langsung dengan cairan lenting.' },
  { q: 'Berapa dosis vaksin varisela untuk perlindungan optimal?',
    opts: ['2 dosis', '1 dosis seumur hidup', '5 dosis', 'Tidak ada vaksinnya'],
    why: 'Vaksin varisela umumnya diberikan 2 dosis, dan sangat efektif mencegah bentuk penyakit yang berat.' },
  { q: 'Obat demam apa yang sebaiknya dihindari pada anak dan remaja dengan cacar air?',
    opts: ['Aspirin', 'Parasetamol', 'Kompres hangat', 'Minum air putih cukup'],
    why: 'Aspirin dikaitkan dengan sindrom Reye pada anak dan remaja. Tanyakan tenaga kesehatan untuk obat yang tepat.' },
  { q: 'Sikap terbaik terhadap teman yang terkena cacar air adalah…',
    opts: ['Isolasi medis tetap didukung: kirim kabar, bantu makanan, tanpa stigma', 'Menjauhi dan membicarakannya di grup', 'Menyuruhnya menyembunyikan penyakit', 'Memaksanya tetap masuk kelas'],
    why: 'Isolasi itu urusan medis, bukan hukuman. Stigma justru membuat orang menyembunyikan gejala dan memperparah penularan.' },
  { q: 'Kamu menerima pesan berantai “Cacar air: jangan mandi 2 minggu!”. Langkah tepat?',
    opts: ['Cek ke sumber resmi/UKS sebelum meneruskan', 'Langsung teruskan ke semua grup', 'Percaya karena banyak yang membagikan', 'Percaya karena ada kata “dokter”'],
    why: 'Pesan viral bukan bukti kebenaran. Mandi dengan air bersih justru dianjurkan dengan cara yang lembut.' }
];

const MYTHS = [
  { m: 'Penderita cacar air tidak boleh mandi sampai sembuh.',
    f: 'Mandi dianjurkan untuk menjaga kebersihan kulit dan mencegah infeksi. Gunakan air bersih suam-suam kuku, lalu keringkan dengan menepuk lembut, jangan menggosok.' },
  { m: 'Cacar air hanya menyerang anak kecil.',
    f: 'Remaja dan dewasa yang belum kebal juga bisa tertular, dan gejalanya cenderung lebih berat dibanding anak kecil.' },
  { m: 'Orang yang sudah pernah cacar air tidak akan sakit karena virusnya lagi.',
    f: 'Kekebalannya umumnya bertahan lama, tetapi virus tetap “tidur” di saraf dan dapat aktif kembali sebagai cacar ular (herpes zoster).' },
  { m: 'Bedak, kunyit, atau ramuan tertentu bisa menyembuhkan cacar air.',
    f: 'Tidak ada bukti ramuan tersebut menyembuhkan. Cacar air umumnya sembuh sendiri; yang membantu adalah meredakan gejala sesuai saran tenaga kesehatan. Bahan yang tidak steril bisa mengiritasi kulit dan memicu infeksi.' },
  { m: 'Cacar air baru menular setelah ruamnya muncul.',
    f: 'Penderita sudah dapat menularkan sekitar 1–2 hari sebelum ruam muncul, sampai semua lenting berkeropeng.' },
  { m: 'Lenting sebaiknya dipecahkan atau digaruk agar cepat kering.',
    f: 'Menggaruk atau memecahkan lenting memperlambat penyembuhan, menambah risiko infeksi bakteri, dan dapat meninggalkan bekas luka permanen.' },
  { m: 'Yang sudah divaksin pasti tidak akan terkena cacar air.',
    f: 'Infeksi pada orang yang sudah divaksin masih mungkin terjadi, tetapi biasanya jauh lebih ringan, dengan lenting lebih sedikit dan pemulihan lebih cepat.' },
  { m: 'Demam akibat cacar air bisa diatasi dengan aspirin.',
    f: 'Aspirin sebaiknya dihindari pada anak dan remaja dengan cacar air karena berisiko sindrom Reye. Tanyakan ke tenaga kesehatan obat penurun demam yang tepat.' },
  { m: 'Penderita harus dikucilkan dan dijauhi oleh semua orang.',
    f: 'Yang diperlukan adalah isolasi medis yang tertib dan didukung (makanan, kabar, semangat), bukan pengucilan sosial. Stigma membuat orang takut melapor.' },
  { m: 'Pesan berantai di grup yang menyebut “asrama wajib dikosongkan” pasti benar.',
    f: 'Keputusan semacam itu datang dari pengelola dan otoritas kesehatan secara resmi. Cek ke pembina/UKS sebelum panik atau meneruskan pesan.' }
];

/* ---------------------------------------------------------
   BAGIAN 1B — LOGIKA MURNI
   --------------------------------------------------------- */

/** Mengevaluasi gejala (array id terpilih) menjadi tingkat panduan. */
function evaluateSymptoms(ids) {
  const has = (id) => ids.includes(id);
  const red = RED_FLAGS.filter(has);
  const hasRash = has('ruam') || has('lenting');
  const suspected = has('lenting') || (has('ruam') && (has('demam') || has('gatal') || has('lemas')));
  const exposed = has('kontak');
  const atRisk = has('hamil') || has('imunLemah');
  const anySymptom = ['demam', 'lemas', 'ruam', 'gatal', 'lenting'].some(has);

  const extras = [];
  if (atRisk) {
    extras.push('Kamu atau orang di dekatmu termasuk kelompok berisiko. Beri tahu tenaga kesehatan SEGERA, karena penanganan khusus mungkin diperlukan.');
  }

  if (red.length > 0) {
    return {
      level: 'danger', icon: '🚨', title: 'Tanda bahaya: segera cari pertolongan medis',
      summary: 'Kamu memilih gejala yang tidak boleh ditunda penanganannya.',
      steps: [
        'Segera hubungi pembina/petugas kesehatan dan menuju IGD atau fasilitas kesehatan terdekat.',
        'Pakai masker dan hindari kontak dekat dengan orang lain selama perjalanan.',
        'Sampaikan semua gejala dan riwayat kontakmu kepada petugas.'
      ],
      extras, redFlags: red
    };
  }

  if (suspected) {
    return {
      level: 'warn', icon: '🟠', title: 'Gejalamu mengarah ke kemungkinan cacar air',
      summary: 'Belum tentu cacar air, tetapi perlu bertindak hati-hati dan diperiksa.',
      steps: [
        'Isolasi diri sekarang: tidak ke kelas/kantin ramai, tidak berbagi kamar jika memungkinkan, dan pakai masker.',
        'Lapor ke pembina/UKS hari ini (gunakan menu “Lapor” di website ini).',
        'Periksakan ke tenaga kesehatan untuk memastikan diagnosis.',
        'Jangan menggaruk atau memecahkan lenting, potong kuku pendek, dan hindari aspirin.',
        'Hitung perkiraan masa isolasimu di menu “Isolasi”.'
      ],
      extras, redFlags: []
    };
  }

  if (exposed || hasRash) {
    const steps = [
      'Cek suhu tubuh dan kulit setiap hari sampai sekitar 21 hari sejak kontak terakhir.',
      'Tetap cuci tangan, jangan berbagi barang pribadi, dan buka ventilasi kamar.',
      'Jika muncul demam atau ruam gatal, ulangi pemeriksaan ini dan segera lapor.'
    ];
    if (has('belumImun')) {
      steps.push('Karena belum kebal, tanyakan ke tenaga kesehatan soal vaksin setelah paparan. Manfaatnya paling besar jika diberikan secepat mungkin (idealnya dalam 3–5 hari sejak kontak).');
    }
    return {
      level: 'notice', icon: '🔵', title: 'Pantau dirimu dengan saksama',
      summary: exposed
        ? 'Kamu pernah kontak dengan penderita, jadi masih ada jendela waktu untuk gejala muncul.'
        : 'Ruam saja belum cukup untuk menyimpulkan penyebabnya, jadi tetap diamati.',
      steps, extras, redFlags: []
    };
  }

  const steps = [
    'Tetap jaga kebersihan dan lengkapi checklist asrama.',
    'Cek status vaksin varisela dan tanyakan ke puskesmas/dokter jika belum lengkap.'
  ];
  if (anySymptom) {
    steps.unshift('Gejala ringan bisa disebabkan banyak penyakit. Istirahat cukup, dan periksa ke UKS bila berlanjut lebih dari 2–3 hari atau memburuk.');
  }
  return {
    level: 'ok', icon: '🟢', title: 'Risiko rendah berdasarkan jawabanmu',
    summary: 'Tidak ada tanda yang mengarah ke cacar air saat ini.',
    steps, extras, redFlags: []
  };
}

/** Menambah n hari pada tanggal tanpa memengaruhi jam. */
function addDays(date, n) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
}
function stripTime(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function diffDays(a, b) { return Math.round((stripTime(b) - stripTime(a)) / 86400000); }

/** Parse "YYYY-MM-DD" sebagai tanggal lokal; kembalikan null jika tidak valid. */
function parseISODate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return null;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) ? dt : null;
}

function formatDate(d) {
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/** Rencana untuk penderita: menular mulai H-2 ruam; isolasi ≈ H+5 s.d. H+7 (hingga semua lenting berkeropeng). */
function isolationPlan(onset, today) {
  const contagiousFrom = addDays(onset, -2);
  const isoMin = addDays(onset, 5);
  const isoMax = addDays(onset, 7);
  const dayNo = diffDays(onset, today) + 1; // hari ke-1 = hari ruam muncul
  let status;
  if (dayNo < 1) status = 'future';
  else if (diffDays(today, isoMin) > 0) status = 'during';
  else if (diffDays(today, isoMax) >= 0) status = 'near-end';
  else status = 'past';
  return { contagiousFrom, isoMin, isoMax, dayNo, status };
}

/** Rencana untuk orang yang terpapar: pantau hari ke-10 s.d. ke-21; vaksin pasca-paparan idealnya ≤ 5 hari. */
function exposurePlan(exposure, today) {
  const watchStart = addDays(exposure, 10);
  const watchEnd = addDays(exposure, 21);
  const vaccineDeadline = addDays(exposure, 5);
  const dayNo = diffDays(exposure, today);
  let status;
  if (dayNo < 0) status = 'future';
  else if (dayNo < 10) status = 'early';
  else if (dayNo <= 21) status = 'watch';
  else status = 'past';
  return { watchStart, watchEnd, vaccineDeadline, dayNo, status };
}

/** Normalisasi nomor telepon Indonesia ke format wa.me (tanpa +). */
function normalizePhone(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('62')) return d;
  if (d.startsWith('0')) return '62' + d.slice(1);
  if (d.startsWith('8')) return '62' + d;
  return d;
}

function buildReport(f) {
  const lines = [
    'LAPORAN KESEHATAN ASRAMA (dugaan cacar air)',
    '',
    'Nama: ' + (f.nama && f.nama.trim() ? f.nama.trim() : '(tidak dicantumkan)'),
    'Kamar/Blok: ' + (f.kamar && f.kamar.trim() ? f.kamar.trim() : '-'),
    'Tanggal ruam pertama muncul: ' + (f.tgl ? formatDate(parseISODate(f.tgl) || new Date(NaN)) : '-'),
    'Gejala: ' + (f.gejala && f.gejala.trim() ? f.gejala.trim() : '-'),
    'Kontak dekat: ' + (f.kontak && f.kontak.trim() ? f.kontak.trim() : '-'),
    'Riwayat cacar/vaksin: ' + (f.vaksin || 'Tidak tahu'),
    '',
    'Saya akan membatasi aktivitas bersama sampai ada arahan. Mohon arahan pemeriksaan dan isolasi. Terima kasih.'
  ];
  return lines.join('\n');
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Ekspor untuk pengujian di Node (diabaikan di browser). */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    evaluateSymptoms, isolationPlan, exposurePlan, parseISODate, normalizePhone,
    buildReport, addDays, diffDays, QUIZ, MYTHS, CHECKLIST, SYMPTOM_GROUPS, RED_FLAGS
  };
}

/* ---------------------------------------------------------
   BAGIAN 2 — INISIALISASI DOM (browser saja)
   --------------------------------------------------------- */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}

function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* abaikan */ } }
};

function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._id);
  toast._id = setTimeout(() => t.classList.remove('show'), 2400);
}

function init() {
  initTheme();
  initNav();
  initReveal();
  initSymptomChecker();
  initIsolation();
  initChecklist();
  initQuiz();
  initMyths();
  initReport();
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
}

/* ---------- Tema ---------- */
function initTheme() {
  const root = document.documentElement;
  const saved = store.get('sc_theme', null);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
  $('#themeToggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store.set('sc_theme', next);
  });
}

/* ---------- Navigasi + scrollspy ---------- */
function initNav() {
  const toggle = $('#navToggle');
  const menu = $('#navMenu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  });
  $$('a', menu).forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { menu.classList.remove('open'); toggle.focus(); }
  });

  if (!('IntersectionObserver' in window)) return;
  const links = new Map($$('a', menu).map(a => [a.getAttribute('href').slice(1), a]));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(l => l.removeAttribute('aria-current'));
        const l = links.get(en.target.id);
        if (l) l.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
}

/* ---------- Reveal ---------- */
function initReveal() {
  const els = $$('.section .container > *, .hero-text, .stat-cards');
  els.forEach(el => el.classList.add('reveal'));
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

/* ---------- Fitur 1: Cek gejala ---------- */
function initSymptomChecker() {
  const wrap = $('#cekGroups');
  wrap.innerHTML = SYMPTOM_GROUPS.map(g => `
    <fieldset class="${g.danger ? 'danger' : ''}">
      <legend>${g.title}</legend>
      ${g.items.map(([id, label]) => `
        <label class="check"><input type="checkbox" name="sym" value="${id}"><span>${label}</span></label>`).join('')}
    </fieldset>`).join('');

  const out = $('#cekHasil');
  $('#cekForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const ids = $$('input[name="sym"]:checked').map(i => i.value);
    const r = evaluateSymptoms(ids);
    out.innerHTML = `
      <div class="res-card res-${r.level}">
        <h3><span aria-hidden="true">${r.icon}</span> ${r.title}</h3>
        <p>${r.summary}</p>
        <ul>${r.steps.map(s => `<li>${s}</li>`).join('')}</ul>
        ${r.extras.map(x => `<div class="extra"><strong>Perhatian:</strong> ${x}</div>`).join('')}
        <div class="res-links">
          ${r.level === 'warn' || r.level === 'notice' ? '<a class="btn btn-ghost btn-small" href="#isolasi">Hitung masa isolasi</a>' : ''}
          ${r.level !== 'ok' ? '<a class="btn btn-ghost btn-small" href="#lapor">Buat pesan laporan</a>' : ''}
        </div>
        <p class="fineprint">Panduan ini bukan diagnosis. Keputusan medis ada pada tenaga kesehatan.</p>
      </div>`;
    out.focus();
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $('#cekReset').addEventListener('click', () => {
    $('#cekForm').reset();
    out.innerHTML = '';
  });
}

/* ---------- Fitur 2: Kalkulator isolasi ---------- */
function initIsolation() {
  const todayISO = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  })();
  const ruam = $('#tglRuam'), pap = $('#tglPaparan'), out = $('#isoHasil');
  ruam.max = todayISO; pap.max = todayISO;

  $('#isoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const today = stripTime(new Date());
    const dRuam = parseISODate(ruam.value);
    const dPap = parseISODate(pap.value);

    if (!dRuam && !dPap) {
      out.innerHTML = '<div class="res-card res-notice"><p>Isi minimal salah satu tanggal terlebih dahulu.</p></div>';
      return;
    }
    let html = '';

    if (dRuam) {
      if (diffDays(dRuam, today) < 0) {
        html += '<div class="res-card res-warn"><p>Tanggal ruam tidak boleh di masa depan.</p></div>';
      } else {
        const p = isolationPlan(dRuam, today);
        const statusMsg = {
          during: `Hari ke-${p.dayNo} sejak ruam muncul: <strong>masih dalam masa isolasi</strong>.`,
          'near-end': `Hari ke-${p.dayNo}: <strong>mendekati akhir perkiraan isolasi</strong>. Tetap isolasi sampai semua lenting berkeropeng dan tenaga kesehatan mengizinkan.`,
          past: `Hari ke-${p.dayNo}: perkiraan masa isolasi sudah terlewati. Pastikan <strong>semua lenting sudah berkeropeng</strong> sebelum kembali beraktivitas bersama.`
        }[p.status];
        html += `
          <div class="res-card res-warn">
            <h3>🧑‍⚕️ Jika kamu sedang sakit</h3>
            <p>${statusMsg}</p>
            <ul class="timeline">
              <li><span class="t-label">Mulai menular</span><span>± ${formatDate(p.contagiousFrom)} (1–2 hari sebelum ruam)</span></li>
              <li><span class="t-label">Perkiraan isolasi</span><span>${formatDate(p.isoMin)} s.d. ${formatDate(p.isoMax)}</span></li>
            </ul>
            <p class="fineprint">Ini perkiraan umum. Isolasi berakhir saat <em>seluruh</em> lenting berkeropeng. Tenaga kesehatan yang menentukan.</p>
          </div>`;
      }
    }

    if (dPap) {
      if (diffDays(dPap, today) < 0) {
        html += '<div class="res-card res-warn"><p>Tanggal kontak tidak boleh di masa depan.</p></div>';
      } else {
        const p = exposurePlan(dPap, today);
        const statusMsg = {
          early: `Hari ke-${p.dayNo} setelah kontak: masih sebelum jendela umum munculnya gejala, tetapi tetap pantau.`,
          watch: `Hari ke-${p.dayNo} setelah kontak: <strong>sedang dalam jendela pemantauan</strong>. Cek suhu dan kulit tiap hari.`,
          past: `Hari ke-${p.dayNo} setelah kontak: jendela pemantauan umum (21 hari) sudah lewat. Jika tidak ada gejala, risiko dari kontak itu sangat kecil.`
        }[p.status];
        const vaxNote = diffDays(today, p.vaccineDeadline) >= 0
          ? '<div class="extra"><strong>Masih dalam jendela vaksin pasca-paparan.</strong> Jika kamu belum kebal, segera tanyakan ke tenaga kesehatan hari ini.</div>'
          : '';
        html += `
          <div class="res-card res-notice">
            <h3>🔎 Jika kamu terpapar</h3>
            <p>${statusMsg}</p>
            <ul class="timeline">
              <li><span class="t-label">Gejala paling mungkin</span><span>${formatDate(p.watchStart)} s.d. ${formatDate(p.watchEnd)} (hari ke-10 sampai ke-21)</span></li>
              <li><span class="t-label">Batas ideal vaksin</span><span>± ${formatDate(p.vaccineDeadline)} (3–5 hari sejak kontak)</span></li>
            </ul>
            ${vaxNote}
            <p class="fineprint">Jika muncul demam atau ruam, segera isolasi diri dan lapor.</p>
          </div>`;
      }
    }

    out.innerHTML = html;
    out.focus();
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  $('#isoReset').addEventListener('click', () => { $('#isoForm').reset(); out.innerHTML = ''; });
}

/* ---------- Fitur 3: Checklist ---------- */
function initChecklist() {
  const KEY = 'sc_checklist';
  const total = CHECKLIST.reduce((n, g) => n + g.items.length, 0);
  let done = new Set(store.get(KEY, []));
  const validIds = new Set(CHECKLIST.flatMap(g => g.items.map(i => i[0])));
  done = new Set([...done].filter(id => validIds.has(id)));

  $('#clGroups').innerHTML = CHECKLIST.map(g => `
    <fieldset>
      <legend>${g.title}</legend>
      ${g.items.map(([id, label]) => `
        <label class="check"><input type="checkbox" data-id="${id}" ${done.has(id) ? 'checked' : ''}><span>${label}</span></label>`).join('')}
    </fieldset>`).join('');

  function update() {
    const pct = Math.round((done.size / total) * 100);
    $('#clText').textContent = `${done.size} dari ${total} selesai (${pct}%)`;
    $('#clFill').style.width = pct + '%';
    $('#clBar').setAttribute('aria-valuenow', String(pct));
    $('#clDone').hidden = done.size !== total;
  }
  $('#clGroups').addEventListener('change', (e) => {
    const cb = e.target.closest('input[type="checkbox"]');
    if (!cb) return;
    cb.checked ? done.add(cb.dataset.id) : done.delete(cb.dataset.id);
    store.set(KEY, [...done]);
    update();
  });
  $('#clReset').addEventListener('click', () => {
    done.clear(); store.set(KEY, []);
    $$('#clGroups input').forEach(i => { i.checked = false; });
    update();
  });
  update();
}

/* ---------- Fitur 4: Kuis ---------- */
function initQuiz() {
  const box = $('#quizBox');
  let order = [], i = 0, score = 0;

  function start() {
    order = shuffle(QUIZ).map(q => ({
      q: q.q, why: q.why,
      opts: shuffle(q.opts.map((t, k) => ({ t, ok: k === 0 })))
    }));
    i = 0; score = 0; render();
  }

  function render() {
    if (i >= order.length) return finish();
    const cur = order[i];
    box.innerHTML = `
      <div class="quiz-top"><span>Pertanyaan ${i + 1} dari ${order.length}</span><span>Skor: ${score}</span></div>
      <div class="progress" aria-hidden="true"><span style="width:${(i / order.length) * 100}%"></span></div>
      <h3 id="qText">${cur.q}</h3>
      <div class="opts" role="group" aria-labelledby="qText">
        ${cur.opts.map((o, k) => `<button type="button" class="opt-btn" data-k="${k}">${o.t}</button>`).join('')}
      </div>
      <div class="quiz-fb" id="qFb" aria-live="polite"></div>
      <button type="button" class="btn btn-primary" id="qNext" hidden>${i === order.length - 1 ? 'Lihat hasil' : 'Lanjut'}</button>`;

    $$('.opt-btn', box).forEach(btn => btn.addEventListener('click', () => {
      const chosen = cur.opts[Number(btn.dataset.k)];
      $$('.opt-btn', box).forEach((b, k) => {
        b.disabled = true;
        if (cur.opts[k].ok) b.classList.add('correct');
      });
      const fb = $('#qFb');
      if (chosen.ok) { score++; btn.classList.add('correct'); fb.className = 'quiz-fb ok'; fb.innerHTML = '<strong>Benar!</strong> ' + cur.why; }
      else { btn.classList.add('wrong'); fb.className = 'quiz-fb bad'; fb.innerHTML = '<strong>Belum tepat.</strong> ' + cur.why; }
      const next = $('#qNext'); next.hidden = false; next.focus();
    }));
    $('#qNext').addEventListener('click', () => { i++; render(); });
  }

  function finish() {
    const best = store.get('sc_quiz_best', 0);
    const newBest = score > best;
    if (newBest) store.set('sc_quiz_best', score);
    const ratio = score / order.length;
    const msg = ratio === 1 ? 'Sempurna! Kamu siap jadi duta pencegahan cacar air di asrama.'
      : ratio >= 0.75 ? 'Bagus sekali! Sedikit lagi, ulangi untuk skor sempurna.'
      : ratio >= 0.5 ? 'Lumayan. Baca ulang bagian Edukasi lalu coba lagi.'
      : 'Ayo pelajari lagi bagian Edukasi dan Anti-Hoaks, lalu coba kembali.';
    box.innerHTML = `
      <div style="text-align:center">
        <div class="score-big">${score}/${order.length}</div>
        <p><strong>${msg}</strong></p>
        <p class="muted">Skor terbaikmu: ${Math.max(best, score)}/${order.length}${newBest ? ' 🎉 (rekor baru)' : ''}</p>
        <button type="button" class="btn btn-primary" id="qAgain">Ulangi kuis</button>
      </div>`;
    $('#qAgain').addEventListener('click', start);
  }
  start();
}

/* ---------- Fitur 5: Anti-hoaks ---------- */
function initMyths() {
  const list = $('#hoaksList'), search = $('#hoaksSearch'), count = $('#hoaksCount');
  function render(q) {
    const term = (q || '').trim().toLowerCase();
    const found = MYTHS.filter(x => !term || (x.m + ' ' + x.f).toLowerCase().includes(term));
    count.textContent = `${found.length} dari ${MYTHS.length} mitos`;
    list.innerHTML = found.length ? found.map(x => `
      <details class="myth">
        <summary><span class="tag m">MITOS</span><span>${x.m}</span></summary>
        <div class="fact"><span class="tag f">FAKTA</span><span>${x.f}</span></div>
      </details>`).join('') : '<p class="empty">Tidak ada yang cocok. Coba kata kunci lain.</p>';
  }
  search.addEventListener('input', () => render(search.value));
  render('');
}

/* ---------- Fitur 6: Pembuat laporan ---------- */
function initReport() {
  const ids = ['lpNama', 'lpKamar', 'lpTgl', 'lpGejala', 'lpKontak', 'lpVaksin', 'lpWa'];
  const el = Object.fromEntries(ids.map(id => [id, $('#' + id)]));
  const out = $('#laporOut'), send = $('#lpSend');
  const now = new Date();
  el.lpTgl.max = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  el.lpWa.value = store.get('sc_wa', '');

  function refresh() {
    const text = buildReport({
      nama: el.lpNama.value, kamar: el.lpKamar.value, tgl: el.lpTgl.value,
      gejala: el.lpGejala.value, kontak: el.lpKontak.value, vaksin: el.lpVaksin.value
    });
    out.value = text;
    const phone = normalizePhone(el.lpWa.value);
    send.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
  }
  ids.forEach(id => el[id].addEventListener('input', refresh));
  el.lpWa.addEventListener('change', () => store.set('sc_wa', el.lpWa.value));
  $('#laporForm').addEventListener('submit', e => e.preventDefault());

  $('#lpCopy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(out.value);
      toast('Pesan disalin ✔');
    } catch (e) {
      out.select();
      const ok = document.execCommand && document.execCommand('copy');
      toast(ok ? 'Pesan disalin ✔' : 'Gagal menyalin, salin manual ya');
    }
  });
  refresh();
}
