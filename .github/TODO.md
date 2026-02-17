# E-Tickets Manager TODO Plan

Last updated: 2026-02-17

## Legend

- Status: `[ ]` not started, `[~]` in progress, `[x]` done, `[-]` blocked
- Priority: `P0` critical for MVP, `P1` important, `P2` post-MVP polish

## 0) Current Baseline Snapshot (from repository)

- [x] `P0` Nuxt 4 + Convex project scaffold
- [x] `P0` Better Auth integration (email/password + Google OAuth)
- [x] `P0` Auth middleware + auth composables scaffold
- [x] `P0` Core Convex schema created (`events`, `eventRoles`, `ticketTypes`, `purchases`, `tickets`, `formFields`, `formResponses`)
- [x] `P1` Password reset email action scaffold (SMTP/mock fallback)
- [x] `P1` CI workflow with lint/format/build/test stages

---

## 1) MVP Scope Lock + Technical Foundation

- [ ] `P0` Finalize MVP boundaries (must-have vs post-MVP)
- [ ] `P0` Create route map for all roles (planner/scanner/buyer/public)
- [ ] `P0` Define shared domain types and constants (event statuses, ticket statuses, role enums)
- [ ] `P0` Add app shell: layouts, navigation, role-aware menu
- [ ] `P0` Add global empty/loading/error states for pages
- [ ] `P1` Add reusable form components + validation helpers for Nuxt UI + Zod

**Done when**

- MVP feature list is frozen in docs
- Route map exists and all routes are scaffolded
- Shared constants/types are used across frontend + backend

---

## 2) Authentication, Session, and Access Control

- [ ] `P0` Build auth pages (`/login`, `/signup`, `/forgot-password`, `/reset-password`)
- [ ] `P0` Add post-login dashboard landing route with role/event summary
- [ ] `P0` Implement robust route guards for public/admin/scanner paths
- [ ] `P0` Build event-level RBAC guard helpers in Convex (planner/scanner checks)
- [ ] `P0` Add unauthorized and forbidden UX states
- [ ] `P1` Add account profile page (name/avatar/password change)

**Done when**

- Unauthorized users cannot access protected routes
- Scanner cannot access planner-only data
- Buyers cannot access admin/scanner routes

---

## 3) Event Planner Core Flows

### 3.1 Event Creation & Management

- [ ] `P0` Create event wizard/form (name, date, sales start/end, payment details)
- [ ] `P0` Add date/time business validations (sales window + event timing)
- [ ] `P0` Implement event status transitions (`draft` -> `on_sale` -> `closed` -> `completed`)
- [ ] `P1` Add edit event details with status-based restrictions
- [ ] `P1` Add event archive/close actions

### 3.2 Ticket Types

- [ ] `P0` Create ticket type CRUD (name, price, quantity, metadata)
- [ ] `P0` Enforce duplicate-name and zero-quantity rules
- [ ] `P0` Prevent unsafe edits once sales begin
- [ ] `P1` Add per-ticket sales metrics in planner view

### 3.3 Custom Form Builder

- [ ] `P0` Build form field CRUD (text/email/number/dropdown, required toggle, ordering)
- [ ] `P0` Persist event-specific form schema
- [ ] `P0` Validate required fields for buyer submission
- [ ] `P1` Restrict destructive field edits after first purchase

### 3.4 Publish & Public Link

- [ ] `P0` Add publish readiness checks (event + ticket + form + payment config)
- [ ] `P0` Generate stable public event sales link
- [ ] `P0` Show publish errors with specific missing requirements

**Done when**

- Planner can go from draft event to published event without manual DB edits
- Publish action fails safely with actionable messages

---

## 4) Buyer Ticket Purchase Flow

### 4.1 Public Event + Ticket Selection

- [ ] `P0` Build public event page with event details + available ticket types
- [ ] `P0` Show remaining quantities and sales window status
- [ ] `P0` Implement ticket selection cart with quantity constraints

### 4.2 Form + Checkout

- [ ] `P0` Render dynamic planner-defined fields for buyer form
- [ ] `P0` Validate and persist form responses linked to purchase
- [ ] `P0` Build checkout summary and total calculation
- [ ] `P0` Integrate Paystack initialize flow (server endpoint/action)
- [ ] `P0` Integrate Paystack verify callback/webhook
- [ ] `P0` Implement idempotent payment verification (duplicate callback safe)

### 4.3 Ticket Generation

- [ ] `P0` Reserve inventory atomically on successful payment
- [ ] `P0` Generate unique ticket records + unique code
- [ ] `P0` Generate QR payload/code per ticket
- [ ] `P1` Add safe rollback/retry paths for partial failures

**Done when**

- Successful payment always results in correct number of tickets
- Failed payments never consume ticket inventory
- Duplicate provider callbacks do not create duplicate tickets

---

## 5) Ticket Delivery & Notifications

