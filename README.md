# MediTrust

**AI-Powered Prescription & Healthcare Platform**

MediTrust is a full-stack healthcare platform where patients can upload a prescription, get it automatically read and structured using AI, check medicine availability on the platform (with alternatives from other companies), book doctor appointments, book pathology/lab tests, and chat for basic health guidance — all in one place.

Built and maintained by **[E-Skills Web](https://eskillsweb.com)**.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [AI / Prescription Extraction Flow](#ai--prescription-extraction-flow)
- [Database Design](#database-design)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)
- [Disclaimer](#disclaimer)
- [About](#about)

---

## Overview

MediTrust solves a simple but common problem: patients receive a prescription, often handwritten, and have no easy way to understand what's written, whether the medicines are available nearby, or how to act on it (book a doctor follow-up, get a lab test done, ask a quick question). MediTrust brings all of this into a single connected flow.

**In one sentence:** Upload a prescription → get it explained → order what's available → book what's needed → ask what's unclear.

---

## Core Features

### 1. Prescription Upload & AI Extraction

- Patient uploads a photo of a prescription (printed or handwritten)
- Gemini API extracts structured data: medicine name, dosage, frequency, duration
- Low-confidence extractions are flagged for manual review instead of guessed
- Extracted medicines are fuzzy-matched against the platform's medicine database

### 2. Medicine Availability & Alternatives

- Checks if each prescribed medicine is available on MediTrust
- If unavailable: shows a suggested external link to search/purchase elsewhere
- Always shows **alternative brands** carrying the same generic/salt composition, so users aren't locked into one company

### 3. Doctor Appointment Booking

- Browse doctors by specialization
- View available time slots and book appointments
- Doctors manage their own availability via a dedicated panel

### 4. Pathology / Lab Test Booking

- Browse available tests and diagnostic labs
- Book a test slot (with optional home sample collection)
- Pathologists manage test catalogs and bookings via their own panel

### 5. Basic Health Chat (AI-Assisted)

- Chat window for general, non-diagnostic health questions
- Implemented via **polling** (periodic REST calls), not WebSockets — simpler and sufficient for this use case
- AI is explicitly restricted: no diagnosis, no dosage recommendations
- Always nudges toward booking a real doctor consultation for anything specific

---

## User Roles

| Role            | Capabilities                                                                                |
| --------------- | ------------------------------------------------------------------------------------------- |
| **Patient**     | Upload prescriptions, view extracted details, order medicines, book doctors/tests, use chat |
| **Doctor**      | Manage profile & availability, view/accept appointments, consult patients                   |
| **Pathologist** | Manage test catalog, view/accept test bookings                                              |
| **Admin**       | Manage medicine catalog, verify doctors/pathologists, oversee platform activity             |

---

## Tech Stack

**Frontend**

- React (Vite)
- Redux Toolkit — global/auth state
- TanStack Query — server state & caching
- Tailwind CSS — styling

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT — authentication
- Polling (REST) — chat updates, no WebSockets

**AI / External Services**

- Gemini API — prescription extraction (vision + structured output) and health chat
- Cloud storage (e.g. Cloudinary) — prescription image uploads

---

## System Architecture

```
┌─────────────┐      ┌──────────────┐      ┌───────────────┐
│   React     │◄────►│  Express API │◄────►│    MongoDB     │
│  (Client)   │      │   (Server)   │      │  (Mongoose)    │
└─────────────┘      └──────┬───────┘      └───────────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
          ┌──────▼──────┐        ┌───────▼───────┐
          │  Gemini API │        │  Chat (polling │
          │ (extraction │        │  via REST API) │
          │  + chat)    │        └────────────────┘
          └─────────────┘
```

---

## AI / Prescription Extraction Flow

```
1. Patient uploads prescription image
        │
        ▼
2. Image sent to Gemini API with a structured-output prompt
   → returns JSON: [{ medicine_name, dosage, frequency, duration, confidence }]
        │
        ▼
3. Each medicine name is fuzzy-matched against the `medicines` collection
        │
        ├── Match found + in stock  → "Available" (add to cart)
        ├── Match found, out of stock → suggested external link
        └── No confident match      → flagged for manual patient/admin review
        │
        ▼
4. Alternatives (same generic name, different company) are shown alongside every matched medicine
```

**Safety principle:** the AI never silently guesses. Anything below a confidence threshold is surfaced to the user as "unclear — please verify" rather than auto-filled.

---

## Database Design (Key Collections)

```
User            { name, email, password, role, phone }
Doctor          { userId, specialization, fee, availableSlots[] }
Pathologist     { userId, labName, testsOffered[] }
Prescription    { patientId, imageUrl, extractedData[], status, uploadedAt }
Medicine        { name, genericName, company, price, stock, category }
Appointment     { patientId, doctorId, slotTime, status }
TestBooking     { patientId, pathologistId, testId, slotTime, status }
Test            { name, pathologistId, price }
ChatMessage     { senderId, receiverId/sessionId, message, isAI, timestamp }
```

Medicine alternatives are resolved at query time by matching `genericName` across different `company` values — no separate mapping table required.

---

## Folder Structure

```
meditrust/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── hooks/
│   │   └── services/        # API calls (axios/TanStack Query)
│   └── ...
├── server/                  # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/          # auth, role-based access
│   └── services/            # Gemini integration, matching logic
└── README.md
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/imrankhan919/meditrust.git
cd meditrust

# Install dependencies
cd server && npm install
cd ../client && npm install

# Set up environment variables (see below)

# Run backend
cd server && npm run dev

# Run frontend
cd client && npm run dev
```

---

## Environment Variables

**server/.env**

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**client/.env**

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## Roadmap

- [ ] Auth & role-based access (Patient / Doctor / Pathologist / Admin)
- [ ] Medicine catalog + admin panel
- [ ] Prescription upload + Gemini extraction + fuzzy matching
- [ ] Medicine availability + alternatives display
- [ ] Doctor panel + appointment booking
- [ ] Pathologist panel + test booking
- [ ] Polling-based chat with AI-assisted basic advice
- [ ] Payments integration (future)
- [ ] Order tracking / delivery (future)

---

## Disclaimer

MediTrust is built for educational and demonstration purposes. It is **not a certified medical product** and must not be used for actual diagnosis, treatment, or medicine dispensing. AI-extracted prescription data and chat responses can be inaccurate — always verify with a licensed medical professional before acting on any information shown by this platform.

---

## About

MediTrust is built and maintained by **E-Skills Web** ([eskillsweb.com](https://eskillsweb.com)), a tech training institute based in Indore, India, with branches in Mandsaur and Udaipur — also operating under the **Robotwala EdTech** brand.

- 🌐 Website: [eskillsweb.com](https://eskillsweb.com)
- 📸 Instagram: [@eskillsweb](https://instagram.com/eskillsweb)
- 💻 GitHub: [imrankhan919](https://github.com/imrankhan919)

© E-Skills Web. All rights reserved.
