# E-Tickets Manager Implementation Plan (MVP First)

Last updated: 2026-02-17

## How to use this plan

- Status: `[ ]` not started, `[~]` in progress, `[x]` done, `[-]` blocked
- Priority: `P0` required for MVP launch, `P1` important after MVP is stable, `P2` later improvement
- Rule: every task should produce a visible output (page, route, mutation, test, report, or doc)
- Rule: if a task is done, link the PR or file path next to it

---

## 1) MVP Scope Lock (Directly from `PROJECT.md`)

### 1.1 In scope for MVP

- [ ] `P0` Auth for registered users (signup, login, logout, reset password)
- [ ] `P0` Registered user can view associated events with role per event (planner/scanner)
- [ ] `P0` Event planner can create event with sales window and payment details
- [ ] `P0` Event planner can create ticket types (name, price, quantity, metadata)
- [ ] `P0` Event planner can create buyer form fields and mark required fields
- [ ] `P0` Event planner can publish event and share public link
- [ ] `P0` Buyer can open public event page, select tickets, submit form, and pay
- [ ] `P0` System verifies payment and generates ticket(s) with QR code
- [ ] `P0` Buyer receives confirmation email with QR code
- [ ] `P0` Scanner can scan QR and get valid/already-used/invalid result
- [ ] `P0` Scanner can view live checked-in count for assigned event
- [ ] `P0` Planner can view core dashboard metrics (sold, revenue, checked-in)
- [ ] `P0` Planner can view buyer form responses (searchable/sortable)
- [ ] `P0` Planner can add/remove event planners and ticket scanners

### 1.2 Out of scope for MVP (post-MVP)

- [ ] `P1` Offline scanning with sync queue
- [ ] `P1` Trend charts and advanced analytics
- [ ] `P1` Fraud detection and suspicious activity alerts
- [ ] `P1` Advanced incident automation

### 1.3 MVP capability map (requirement -> route -> backend)

| ID  | MVP capability                                 | Route(s)                                                   | Backend capability (current or target)                                                                | Status  |
| --- | ---------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| M1  | Auth for registered users                      | `/signup`, `/login`, `/forgot-password`, `/reset-password` | Current: `convex/http.ts` auth routes + `server/api/auth/[...all].ts` + `useAuth.ts`                  | Partial |
| M2  | View associated events and role per event      | `/dashboard`                                               | Target: `convex/eventRoles.ts:listUserEventAssociations`                                              | Missing |
| M3  | Planner creates event with sales/payment rules | `/planner/events/new`, `/planner/events/[eventId]`         | Target: `convex/events.ts:createEvent`, `convex/events.ts:updateEvent`                                | Missing |
| M4  | Planner creates and manages ticket types       | `/planner/events/[eventId]/tickets`                        | Target: `convex/ticketTypes.ts:createTicketType`, `convex/ticketTypes.ts:updateTicketType`            | Missing |
| M5  | Planner builds buyer form fields               | `/planner/events/[eventId]/form-builder`                   | Target: `convex/formFields.ts:createFormField`, `convex/formFields.ts:updateFormField`                | Missing |
| M6  | Planner publishes event and gets public link   | `/planner/events/[eventId]/publish`, `/events/[slug]`      | Target: `convex/events.ts:getPublishChecklist`, `convex/events.ts:publishEvent`                       | Missing |
| M7  | Buyer selects tickets, submits form, pays      | `/events/[slug]`, `/events/[slug]/checkout`                | Target: `convex/checkout.ts:createPurchaseIntent`, `convex/payments.ts:initializePaystackTransaction` | Missing |
| M8  | System verifies payment and issues QR tickets  | `/events/[slug]/confirmation/[purchaseRef]`                | Target: `convex/payments.ts:verifyPaystackPayment`, `convex/tickets.ts:issueTicketsFromPurchase`      | Missing |
| M9  | Buyer receives confirmation email with QR      | `/events/[slug]/confirmation/[purchaseRef]`                | Target: `convex/email.ts:sendPurchaseConfirmationEmail`                                               | Missing |
| M10 | Scanner validates QR status and checks in      | `/scanner/events`, `/scanner/events/[eventId]`             | Target: `convex/scanner.ts:validateScan`, `convex/scanner.ts:checkInTicket`                           | Missing |
| M11 | Scanner sees real-time checked-in count        | `/scanner/events/[eventId]`                                | Target: `convex/scanner.ts:getCheckedInCount`                                                         | Missing |
| M12 | Planner sees core dashboard metrics            | `/planner/events/[eventId]/dashboard`                      | Target: `convex/dashboard.ts:getCoreMetrics`                                                          | Missing |
| M13 | Planner views searchable/sortable responses    | `/planner/events/[eventId]/responses`                      | Target: `convex/formResponses.ts:listResponses`                                                       | Missing |
| M14 | Planner manages planners/scanners per event    | `/planner/events/[eventId]/team`                           | Target: `convex/eventRoles.ts:addEventRole`, `convex/eventRoles.ts:removeEventRole`                   | Missing |

