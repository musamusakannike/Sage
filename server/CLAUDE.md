# Sage AI — Backend (NestJS + MongoDB)

## Project Purpose

Sage AI is a payroll fraud detection system. It combines biometric liveness verification,
behavioural DNA scoring, and post-disbursement transaction graph analysis to detect ghost workers
before and after salary payments. Integrated with Squad payment infrastructure.

---

## Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Framework      | NestJS 11 (TypeScript)              |
| Database       | MongoDB via `@nestjs/mongoose`      |
| Auth           | JWT + Passport (`passport-jwt`)     |
| Validation     | `class-validator` + `class-transformer` |
| File Upload    | `multer` (CSV roster import)        |
| PDF Generation | `pdfkit` (case file export)         |
| Push Alerts    | Firebase Admin SDK                  |
| HTTP Client    | `axios` (Squad API calls)           |
| Docs           | `@nestjs/swagger`                   |

---

## Module Architecture (Feature-Based)

Each feature is a self-contained NestJS module. Modules only import what they need;
no module reaches into another module's internals.

```
src/
├── main.ts                    # Bootstrap, global pipes, filters, interceptors
├── app.module.ts              # Root module — imports all feature modules
│
├── common/                    # Shared utilities (no business logic)
│   ├── enums/                 # Shared enums (role, status, node type …)
│   ├── decorators/            # @Roles(), @CurrentUser()
│   ├── guards/                # JwtAuthGuard, RolesGuard
│   ├── filters/               # HttpExceptionFilter
│   ├── interceptors/          # TransformInterceptor (unified response shape)
│   └── pipes/                 # (reserved — global ValidationPipe used instead)
│
├── config/                    # @nestjs/config typed configuration
│   └── configuration.ts
│
├── auth/                      # Authentication & session tokens
│   ├── auth.module.ts
│   ├── auth.controller.ts     # POST /auth/login, POST /auth/verify-link
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       └── verify-link.dto.ts
│
├── users/                     # HR Admin & Auditor accounts
│   ├── users.module.ts
│   ├── users.controller.ts    # GET /users/me — profile endpoint
│   ├── users.service.ts
│   ├── schemas/
│   │   └── user.schema.ts     # name, email, passwordHash, role, orgName
│   └── dto/
│       └── create-user.dto.ts
│
├── employees/                 # Employee roster (HR Admin manages)
│   ├── employees.module.ts
│   ├── employees.controller.ts # GET/PATCH /employees, POST /employees/import
│   ├── employees.service.ts
│   ├── schemas/
│   │   └── employee.schema.ts  # name, role, accountNumber, phone, dnaScore, status
│   └── dto/
│       ├── import-employees.dto.ts
│       └── update-employee.dto.ts
│
├── verification/              # Liveness challenge sessions (Employee flow)
│   ├── verification.module.ts
│   ├── verification.controller.ts  # GET /verify/:token, POST /verify/:token/submit
│   ├── verification.service.ts
│   ├── schemas/
│   │   └── verification-session.schema.ts
│   └── dto/
│       └── submit-challenge.dto.ts
│
├── scoring/                   # Behavioral DNA Score engine
│   ├── scoring.module.ts
│   └── scoring.service.ts     # computeScore(session) → 0–100
│
├── payroll/                   # Payroll schedule & salary amounts
│   ├── payroll.module.ts
│   ├── payroll.controller.ts  # GET/PUT /payroll/schedule
│   ├── payroll.service.ts
│   └── schemas/
│       └── payroll-schedule.schema.ts
│
├── transactions/              # Squad webhook receiver + velocity analysis
│   ├── transactions.module.ts
│   ├── transactions.controller.ts  # POST /webhooks/squad
│   ├── transactions.service.ts
│   └── schemas/
│       └── transaction.schema.ts
│
├── fraud-ring/                # Graph engine — node-edge convergence detection
│   ├── fraud-ring.module.ts
│   ├── fraud-ring.controller.ts    # GET /fraud-ring?cycle=
│   ├── fraud-ring.service.ts
│   └── schemas/
│       ├── graph-node.schema.ts
│       └── graph-edge.schema.ts
│
├── cases/                     # Auditor case management (flagged employees)
│   ├── cases.module.ts
│   ├── cases.controller.ts    # GET/POST/PATCH /cases
│   ├── cases.service.ts
│   └── schemas/
│       └── case.schema.ts
│
├── notifications/             # SMS & Firebase push alerts
│   ├── notifications.module.ts
│   └── notifications.service.ts
│
├── squad/                     # Squad Disburse API client
│   ├── squad.module.ts
│   └── squad.service.ts
│
└── export/                    # PDF case file generation
    ├── export.module.ts
    ├── export.controller.ts   # GET /export/case/:employeeId
    └── export.service.ts
```

---

## Role System

