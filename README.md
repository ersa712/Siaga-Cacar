# 🛡️ SiagaCacar Asrama

**Website edukasi dan alat bantu pencegahan cacar air (varisela) di lingkungan asrama.**
Proyek Informatika: Dampak Sosial Informatika. Dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework, tanpa server).

> Demo: `https://<username>.github.io/<nama-repo>/` *(isi setelah deploy)*
> Pembuat: `[Nama kamu] · [Kelas] · [Sekolah]` *(ganti)*

---

## 1. Masalah yang diangkat

**Informasi kesehatan di asrama menyebar lewat grup chat dan pesan berantai secara cepat, tetapi rentan keliru dan terlambat ditindaklanjuti**, sehingga cacar air mudah menular dan penanganannya sering salah.

### Penyebab
- Info beredar lewat WhatsApp/pesan berantai tanpa dicek sumbernya (hoaks dan mitos).
- Tidak ada satu rujukan singkat yang mudah diakses penghuni.
- Takut dijauhi (stigma) sehingga gejala disembunyikan dan laporan terlambat.
- Hunian padat, ventilasi terbatas, dan kebiasaan berbagi barang.

### Dampak
- Penularan cepat antar-kamar dan antar-blok.
- Penanganan keliru (mis. dilarang mandi, ramuan tidak terbukti).
- Panik, saling menyalahkan, dan pengucilan teman yang sakit.
- Absen sekolah dan terganggunya belajar.
- Risiko lebih berat bagi kelompok rentan di sekitar.

### Pihak yang terdampak
Penghuni asrama, pembina/pengasuh, petugas UKS/klinik, orang tua, dan pengelola sekolah.

## 2. Tujuan dan sasaran pengguna

**Tujuan**
1. Menyediakan edukasi cacar air yang ringkas dan terpercaya.
2. Mendorong deteksi dini dan pelaporan cepat lewat fitur yang berfungsi.
3. Membangun kebiasaan bersih di kamar asrama.
4. Melawan hoaks dan stigma dengan literasi digital.

**Sasaran pengguna:** penghuni asrama usia SMP–SMA (13–19 tahun) sebagai pengguna utama; pembina dan petugas UKS sebagai pengguna pendukung.

## 3. Fitur

| Fitur | Fungsi | Cara kerja |
|---|---|---|
| **Edukasi** | Penjelasan penyakit, penularan, tahap ruam, pencegahan, penanganan, tanda bahaya | Akordeon `<details>` (aksesibel tanpa JS) |
| **Cek gejala mandiri** | Panduan langkah berikutnya (4 tingkat: aman, pantau, mungkin cacar, darurat) | Fungsi `evaluateSymptoms()` berbasis aturan |
| **Kalkulator isolasi & pemantauan** | Perkiraan masa menular, isolasi, dan jendela pemantauan setelah kontak | Fungsi `isolationPlan()` dan `exposurePlan()` |
| **Checklist asrama** | Kebiasaan bersih dengan progress bar | Disimpan di `localStorage` perangkat |
| **Kuis** | 8 soal, jawaban diacak, penjelasan tiap soal, skor terbaik | Algoritma Fisher–Yates |
| **Pelurus hoaks** | 10 mitos vs fakta dengan pencarian | Filter teks real-time |
| **Pembuat laporan** | Menyusun pesan laporan siap salin/kirim ke WhatsApp pembina | `wa.me` + `encodeURIComponent` |
| **Mode gelap, responsif, aksesibel** | Nyaman di ponsel, navigasi keyboard, skip link, `prefers-reduced-motion` | CSS variables |

**Privasi:** tidak ada server, tidak ada login. Semua data diproses di perangkat pengguna. Hanya progres checklist, skor kuis, tema, dan nomor WA pembina (jika diisi) yang disimpan di `localStorage`.

## 4. Struktur proyek

```
├── index.html   # struktur halaman, konten edukasi, navigasi
├── style.css    # tampilan responsif, tema terang/gelap
├── script.js    # data + logika murni + interaksi DOM
└── README.md
```

`script.js` memisahkan **logika murni** (bisa diuji di Node) dari **kode DOM** sehingga mudah diuji.

## 5. Menjalankan

**Lokal:** buka `index.html` di browser. Tidak perlu instalasi.

**GitHub Pages:**
1. Buat repository baru di GitHub, lalu unggah keempat file.
2. Buka **Settings → Pages**.
3. Pada *Build and deployment*, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu 1–2 menit; alamat situs muncul di halaman Pages.

