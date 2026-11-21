# Sehat12

Aplikasi web gratis untuk program berat badan sehat 12 minggu. Bisa dipasang di HP seperti aplikasi biasa (PWA), dan tetap jalan tanpa internet.

**Unduh APK Android:** https://github.com/adisucipt8-ux/weightmanagement/releases/latest (file `Sehat12.apk`)

**Versi web:** https://adisucipt8-ux.github.io/weightmanagement/ (setelah GitHub Pages diaktifkan)

## Fitur

- Asesmen awal: IMT (kriteria Asia-Pasifik), BMR (Mifflin-St Jeor), kebutuhan kalori, target protein dan air, skrining kondisi yang perlu didampingi tenaga kesehatan
- Catat makan dan minum lewat foto, lalu pilih menu dari daftar makanan Indonesia (porsi, digoreng/tidak, santan, gula)
- Program 12 minggu dalam 4 fase, latihan harian untuk level pemula, menengah, dan lanjut
- Evaluasi mingguan yang menyesuaikan target secara otomatis
- Unsur game: level dan XP, tanaman yang tumbuh, misi harian, peti hadiah, tantangan mingguan, streak dengan perisai
- Pelatih dengan jawaban dasar dan aturan keselamatan

## Privasi

Semua data tersimpan di perangkat pengguna (localStorage, foto di IndexedDB). Tidak ada server, akun, atau pelacakan. Pengguna bisa mengunduh cadangan data dan menghapus semua data dari menu Profil.

## Keselamatan

Sehat12 adalah alat bantu gaya hidup, bukan pengganti pemeriksaan dokter. Aplikasi tidak memberi target di bawah 1.200 kkal (wanita) / 1.500 kkal (pria), membatasi target penurunan 0,5–1 kg per minggu, dan menyarankan konsultasi tenaga kesehatan bila IMT ≥35 atau <17, ada penyakit kronis, hamil/menyusui, usia <18 atau ≥60, atau tanda gangguan makan. Angka kalori adalah perkiraan.

## APK Android

APK dibuat otomatis oleh GitHub Actions (`.github/workflows/android.yml`) setiap ada perubahan di branch `main`, memakai [Capacitor](https://capacitorjs.com/) untuk membungkus aplikasi web. Hasilnya terbit di halaman Releases.

- Tanpa kunci rilis, workflow membuat APK versi debug (bisa dipasang, tapi pembaruan dengan kunci berbeda harus copot pasang dulu).
- Untuk APK rilis bertanda tangan tetap, tambahkan secret repo `ANDROID_KEYSTORE_BASE64` (file keystore dalam base64, alias `sehat12`) dan `ANDROID_KEYSTORE_PASSWORD`.

Build lokal (butuh Android SDK dan Java 17): `npm install && npm run android:prepare && cd android && ./gradlew assembleDebug`.

## Struktur

| File | Isi |
| --- | --- |
| `index.html` | Kerangka halaman |
| `app.css` | Tampilan (tema terang dan gelap) |
| `app.js` | Seluruh logika aplikasi dan data makanan |
| `sw.js` | Service worker untuk mode offline |
| `manifest.webmanifest`, `icons/` | Data pemasangan PWA |
| `capacitor.config.json`, `scripts/`, `assets/` | Pembungkus Android (Capacitor), ikon dan splash |

Tidak perlu proses build. Untuk mencoba di komputer: `python3 -m http.server`, lalu buka `http://localhost:8000`.
