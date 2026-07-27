### Project Overview

E-Tickets Manager is a web platform for event organizers to create events, sell tickets online, and validate attendees via QR code scanning on the day.

### Problem Statement

Creating and selling tickets online currently requires building or maintaining a dedicated website — which is costly, time-consuming, and pulls focus away from the event itself.

### Proposed Solution

A centralized platform that handles the full ticket lifecycle — creation, sales, and day-of scanning — so organizers can focus on running a great event.

### User Roles

- **Organizer** — Creates and manages events and tickets
- **Attendee** — Discovers and purchases tickets
- **Scanner** — Validates attendee tickets at the venue

### User Capabilities

- Organizer
  - Create & edit events
  - Configure ticket types (price, quantity, etc.)
  - Assign scanners to events
  - View sales analytics & attendee list
- Attendee
  - Browse and open event links
  - Purchase tickets
  - View and store QR code ticket
- Scanner
  - Access assigned events
  - Scan and validate QR codes
  - See real-time entry status

### User Flows

- Organizer
  Register → Create event → Configure tickets → Publish → Share link → Monitor analytics
- Attendee
  Open event link → View details → Purchase → Receive QR code → Attend
- Scanner
  Login → Select event → Open scanner → Scan QR code → Confirm entry

### Screen Inventory

- Auth
  | Screen | Route | Accessible Roles | Content | Actions |
  | --------------- | ------------------ | ---------------- | ----------------- | ---------------------------------------- |
  | Login | `/login` | All | Login form | Sign in, go to register, forgot password |
  | Register | `/register` | All | Registration form | Create account |
  | Forgot Password | `/forgot-password` | All | Email input | Request reset link |
- Public
  | Screen | Route | Accessible Roles | Content | Actions |
  | ---------- | ------------- | ---------------- | ------------------------------------ | ----------------------------- |
  | Landing | `/` | All | App intro, featured events | Browse events, login/register |
  | Explore | `/explore` | All | Public events list | Search, filter, open event |
  | Event Page | `/events/:id` | All | Event details, ticket types & prices | Purchase ticket |
- Organizer
  | Screen | Route | Accessible Roles | Content | Actions |
  | --------------- | ----------------------------------- | ---------------- | ------------------------------- | --------------------------------------------- |
  | Dashboard | `/dashboard` | Organizer | Events summary, recent activity | Create event, view events |
  | My Events | `/dashboard/events` | Organizer | List of created events | Create, open event |
  | Create Event | `/dashboard/events/new` | Organizer | Event creation form | Submit |
  | Event Overview | `/dashboard/events/:id` | Organizer | Event stats, quick links | Edit, manage tickets/scanners, view analytics |
  | Edit Event | `/dashboard/events/:id/edit` | Organizer | Pre-filled event form | Update |
  | Ticket Types | `/dashboard/events/:id/tickets` | Organizer | List of ticket types | Create, edit, delete |
  | Create Ticket | `/dashboard/events/:id/tickets/new` | Organizer | Ticket form (name, price, qty) | Submit |
  | Manage Scanners | `/dashboard/events/:id/scanners` | Organizer | Scanner links list | Generate link, revoke link |
  | Analytics | `/dashboard/events/:id/analytics` | Organizer | Sales data, attendance stats | View, filter |
  | Attendees | `/dashboard/events/:id/attendees` | Organizer | Ticket purchasers list | Search |
- Attendee
  | Screen | Route | Accessible Roles | Content | Actions |
  | ------------- | -------------------- | ---------------- | ------------------------------- | ----------------------- |
  | Checkout | `/checkout/:eventId` | Attendee | Ticket selection + payment form | Select tickets, pay |
  | My Tickets | `/tickets` | Attendee | Purchased tickets list | View ticket |
  | Ticket Detail | `/tickets/:id` | Attendee | QR code + event info | Display QR for scanning |