## 6. Pengujian

Logika diuji otomatis dengan Node (`node --check script.js` untuk sintaks, lalu pengujian fungsi). Kasus yang diuji:

| Kasus | Hasil yang diharapkan |
|---|---|
| Tidak ada gejala | Risiko rendah |
| Hanya demam | Risiko rendah + saran periksa jika berlanjut |
| Hanya kontak dengan penderita | Pantau |
| Ruam + gatal, atau ada lenting | Kemungkinan cacar air (isolasi + lapor) |
| Lenting + sesak napas | Darurat |
| Ruam muncul 20 Nov, hari ini 25 Nov | Hari ke-6, mendekati akhir isolasi |
| Kontak 23 Nov, hari ini 25 Nov | Masa awal; masih dalam jendela vaksin pasca-paparan |
| Tanggal tidak valid (30 Feb) | Ditolak |
| Nomor `0812-3456-789` | Dinormalisasi menjadi `628123456789` |

**Uji manual yang perlu kamu lakukan sendiri** (centang setelah dicoba):
- [ ] Buka di ponsel dan laptop; menu hamburger berfungsi
- [ ] Mode gelap/terang berganti dan tersimpan setelah refresh
- [ ] Cek gejala: coba semua tingkat hasil
- [ ] Kalkulator: isi tanggal ruam, tanggal kontak, dan keduanya
- [ ] Checklist tersimpan setelah halaman dimuat ulang
- [ ] Kuis sampai selesai, lalu ulangi
- [ ] Tombol “Salin pesan” dan “Kirim via WhatsApp”
- [ ] Navigasi dengan keyboard (Tab) dan skip link

## 7. Penggunaan AI secara kritis

> **Catatan:** bagian ini harus mencerminkan proses yang benar-benar kamu lakukan. Edit tabel di bawah sesuai pengalamanmu, tambahkan prompt aslinya, dan tulis koreksi yang kamu buat sendiri.

AI (Claude) dipakai untuk membantu menyusun ide fitur, kerangka kode HTML/CSS/JS, dan data konten. Hasilnya **tidak diterima begitu saja**:

| Tahap | Bantuan AI | Pemeriksaan yang dilakukan |
|---|---|---|
| Ide & masalah | Menyusun rumusan masalah (hoaks + keterlambatan lapor) | Dicocokkan dengan situasi nyata di asrama kami: `[tulis hasil pengamatanmu]` |
| Konten medis | Menyusun isi edukasi, mitos/fakta, dan angka (inkubasi 10–21 hari, menular 1–2 hari sebelum ruam, 2 dosis vaksin, hindari aspirin) | Diverifikasi ke rujukan CDC, WHO, Kemenkes, dan IDAI; ditambah disclaimer bahwa ini bukan diagnosis |
| Kode | Membuat struktur, logika cek gejala, kalkulator, kuis | Dibaca baris demi baris, diuji dengan kasus di bagian 6, dan diperbaiki: `[tulis bug/perbaikan yang kamu temukan]` |
| Keamanan | — | Tidak ada data dikirim ke server; teks dari pengguna tidak dimasukkan ke `innerHTML` |
| Aksesibilitas | Saran label, kontras, fokus keyboard | Dicoba dengan navigasi keyboard dan mode gelap |

**Batasan yang disadari:** AI bisa keliru atau tidak mutakhir, terutama untuk angka medis. Karena itu pedoman resmi tetap menjadi rujukan utama, dan hasil cek gejala hanya berupa panduan, bukan diagnosis.

## 8. Rujukan

- CDC — Chickenpox: https://www.cdc.gov/chickenpox
- WHO (informasi varisela/vaksin varisela)
- Kementerian Kesehatan RI dan Ikatan Dokter Anak Indonesia (IDAI)

Periksa pembaruan pedoman di situs resminya sebelum dipakai sebagai acuan resmi sekolah.

## 9. Disclaimer

Konten bersifat edukasi umum dan **tidak menggantikan** pemeriksaan, diagnosis, atau pengobatan oleh dokter/tenaga kesehatan. Dalam keadaan darurat, segera hubungi fasilitas kesehatan terdekat.

## 10. Pengembangan lanjutan
- Dukungan bahasa daerah.
- Mode cetak poster/checklist.
- Pencatatan kasus anonim untuk pembina (memerlukan Google Apps Script/backend).
- Notifikasi pengingat vaksin.

## Lisensi
Untuk keperluan pembelajaran. Silakan dimodifikasi dengan mencantumkan sumber.
