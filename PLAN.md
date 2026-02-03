# E-tickets Manager app

## Project Overview

This application is an e-ticket manager that helps event organizers create, sell, and manage tickets for events, and enables attendees to purchase tickets and gain entry using QR codes.

## Problem Statement

When hosting a paid event (e.g., a conference or concert), organizers often have two poor options:

- Build a custom website, which is expensive and time-consuming, or
- Use tools like Google Forms where users manually upload payment receipts.

Neither option handles ticket validation or event-day entry well. Manually checking tickets or receipts at the venue is slow, error-prone, and difficult to scale.

## Proposed Solution

This app provides a simple platform where organizers can create events and tickets, collect payments, and manage attendance. Attendees purchase tickets online and receive a QR code after payment. On the event day, tickets are validated instantly by scanning the QR code.

### User Roles

- Registered User
  - Event planner — The person (or team) responsible for creating and managing an event. They act as the event’s administrators.
  - Ticket Scanners — Users authorized to scan and validate tickets at the event venue.
- Users/Ticket Buyers — Users who purchase tickets to attend events (e.g., conference attendees or concert fans).

## User Capabilities

### Registered User (General)

- Register, Login, Logout
- View a list of events they are associated with and their role per event (Event Planner or Ticket Scanner)
- Create an event with:
  - Event name
  - Event date
  - Ticket sales start time
  - Ticket sales end time
  - Payment account details

### Event Planner

- Create tickets for an event:
  - Ticket name/type (e.g., Regular, VIP, Table)
  - Total ticket quantity
  - Ticket price
  - Optional metadata (e.g., seat number, section)
- Create and manage a custom form for ticket buyers (e.g., name, email, age)
- Publish a public link for ticket sales
- View an event dashboard showing:
  - Event details
  - Tickets sold per ticket type and total
  - Revenue per ticket type and total
  - Number of attendees checked in
  - List of form responses (searchable and sortable)
- Add or remove event planners
- Add or remove ticket scanners

### Ticket Scanner

- View the total number of attendees checked in
- Scan and validate QR codes at the event entrance
- See whether a ticket is valid, already used, or invalid

### User/Ticket Buyer

- View event details and available tickets
- Fill out the required form
- Select ticket type(s) and quantity
- Complete checkout and payment
- Receive a confirmation email with their ticket QR code

## User flows

### 1. Global / System-Wide Flows

- 1.1 Authentication & Access Flow (Registered Users)
  **Actors:** Event Planners, Ticket Scanners
  **Flow:**
  1. User visits app
  2. Clicks **Sign Up / Login**
  3. Enters credentials (email + password / OAuth)
  4. System validates credentials
  5. On success:
     - Session is created
     - User is redirected to **Dashboard**
  6. On failure:
     - Error message shown
     - Retry allowed
       **Edge Cases:**
  - Password reset
  - Email verification
  - Disabled account
  - Role-restricted access per event
- 1.2 Event Association Flow
  **Actors:** Event Planners, Ticket Scanners
  **Flow:**
  1. User logs in
  2. System fetches:
     - Events user is associated with
     - User’s role per event
  3. Dashboard shows:
     - Event name
     - Role (Planner / Scanner)
     - Event status (Draft / On Sale / Closed / Live)

### 2. Event Planner Flows

- 2.1 Create Event Flow
  **Actor:** Event Planner
  **Flow:**
  1. Planner clicks **Create Event**
  2. Enters:
     - Event name
     - Event date & time
     - Ticket sales start date/time
     - Ticket sales end date/time
     - Payment account details
  3. Clicks **Save**
  4. System:
     - Validates fields
     - Creates event in `Draft` state
  5. Planner is redirected to **Event Setup Dashboard**
     **Edge Cases:**
  - Sales end date before start date
  - Event date before sales end
  - Missing payment info
- 2.2 Ticket Type Creation Flow
  **Actor:** Event Planner
  **Flow:**
  1. From Event Dashboard → **Create Ticket**
  2. Enters:
     - Ticket name (e.g., VIP)
     - Price
     - Total quantity
     - Optional metadata (seat, section)
  3. Clicks **Save**
  4. System:
     - Stores ticket type
     - Sets remaining quantity = total quantity
  5. Ticket appears in ticket list
     **Edge Cases:**
  - Quantity = 0
  - Duplicate ticket names
  - Editing ticket after sales begin (restricted)
