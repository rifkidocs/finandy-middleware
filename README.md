# Finandy Middleware

Aplikasi middleware untuk menerima webhook dari TradingView dan meneruskannya ke Finandy dengan pembatasan rate (jeda 30 detik antar request per koin).

## Fitur

- Menerima webhook dari TradingView
- Mendukung beberapa koin (WIF, GRT, PEPE, AEVO)
- Mengantrikan webhook dan mengirimnya dengan jeda 30 detik per koin
- Logging status pengiriman

## Instalasi

```bash
npm install
```

## Menjalankan Aplikasi

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## Cara Penggunaan

1. Aplikasi akan berjalan di `http://localhost:3000` (atau port yang dikonfigurasi di file .env)
2. Kirim webhook ke endpoint `/webhook` dengan body JSON yang berisi field `name` (nama koin)
3. Middleware akan mengantrikan request dan meneruskannya ke URL Finandy dengan jeda 30 detik per koin

## Konfigurasi

Edit file `.env` untuk mengubah port aplikasi:

```
PORT=3000
``` 