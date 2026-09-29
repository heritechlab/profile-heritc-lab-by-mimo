# PRD: Website Profil Personal — Heri

| | |
|---|---|
| **Versi** | 0.1 (Draft) |
| **Tanggal** | 25 September 2026 |
| **Pemilik produk** | Heri |
| **Status** | Menunggu data sumber (handle & URL) |

---

## 1. Ringkasan

Website profil personal yang menjadi **satu pintu utama** untuk semua jejak digital Heri: profil singkat, kanal YouTube, akun media sosial, proyek di GitHub, dan website aktif yang dikelola. Pengunjung (calon klien, rekan kerja, kampus/institusi, penonton YouTube) bisa memahami siapa Heri, apa keahliannya, dan bukti kerjanya dalam kurang dari satu menit.

## 2. Latar Belakang & Masalah

- Konten dan karya tersebar di banyak tempat (YouTube, GitHub, sosmed, beberapa website), sehingga sulit dinilai secara utuh.
- Tidak ada satu URL yang bisa dibagikan untuk perkenalan profesional.
- Portofolio proyek dan website yang dikelola belum tersaji dengan konteks (peran, teknologi, hasil).

## 3. Tujuan & Non-Tujuan

**Tujuan**
1. Menjadi hub tunggal (`link in bio` yang lebih kaya) untuk seluruh kanal dan karya.
2. Menampilkan kredibilitas: keahlian, proyek, dan website aktif dengan bukti nyata.
3. Mengarahkan trafik ke YouTube, GitHub, dan sosmed.
4. Memudahkan orang menghubungi Heri untuk kerja sama/konsultasi.
5. Konten terbarui otomatis sebisa mungkin (video terbaru, repo terbaru) tanpa edit manual.

**Non-Tujuan (v1)**
- Bukan platform blog penuh atau CMS multi-penulis.
- Tidak ada sistem login/akun pengunjung.
- Tidak ada e-commerce atau pembayaran.

## 4. Target Pengguna

| Persona | Kebutuhan | Yang dicari di situs |
|---|---|---|
| Calon klien / mitra proyek | Menilai kemampuan cepat | Layanan, proyek unggulan, kontak |
| Penonton YouTube | Tahu siapa di balik kanal | Profil, video terbaru, tautan sosmed |
| Rekan teknis / rekruter | Menilai kualitas teknis | GitHub, stack, studi kasus |
| Institusi (kampus, organisasi) | Verifikasi pengalaman | Website yang dikelola, peran, rekam jejak |

## 5. Sumber Konten

> **Perlu diisi Heri.** Semua kolom bertanda `[ISI]` dibutuhkan agar konten bisa ditarik dan dirakit.

| Sumber | Data yang diambil | Metode | Handle/URL |
|---|---|---|---|
| YouTube | Nama kanal, deskripsi, jumlah subscriber, video terbaru & populer, playlist | YouTube Data API v3 (atau RSS feed kanal sebagai opsi tanpa API key) | `[ISI]` |
| GitHub | Repo pilihan (pinned), bahasa, stars, deskripsi, aktivitas terakhir | GitHub REST/GraphQL API, cache berkala | `[ISI]` |
| Media sosial (Instagram/TikTok/Facebook/X/LinkedIn dll.) | Bio, foto profil, tautan | Manual (tautan + ikon); embed hanya bila stabil | `[ISI]` |
| Website aktif yang dikelola | Nama, URL, deskripsi, peran Heri, stack, screenshot, status uptime | Data manual (file JSON/YAML) + screenshot otomatis | `[ISI]` daftar URL |

Catatan: API resmi dipakai jika tersedia; untuk platform yang membatasi akses (mis. Instagram/TikTok), cukup tautan dan info manual agar tidak melanggar ketentuan platform dan tidak rapuh.

## 6. Ruang Lingkup Fitur

### 6.1 MVP (v1.0)

