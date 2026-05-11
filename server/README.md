# Sage AI — Backend API

> *"Sage AI doesn't just ask if an employee is real — it asks if they exist independently. Because a ghost worker isn't a fake face. It's a stolen life."*

A **NestJS + MongoDB** REST API that powers Sage AI — a mobile-first payroll fraud detection system for SMEs and government agencies. It detects ghost workers by combining biometric liveness verification, a five-signal Behavioural DNA Score, and post-disbursement transaction graph analysis, integrated with the Squad payment infrastructure.

---

## Table of Contents

1. [What It Does](#what-it-does)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [Authentication](#authentication)
9. [Role System](#role-system)
10. [Behavioural DNA Score](#behavioural-dna-score)
11. [Employee Verification Flow](#employee-verification-flow)
12. [Fraud Ring Detection](#fraud-ring-detection)
13. [Squad API Integration](#squad-api-integration)
14. [Database Collections](#database-collections)
15. [Running Tests](#running-tests)
16. [Contributing & Code Standards](#contributing--code-standards)

---

## What It Does

| Problem | Sage AI Response |
|---|---|
| Ghost workers go undetected for years | Automated liveness verification before every pay cycle |
| Static selfies can be replayed | Randomised server-generated gesture challenge, expires in 30 s |
| Fraud rings funnel money to one account | Post-payment network graph detects converging fund flows |
| HR teams have no evidence for prosecution | Timestamped PDF case file generated on demand |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 (TypeScript) |
| Database | MongoDB via `@nestjs/mongoose` |
| Authentication | JWT + Passport (`passport-jwt`, `passport-local`) |
| Validation | `class-validator` + `class-transformer` |
| File Upload | `multer` (CSV roster import) |
| PDF Generation | `pdfkit` (case file export) |
| SMS Notifications | Termii (Nigerian SMS gateway) |
| Push Notifications | Firebase Admin SDK |
| HTTP Client | `axios` (Squad API calls) |
| API Docs | `@nestjs/swagger` (Swagger UI) |
| Rate Limiting | `@nestjs/throttler` |

---

## Project Structure

```
src/
├── main.ts                    # Bootstrap — global pipes, filters, interceptors, CORS, Swagger
├── app.module.ts              # Root module — imports all feature modules
│
├── common/                    # Shared utilities (no business logic)
│   ├── enums/                 # UserRole, EmployeeStatus, CaseStatus, NodeType, RingConfidence
│   ├── decorators/            # @Roles(), @CurrentUser(), @Public()
│   ├── guards/                # JwtAuthGuard, RolesGuard
│   ├── filters/               # HttpExceptionFilter — unified error shape
│   └── interceptors/          # TransformInterceptor — unified success shape
│
├── config/                    # Typed configuration factory (reads .env)
│
├── auth/                      # Login, JWT signing, admin seeding
├── users/                     # HR Admin & Auditor user accounts
├── employees/                 # Employee roster — CRUD + CSV import
├── verification/              # Employee liveness challenge (SMS deep-link flow)
├── scoring/                   # Behavioural DNA Score computation engine
├── payroll/                   # Payroll schedule, salary amounts, Squad key storage
├── transactions/              # Squad webhook receiver, velocity analysis
├── fraud-ring/                # Node-edge graph engine, convergence detection
├── cases/                     # Auditor case management + Risk Leaderboard
├── notifications/             # SMS (Termii) + Firebase push notifications
├── squad/                     # Squad Disburse API client
└── export/                    # PDF case file generation
```

Every feature module follows the same layout:

```
<feature>/
├── <feature>.module.ts        # NestJS module — imports, exports
├── <feature>.controller.ts    # Route handlers only (no business logic)
├── <feature>.service.ts       # All business logic and DB access
├── schemas/
│   └── <entity>.schema.ts     # Mongoose schema + document type
└── dto/
    └── <action>.dto.ts        # class-validator DTO for every input
```

---

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9
- **MongoDB** ≥ 7 (local or Atlas)

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in at minimum:

```env
MONGODB_URI=mongodb://localhost:27017/sage
JWT_SECRET=a-long-random-secret-at-least-32-chars
ENCRYPTION_KEY=exactly-32-character-string-here
```

See [Environment Variables](#environment-variables) for the full list.

### 3. Start in development mode

```bash
pnpm start:dev
```

The server starts on `http://localhost:3000`.

### 4. Browse the API docs

Swagger UI is available at:

```
http://localhost:3000/api/docs
```

All routes are documented with request/response schemas and authentication requirements.

### 5. Seed your first admin account

```bash
curl -X POST http://localhost:3000/api/v1/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@yourorg.com",
    "password": "securepassword",
    "orgName": "Your Organisation",
    "role": "hr_admin"
  }'
```

### 6. Log in and get a JWT

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@yourorg.com", "password": "securepassword" }'
```

Response:
```json
{
  "success": true,
  "statusCode": 200,
  "data": { "access_token": "eyJhbGci..." }
}
```

Use this token as `Authorization: Bearer <token>` on all protected routes.

---

## Environment Variables

All variables are typed through `src/config/configuration.ts`. Copy `.env.example` and fill in:

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `3000`) |
| `MONGODB_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Secret for signing access tokens |
| `JWT_EXPIRES_IN` | No | Token lifetime (default: `7d`) |
| `VERIFICATION_TOKEN_SECRET` | **Yes** | Secret for employee SMS link tokens |
| `VERIFICATION_TOKEN_EXPIRES_IN` | No | Link lifetime (default: `24h`) |
| `TERMII_API_KEY` | No | Termii SMS API key (SMS won't send without it) |
| `TERMII_BASE_URL` | No | Termii base URL |
| `SMS_SENDER_ID` | No | SMS sender name (default: `Sage AI`) |
| `FIREBASE_PROJECT_ID` | No | Firebase project ID (push notifications) |
| `FIREBASE_CLIENT_EMAIL` | No | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | No | Firebase private key (replace `\n` with `\\n`) |
| `SQUAD_WEBHOOK_SECRET` | No | HMAC secret for verifying Squad webhooks |
| `ENCRYPTION_KEY` | **Yes** | Exactly 32 chars — encrypts Squad API keys at rest |
| `DEEP_LINK_BASE_URL` | No | Base URL for employee SMS links |
| `THROTTLE_TTL` | No | Rate limit window in ms (default: `60000`) |
| `THROTTLE_LIMIT` | No | Max requests per window (default: `10`) |

---

## API Reference

All routes are prefixed with `/api/v1`. Responses always follow this shape:

```json
// Success
{ "success": true, "statusCode": 200, "data": { ... } }

// Error
{ "success": false, "statusCode": 400, "message": "...", "timestamp": "..." }
```

### Authentication

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Log in as HR Admin or Auditor |
| `POST` | `/auth/seed-admin` | Public | Create an admin/auditor account (dev seeding) |

### Users

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/users/me` | JWT | Get current user profile |

### Employees (HR Admin only)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/employees` | hr_admin | List employees — supports `?status=`, `?search=`, `?page=`, `?limit=` |
| `GET` | `/employees/:id` | hr_admin | Get single employee |
| `PATCH` | `/employees/:id/hold` | hr_admin | Set status to PENDING (hold payment) |
| `PATCH` | `/employees/:id/freeze` | hr_admin | Set status to FROZEN (block payment) |
| `POST` | `/employees/import` | hr_admin | Upload CSV roster (`multipart/form-data`, field: `file`) |

**CSV format** — required columns: `Name`, `Role`, `Account Number`, `Phone Number`.

### Employee Verification (Public — SMS deep link)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/verify/:token` | Public | Get the randomised challenge instruction |
| `POST` | `/verify/:token/submit` | Public | Submit liveness result; scores and updates employee |

### Payroll (HR Admin only)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/payroll/schedule` | hr_admin | Get the organisation's payroll schedule |
| `PUT` | `/payroll/schedule` | hr_admin | Update disbursement day, salary amounts, Squad key |
| `POST` | `/payroll/send-invites` | hr_admin | Manually trigger SMS verification invites to all employees |

### Risk Leaderboard (Auditor only)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/leaderboard` | auditor | All employees sorted by DNA score ascending (riskiest first) |
| `GET` | `/leaderboard/:employeeId` | auditor | Full case profile — employee + sessions + transactions |

### Cases (Auditor only)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/cases` | auditor | List investigation cases — supports `?status=OPEN\|RESOLVED` |
| `POST` | `/cases` | auditor | Flag an employee for investigation |
| `PATCH` | `/cases/:id/resolve` | auditor | Mark a case as resolved |

### Fraud Ring (Auditor only)

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/fraud-ring/build` | auditor | Rebuild the transaction graph for current cycle |
| `GET` | `/fraud-ring` | auditor | Get graph nodes, edges, and ring confidence — supports `?cycle=2026-05` |
| `GET` | `/fraud-ring/node/:nodeId` | auditor | Get node detail with connected edges |

### Webhooks

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/webhooks/squad` | HMAC | Squad Transaction API webhook receiver |

### Export (Auditor only)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/export/case/:employeeId` | auditor | Download timestamped PDF case file |

---

## Authentication

### HR Admin & Auditor

Standard JWT authentication using `Authorization: Bearer <token>`.

1. `POST /auth/login` → returns `{ access_token }`
2. Attach the token to all protected requests
3. On 401, the server clears the token and returns `"Session expired. Please log in again."`

The JWT payload contains:

```json
{
  "sub": "<userId>",
  "email": "user@org.com",
  "role": "hr_admin",
  "orgId": "<orgId>"
}
```

### Employee (SMS Deep Link)

Employees **never log in**. Their flow:

1. HR Admin triggers `POST /payroll/send-invites`
2. Each employee receives an SMS with a unique single-use URL: `<DEEP_LINK_BASE_URL>/verify?token=<uuid>`
3. The token is valid until the next payroll disbursement date
4. `GET /verify/:token` — returns the challenge instruction
5. `POST /verify/:token/submit` — marks the token consumed, scores the session, updates employee status

---

## Role System

| Role | JWT `role` Claim | Access |
|---|---|---|
| HR Admin | `hr_admin` | Dashboard, Employees, Payroll, Settings |
| Auditor | `auditor` | Leaderboard, Cases, Network Graph, Export |
| Employee | — | No JWT; one-time token in SMS deep link |

Guards are applied globally via `APP_GUARD`. Public routes are opted out with the `@Public()` decorator. Routes additionally restricted by role use the `@Roles()` decorator alongside `RolesGuard`.

---

## Behavioural DNA Score

Each verification session produces a composite score from five independent signals:

| Signal | Max Points | What It Detects |
|---|---|---|
| Liveness passed | 30 | Face confirmed as live and matching onboarding photo |
| Geolocation cluster | 20 | GPS captured; deducted if absent (may indicate coordination) |
| Device fingerprint | 20 | Same device verifying as multiple different employees |
| Check-in time clustering | 15 | Employees verifying within minutes of each other |
| Post-payment velocity | 15 | Funds leaving account within 90 seconds of receipt |
| **Total** | **100** | |

**Score thresholds:**

| Range | Status | Squad Action |
|---|---|---|
| 70 – 100 | CLEAR | Payment released automatically |
| 40 – 69 | REVIEW | Payment held — HR Admin notified |
| 0 – 39 | FROZEN | Payment blocked — fraud ring analysis triggered |

Scores are stored per employee per cycle and accumulate over time to build a historical baseline.

---

## Employee Verification Flow

```
24 h before payday
        │
        ▼
PayrollService.sendInvites()
        │  creates VerificationSession (token, challengeCode, expiresAt)
        │  sends SMS via Termii
        ▼
Employee taps link → GET /verify/:token
        │  returns: { challenge: "Blink twice, then tilt your head right." }
        ▼
Employee performs gesture → POST /verify/:token/submit
        │  body: { deviceFingerprint, gpsLat?, gpsLng?, gpsCaptured, livenessPasssed }
        │
        ├─ ScoringService computes DNA Score (5 signals)
        ├─ EmployeesService updates dnaScore + status
        ├─ Session marked isConsumed = true
        │
        ▼
Employee sees: "Verification received."
        │
        ▼
Score ≥ 70 → CLEAR (payment released via Squad)
Score 40–69 → REVIEW (HR Admin notified)
Score < 39  → FROZEN (fraud ring analysis triggered)
```

**Challenge instructions are always fetched from the server** — never cached or predictable client-side. Each session gets a randomly selected instruction from a pool.

---

## Fraud Ring Detection

After disbursement, Squad sends transaction webhooks to `POST /webhooks/squad`. The system:

1. Records every fund movement from disbursed salary accounts
2. Flags transactions where funds left within **90 seconds** of receipt (`velocityFlag`)
3. Detects **destination account convergence** — 2+ employees sending to the same account within 4 hours
4. Builds a node-edge graph stored in `graph_nodes` / `graph_edges` collections

**Node types:**

| Type | Colour (UI) | Description |
|---|---|---|
| `employee` | Blue | Employee salary account |
| `destination` | Grey | Account receiving funds |
| `controller` | Red | Account receiving from 3+ employees — suspected controller |

**Ring confidence** is computed from the convergence ratio:

| Confidence | Condition |
|---|---|
| HIGH | ≥ 3 controller nodes or convergence ratio ≥ 30% |
| MEDIUM | ≥ 2 controller nodes or convergence ratio ≥ 10% |
| LOW | Default |

---

## Squad API Integration

Two Squad surfaces are used:

| Surface | Trigger | Action |
|---|---|---|
| Squad Disburse | DNA Score ≥ 70 | Initiates salary transfer to employee |
| Squad Disburse (block) | Auditor taps "Freeze" | Cancels scheduled disbursement |
| Squad Transaction API (webhooks) | Post-disbursement | Feeds velocity + graph engine |

The Squad API key is entered once by the HR Admin via `PUT /payroll/schedule` and stored **AES-256-CBC encrypted** in the database. It is never stored on-device or exposed to the Employee or Auditor roles.

Webhook HMAC verification: The Squad webhook signature is validated against `SQUAD_WEBHOOK_SECRET` before any processing occurs.

---

## Database Collections

| Collection | Key Fields |
|---|---|
| `users` | email, passwordHash (select: false), role, orgName, orgId |
| `employees` | orgId, name, roleTitle, accountNumber, phone, dnaScore, status, lastVerifiedAt |
| `verification_sessions` | employeeId, orgId, token, tokenExpiresAt, isConsumed, challengeCode, scores, verifiedAt |
| `payroll_schedules` | orgId, disbursementDay, smsHoursBefore, salaryAmounts[], encryptedSquadApiKey |
| `transactions` | txId, employeeId, orgId, amount, destination, txTimestamp, isSuspicious, velocityFlag |
| `graph_nodes` | orgId, cycle, type, label, accountNumber, employeeId, totalInflow, totalOutflow |
| `graph_edges` | orgId, cycle, sourceNodeId, targetNodeId, amount, timestamp |
| `cases` | employeeId, orgId, flaggedBy, flaggedAt, status, resolvedAt |

**Sensitive field masking in API responses:**
- `accountNumber` → `****1234` (last 4 digits)
- `phone` → `080****7890`
- `passwordHash` → never returned (excluded at schema level)

---

## Running Tests

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# E2E tests
pnpm test:e2e
```

---

## Available Scripts

```bash
pnpm start          # Run compiled dist
pnpm start:dev      # Watch mode (hot reload)
pnpm start:debug    # Debug mode with inspector
pnpm start:prod     # Production mode
pnpm build          # Compile TypeScript → dist/
pnpm lint           # ESLint with auto-fix
pnpm format         # Prettier format
```

---

## Contributing & Code Standards

This project enforces strict module boundaries and NestJS conventions. Read [.agent.md](.agent.md) before contributing — it contains the full rule set including:

- One module per feature — no cross-feature schema imports
- DTOs with `class-validator` on every controller input
- Services own all business logic — controllers are thin route handlers
- No `any` types — use `unknown` and narrow
- `ConfigService` for all environment variable access
- Guards on routes, never inside service methods
- All sensitive fields masked before returning to the client

A PR checklist is included at the bottom of [.agent.md](.agent.md).

The [CLAUDE.md](CLAUDE.md) file contains the full architecture reference — route map, scoring table, MongoDB collection contracts, and the complete file tree.