- Scanner
  | Screen | Route | Accessible Roles | Content | Actions |
  | --------------- | -------------------------- | -------------------- | ---------------------- | ----------------------------------- |
  | Scanner Session | `/scan/:eventId?token=xxx` | Scanner (magic link) | QR reader, scan result | Scan QR code, confirm valid/invalid |
- Shared
  | Screen | Route | Accessible Roles | Content | Actions |
  | --------- | ---------- | ------------------- | -------------------- | ------------------------------------- |
  | Profile | `/profile` | Organizer, Attendee | User info & settings | Edit profile, change password, logout |
  | Not Found | `/*` | All | 404 message | Go home |

### Data Model Design

- user
  Managed by Better Auth.
  | Column | Type | Constraints |
  | -------------- | ------------ | ------------------------------------ |
  | id | UUID | PK |
  | name | VARCHAR(255) | NOT NULL |
  | email | VARCHAR(255) | NOT NULL, UNIQUE |
  | email_verified | BOOLEAN | NOT NULL, DEFAULT FALSE |
  | image | TEXT | NULLABLE |
  | role | ENUM | NOT NULL, DEFAULT `attendee` — `organizer`, `attendee` |
  | created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
  | updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
- events
  | Column | Type | Constraints |
  | ------------ | ------------ | -------------------------------------------------------------------------- |
  | id | UUID | PK |
  | organizer_id | UUID | FK → user.id, NOT NULL |
  | title | VARCHAR(255) | NOT NULL |
  | description | TEXT | |
  | location | VARCHAR(255) | |
  | banner_url | VARCHAR(500) | |
  | start_at | TIMESTAMP | NOT NULL |
  | end_at | TIMESTAMP | NOT NULL |
  | status | ENUM | NOT NULL, DEFAULT `draft` — `draft`, `published`, `cancelled`, `completed` |
  | created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
  | updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
  Check: `end_at > start_at`
- ticket_types
  | Column | Type | Constraints |
  | -------------- | ------------- | ------------------------------- |
  | id | UUID | PK |
  | event_id | UUID | FK → events.id, NOT NULL |
  | name | VARCHAR(255) | NOT NULL |
  | description | TEXT | |
  | price | NUMERIC(10,2) | NOT NULL, CHECK >= 0 |
  | quantity | INTEGER | NOT NULL, CHECK > 0 |
  | quantity_sold | INTEGER | NOT NULL, DEFAULT 0, CHECK >= 0 |
  | sale_starts_at | TIMESTAMP | |
  | sale_ends_at | TIMESTAMP | |
  | created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
  | updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
  Checks: `quantity_sold <= quantity` · `sale_ends_at > sale_starts_at` (when both set)
- orders
  Groups tickets purchased in a single transaction.
  | Column | Type | Constraints |
  | ------------ | ------------- | --------------------------------------------------------------------- |
  | id | UUID | PK |
  | attendee_id | UUID | FK → user.id, NOT NULL |
  | event_id | UUID | FK → events.id, NOT NULL |
  | total_amount | NUMERIC(10,2) | NOT NULL, CHECK >= 0 |
  | status | ENUM | NOT NULL, DEFAULT `pending` — `pending`, `paid`, `failed`, `refunded` |
  | payment_ref | VARCHAR(255) | External payment provider reference |
  | created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
  | updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
- tickets
  One row per individual ticket (one per seat/entry).
  | Column | Type | Constraints |
  | --------------------- | ------------- | -------------------------------------------------------- |
  | id | UUID | PK |
  | order_id | UUID | FK → orders.id, NOT NULL |
  | ticket_type_id | UUID | FK → ticket_types.id, NOT NULL |
  | unit_price | NUMERIC(10,2) | NOT NULL — price captured at purchase time |
  | qr_code | VARCHAR(255) | NOT NULL, UNIQUE |
  | status | ENUM | NOT NULL, DEFAULT `valid` — `valid`, `used`, `cancelled` |
  | scanned_at | TIMESTAMP | NULL until scanned |
  | scanned_by_session_id | UUID | FK → scanner_sessions.id, NULLABLE |
  | created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