1. **Hero** — foto, nama, tagline satu kalimat, tombol utama (Lihat Karya, Hubungi Saya).
2. **Tentang Saya** — bio singkat, bidang keahlian, lokasi (level kota/negara saja), bahasa.
3. **Keahlian** — dikelompokkan, mis. jaringan & infrastruktur, sistem elektrikal/PLTS, audio-visual & live streaming, self-hosting/virtualisasi, pengembangan web. *(Usulan awal; sesuaikan.)*
4. **YouTube** — kartu kanal + grid video terbaru (auto-update) + tombol subscribe.
5. **Proyek GitHub** — kartu repo pilihan: nama, deskripsi, bahasa/teknologi, stars, tautan; filter berdasarkan teknologi.
6. **Website yang Dikelola** — kartu per website: screenshot, nama, URL, peran, stack, status (aktif), tautan kunjungi.
7. **Tautan Sosial** — ikon ke semua akun.
8. **Kontak** — email/WhatsApp (tautan langsung) dan form sederhana dengan anti-spam.
9. **SEO dasar & Open Graph** — meta, sitemap, kartu pratinjau saat dibagikan.
10. **Responsif** — mobile-first (mayoritas trafik dari HP).

### 6.2 Fase 2

- Studi kasus per proyek/website (masalah → solusi → hasil), termasuk dokumentasi setup jaringan, PLTS, atau streaming.
- Blog/catatan teknis (Markdown).
- Halaman "Now"/aktivitas terbaru.
- Statistik publik (jumlah video, repo, uptime).
- Mode gelap/terang dan dua bahasa (Indonesia/Inggris).
- Widget uptime untuk website yang dikelola.

### 6.3 Di Luar Lingkup

Komentar, akun pengguna, pembayaran, dashboard admin kompleks.

## 7. Struktur Halaman

```
/                 Beranda (hero + ringkasan semua seksi)
/tentang          Profil lengkap & keahlian
/proyek           Daftar proyek GitHub (+ filter)
/website          Website yang dikelola
/youtube          Kanal & video
/kontak           Form & tautan kontak
/404
```

Untuk v1, semua konten juga bisa disajikan sebagai satu halaman scroll dengan anchor.

## 8. Persyaratan Fungsional

| ID | Persyaratan | Prioritas |
|---|---|---|
| F-01 | Menampilkan video YouTube terbaru otomatis (minimal 6) | Must |
| F-02 | Menampilkan repo GitHub pilihan dengan metadata terbarui | Must |
| F-03 | Daftar website dikelola dari satu file data (tanpa ubah kode) | Must |
| F-04 | Tautan sosial dikelola dari satu file konfigurasi | Must |
| F-05 | Form kontak terkirim ke email dengan proteksi spam | Must |
| F-06 | Pratinjau Open Graph benar saat dibagikan di WhatsApp/sosmed | Must |
| F-07 | Cache data API (mis. 6–24 jam) agar cepat dan hemat kuota | Should |
| F-08 | Screenshot website otomatis/manual per kartu | Should |
| F-09 | Mode gelap/terang | Could |
| F-10 | Versi dua bahasa | Could |

## 9. Persyaratan Non-Fungsional

- **Performa:** LCP < 2,5 dtk pada 4G; skor Lighthouse ≥ 90 (Performance, SEO, Accessibility).
- **Ringan:** cocok untuk koneksi terbatas; gambar WebP/AVIF, lazy loading.
- **Keamanan:** HTTPS, API key hanya di sisi server/build, header keamanan, rate limit form.
- **Aksesibilitas:** kontras cukup, navigasi keyboard, teks alternatif.
- **Ketersediaan:** target uptime ≥ 99,5%.
- **Privasi:** tidak menampilkan alamat rumah, nomor pribadi yang tidak dikehendaki, atau data sensitif lain; kontak lewat kanal yang Heri pilih.

## 10. Rekomendasi Arsitektur

Karena Heri sudah terbiasa dengan self-hosting, ada dua opsi:

| Opsi | Stack | Kelebihan | Kekurangan |
|---|---|---|---|
| **A (Disarankan)** | Site statis (Astro atau Next.js static export) + build terjadwal (GitHub Actions) yang menarik data YouTube/GitHub ke file JSON | Sangat cepat, murah, aman, mudah di-hosting di mana saja | Update data menunggu build berikutnya (mis. tiap 6 jam) |
| B | Next.js SSR + API route dengan cache | Data lebih real-time | Butuh server/runtime; lebih banyak perawatan |