### 1.4 Scope change rule

- Any new `P0` request must be added to this section with a route and backend mapping before implementation starts.
- If a request cannot be mapped to `PROJECT.md`, default it to `P1` or `P2` until explicitly approved for MVP.
- Do not start Phase work for an unmapped MVP requirement.

### Done when

- [x] `P0` MVP in-scope list is documented, reviewed, and agreed
- [x] `P0` Every MVP row in section 1.3 has at least one route and one backend capability
- [ ] `P0` Every item marked `P0` elsewhere in this file maps back to section 1.3 (no orphan `P0` work)

---

## 2) Route and Screen Inventory (Implementation Backbone)

Create every route below first, even with placeholder content, so implementation can proceed screen by screen.

### 2.1 Public routes

- [x] `P0` `/` Landing page (value prop, role explanation, CTA) - `app/pages/index.vue`
- [x] `P0` `/events/[slug]` Public event sales page - `app/pages/events/[slug]/index.vue`
- [x] `P0` `/events/[slug]/checkout` Buyer checkout page - `app/pages/events/[slug]/checkout.vue`
- [x] `P0` `/events/[slug]/confirmation/[purchaseRef]` Buyer confirmation page - `app/pages/events/[slug]/confirmation/[purchaseRef].vue`

### 2.2 Auth routes

- [x] `P0` `/login` - `app/pages/login.vue`
- [x] `P0` `/signup` - `app/pages/signup.vue`
- [x] `P0` `/forgot-password` - `app/pages/forgot-password.vue`
- [x] `P0` `/reset-password` - `app/pages/reset-password.vue`

### 2.3 Registered-user dashboard routes

- [x] `P0` `/dashboard` Event association list (show role per event) - `app/pages/dashboard.vue`, `convex/eventRoles.ts`
- [x] `P0` `/account` Basic profile and password update - `app/pages/account.vue`

### 2.4 Planner routes

- [x] `P0` `/planner/events/new` - `app/pages/planner/events/new.vue`
- [x] `P0` `/planner/events/[eventId]` - `app/pages/planner/events/[eventId]/index.vue`
- [x] `P0` `/planner/events/[eventId]/tickets` - `app/pages/planner/events/[eventId]/tickets.vue`
- [x] `P0` `/planner/events/[eventId]/form-builder` - `app/pages/planner/events/[eventId]/form-builder.vue`
- [x] `P0` `/planner/events/[eventId]/publish` - `app/pages/planner/events/[eventId]/publish.vue`
- [x] `P0` `/planner/events/[eventId]/dashboard` - `app/pages/planner/events/[eventId]/dashboard.vue`
- [x] `P0` `/planner/events/[eventId]/responses` - `app/pages/planner/events/[eventId]/responses.vue`
- [x] `P0` `/planner/events/[eventId]/team` - `app/pages/planner/events/[eventId]/team.vue`

### 2.5 Scanner routes

- [x] `P0` `/scanner/events` - `app/pages/scanner/events/index.vue`
- [x] `P0` `/scanner/events/[eventId]` - `app/pages/scanner/events/[eventId].vue`

### Done when

- [x] All routes exist and are protected with correct auth/role rules - `app/middleware/auth.global.ts`, `convex/eventRoles.ts`, `app/plugins/convex-auth.client.ts`, `app/pages/forbidden.vue`
- [x] No route returns 404 during normal planner, buyer, scanner flows - `app/pages/**`

---

## 3) Phase A - Public Foundation, Landing, and Auth

### Goal

Users can understand the product, create accounts, log in, and reach the correct dashboard.

### Work items

- [x] `P0` Build landing page sections: hero, how-it-works, role cards (planner/scanner/buyer), CTA buttons - `app/pages/index.vue`
- [x] `P0` Add public header/footer navigation with Login and Sign Up actions - `app/layouts/default.vue`
- [x] `P0` Build auth pages and connect to Better Auth actions - `app/pages/login.vue`, `app/pages/signup.vue`, `app/pages/forgot-password.vue`, `app/pages/reset-password.vue`, `app/composables/useAuth.ts`
- [x] `P0` Add auth error handling states (invalid credentials, email conflict, disabled account) - `app/composables/useAuth.ts`
- [x] `P0` Build post-login redirect logic to `/dashboard` - `app/composables/useAuth.ts`, `app/middleware/auth.global.ts`
- [x] `P0` Build unauthorized and forbidden pages/states - `app/pages/forbidden.vue`
- [x] `P0` Add route middleware rules for public, registered, planner-only, scanner-only routes - `app/middleware/auth.global.ts`, `server/api/authz/event-role.get.ts`