- scanner_sessions
  Magic link sessions — no user account attached.
  | Column | Type | Constraints |
  | ---------- | ------------ | ----------------------------------------- |
  | id | UUID | PK |
  | event_id | UUID | FK → events.id, NOT NULL |
  | token | VARCHAR(255) | NOT NULL, UNIQUE |
  | label | VARCHAR(255) | Optional — e.g. "Gate A", "Main Entrance" |
  | expires_at | TIMESTAMP | NOT NULL |
  | revoked | BOOLEAN | NOT NULL, DEFAULT FALSE |
  | created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
- sessions
  Managed entirely by Better Auth.
  | Column | Type | Constraints |
  | --------- | ------------ | ------------------------------------------- |
  | id | UUID | PK |
  | token | VARCHAR(255) | NOT NULL, UNIQUE — the session cookie value |
  | user_id | UUID | FK → user.id, NOT NULL |
  | expires_at | TIMESTAMP | NOT NULL |
  | ip_address | VARCHAR(255) | |
  | user_agent | VARCHAR(255) | |
  | created_at | TIMESTAMP | NOT NULL |
  | updated_at | TIMESTAMP | NOT NULL |
- accounts
  Links users to auth providers and stores credentials. Managed by Better Auth.
  | Column | Type | Constraints |
  | ------------------------- | ------------ | -------------------------------------- |
  | id | UUID | PK |
  | user_id | UUID | FK → user.id, NOT NULL |
  | provider_id | VARCHAR(255) | NOT NULL — e.g. `credential`, `google` |
  | account_id | VARCHAR(255) | NOT NULL — provider's user ID |
  | password | TEXT | NULLABLE — hashed password for credential auth |
  | access_token | TEXT | |
  | refresh_token | TEXT | |
  | id_token | TEXT | |
  | access_token_expires_at | TIMESTAMP | |
  | refresh_token_expires_at | TIMESTAMP | |
  | scope | TEXT | |
  | created_at | TIMESTAMP | NOT NULL |
  | updated_at | TIMESTAMP | NOT NULL |
- verification
  Stores tokens for verification & password resets. Managed by Better Auth.
  | Column | Type | Constraints |
  | ---------- | ------------ | -------------------- |
  | id | UUID | PK |
  | identifier | VARCHAR(255) | NOT NULL |
  | value | TEXT | NOT NULL |
  | expires_at | TIMESTAMP | NOT NULL |
  | created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
  | updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

### Relationships

```jsx
user ──[1:N]──► events              (organizer_id)
user ──[1:N]──► orders              (attendee_id)
events ──[1:N]──► ticket_types
events ──[1:N]──► orders
events ──[1:N]──► scanner_sessions
orders ──[1:N]──► tickets
ticket_types ──[1:N]──► tickets
user ──[1:N]──► sessions             (user_id)
user ──[1:N]──► accounts             (user_id)
scanner_sessions ──[0:N]──► tickets  (scanned_by_session_id, nullable)
```

### Notes

- `unit_price` on `tickets` captures price at purchase time — `ticket_types.price` can change after purchase
- `quantity_sold` is a cached counter — must be incremented atomically inside a transaction to prevent overselling
- `payment_ref` on `orders` is a lightweight hook for a payment provider (Paystack, Stripe, etc.) — no separate payments table for now
- Scanner has no `users` row — their identity is entirely the `scanner_sessions.token`

### API Contract

All private endpoints use session cookie auth (`better-auth.session_token`, httpOnly, set automatically on sign-in). Errors return `{ error: { code, message } }`.