**Hosting:** Cloudflare Pages/Netlify/Vercel (gratis) atau self-host di VPS/Proxmox milik sendiri di belakang reverse proxy (Nginx/Caddy) dengan Cloudflare di depan.
**Form kontak:** layanan form (Formspree/Web3Forms) atau endpoint kecil sendiri.
**Analitik:** Plausible/Umami (ringan, ramah privasi) atau Google Analytics.
**Domain:** `[ISI]` (mis. nama sendiri `.id`/`.com`).

## 11. Model Data (contoh)

```yaml
# data/websites.yml
- nama: "[ISI]"
  url: "https://..."
  deskripsi: "[ISI]"
  peran: "Pengelola / Developer / Admin"
  stack: ["WordPress", "Nginx", "Cloudflare"]
  status: aktif
  screenshot: /img/websites/nama.webp

# data/social.yml
- platform: youtube
  url: "https://youtube.com/@..."
- platform: github
  url: "https://github.com/..."

# data/github.yml (pilihan repo)
pinned: ["repo-1", "repo-2", "repo-3"]
```

## 12. Arah Desain

- Bersih, modern, dominan teks dan kartu; nuansa "teknisi kreator": profesional tetapi hangat.
- Warna: 1 warna aksen + netral; konsisten dengan branding kanal YouTube (logo/warna kanal dipakai sebagai acuan).
- Tipografi: 1 font sans-serif untuk badan, 1 untuk judul.
- Komponen: kartu proyek/website/video dengan pola seragam.
- Bahasa utama: **Indonesia** (Inggris di Fase 2).

## 13. Metrik Keberhasilan

| Metrik | Target 3 bulan |
|---|---|
| Pengunjung unik/bulan | `[tentukan]` |
| Klik keluar ke YouTube/GitHub/sosmed | ≥ 25% dari pengunjung |
| Pesan/permintaan kerja sama masuk | ≥ `[tentukan]` per bulan |
| Skor Lighthouse | ≥ 90 semua kategori |
| Waktu pembaruan konten (video/repo baru tampil) | ≤ 24 jam |

## 14. Timeline (perkiraan, 1 orang paruh waktu)

| Minggu | Kegiatan |
|---|---|
| 1 | Kumpulkan data sumber, finalisasi konten & branding, pilih domain/hosting |
| 2 | Desain (wireframe → tampilan), siapkan file data |
| 3 | Bangun MVP: hero, tentang, keahlian, YouTube, GitHub, website, kontak |
| 4 | Integrasi API + build terjadwal, SEO/OG, uji performa & mobile |
| 5 | Peluncuran, pasang analitik, bagikan ke semua kanal |
| 6+ | Fase 2 sesuai prioritas |

## 15. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Batas kuota/perubahan API | Data tidak muncul | Cache + fallback ke data terakhir/manual |
| Platform sosmed membatasi embed | Tampilan rusak | Gunakan tautan + ikon saja |
| Konten tidak terawat | Situs terlihat usang | Otomasi build terjadwal, data terpusat |
| Kebocoran info pribadi | Privasi | Tinjau seluruh konten sebelum publikasi; kontak lewat form/kanal terpilih |
| Spam pada form | Kotak masuk penuh | Honeypot/CAPTCHA + rate limit |

## 16. Pertanyaan Terbuka

1. Username GitHub, handle YouTube, dan akun sosmed apa saja yang ingin ditampilkan?
2. Daftar URL website aktif yang dikelola beserta perannya di masing-masing?
3. Repo mana yang ingin ditonjolkan, dan adakah yang harus disembunyikan (privat/sensitif)?
4. Tujuan utama: cari klien/jasa, personal branding YouTube, atau portofolio karier?
5. Sudah punya domain? Preferensi hosting (gratis vs self-host)?
6. Bahasa: Indonesia saja, atau dua bahasa sejak awal?
7. Kontak apa yang boleh dipublikasikan (email, WhatsApp, lainnya)?

## 17. Kriteria Penerimaan MVP

- Semua seksi MVP tampil benar di mobile dan desktop.
- Video YouTube dan repo GitHub terbarui otomatis sesuai jadwal.
- Minimal 3 website aktif dan 3 repo unggulan tampil dengan data lengkap.
- Form kontak berhasil mengirim dan menolak spam sederhana.
- Skor Lighthouse ≥ 90; pratinjau tautan benar di WhatsApp.
- Tidak ada API key atau data sensitif terekspos di sisi klien.
