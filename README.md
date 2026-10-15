# HealthWise — College Demo (No Database)

A polished, professional healthcare website for a college project presentation:
predefined login, appointment booking, and a working AI medical chatbot.
Built with **React + TypeScript** (Vite) on the frontend and **Express + TypeScript**
on the backend.

**No database is required.** Appointments live in the server's shared in-memory
store (lost on server restart); chat conversations stay in the browser's
`localStorage`. The backend validates logins, owns appointments, and serves the
AI medical chatbot (so the AI API key never reaches the browser).

## Quick start

```bash
cd healthwise-demo
npm run install:all   # install root + server + client dependencies
npm run dev           # starts the API (http://localhost:4000) and the site (http://localhost:5173)
```

Open **http://localhost:5173** and log in on the single login page — it accepts
both accounts and routes each to the right place:

- Patient: `meetduggar@gmail.com` / `meet2005` → patient pages (Book, My Appointments).
- Admin: `admin@healthwise.in` / `meet2005` → admin dashboard.

(Change these via `DEMO_EMAIL` / `DEMO_PASSWORD` and `ADMIN_EMAIL` /
`ADMIN_PASSWORD` in `server/.env` — see Configuration.)

Notes: the login form has a show/hide password eye; the Sign Up button is
UI-only and disabled in this demo (no self-registration). The dedicated admin
login page accepts both accounts too (admin → dashboard, patient → patient pages). Admin sessions are
separate from patient sessions, and credentials are never in frontend code.

## Configuration

```bash
cp server/.env.example server/.env
```

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | API port | `4000` |
| `SESSION_SECRET` | Signs session cookies (set a long random string in production) | — |
| `DEMO_EMAIL` / `DEMO_NAME` / `DEMO_PASSWORD` | Predefined login, validated on the server only | `meetduggar@gmail.com` / `Meet Duggar` / `meet2005` |
| `ADMIN_EMAIL` / `ADMIN_NAME` / `ADMIN_PASSWORD` | Admin login for `/admin/dashboard`, validated on the server only | `admin@healthwise.in` / `Administrator` / `meet2005` |
| `AI_API_KEY` | Optional OpenAI-compatible API key for model-generated chatbot replies | — (built-in knowledge base is used instead) |
| `AI_API_BASE` / `AI_MODEL` | AI provider endpoint and model | `https://api.openai.com/v1` / `gpt-4o-mini` |

The credentials are **not displayed anywhere in the UI** and never leave the
server — login is validated server-side with bcrypt.

## Features

- **Login / Logout** — predefined account validated on the backend; session
  cookie is httpOnly; protected pages redirect to `/login` when logged out.
  The admin session (`/admin/login` → `/admin/dashboard`) is separate from the
  patient session; all admin APIs are server-side protected (patients get 403).
- **Book Appointment** — patient name, doctor or specialization, date, time,
  reason for visit. Past dates/times are blocked; duplicate slots are rejected;
  double-submits are prevented. Stored in the **shared server in-memory store**,
  so bookings made by any browser on the same running server appear in the
  admin dashboard. ⚠️ Cleared on server restart — not permanent storage.
- **Admin Dashboard** — overview counts (total/pending/confirmed/completed/
  cancelled/upcoming) computed from actual records; searchable/filterable/
  sortable appointment table; detail view; status changes with cancel
  confirmation; refresh and logout.
- **My Appointments** — your own bookings only (ownership enforced server-side),
  cancel with confirmation dialog; cancelled appointments are kept with status `Cancelled`.
- **AI Medical Chatbot** — free to use **without login** (public endpoint, rate-limited).
  Floating chat button on every page plus a full chat page with conversation history
  (stored in `localStorage`). Uses the project's system prompt plus the medical
  knowledge base; emergency messages immediately return emergency guidance
  including 112, with a link to the Emergency Help page. Set `AI_API_KEY` for
  model-generated replies; without it the chatbot answers from the built-in
  knowledge base. English, Hindi, and Hinglish supported.
- **Emergency Help** — public page with `tel:112` and `tel:108` call buttons,
  location-variance warning, and short first-aid guidance (bleeding, burns,
  choking, stroke, chest pain, breathing difficulty, seizures, allergy, poisoning).
- **Health Tools** — BMI, age, and hydration calculators (educational estimates,
  validated inputs) plus measurement explanations.
- **Health Library / FAQ / Visit Prep** — searchable static education pages
  (specialties, tests, prevention, lifestyle, terminology in EN/HI/Hinglish),
  categorized FAQs, and appointment-preparation checklists.