- [ ] `P0` Build purchase confirmation email template
- [ ] `P0` Send email with event/ticket details + QR code(s)
- [ ] `P0` Add resend ticket email action
- [ ] `P1` Add delivery status tracking (sent/failed/retry)
- [ ] `P1` Add buyer confirmation page with downloadable ticket QR codes

**Done when**

- Buyer receives email for successful purchase
- Planner can troubleshoot failed email delivery

---

## 6) Scanner Experience (Event Day Critical Path)

- [ ] `P0` Build scanner event selection screen
- [ ] `P0` Build QR scanning UI (camera permissions + scan loop)
- [ ] `P0` Implement ticket validation mutation:
  - exists
  - belongs to event
  - status valid/not used
- [ ] `P0` Mark valid ticket as checked-in with timestamp + scanner ID
- [ ] `P0` Return clear outcomes (`valid`, `already used`, `invalid/wrong event`)
- [ ] `P0` Show real-time checked-in count
- [ ] `P2` Add offline scan queue + sync conflict handling

**Done when**

- Scanner can process tickets quickly with clear status feedback
- Duplicate scan is rejected safely and auditable

---

## 7) Planner Dashboard, Team Management, and Reporting

### 7.1 Dashboard Analytics

- [ ] `P0` Build planner dashboard with:
  - tickets sold by type + total
  - revenue by type + total
  - checked-in count
- [ ] `P1` Add trend charts (sales over time, check-in velocity)

### 7.2 Form Responses

- [ ] `P0` Build searchable/sortable responses table
- [ ] `P1` Add filters + CSV export

### 7.3 Team Management

- [ ] `P0` Add planner/scanner invite flow by email
- [ ] `P0` Add role assignment and role removal flow
- [ ] `P0` Enforce RBAC in all related queries/mutations

### 7.4 Post-Event Closeout

- [ ] `P1` Auto/Manual event completion flow
- [ ] `P1` Export attendee list + revenue report

**Done when**

- Planner can manage team, monitor performance, and export event data

---

## 8) Security, Reliability, and Observability

- [ ] `P0` Add centralized permission checks in Convex handlers
- [ ] `P0` Add input validation for all server actions/mutations
- [ ] `P0` Add payment webhook signature verification
- [ ] `P1` Add Sentry error reporting for frontend + backend critical paths
- [ ] `P1` Add audit logging for critical actions (publish, role changes, check-ins)
- [ ] `P1` Add rate limiting/abuse controls for public endpoints
- [ ] `P2` Add fraud checks and suspicious activity alerts

**Done when**

- Critical user and payment actions are observable, validated, and auditable

---

## 9) Testing Strategy (Must Run in CI)

### 9.1 Unit Tests

- [ ] `P0` Validation schemas and domain rules
- [ ] `P0` Price/total calculations and inventory logic
- [ ] `P0` RBAC helper behavior

### 9.2 Nuxt Component Tests

- [ ] `P0` Auth forms and error states
- [ ] `P0` Event/ticket/form builder interactions
- [ ] `P0` Checkout and scanner UI states

### 9.3 E2E Tests

- [ ] `P0` Planner happy path: create -> publish
- [ ] `P0` Buyer happy path: select -> pay -> ticket received
- [ ] `P0` Scanner happy path: scan valid + reject duplicate
- [ ] `P1` Failure scenarios (payment failure, invalid QR, unauthorized access)

### 9.4 CI/CD

- [ ] `P0` Ensure CI runs lint, format, tests, build on PR and main
- [ ] `P1` Add coverage thresholds and report artifacts

**Done when**

- Critical workflows are covered end-to-end and reliably pass in CI

---

## 10) Launch Readiness Checklist

- [ ] `P0` Production environment variables documented and validated
- [ ] `P0` Payment sandbox -> production switch checklist
- [ ] `P0` Email provider production setup + domain verification
- [ ] `P0` Security review (auth flows, webhook verification, RBAC)
- [ ] `P0` Smoke test in staging with real-like data
- [ ] `P1` Basic admin runbook for event-day operations
- [ ] `P1` Incident response notes (payment/email/scanner outages)

---

## Suggested Implementation Order (Execution Sequence)

1. `P0` Foundation + auth/access control
2. `P0` Planner event setup (event, tickets, form, publish)
3. `P0` Buyer flow + payment + ticket generation
4. `P0` Scanner check-in critical path
5. `P0` Dashboard essentials + team management
6. `P0` Tests for critical flows
7. `P1/P2` Observability, exports, offline mode, polish

---

## Immediate Next 7 Tasks (Start Here)

- [ ] `P0` Scaffold missing routes/pages for auth, dashboard, planner, scanner, public event
- [ ] `P0` Implement Convex RBAC helper utilities and apply to existing handlers
- [ ] `P0` Build event create/edit flow with date validation rules
- [ ] `P0` Build ticket type management with inventory constraints
- [ ] `P0` Build form builder + schema persistence
- [ ] `P0` Implement publish readiness checks + public link generation
- [ ] `P0` Add first E2E smoke test for auth + event creation