- Auth
  | Method | Endpoint | Auth | Access |
  | ------ | --------------------------- | ------- | ---------------------- |
  | POST | `/api/auth/sign-up/email` | Public | All |
  | POST | `/api/auth/sign-in/email` | Public | All |
  | POST | `/api/auth/sign-in/social` | Public | All |
  | GET | `/api/auth/callback/google` | Public | OAuth redirect handler |
  | POST | `/api/auth/sign-out` | Private | All (authenticated) |
  | GET | `/api/auth/get-session` | Private | All (authenticated) |
  | POST | `/api/auth/forget-password` | Public | All |
  | POST | `/api/auth/reset-password` | Public | All |
  All endpoints are auto-exposed by Better Auth — configured, not written.
  **POST /api/auth/sign-up/email**
  Request
  ```
  { name, email, password, role: "organizer | attendee" }
  ```
  Response `200` + sets `better-auth.session_token` cookie
  ```
  { user: { id, name, email, role, emailVerified }, session: { id, expiresAt } }
  ```
  **POST /api/auth/sign-in/email**
  Request
  ```
  { email, password }
  ```
  Response `200` + sets `better-auth.session_token` cookie
  ```
  { user: { id, name, email, role, emailVerified }, session: { id, expiresAt } }
  ```
  **POST /api/auth/sign-in/social** — Google OAuth
  Request
  ```
  { provider: "google", callbackURL: "/dashboard" }
  ```
  Redirects to Google → `/api/auth/callback/google` → Better Auth creates/finds user → sets cookie → redirects to `callbackURL`.
- Events
  | Method | Endpoint | Auth | Access |
  | ------ | -------------------- | ------- | --------------- |
  | GET | `/events` | Public | All |
  | GET | `/events/:id` | Public | All |
  | GET | `/me/events` | Private | Organizer |
  | POST | `/events` | Private | Organizer |
  | PATCH | `/events/:id` | Private | Organizer (own) |
  | PATCH | `/events/:id/status` | Private | Organizer (own) |
  | DELETE | `/events/:id` | Private | Organizer (own) |
  **GET /events** — query params: `?search, location, page`
  Response `200`
  ```
  {
    data: [{ id, title, location, start_at, end_at, banner_url, ticket_types: [{ name, price }] }],
    pagination: { cursor, has_next }
  }
  ```
  **GET /events/:id**
  Response `200`
  ```
  {
    id, title, description, location, banner_url, start_at, end_at, status,
    organizer: { id, name },
    ticket_types: [{ id, name, description, price, quantity, quantity_sold }]
  }
  ```
  **POST /events**
  Request
  ```
  { title, description?, location?, banner_url?, start_at, end_at }
  ```
  Response `201` — full event object
  **PATCH /events/:id/status**
  Request
  ```
  { status: "published | cancelled | completed" }
  ```
  Response `200`
  ```
  { id, status }
  ```
- Ticket Types
  | Method | Endpoint | Auth | Access |
  | ------ | ---------------------------------- | ------- | --------------------- |
  | POST | `/events/:id/ticket-types` | Private | Organizer (own event) |
  | PATCH | `/events/:id/ticket-types/:typeId` | Private | Organizer (own event) |
  | DELETE | `/events/:id/ticket-types/:typeId` | Private | Organizer (own event) |
  **POST /events/:id/ticket-types**
  Request
  ```
  { name, description?, price, quantity, sale_starts_at?, sale_ends_at? }
  ```
  Response `201` — ticket_type object
- Orders
  | Method | Endpoint | Auth | Access |
  | ------ | -------------------- | ------- | --------------------- |
  | POST | `/orders` | Private | Attendee |
  | GET | `/me/orders` | Private | Attendee |
  | GET | `/orders/:id` | Private | Attendee (own) |
  | GET | `/events/:id/orders` | Private | Organizer (own event) |
  **POST /orders**
  Request
  ```
  { event_id, items: [{ ticket_type_id, quantity }] }
  ```
  Response `201`
  ```
  { order: { id, total_amount, status: "pending" }, payment_url }
  ```
  **GET /orders/:id**
  Response `200`
  ```
  { id, status, total_amount, payment_ref, tickets: [{ id, ticket_type, qr_code, status }] }
  ```