- 2.3 Custom Form Builder Flow
  **Actor:** Event Planner
  **Flow:**
  1. From Event Dashboard → **Form Builder**
  2. Adds form fields:
     - Field label
     - Field type (text, email, number, dropdown)
     - Required / optional
  3. Reorders fields
  4. Saves form
  5. System:
     - Attaches form schema to event
     - Validates required fields
       **Edge Cases:**
  - Deleting fields after tickets sold
  - Making required fields optional later
- 2.4 Publish Event & Ticket Sales Flow
  **Actor:** Event Planner
  **Flow:**
  1. Planner reviews:
     - Event details
     - Tickets
     - Form
  2. Clicks **Publish**
  3. System:
     - Validates event readiness
     - Generates public ticket sales link
  4. Event status becomes **On Sale**
  5. Planner shares public link
- 2.5 Event Dashboard & Analytics Flow
  **Actor:** Event Planner
  **Flow:**
  1. Opens Event Dashboard
  2. Views:
     - Total tickets sold
     - Tickets sold per type
     - Revenue per type
     - Total revenue
     - Attendees checked in
  3. Views list of form submissions:
     - Search
     - Sort
     - Filter
- 2.6 Manage Event Team Flow
  - Add / Remove Event Planners
    **Flow:**
    1. Planner opens **Team Management**
    2. Invites user via email
    3. Assigns role: Event Planner
    4. User accepts invite
    5. System grants permissions
  - Add / Remove Ticket Scanners
    **Flow:**
    1. Planner opens **Scanner Management**
    2. Invites user via email
    3. Assigns role: Ticket Scanner
    4. User accepts invite
    5. Scanner gains scan access

### 3. Ticket Scanner Flows

- 3.1 Scanner Access Flow
  **Actor:** Ticket Scanner
  **Flow:**
  1. Scanner logs in
  2. Selects assigned event
  3. System verifies scanner role
  4. Scanner sees:
     - Event name
     - Total checked-in count
     - QR scanner interface
- 3.2 QR Code Scanning & Validation Flow
  **Actor:** Ticket Scanner
  **Flow:**
  1. Scanner opens QR scanning screen
  2. Scans attendee QR code
  3. System:
     - Decodes QR data
     - Verifies ticket exists
     - Checks event match
     - Checks ticket status
  4. Result shown:
     - ✅ Valid (not used)
     - ❌ Already used
     - ❌ Invalid / wrong event
  5. If valid:
     - Ticket is marked as **Checked-in**
     - Timestamp + scanner ID recorded
  6. Checked-in count updates in real time
     **Edge Cases:**
  - Offline scanning (sync later)
  - Duplicate scans
  - Expired tickets

### 4. Ticket Buyer (Attendee) Flows

- 4.1 Discover Event & Ticket Selection Flow
  **Actor:** Ticket Buyer
  **Flow:**
  1. Buyer opens public event link
  2. Views:
     - Event details
     - Available ticket types
     - Prices
     - Remaining quantities
  3. Selects:
     - Ticket type(s)
     - Quantity
  4. Clicks **Continue**
- 4.2 Form Submission Flow
  **Actor:** Ticket Buyer
  **Flow:**
  1. Buyer fills required form fields
  2. Clicks **Proceed to Payment**
  3. System validates input
  4. Errors shown if invalid
- 4.3 Checkout & Payment Flow
  **Actor:** Ticket Buyer
  **Flow:**
  1. Buyer selects payment method
  2. Completes payment
  3. Payment provider confirms success
  4. System:
     - Reserves ticket(s)
     - Generates unique ticket ID(s)
     - Generates QR code(s)
  5. Purchase confirmation shown
     **Edge Cases:**
  - Payment failure
  - Timeout
  - Duplicate payment
  - Partial ticket availability
- 4.4 Ticket Delivery Flow
  **Actor:** Ticket Buyer
  **Flow:**
  1. System sends confirmation email
  2. Email includes:
     - Event info
     - Ticket details
     - QR code(s)
  3. Buyer can:
     - Download QR code
     - Present QR code at event

### 5. Event Day / Entry Flow (Critical Path)

**Actors:** Ticket Buyer + Ticket Scanner

**Flow:**

1. Buyer arrives at event
2. Opens QR code
3. Scanner scans QR
4. System validates ticket
5. Entry granted or denied
6. Attendance count updates

### 6. Post-Event Flows

- **6.1 Event Closeout Flow**
  **Actor:** Event Planner
  **Flow:**
  1. Event date passes
  2. System marks event as **Completed**
  3. Planner can:
     - View final stats
     - Export attendee list
     - Export revenue report

### 7. Permission & Security Flows (Implicit)