- **Medicine Library** (`/medicines`) — separate encyclopedia-style section with 16
  curated entries (Paracetamol, Ibuprofen, Cetirizine, Amoxicillin, Azithromycin,
  Omeprazole, Metformin, Amlodipine, Losartan, Atorvastatin, Levothyroxine,
  Salbutamol inhaler, ORS, Vitamin D3, Iron+Folic Acid, Clotrimazole). Search with
  suggestions (brand/generic/use), category filters, featured + recently viewed,
  Load More, and full detail pages (uses, side effects, warnings, precautions,
  interactions, pregnancy, overdose/112 guidance, Rx/OTC status, references,
  review dates). Images are generic illustrative Wikimedia Commons photos with
  attribution plus built-in fallback illustrations — never brand packaging. The
  chatbot recognizes medicine names and links to detail pages; detail pages link
  chatbot recognizes medicine names and links to detail pages; detail pages link
  back via "Ask HealthWise AI". Educational only: no dosages, no prescriptions.
- **Symptom Checker** (`/symptom-checker`) — separate interactive body explorer:
  SVG front/back body with 28 individually selectable regions (left/right
  distinguished), male/female variants, 6 organ shortcuts, region search, and
  keyboard access. Side panel with symptoms, duration, 1–10 severity, and onset;
  emergency triage runs first (112/108 banner). Results cover possible causes,
  self-care, doctor/escalation guidance, specialists, tests, treatments, surgery
  context, related regions, references, and an "Ask the AI Assistant" handoff
  carrying the checked symptoms. Educational only — never a diagnosis.
- **Responsive UI** — desktop, tablet, and mobile layouts with the HealthWise logo.

## Project structure

```
healthwise-demo/
  client/                 # React + TypeScript (Vite)
    src/pages/            # Home, Login, BookAppointment, MyAppointments, ChatPage,
                          # Emergency, HealthTools, HealthLibrary, HealthFaq,
                          # VisitPrep, AdminLogin, AdminDashboard,
                          # MedicineLibrary, MedicineDetail, SymptomChecker
    src/components/       # Navbar, Footer, AuthContext, AdminAuthContext, AdminRoute, ChatWidget, useChat, chatMarkdown, MedicineImage, PasswordField, BodyMap
    src/api/client.ts     # auth + chat + appointments + admin API calls
    src/data/healthContent.ts  # static emergency/library/FAQ/prep content
    src/data/medicines.ts # static medicine catalogue (16 entries, no database)
    src/data/bodyRegions.ts # static symptom-checker regions (12 entries)
    src/lib/symptomTriage.ts # pure emergency triage + chatbot context builder
    src/lib/healthCalc.ts # pure BMI/age/hydration functions
  server/                 # Express + TypeScript (no database)
    src/index.ts          # app wiring, session config
    src/auth.ts           # predefined-account login (bcrypt, server-side)
    src/admin.ts          # separate admin login (ADMIN_* env, server-side)
    src/appointments.ts   # shared in-memory appointments (patient + admin routes)
    src/chatbot.ts        # public chat endpoint: POST /api/chat/message
    src/knowledge.ts      # chatbot system prompt + medical knowledge base
    src/medicineBriefs.ts # shared medicine briefs linking chatbot to library
    tests/server-tests.ts # integration tests (run: npx tsx tests/server-tests.ts)
    tests/chatbot-tests.ts# knowledge/chatbot tests
```

## Notes for the presentation

- Doctor names in the booking form are **sample entries for demonstration** and
  are clearly labeled as such in the UI.
- Appointments are **not** sent to any hospital or permanently stored — they
  live in the running server's memory and are **lost on server restart**.
  Bookings are never faked: the dashboard shows only real submitted records.
- The chatbot gives **general health information only**, not medical advice;
  emergencies get an immediate call-for-help response. It is free to use
  without an account; the AI provider key stays on the backend.
- Health calculators and library content are educational estimates, not diagnoses.
- For any public deployment, change the demo and admin credentials via environment
  variables and set a strong `SESSION_SECRET`.

## Production build

```bash
npm run build
NODE_ENV=production npm start   # serves the API and the built site on PORT
```

## Verified by testing

Server integration (`server/tests/server-tests.ts`, run against a live test
server — 44 checks): patient login/logout; unified login returns the correct
role for each account and rejects bad credentials; admin login accepts only the
configured credentials (`admin@healthwise.in`); unauthenticated users get 401
on admin APIs; patient accounts get 403 on admin routes; booking appears in the
admin dashboard; duplicate/past-date rejected; cancel + admin status updates
work; ownership enforced; sessions independent; chatbot responds in English,
Hindi, and Hinglish without login; emergency reply includes 112; `tel:112` /
`tel:108` buttons and searchable library present; BMI/age/hydration calculators
work and validate inputs.

Knowledge/chatbot (`server/tests/chatbot-tests.ts` — 108 checks): category
coverage, multilingual retrieval, misspellings, multi-topic, follow-ups,
emergency detection, and offline fallback.

Login works with the predefined credentials; wrong credentials return 401;
logout clears the session; unauthenticated users are redirected to login;
chat replies work (greeting, knowledge answer, emergency/112 response);
the client builds with zero TypeScript errors (`npm run build` passes).
