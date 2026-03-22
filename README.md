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
