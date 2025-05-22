# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Cara Install

1. Pastikan Node.js dan npm sudah terinstall di komputer Anda.
2. Clone repository ini:
   ```powershell
   git clone <url-repo-anda>
   cd vh-ai_crm-fe
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Jalankan aplikasi:
   ```powershell
   npm run dev
   ```
5. Buka browser dan akses `http://localhost:5173`.

---

## Struktur Folder

- `public/` : Asset publik seperti gambar dan ikon.
- `src/` : Seluruh source code aplikasi.
  - `api/` : Kumpulan file API request.
  - `assets/` : Asset statis (logo, svg, dll).
  - `components/` : Komponen UI reusable.
  - `data/` : Data mock dan geo features.
  - `redux/` : State management (Redux store & slice).
  - `routes/` : Routing protection.
  - `scenes/` : Halaman utama aplikasi (dashboard, login, register, dll).
  - `theme.js` : Konfigurasi tema dan color palette.
  - `service.js` : Service utilitas.
  - `main.jsx` : Entry point React.
  - `route.jsx` : Definisi route aplikasi.

---

## Color Palette

Color palette didefinisikan di `src/theme.js` dan mendukung mode gelap & terang. Berikut beberapa warna utama:

### Dark Mode
- **Primary**: `#141b2d`, `#1F2A40`, `#727681`
- **Grey**: `#e0e0e0`, `#a3a3a3`, `#666666`, `#141414`
- **Green Accent**: `#4cceac`, `#70d8bd`, `#dbf5ee`
- **Red Accent**: `#db4f4a`, `#e2726e`, `#f8dcdb`
- **Blue Accent**: `#6870fa`, `#868dfb`, `#e1e2fe`

### Light Mode
- **Primary**: `#040509`, `#f2f0f0`, `#727681`
- **Grey**: `#141414`, `#666666`, `#e0e0e0`
- **Green Accent**: `#4cceac`, `#70d8bd`, `#dbf5ee`
- **Red Accent**: `#db4f4a`, `#e2726e`, `#f8dcdb`
- **Blue Accent**: `#6870fa`, `#868dfb`, `#e1e2fe`

Untuk detail lengkap, lihat file `src/theme.js`.

---