- Tickets
  | Method | Endpoint | Auth | Access |
  | ------ | ----------------------- | ------- | --------------------- |
  | GET | `/me/tickets` | Private | Attendee |
  | GET | `/me/tickets/:id` | Private | Attendee (own) |
  | GET | `/events/:id/attendees` | Private | Organizer (own event) |
  **GET /me/tickets/:id**
  Response `200`
  ```
  {
    id, qr_code, status, unit_price, scanned_at,
    ticket_type: { name },
    event: { id, title, location, start_at, end_at },
    order: { id }
  }
  ```
- Scanner Sessions
  | Method | Endpoint | Auth | Access |
  | ------ | ----------------------------------------- | ------- | --------------------- |
  | POST | `/events/:id/scanner-sessions` | Private | Organizer (own event) |
  | GET | `/events/:id/scanner-sessions` | Private | Organizer (own event) |
  | DELETE | `/events/:id/scanner-sessions/:sessionId` | Private | Organizer (own event) |
  **POST /events/:id/scanner-sessions**
  Request
  ```
  { label?, expires_at }
  ```
  Response `201`
  ```
  { id, label, token, expires_at, link: "https://app.com/scan/:id?token=xxx" }
  ```
- Scanning
  | Method | Endpoint | Auth | Access |
  | ------ | -------------- | ----------- | -------------------------- |
  | POST | `/scan/verify` | Token-based | Scanner (magic link token) |
  Token passed as `Authorization: Bearer <scanner_token>` or `?token=` query param.
  **POST /scan/verify**
  Request
  ```
  { qr_code }
  ```
  Response `200` — valid
  ```
  { valid: true, ticket: { id, status: "used" }, attendee_name, ticket_type }
  ```
  Response `200` — invalid
  ```
  { valid: false, reason: "already_used | cancelled | invalid | expired" }
  ```
- Analytics
  | Method | Endpoint | Auth | Access |
  | ------ | ----------------------- | ------- | --------------------- |
  | GET | `/events/:id/analytics` | Private | Organizer (own event) |
  **GET /events/:id/analytics**
  Response `200`
  ```
  {
    total_tickets_sold, total_revenue, tickets_scanned,
    tickets_by_type: [{ name, sold, remaining, revenue }],
    sales_over_time: [{ date, count, revenue }]
  }
  ```
- User
  | Method | Endpoint | Auth | Access |
  | ------ | -------------- | ------- | ------------------- |
  | GET | `/me` | Private | All (authenticated) |
  | PATCH | `/me` | Private | All (authenticated) |
  | PATCH | `/me/password` | Private | All (authenticated) |
  **PATCH /me/password**
  Request
  ```
  { current_password, new_password }
  ```
  Response `200`
  ```
  { message: "Password updated" }
  ```
- Webhooks
  | Method | Endpoint | Auth | Access |
  | ------ | ------------------- | ------------------ | -------- |
  | POST | `/webhooks/payment` | Provider signature | Internal |
  Receives payment confirmation from Paystack/Stripe. Marks order as `paid` and activates tickets. Verified via provider HMAC signature in request headers — not a JWT.

### Design Elements

- Fonts
  - Heading — **Bebas Neue**
  - Body — **Montserrat**
- Colors
  - Primary — Electric violet (#534AB7)
  - Secondary — Coral (#D85A30)
  - Neutral — Warm white (#F5F4F2)

### Technology Stack

- Framework: Nuxt
- UI Component Library: Nuxt UI
- Auth: Better Auth
- Database: Neon postgres
- Storage: Cloudinary
- Payments: Paystack
- Error Monitoring: Sentry
- Email: Nodemailer with gmail smtp
- Deployment: Vercel
- CI/CD: Github Actions