### Edge cases

- [x] `P0` Preserve intended destination after login (`redirect` query) - `app/middleware/auth.global.ts`, `app/composables/useAuth.ts`

### Done when

- New visitor can go from landing page to authenticated dashboard without manual steps
- Route protection blocks wrong role access reliably

---

## 4) Phase B - Planner Event Setup (Create -> Configure -> Publish)

### Goal

Planner can create a valid event and publish it with a working public link.

### 4.1 Event creation and rules

- [ ] `P0` Build event create form (name, event datetime, sales start/end, payment account details)
- [ ] `P0` Enforce date rules: sales start < sales end < event date
- [ ] `P0` Store event in `draft` status initially
- [ ] `P0` Build event edit page with status-based edit restrictions

### 4.2 Ticket type management

- [ ] `P0` Build ticket type CRUD (name, price, quantity, optional metadata)
- [ ] `P0` Enforce no duplicate ticket names per event
- [ ] `P0` Enforce quantity > 0 and price >= 0
- [ ] `P0` Prevent risky ticket edits after sales begin

### 4.3 Form builder

- [ ] `P0` Build form field CRUD (text, email, number, dropdown)
- [ ] `P0` Support required/optional toggle and display order
- [ ] `P0` Persist form schema per event
- [ ] `P0` Restrict destructive schema edits after first successful purchase

### 4.4 Publish flow

- [ ] `P0` Build publish checklist UI showing missing requirements
- [ ] `P0` Implement publish readiness checks (event details, tickets, form, payment config)
- [ ] `P0` Generate stable public event slug/link
- [ ] `P0` Move event state from `draft` to `on_sale` on successful publish

### Done when

- Planner can create an event from empty state and publish successfully
- Publish fails with clear requirement-specific errors when setup is incomplete

---

## 5) Phase C - Buyer Flow (Discover -> Select -> Submit -> Pay)

### Goal

Buyer can purchase tickets from the public event link end-to-end.

### 5.1 Public event sales page

- [ ] `P0` Show event details, ticket types, prices, and remaining quantities
- [ ] `P0` Show sales state banners (not started, on sale, ended, sold out)
- [ ] `P0` Build quantity selector with stock limits and per-order limits

### 5.2 Buyer form and checkout

- [ ] `P0` Render planner-defined custom fields dynamically
- [ ] `P0` Validate required fields client-side and server-side
- [ ] `P0` Build checkout summary (line items, fees if any, total)
- [ ] `P0` Initialize Paystack transaction from server
- [ ] `P0` Verify Paystack callback/webhook securely

### 5.3 Payment safety

- [ ] `P0` Make payment verification idempotent (same callback cannot create duplicates)
- [ ] `P0` Handle payment failure and timeout states cleanly
- [ ] `P0` Return user-facing purchase status pages/messages

### Done when

- Buyer can complete purchase with no manual intervention
- Failed or duplicate payment signals do not over-allocate inventory

---

## 6) Phase D - Ticket Issuance, QR, and Delivery

### Goal

Every successful purchase creates valid tickets and sends buyer confirmation.

### Work items

- [ ] `P0` Reserve and decrement inventory atomically only after verified payment
- [ ] `P0` Create ticket record per purchased unit with unique ticket ID/code
- [ ] `P0` Generate QR payload for each ticket
- [ ] `P0` Build buyer confirmation page with ticket list and QR display
- [ ] `P0` Send confirmation email with event info and QR attachment/link
- [ ] `P0` Add resend confirmation email action
- [ ] `P1` Track email delivery status (sent, failed, retried)

### Done when

- Every successful payment produces the exact expected number of tickets
- Buyer can retrieve ticket from confirmation page and email

---

## 7) Phase E - Scanner Experience (Event-Day Critical Path)

### Goal

Scanner validates tickets quickly and check-ins are accurate.

### Work items

- [ ] `P0` Build scanner event list restricted to assigned events
- [ ] `P0` Build scanner screen with camera permission and scan loop
- [ ] `P0` Implement validation logic: ticket exists, event matches, ticket unused
- [ ] `P0` Mark valid ticket as checked-in with timestamp and scanner user ID
- [ ] `P0` Return strict statuses: `valid`, `already_used`, `invalid`
- [ ] `P0` Show real-time checked-in counter for the selected event
- [ ] `P1` Log scan attempts for audit and support debugging
- [ ] `P2` Add offline queue and later sync conflict handling

### Done when