- Role-based access control per event
- Ticket scanners cannot:
  - View revenue
  - Edit events
- Buyers cannot:
  - Reuse QR codes
  - Access admin dashboards

### 8. High-Level Flow Map (Summary)

```bash
Event Planner → Create Event → Create Tickets → Build Form → Publish
Ticket Buyer → View Event → Buy Ticket → Receive QR → Attend Event
Ticket Scanner → Login → Scan QR → Validate → Check-in Attendee
```

## Page Site Map

### 1. Public Pages (Unauthenticated)

| Page / Route        | Access | Content Displayed                    | Allowed Interactions | Entry Points                      | Error / Empty States             |
| ------------------- | ------ | ------------------------------------ | -------------------- | --------------------------------- | -------------------------------- |
| `/` (Landing)       | Public | Product overview, features, CTA      | Go to Login / Signup | Direct URL                        | Network failure                  |
| `/login`            | Public | Login form                           | Login, OAuth         | Landing, protected-route redirect | Invalid credentials              |
| `/signup`           | Public | Signup form                          | Create account       | Landing                           | Email already exists             |
| `/reset-password`   | Public | Password reset form                  | Request reset        | Login                             | Invalid / expired token          |
| `/events/:slug`     | Public | Event details, tickets, availability | Select tickets       | Shared link                       | Event not found, sales closed    |
| `/checkout`         | Public | Order summary, form, payment         | Pay                  | Event page                        | Payment failure, ticket sold out |
| `/checkout/success` | Public | Confirmation                         | View receipt         | Payment success                   | Missing order                    |
| `/checkout/failed`  | Public | Failure reason                       | Retry payment        | Payment error                     | —                                |

### 2. Authenticated – Global

| Page / Route | Access           | Content                           | Interactions   | Entry Points | Error / Empty States |
| ------------ | ---------------- | --------------------------------- | -------------- | ------------ | -------------------- |
| `/dashboard` | Planner, Scanner | List of associated events + roles | Open event     | Login        | No events            |
| `/profile`   | Planner, Scanner | Account info                      | Update profile | Dashboard    | Save failure         |

### 3. Event Planner Pages

| Page / Route            | Access  | Content                         | Interactions        | Entry Points | Error / Empty States         |
| ----------------------- | ------- | ------------------------------- | ------------------- | ------------ | ---------------------------- |
| `/events/new`           | Planner | Event creation form             | Create event        | Dashboard    | Validation errors            |
| `/events/:id/setup`     | Planner | Event details, status           | Edit details        | Event list   | Missing payment info         |
| `/events/:id/tickets`   | Planner | Ticket types list               | Create/edit tickets | Event setup  | No tickets                   |
| `/events/:id/form`      | Planner | Custom form builder             | Add/edit fields     | Event setup  | Locked fields (tickets sold) |
| `/events/:id/publish`   | Planner | Readiness checklist             | Publish event       | Setup pages  | Validation failed            |
| `/events/:id/dashboard` | Planner | Sales stats, revenue, check-ins | Filter, export      | Event list   | No sales                     |
| `/events/:id/attendees` | Planner | Buyer submissions               | Search, export      | Dashboard    | No attendees                 |
| `/events/:id/team`      | Planner | Planners list                   | Invite/remove       | Dashboard    | Invite failed                |
| `/events/:id/scanners`  | Planner | Scanners list                   | Invite/remove       | Dashboard    | No scanners                  |

### 4. Ticket Scanner Pages

| Page / Route             | Access  | Content            | Interactions | Entry Points | Error / Empty States   |
| ------------------------ | ------- | ------------------ | ------------ | ------------ | ---------------------- |
| `/scan/select-event`     | Scanner | Assigned events    | Select event | Dashboard    | No assigned events     |
| `/scan/:eventId`         | Scanner | QR scanner + stats | Scan ticket  | Event select | Camera denied, offline |
| `/scan/:eventId/history` | Scanner | Scan log           | View history | Scanner page | No scans               |

### 5. System / Utility Pages

| Page / Route | Access | Content       | Interactions | Error States |
| ------------ | ------ | ------------- | ------------ | ------------ |
| `/403`       | Any    | Access denied | Go back      | —            |
| `/404`       | Any    | Not found     | Go home      | —            |
| `/500`       | Any    | Server error  | Retry        | —            |

## Design Elements

- Color
  - Primary: Indigo
  - Secondary: Blue
- Font: Inter / SF Pro / Roboto

## Technology Stack

