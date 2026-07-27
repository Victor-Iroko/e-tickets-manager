# Feature-by-Feature Implementation Plan: E-Tickets Manager

> **Note:** Initial database schemas (`@server/db/schemas`), Better Auth initialization (`@server/utils/auth.ts`), Cloudinary utility (`@server/utils/cloudinary.ts`), Paystack helper (`@server/utils/paystack.ts`), and Email helper (`@server/utils/email.ts`) are already configured in the codebase.
> This plan focuses exclusively on the **remaining work to be built**, organized feature by feature.

---

## 🔐 Feature 1: Authentication UI & Role Guards

### Goal

Connect frontend authentication pages to Better Auth and enforce role-based access control (`organizer` vs `attendee`).

### Checklist

- [ ] **Auth Client & Route Middleware**
  - [ ] Implement `@app/middleware/auth.ts` to protect authenticated routes and redirect unauthenticated users to `/login`.
  - [ ] Implement `@app/middleware/organizer.ts` to enforce `organizer` role check on all `/dashboard/*` routes.
- [ ] **Real API Handlers**
  - [ ] Update `@server/api/me/index.get.ts` to return authenticated user profile from session.
  - [ ] Update `@server/api/me/index.patch.ts` for updating user name and image.
  - [ ] Update `@server/api/me/password.patch.ts` for password updates.
- [ ] **Frontend Auth Screens (`@nuxt/ui`)**
  - [ ] Complete `@app/pages/login.vue` with email/password sign-in and Google OAuth trigger.
  - [ ] Complete `@app/pages/register.vue` with role selector (`organizer` / `attendee`).
  - [ ] Complete `@app/pages/forgot-password.vue` to request OTP reset links.
  - [ ] Complete `@app/pages/verify-otp.vue` for OTP verification.
  - [ ] Complete `@app/pages/profile.vue` for profile and password management.

---

## 📅 Feature 2: Organizer Event Management & Banner Uploads

### Goal

Allow organizers to create, edit, publish, and delete events, including image banner uploads via Cloudinary.

### Checklist

- [ ] **Event API Handlers (Drizzle Integration)**
  - [ ] Update `@server/api/events/index.post.ts` to insert draft events into `events` table with organizer ID.
  - [ ] Update `@server/api/me/events.get.ts` to query organizer's events.
  - [ ] Update `@server/api/events/[id]/index.get.ts` to fetch single event details.
  - [ ] Update `@server/api/events/[id]/index.patch.ts` to edit event details.
  - [ ] Update `@server/api/events/[id]/status.patch.ts` to handle status transitions (`draft` -> `published` -> `cancelled` / `completed`).
  - [ ] Update `@server/api/events/[id]/index.delete.ts` to remove draft events.
  - [ ] Update `@server/api/upload/presigned.post.ts` using `@server/utils/cloudinary.ts` to generate signed upload credentials.
- [ ] **Organizer Dashboard UI (`@nuxt/ui`)**
  - [ ] Complete `@app/pages/dashboard/index.vue` with overview stats and quick actions.
  - [ ] Complete `@app/pages/dashboard/events/index.vue` listing created events with status badges.
  - [ ] Complete `@app/pages/dashboard/events/new.vue` with event creation form and Cloudinary image upload component.
  - [ ] Complete `@app/pages/dashboard/events/[id]/index.vue` event management overview page.
  - [ ] Complete `@app/pages/dashboard/events/[id]/edit.vue` pre-filled event edit page.

---

## 🎟️ Feature 3: Ticket Pricing & Inventory Configuration

### Goal

Enable organizers to create and manage multiple ticket types (VIP, Regular, Early Bird) with price, quantity, and sale schedules.

### Checklist

- [ ] **Ticket Types API Handlers**
  - [ ] Update `@server/api/events/[id]/ticket-types/index.post.ts` to create ticket tiers.
  - [ ] Update `@server/api/events/[id]/ticket-types/[typeId].patch.ts` to modify price and quantity.
  - [ ] Update `@server/api/events/[id]/ticket-types/[typeId].delete.ts` to remove unsold ticket tiers.
- [ ] **Ticket Management UI**
  - [ ] Complete `@app/pages/dashboard/events/[id]/tickets/index.vue` displaying ticket tier cards with inventory counters.
  - [ ] Complete `@app/pages/dashboard/events/[id]/tickets/new.vue` ticket creation form.

---

## 🌐 Feature 4: Public Event Catalog & Discovery

### Goal

Provide public pages for browsing and discovering published events with search and filtering.

### Checklist

- [ ] **Public Event Query API**
  - [ ] Update `@server/api/events/index.get.ts` to query `published` events with title search, location filter, and pagination.
- [ ] **Public UI Pages**
  - [ ] Build `@app/pages/index.vue` landing page with hero banner and featured events grid.
  - [ ] Build `@app/pages/explore.vue` search page with filter inputs and event cards.
  - [ ] Build `@app/pages/events/[id].vue` public event detail page with ticket selection.

---

