# SpaceSnap — AI-Powered Interior Design Platform

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