- Scanner can process repeated scans without accidental duplicate entry
- Planner can audit who scanned which ticket and when

---

## 8) Phase F - Planner Dashboard, Team, and Closeout

### Goal

Planner can monitor event performance and manage event staff safely.

### 8.1 Dashboard metrics

- [ ] `P0` Show tickets sold by type and total
- [ ] `P0` Show revenue by type and total
- [ ] `P0` Show checked-in count
- [ ] `P1` Add sales-over-time and check-in trend charts

### 8.2 Form responses

- [ ] `P0` Build searchable/sortable response table
- [ ] `P1` Add filters and CSV export

### 8.3 Team management

- [ ] `P0` Invite planners and scanners by email
- [ ] `P0` Assign and remove role per event
- [ ] `P0` Enforce role checks on every related query/mutation

### 8.4 Post-event closeout

- [ ] `P1` Mark event as completed (manual and/or automatic)
- [ ] `P1` Export attendee and revenue reports

### Done when

- Planner can run event operations without direct database access

---

## 9) Phase G - Security, Reliability, and Observability

### Goal

Critical flows are safe, auditable, and debuggable in production.

### Work items

- [ ] `P0` Centralize permission checks for planner/scanner actions
- [ ] `P0` Validate all public inputs and mutation/action args
- [ ] `P0` Verify payment webhook signature before processing
- [ ] `P0` Add idempotency keys/guards for payment and ticket issuance flows
- [ ] `P1` Add Sentry for frontend and backend error monitoring
- [ ] `P1` Add audit logs for publish, role changes, and check-ins
- [ ] `P1` Add basic abuse/rate limits on public endpoints

### Done when

- Security-critical actions fail closed and are traceable in logs

---

## 10) Phase H - Testing and CI Gates

### Goal

MVP flows are protected by automated tests before launch.

### 10.1 Unit tests

- [ ] `P0` Date and status transition rules
- [ ] `P0` Ticket inventory and total calculations
- [ ] `P0` Payment idempotency helpers
- [ ] `P0` Role/permission helpers

### 10.2 Component tests

- [ ] `P0` Auth forms with error states
- [ ] `P0` Planner setup screens (event, ticket, form, publish)
- [ ] `P0` Buyer checkout states
- [ ] `P0` Scanner result states

### 10.3 End-to-end tests

- [ ] `P0` Planner path: create event -> add tickets -> build form -> publish
- [ ] `P0` Buyer path: open public page -> buy ticket -> see confirmation
- [ ] `P0` Scanner path: scan valid -> reject duplicate
- [ ] `P1` Failure path: payment failure, invalid QR, unauthorized route access

### 10.4 CI checks

- [ ] `P0` CI runs lint, format, unit/component/e2e tests, and build
- [ ] `P1` Coverage report artifact and minimum thresholds

### Done when

- PR cannot merge if critical MVP tests fail

---

## 11) Launch Readiness Checklist

- [ ] `P0` Validate production env vars for auth, payment, email, and observability
- [ ] `P0` Complete Paystack sandbox-to-live switch checklist
- [ ] `P0` Complete email provider production setup and sender verification
- [ ] `P0` Run staging smoke test of full planner -> buyer -> scanner path
- [ ] `P0` Create event-day runbook for scanner and support operators
- [ ] `P1` Create rollback notes for payment/email/scanner outages

---

## 12) Practical Execution Order (Do This Sequence)

1. `P0` Route scaffolding + landing page + auth + middleware
2. `P0` Planner event setup (event, tickets, form, publish)
3. `P0` Public event page + buyer form + checkout + payment verify
4. `P0` Ticket generation + QR + email + confirmation page
5. `P0` Scanner validation and check-in flow
6. `P0` Planner dashboard essentials + team roles
7. `P0` Unit/component/e2e tests for all critical paths
8. `P0` Launch checklist and staging smoke test

---

## Immediate Next 10 Tasks (Concrete Start List)

- [x] `P0` Scaffold all routes listed in section 2 with placeholder pages and guards - `app/pages/**`, `app/middleware/auth.global.ts`
- [ ] `P0` Build landing page (`/`) with role-focused CTA to signup/login/public event
- [ ] `P0` Implement auth flow pages and post-login redirect to `/dashboard`
- [ ] `P0` Build planner event create/edit page with date validation
- [ ] `P0` Build ticket type CRUD with duplicate and quantity rules
- [ ] `P0` Build form builder and persist form schema per event
- [ ] `P0` Build publish checklist and event publish action
- [ ] `P0` Build public event sales page and buyer checkout page
- [ ] `P0` Implement payment verify -> ticket generation -> confirmation email pipeline
- [ ] `P0` Build scanner page with valid/already-used/invalid outcomes
