# Kunci tanda tangan APK

File ini sengaja disimpan di repo (atas persetujuan pemilik) supaya APK rilis bisa dibuat otomatis tanpa pengaturan manual, dan update bisa dipasang di atas versi lama tanpa menghapus data.

Konsekuensinya: karena repo publik, orang lain secara teknis bisa membuat APK dengan tanda tangan yang sama. Unduh Sehat12 hanya dari halaman Releases repo ini.

Jika nanti ingin lebih aman, isi secret `ANDROID_KEYSTORE_BASE64` dan `ANDROID_KEYSTORE_PASSWORD` dengan kunci yang sama; workflow akan memakai secret itu lebih dulu.