## 🛒 Feature 5: Checkout & Stock Reservation Engine

### Goal

Handle ticket ordering and atomic stock checks before payment processing.

### Checklist

- [ ] **Order API Handlers**
  - [ ] Update `@server/api/orders/index.post.ts` with a Drizzle transaction to verify stock availability, compute totals, and create `pending` order.
  - [ ] Update `@server/api/me/orders.get.ts` to retrieve attendee order history.
  - [ ] Update `@server/api/orders/[id].get.ts` to fetch single order state.
- [ ] **Checkout UI**
  - [ ] Complete `@app/pages/checkout/[eventId].vue` with ticket item selection, quantity counter, total pricing, and checkout button.

---

## 💳 Feature 6: Paystack Payment Gateway & Fulfillment Webhook

### Goal

Integrate Paystack checkout redirect and webhook listener for automated ticket issuance.

### Checklist

- [ ] **Paystack Integration & Webhook Handler**
  - [ ] Connect `@server/api/orders/index.post.ts` to `@server/utils/paystack.ts` to generate Paystack checkout URLs.
  - [ ] Update `@server/api/webhooks/payment.post.ts`:
    - [ ] Validate Paystack HMAC SHA512 signature header.
    - [ ] On `charge.success`: update order status to `paid`.
    - [ ] Atomically increment `quantity_sold` in `ticket_types`.
    - [ ] Generate individual `tickets` records with cryptographically random `qr_code` strings.

---

## 📱 Feature 7: Attendee Ticket Wallet & QR Display

### Goal

Allow attendees to view purchased tickets with clear QR code rendering for event entry.

### Checklist

- [ ] **Ticket Wallet APIs**
  - [ ] Update `@server/api/me/tickets/index.get.ts` to fetch user's valid tickets.
  - [ ] Update `@server/api/me/tickets/[id].get.ts` to fetch single ticket details.
- [ ] **Ticket Wallet UI**
  - [ ] Build `@app/pages/tickets/index.vue` listing purchased tickets.
  - [ ] Build `@app/pages/tickets/[id].vue` presenting full ticket detail and SVG QR code component.

---

## 🔍 Feature 8: Gate Control, Magic Link Sessions & Camera QR Scanner

### Goal

Enable organizers to issue passwordless scanner links for gate staff to validate QR codes via web camera scanning.

### Checklist

- [ ] **Scanner Sessions & Verification API**
  - [ ] Update `@server/api/events/[id]/scanner-sessions/index.post.ts` to create magic link tokens.
  - [ ] Update `@server/api/events/[id]/scanner-sessions/index.get.ts` to list active scanner sessions.
  - [ ] Update `@server/api/events/[id]/scanner-sessions/[sessionId].delete.ts` to revoke scanner tokens.
  - [ ] Update `@server/api/scan/verify.post.ts`:
    - [ ] Authenticate request using scanner session token.
    - [ ] Verify QR code in `tickets` table.
    - [ ] Update ticket status `valid` ➔ `used`, set `scanned_at`, and set `scanned_by_session_id`.
    - [ ] Return status response (`valid`, `already_used`, `invalid`, `expired`).
- [ ] **Scanner UI**
  - [ ] Complete `@app/pages/dashboard/events/[id]/scanners.vue` for managing scanner links.
  - [ ] Complete `@app/pages/scan/[eventId].vue` with HTML5 camera stream scanner, sound alerts, and manual code input fallback.

---

## 📊 Feature 9: Organizer Analytics & Attendee Management

### Goal

Provide organizers with sales graphs, check-in statistics, and attendee rosters.

### Checklist

- [ ] **Analytics & Attendee APIs**
  - [ ] Update `@server/api/events/[id]/analytics.get.ts` to return revenue metrics, scan counts, and sales timeline.
  - [ ] Update `@server/api/events/[id]/attendees.get.ts` to query attendee check-in records.
- [ ] **Dashboard Analytics UI**
  - [ ] Complete `@app/pages/dashboard/events/[id]/analytics.vue` with metrics cards and charts.
  - [ ] Complete `@app/pages/dashboard/events/[id]/attendees.vue` with searchable attendee roster.

---

## ✉️ Feature 10: Email Notifications Engine

### Goal

Send automated ticket delivery emails and password reset OTPs.

### Checklist

- [ ] **Email Dispatch Integration**
  - [ ] Connect `@server/utils/email.ts` to payment webhook fulfillment to send ticket purchase receipts with QR links.
  - [ ] Verify password reset email dispatches via Better Auth plugin.

---

## 🚀 Feature 11: Testing & Production Hardening

### Goal

Ensure high performance, zero linting errors, and complete test coverage.

### Checklist

- [ ] **Quality & Testing**
  - [ ] Write Vitest unit tests in `test/unit/` for API endpoints and checkout transactions (`vp test`).
  - [ ] Write Playwright E2E tests in `test/e2e/` for complete user journeys.
  - [ ] Run `vp check` to enforce zero formatting and type errors across the codebase.
