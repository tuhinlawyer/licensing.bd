# licensing.bd — Bangladesh's Compliance Intelligence Platform

A SaaS web application where businesses track their licenses, store compliance documents, and receive renewal reminders.

## 🏗️ Architecture

This project follows a **two-system architecture**:

```
┌─────────────────────────┐         ┌─────────────────────────┐
│   Next.js Frontend      │         │   Express.js Backend    │
│   (Port 3000)           │◄───────►│   (Port 5000)           │
│                         │  REST   │                         │
│ - App Router            │  API    │ - RESTful API           │
│ - TypeScript            │         │ - JWT Auth              │
│ - Tailwind CSS          │         │ - Supabase Integration  │
│ - Supabase Auth         │         │ - S3 Storage            │
│ - i18n (en/bn)          │         │ - Payment Gateways      │
└─────────────────────────┘         └─────────────────────────┘
         │                                   │
         │                                   │
         ▼                                   ▼
┌─────────────────────────────────────────────────────────┐
│                    External Services                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Supabase │  │ AWS S3   │  │ SendGrid │  │ SSLCOMMERZ││
│  │(PostgreSQL)│ │(Storage) │  │ (Email)  │  │(Payment) │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│  ┌──────────┐                                          │
│  │  Stripe  │                                          │
│  │(Payment) │                                          │
│  └──────────┘                                          │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

### Frontend (`/frontend`)
Next.js 14 application with App Router.

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── (auth)/               # Auth layout group
│   ├── dashboard/            # User dashboard
│   ├── licenses/             # License management
│   ├── documents/            # Document vault
│   ├── settings/             # User settings
│   ├── login/                # Login page
│   └── register/             # Registration page
├── components/               # Reusable React components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility libraries
├── public/                   # Static assets
├── styles/                   # Global styles
├── types/                    # TypeScript type definitions
└── utils/                    # Helper functions
```

### Backend (`/backend`)
Express.js REST API server.

```
backend/
├── src/
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Data models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   └── utils/                # Utility functions
└── tests/                    # Test files
```

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Authentication:** Supabase Auth
- **i18n:** next-intl (English & Bangla)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **Authentication:** JWT + Supabase Auth
- **File Storage:** AWS S3 (encrypted)
- **Email:** SendGrid
- **Payments:** SSLCOMMERZ (BD) + Stripe (International)
- **Security:** Helmet, CORS, Rate Limiting

## 🎨 Brand Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| Navy | `#0A2540` | Primary brand color |
| Green | `#00C48C` | Accent/CTA buttons |
| Slate | `#1E293B` | Text color |
| Light Gray | `#F1F5F9` | Background |

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- AWS account (for S3)
- SendGrid account
- SSLCOMMERZ account (for BD payments)
- Stripe account (for international payments)

### Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your credentials
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

## 📄 Environment Variables

See `.env.example` files in both frontend and backend directories for all required environment variables.

## 🔐 Security Features

- Row Level Security (RLS) in Supabase
- Encrypted document storage in S3
- JWT-based authentication
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation with express-validator

## 💳 Payment Integration

- **SSLCOMMERZ:** For local Bangladesh payments (BDT)
- **Stripe:** For international payments (USD, EUR, etc.)

## 🌐 Internationalization

The platform supports:
- **English (en)** - Default
- **Bangla (bn)** - বাংলা

## 📝 License

Proprietary - All rights reserved.

## 📞 Support

For support, email: support@licensing.bd

---

Built with ❤️ for Bangladesh businesses