| Role       | JWT Claim | Access                                         |
|------------|-----------|------------------------------------------------|
| `hr_admin` | role      | Dashboard, Employees, Payroll, Settings        |
| `auditor`  | role      | Leaderboard, Cases, Network Graph, Settings    |
| Employee   | —         | No JWT; one-time signed token in SMS deep link |

Employees never log in. They receive a one-time signed token valid until the payment deadline.
The token is issued by `VerificationService` when SMS is sent and consumed on first successful submit.

---

## Authentication Flow

### HR Admin / Auditor
1. `POST /auth/login` → validates email + password → returns `{ access_token }`
2. JWT contains `{ sub: userId, role, orgId }`
3. All protected routes use `JwtAuthGuard` + `@Roles()` decorator

### Employee (SMS Deep Link)
1. 24 h before payroll, `PayrollService` calls `NotificationsService.sendSms()`
2. SMS contains `https://app.sage.ai/verify?token=<signed-token>`
3. `GET /verify/:token` — validates token, returns challenge instruction
4. `POST /verify/:token/submit` — accepts video clip metadata, scores session, marks token consumed

---

## Behavioral DNA Score — Signal Weights

| Signal              | Max Points | Source                                |
|---------------------|-----------|----------------------------------------|
| Liveness passed     | 30        | Face match model API response          |
| Geolocation cluster | 20        | GPS coordinates vs. org cluster        |
| Device fingerprint  | 20        | Device ID uniqueness across employees  |
| Time clustering     | 15        | Verification timestamp proximity       |
| Pay velocity        | 15        | Time-to-exit from account after credit |
| **Total**           | **100**   |                                        |

Score thresholds: `< 40` → FROZEN | `40–69` → REVIEW | `70–100` → CLEAR

---

## API Route Map

```
POST   /auth/login                        Public
POST   /auth/seed-admin                   Public (dev only — seeding)

GET    /users/me                          JwtAuth (any role)

GET    /employees                         JwtAuth + hr_admin
GET    /employees/:id                     JwtAuth + hr_admin
PATCH  /employees/:id/hold                JwtAuth + hr_admin
PATCH  /employees/:id/freeze              JwtAuth + hr_admin
POST   /employees/import                  JwtAuth + hr_admin  (multipart CSV)

GET    /verify/:token                     Public (employee deep link)
POST   /verify/:token/submit              Public (employee deep link)

GET    /payroll/schedule                  JwtAuth + hr_admin
PUT    /payroll/schedule                  JwtAuth + hr_admin
POST   /payroll/send-invites              JwtAuth + hr_admin

GET    /leaderboard                       JwtAuth + auditor
GET    /leaderboard/:employeeId           JwtAuth + auditor  (case profile data)

GET    /fraud-ring                        JwtAuth + auditor
GET    /fraud-ring/node/:nodeId           JwtAuth + auditor

GET    /cases                             JwtAuth + auditor
POST   /cases                             JwtAuth + auditor  (flag employee)
PATCH  /cases/:id/resolve                 JwtAuth + auditor

POST   /webhooks/squad                    Public (Squad HMAC-verified)

GET    /export/case/:employeeId           JwtAuth + auditor
```

---

## MongoDB Collections

| Collection            | Key Fields                                                          |
|-----------------------|---------------------------------------------------------------------|
| `users`               | email, passwordHash, role, orgName, orgId, squadApiKey (encrypted) |
| `employees`           | orgId, name, roleTitle, accountNumber, phone, dnaScore, status      |
| `verification_sessions` | employeeId, token, challengeCode, isConsumed, scores, verifiedAt  |
| `payroll_schedules`   | orgId, disbursementDay, smsSendTime, salaryAmounts[]                |
| `transactions`        | employeeId, amount, destination, txTimestamp, isSuspicious, velocityFlag |
| `graph_nodes`         | orgId, cycle, type, label, accountInfo                              |
| `graph_edges`         | orgId, cycle, sourceNodeId, targetNodeId, amount, timestamp         |
| `cases`               | employeeId, orgId, flaggedAt, status, flaggedBy                     |

---

## Coding Rules (enforced)

1. **One module per feature** — never put two unrelated features in one module.
2. **DTOs for all inputs** — every controller param/body uses a DTO with `class-validator` decorators.
3. **Schemas stay in their module** — `employee.schema.ts` lives in `employees/schemas/`, never shared raw.
4. **Services own business logic** — controllers are thin; they call a service method and return the result.
5. **No `any` types** — use proper interfaces or Mongoose document types.
6. **Guards on controllers, not services** — `@UseGuards()` belongs on the route, not inside service methods.
7. **ConfigService for all env vars** — never `process.env.XYZ` directly in business code.
8. **Async/await everywhere** — no `.then()` chains in service methods.
9. **Barrel exports** — each module folder exposes an `index.ts` re-export for clean imports.
10. **Never expose passwordHash** — use `@Exclude()` on schema and enable `ClassSerializerInterceptor`.
