# 🛍️ TAWZOON NEXUS — Enterprise E-Commerce & Reseller Platform

Welcome to the **TAWZOON NEXUS** full-stack application codebase. TAWZOON is a high-performance e-commerce storefront, authorized reseller affiliate platform, and dynamic administration panel built with React, TypeScript, Tailwind CSS, Node.js, Express, and Firebase.

---

## 🚀 Quick Start Guide (Local Setup)

Follow these simple steps to set up and run the full application on your local machine:

### 1. Prerequisites
Ensure you have **Node.js (v18.0.0 or higher)** and **npm** installed:
```bash
node -v
npm -v
```

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/tamim22439516-cpu/trtrrt.git
cd trtrrt
npm install
```

### 3. Environment Setup
Copy the sample environment configuration file:
```bash
cp .env.example .env
```
*(Optional: You can edit `.env` to customize your local port or credentials).*

### 4. Running the Development Server
Start the full-stack Node.js Express & Vite development engine:
```bash
npm run dev
```
Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🛠️ Production Build & Deployment

To create an optimized production build and launch the production server:

```bash
# 1. Compile TypeScript & Build Frontend Assets
npm run build

# 2. Launch Production Node.js Engine
npm start
```

---

## 🔑 Admin Credentials

- **Admin Login Route:** Navigate to `http://localhost:3000/#admin` or click **Admin Portal** from the menu.
- **Default Email:** `mdshaali9516@gmail.com`
- **Default Password:** `TawzoonNexus@9516`

---

## 📂 Project Architecture

```
├── data/                    # JSON database storage directory (auto-created)
│   ├── store.json           # Primary local database state
│   └── store.backup.json    # Automatic backup snapshot
├── public/                  # Static assets, branding images, uploads & PWA manifest
├── server.ts                # Express engine, real-time SSE stream, auth & API routes
├── server/                  # Server database engine & Firebase Cloud sync handlers
│   ├── db.ts                # Dual-layer JSON & Firestore persistence manager
│   └── firebase.ts          # Firebase Admin SDK & Cloud Storage integration
└── src/                     # React Frontend application
    ├── components/          # Modular UI components (Storefront, Admin, Reseller)
    ├── context/             # Global React AppContext & Toast Manager
    ├── hooks/               # Custom hooks (Real-time SSE events, PWA install)
    ├── services/            # Frontend API client & storage helpers
    ├── types/               # TypeScript interfaces & types
    └── utils/               # Audio engine, image compressor & pricing calculators
```

---

## ⚡ Features Included

- 🛒 **Public Storefront:** Dynamic product showcase, cart slider, instant checkout.
- 💼 **Reseller Affiliate Hub:** Order placement, live commission ledger, wallet top-up & payouts.
- 🛡️ **Admin Portal:** Product CRUD, category reordering, order management, audit logs, and website publish controls.
- 🔔 **Realtime Event Streaming:** Live notifications with sound effects.
- 📱 **Progressive Web App (PWA):** Offline support and mobile installation prompts.