- Framework: Nuxt
- Database/Storage: Convex
- Services
  - Auth: Better-auth
  - Email: Nodemailer + Gmail SMTP
  - Payments: Paystack

## Sprint Planning

### Milestone 0 – Foundation & Architecture

**Goal:** Project is runnable, authenticated, and deployable.

- Sprint 0: Setup & Core Infrastructure
  **Deliverables**
  - Nuxt project scaffolded
  - Convex backend initialized
  - Environment config for local + prod
    **Tasks**
  - Project repo setup
  - Nuxt routing + layouts
  - Convex schema setup (users, events, roles)
  - Better-auth integration (email/password)
  - Session handling & protected routes
  - Base UI components (buttons, inputs, layout)
  - Error pages: 403 / 404 / 500
    **Exit Criteria**
  - User can sign up, log in, log out
  - Protected routes work
  - App deploys successfully

### Milestone 1 – Event Creation & Management (Planner Core)

**Goal:** Planners can fully create and configure events.

- Sprint 1: Event CRUD & Roles
  **Deliverables**
  - Event creation & setup flow
  - Role-based access per event
    **Tasks**
  - Event model (name, dates, status, payment info)
  - Create Event page (`/events/new`)
  - Event states: Draft / On Sale / Closed / Completed
  - Dashboard event list (`/dashboard`)
  - Event association logic (user ↔ event ↔ role)
  - Planner-only route guards
    **Exit Criteria**
  - Planner can create an event
  - Event appears in dashboard
  - Roles are enforced
- Sprint 2: Tickets & Form Builder
  **Deliverables**
  - Ticket types
  - Custom buyer form
    **Tasks**
  - Ticket type model (price, quantity, metadata)
  - Ticket CRUD UI
  - Inventory tracking (remaining quantity)
  - Form schema storage (Convex)
  - Form builder UI (add/reorder/required fields)
  - Locking rules after sales begin
    **Exit Criteria**
  - Planner can create ticket types
  - Planner can build a custom form
  - Validation rules enforced

### Milestone 2 – Public Sales & Payments

**Goal:** Buyers can purchase tickets and receive QR codes.

- Sprint 3: Public Event Pages
  **Deliverables**
  - Public event discovery & checkout UI
    **Tasks**
  - Public event page (`/events/:slug`)
  - Ticket availability logic
  - Checkout flow UI
  - Form submission validation
  - Sold-out & sales-closed states
    **Exit Criteria**
  - Public users can select tickets
  - Forms validate correctly
  - Inventory updates in real time
- Sprint 4: Payments & Ticket Issuance
  **Deliverables**
  - End-to-end purchase flow
    **Tasks**
  - Paystack payment integration
  - Webhook handling (payment success/failure)
  - Ticket reservation + finalization
  - Unique ticket ID generation
  - QR code generation (signed payload)
  - Confirmation email with QR code
  - Idempotency handling (duplicate payments)
    **Exit Criteria**
  - Buyer can pay successfully
  - Ticket + QR code is generated
  - Email is delivered reliably

### Milestone 3 – Event Day Operations (Scanner)

**Goal:** Fast, reliable entry validation.

- Sprint 5: Scanner App & Check-in
  **Deliverables**
  - QR scanning & validation
    **Tasks**
  - Scanner role access
  - Scanner event selection page
  - QR scanner UI (camera access)
  - Ticket validation logic
  - Atomic check-in (prevent double use)
  - Scan result states (valid / used / invalid)
  - Real-time attendee count updates
    **Exit Criteria**
  - Tickets can be scanned
  - Double scans are blocked
  - Counts update instantly

### Milestone 4 – Analytics, Teams & Post-Event

**Goal:** Full event lifecycle management.

- Sprint 6: Dashboards & Team Management
  **Deliverables**
  - Planner dashboards
  - Team invites
    **Tasks**
  - Sales & revenue aggregation
  - Check-in analytics
  - Attendee list view (search/sort)
  - Invite planners & scanners
  - Accept/decline invite flow
  - Permission enforcement
    **Exit Criteria**
  - Planner sees accurate metrics
  - Team roles work correctly
- Sprint 7: Exports, Closeout & Polish
  **Deliverables**
  - Production-ready MVP
    **Tasks**
  - CSV export (attendees, revenue)
  - Event auto-completion logic
  - Email reliability improvements
  - Performance optimizations
  - Security review (QR signing, RBAC)
  - UX polish & edge cases
    **Exit Criteria**
  - Event can fully run end-to-end
  - Data is exportable
  - App is stable under load
