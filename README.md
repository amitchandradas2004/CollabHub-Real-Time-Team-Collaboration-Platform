# CollabHub — Real-Time Team Collaboration Platform ⚡

[![Live Demo](https://img.shields.io/badge/Live_Demo-collabhub--delta.vercel.app-6366F1?style=for-the-badge&logo=vercel)](https://collabhub-delta.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-Latest-indigo?style=for-the-badge)](https://better-auth.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-purple?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

A modern, high-performance SaaS workspace platform built for real-time team collaboration, task management, and project execution. Powered by Next.js 16 App Router, Better Auth, and MongoDB.

🔗 **Live Deployment**: [https://collabhub-delta.vercel.app](https://collabhub-delta.vercel.app)

---

## 🌐 Live Demo

Experience the live application deployed on Vercel:
👉 **[https://collabhub-delta.vercel.app](https://collabhub-delta.vercel.app)**

---

## 🌟 Features

- **⚡ Full Authentication & Session Management**: Powered by **Better Auth** with MongoDB adapter. Features instant email/password sign-up, sign-in, live session detection, profile image URL previews, and session persistence.
- **🛡️ Role-Based System**: Seamless automatic default role assignment (`Team Member`) saved directly to user documents upon registration.
- **✨ Premium UI & Aesthetics**: Dark/Light mode support, glassmorphic navigation bars, vibrant ambient glows, and Framer Motion micro-animations.
- **📱 Fully Responsive Mobile Experience**:
  - Compact right-side mobile drawer with independent route scrolling (`flex-1 overflow-y-auto min-h-0`).
  - Dynamic mobile viewport height handling (`100dvh`) preventing iOS Safari / Android Chrome URL bar clipping.
  - Pinned profile card and red Logout action button (`variant="danger"`).
- **🚀 Smart Hero Section**:
  - Dynamic CTA button that adapts based on user authentication state (renders skeleton loader during initial check, **Continue to Dashboard** for logged-in users, and **Get Started** for guests).
- **🎨 Custom 404 Not Found Page**: Fully animated, theme-aware 404 page featuring a floating glass badge, **Back to Home**, and **Login** quick actions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router, Turbopack)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [Better Auth](https://better-auth.com/) (`better-auth/react` & `better-auth/adapters/mongodb`)
- **Database**: [MongoDB](https://www.mongodb.com/) (Native MongoClient Adapter with HMR connection pooling)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Glassmorphic Utilities
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 📁 Project Structure

```
CollabHub_Client/
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/   # Better Auth API catch-all endpoint
│   │   ├── login/               # Authentication Sign-In page
│   │   ├── register/            # User Registration page
│   │   ├── not-found.tsx        # Custom animated 404 page
│   │   ├── layout.tsx           # Root layout with theme & session providers
│   │   └── page.tsx             # Home landing page with HeroSection
│   ├── components/
│   │   ├── home/                # HeroSection and marketing components
│   │   ├── layout/              # Navbar, Sidebar drawer, Footer
│   │   ├── theme/               # Dark/Light ThemeToggle & ThemeProvider
│   │   └── ui/                  # Reusable Glass Buttons, Modals (LogoutModal)
│   └── lib/
│       ├── auth.ts              # Server Better Auth configuration & MongoDB connection
│       └── auth-client.ts       # React client hooks (useSession, signIn, signOut)
├── .env                         # Environment configuration
├── tailwind.config.ts           # Tailwind CSS configuration & theme tokens
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A running **MongoDB** database instance (MongoDB Atlas cluster or local MongoDB service)

### 1. Clone the Repository

```bash
git clone https://github.com/amitchandradas2004/CollabHub-Real-Time-Team-Collaboration-Platform.git
cd CollabHub-Real-Time-Team-Collaboration-Platform/CollabHub_Client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root of the project:

```env
# Application URL
BETTER_AUTH_URL=http://localhost:3000

# Better Auth Secret (Generate a strong random string)
BETTER_AUTH_SECRET=your_super_secret_auth_key_here

# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/collabhub?retryWrites=true&w=full
```

### 4. Run Development Server

Start the local Next.js development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs Next.js development server on `http://localhost:3000` |
| `npm run build` | Compiles an optimized production build |
| `npm start` | Launches Next.js production server |
| `npm run lint` | Runs ESLint code quality checks |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
