# SpaceSnap — AI-Powered Interior Design Platform

SpaceSnap lets anyone become their own interior designer. Upload a photo of your room, run a style quiz, and use generative AI to visualise new colours, furniture, and layouts — all in the browser.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
  - [Backend .env](#backend-env)
  - [Frontend .env](#frontend-env)
- [API Overview](#api-overview)
- [User Roles](#user-roles)
- [Key Features In Depth](#key-features-in-depth)
- [Contributing](#contributing)

---

## Features

| Feature | Description |
|---|---|
| **Style Quiz** | Multi-step quiz that analyses your aesthetic preferences and returns a personalised style profile powered by Google Gemini |
| **AI Visualiser** | Upload a room photo, apply virtual wall colours, floor patterns, and draggable furniture items, then export a before/after comparison |
| **Room Redesign (AR Preview)** | Scan your room with your phone camera, select a photo, draw a mask over any object, and replace it using Stable Diffusion inpainting (Segmind API) |
| **Room Visualisation** | Send a room photo and a text prompt to a Hugging Face Gradio space to get a fully AI-generated redesign |
| **Gemini Image Analysis** | Analyse any room image with Google Gemini 2.5 Flash to receive detailed styling suggestions |
| **Designer Marketplace** | Registered users can browse and book consultations with approved designers |
| **Portfolio Gallery** | Designers can publish and manage portfolio items; users can browse an inspiration gallery |
| **Premium Upgrade** | Stripe-powered payment flow that unlocks premium features |
| **Multi-Role Dashboards** | Separate dashboards for admins, designers, and regular users |
| **Google OAuth** | Sign up / log in with Google in addition to email/password |
| **Email Verification** | OTP-based email verification on registration and password reset by email |

---

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 18 (JSX) |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 + PostCSS |
| Routing | React Router v6 |
| Animations | Framer Motion |
| 3D / AR | Three.js, @react-three/fiber, @react-three/drei, @react-three/xr, @google/model-viewer |
| Charts | Chart.js + react-chartjs-2 |
| Payments | Stripe (@stripe/react-stripe-js) |
| Auth | React Context + JWT (localStorage) + @react-oauth/google |
| AI (client) | Google Generative AI SDK, Gemini REST API, Segmind Stable Diffusion API |
| PDF Export | jsPDF + html2canvas |
| Package Manager | npm |

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js (CommonJS) |
| Framework | Express 4 |
| Database | MongoDB (Mongoose 8) |
| Auth | JWT (jsonwebtoken) + bcryptjs + google-auth-library |
| File Uploads | Multer + Sharp |
| Image Storage | Cloudinary |
| AI (server) | LaoZhang.ai (Sora image generation), @gradio/client (Hugging Face), Anthropic SDK, OpenAI SDK |
| Payments | Stripe |
| Email | Nodemailer |
| Rate Limiting | express-rate-limit |
| Validation | express-validator |

---

## Project Structure

```
Deep_spaceSnap/
├── README.md
│
├── spacesnap-frontend/          # React + Vite SPA
│   ├── public/                  # Static assets (hero-video.mp4, etc.)
│   ├── src/
│   │   ├── api/                 # Axios instance & interceptors
│   │   ├── assets/              # Images used in the UI
│   │   ├── components/          # Shared UI, layout, auth, and dashboard components
│   │   ├── context/             # AuthContext (React Context + JWT)
│   │   ├── data/                # Static quiz, design, and portfolio data
│   │   ├── features/            # Feature-scoped code
│   │   ├── pages/               # Page-level components
│   │   │   ├── dashboards/      # Admin, designer, and user dashboard pages
│   │   │   ├── AIVisualizerPage.jsx
│   │   │   ├── ArPreviewPage.jsx
│   │   │   ├── StyleQuizPage.jsx
│   │   │   ├── UpgradePage.jsx
│   │   │   └── ...
│   │   ├── routes/              # React Router route definitions
│   │   ├── services/            # API service helpers (Gemini, image generation, quiz)
│   │   ├── utils/               # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   ├── eslint.config.js
│   └── package.json
│
└── spacesnap-backend/           # Node.js + Express REST API
    ├── config/                  # DB connection, email config, Google OAuth, env loader
    ├── middleware/              # JWT auth middleware
    ├── models/                  # Mongoose models (User, Design, Image, Quiz, Consultation, …)
    ├── routes/                  # Express route handlers
    ├── scripts/                 # One-off utility scripts
    ├── utils/                   # AI image service, email helpers, rate limits, seeder
    ├── server.js                # App entry point
    └── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher
- A running **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- API keys for the external services listed in [Environment Variables](#environment-variables)

---

### Backend Setup

```bash
cd spacesnap-backend

# Install dependencies
npm install

# Create and fill in your environment file (see below)
cp .env.example .env

# Optional: seed quiz questions and style data
npm run seed:import

# Development mode with auto-reload
npm run server

# Production mode
npm start
```

The API server listens on `http://localhost:5000` by default.

---

### Frontend Setup

```bash
cd spacesnap-frontend

# Install dependencies
npm install

# Create and fill in your environment file (see below)
cp .env.example .env

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The dev server starts on `http://localhost:5173` by default.

---

## Environment Variables

### Backend `.env`

Create `spacesnap-backend/.env` with the following keys:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/spacesnap

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Google OAuth (server-side token verification)
GOOGLE_CLIENT_ID=your_google_client_id

# Email (Nodemailer — any SMTP provider)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@spacesnap.com

# Cloudinary (image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# LaoZhang.ai (Sora image generation)
LAOZHANG_API_KEY=sk-...
LAOZHANG_API_URL=https://api.laozhang.ai/v1/chat/completions

# Server port (optional, default 5000)
PORT=5000
```

### Frontend `.env`

Create `spacesnap-frontend/.env` with the following keys:

```env
# Google OAuth (client-side)
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Google Gemini
VITE_GEMINI_API_KEY=your_gemini_api_key

# Stripe publishable key (safe for the browser)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Segmind Stable Diffusion inpainting
VITE_SEGMIND_API_KEY=SG_...

# Cloudinary unsigned upload
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

# ClipDrop (optional)
VITE_CLIPDROP_API_KEY=your_clipdrop_key

# Backend base URL (change for production deployments)
VITE_API_URL=http://localhost:5000
```

> **Security note:** Never commit `.env` files to version control. Ensure both `.env` files are listed in the relevant `.gitignore`.

---

## API Overview

All routes are prefixed with `/api`.

| Prefix | Description |
|---|---|
| `/api/users` | Register, login, Google OAuth, email verification, password reset, user profile |
| `/api/admin` | Admin-only: user management, designer approvals, feature flags, email templates |
| `/api/quiz` | Fetch quiz questions, submit answers, retrieve results |
| `/api/images` | Upload / retrieve / delete room images; AI image generation via LaoZhang.ai |
| `/api/consultations` | Book, list, and manage user–designer consultations |
| `/api/designs` | Save and retrieve AI visualiser designs |
| `/api/payments` | Stripe payment intent creation and post-payment premium role upgrade |
| `/api/portfolio` | Designer portfolio CRUD |
| `/api/room-visualize` | Proxy image + prompt to a Hugging Face Gradio model for full-room redesign |
| `/api/segment` | Fallback segmentation endpoint; returns the uploaded image for client-side Gemini processing |

Protected routes require an `Authorization: Bearer <token>` header.

---

## User Roles

| Role | Access |
|---|---|
| `registered` | Style quiz, AI visualiser, AR room redesign, portfolio browsing, booking consultations |
| `designer` | All registered features + designer dashboard, portfolio management, consultation management |
| `premium` | All registered features, unlocked after completing the Stripe payment flow |
| `admin` | Full platform access — user management, designer approvals, content moderation, system settings, email templates, feature flags |

---

## Key Features In Depth

### Style Quiz

1. The user answers a series of visual-preference questions; images for each answer are served from `/api/images`.
2. The backend scores the responses and returns a recommended interior style.
3. The **Google Gemini 1.5 Flash** model receives the user's selections and returns a detailed recommendation: colour palettes, materials, furniture choices, and a room-by-room breakdown.
4. The backend generates a matching reference image via **LaoZhang.ai** (Sora model).
5. Results can be downloaded as a PDF report.

### AI Visualiser

1. The user uploads a room photo or loads a previously saved design.
2. They apply virtual wall colours, ceiling finishes, and floor patterns, and drag-and-drop furniture onto the canvas.
3. An AI analysis panel sends the room image to **Google Gemini 2.5 Flash** and returns actionable styling suggestions.
4. A before/after slider lets users compare the original and edited views.
5. The final design can be saved to their account or exported as an image.

### AR Room Redesign

1. The user's device camera captures a short burst of still frames.
2. The user selects the clearest frame.
3. They draw a mask over the area to replace using the built-in sketch canvas.
4. The image and mask are sent to the **Segmind Stable Diffusion 1.5 Inpainting** API with a text prompt.
5. The generated result is shown alongside the original, with options to refine the design, download the image, or save a PDF report.

---

## Contributing

1. Fork the repository and create a feature branch from `main`.
2. Follow the existing code style — ESLint config lives at `spacesnap-frontend/eslint.config.js`.
3. Keep frontend changes in `spacesnap-frontend/` and backend changes in `spacesnap-backend/`.
4. Open a pull request with a clear title and description of your change.
