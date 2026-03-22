# 💰 SavingApp: Sistem Manajemen Tabungan Digital

Aplikasi manajemen tabungan modern yang memungkinkan pengguna untuk mencatat pemasukan, alokasi tabungan, dan memantau target finansial secara real-time. Dibangun dengan arsitektur **Decoupled** menggunakan Laravel sebagai penyedia API dan React sebagai antarmuka pengguna.

---

## ✨ Fitur Utama
* **🔐 Authentication:** Sistem login dan register menggunakan Laravel Sanctum.
* **📊 Dashboard Finansial:** Ringkasan total saldo, tabungan masuk, dan pengeluaran.
* **💸 Transaction Management:** Pencatatan riwayat transaksi (Deposit/Withdraw) secara detail.
* **🎯 Saving Goals:** Fitur untuk menetapkan dan memantau progres target tabungan tertentu.
* **📱 Responsive Design:** Antarmuka yang optimal baik di desktop maupun perangkat mobile.

---

## 🛠️ Tech Stack

### Backend (API)
* **Framework:** [Laravel 11](https://laravel.com/)
* **Database:** MySQL / PostgreSQL
* **Authentication:** Laravel Sanctum (Token Based)
* **Tools:** Eloquent ORM, Arsitektur RESTful API.

### Frontend (UI)
* **Library:** [React.js](https://react.dev/)
* **State Management:** React Context API / Redux Toolkit
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios (untuk konsumsi API)

---

## 📂 Struktur Direktori
```text
/saving-app
  ├── /backend-api     <-- Source code Laravel
  ├── /frontend-react  <-- Source code React.js
  └── README.md
🚀 Panduan Instalasi & Run Project
Ikuti langkah-langkah berikut secara berurutan untuk menjalankan aplikasi di komputer Anda:

1. Persiapan Awal
Pastikan Anda sudah menginstal PHP >= 8.2, Composer, Node.js (NPM), dan MySQL (XAMPP/Laragon).

2. Clone & Setup Backend (API)
Buka terminal dan jalankan perintah berikut:

Bash
# Clone repository
git clone https://github.com/RayanHakim/saving-app.git
cd saving-app/backend-api

# Install dependensi & konfigurasi
composer install
cp .env.example .env
php artisan key:generate

# Migrasi Database
# (Pastikan sudah membuat database kosong di MySQL dan sesuaikan DB_DATABASE di .env)
php artisan migrate

# Jalankan Server Backend
php artisan serve
Backend kini berjalan di: http://127.0.0.1:8000

3. Setup Frontend (UI)
Buka terminal baru (jangan tutup terminal backend), lalu jalankan:

Bash
# Pindah ke folder frontend
cd ../frontend-react

# Install dependensi & setup API URL
npm install
echo "VITE_API_URL=http://127.0.0.1:8000/api" > .env

# Jalankan Aplikasi React
npm run dev
Frontend kini berjalan di: http://localhost:5173
