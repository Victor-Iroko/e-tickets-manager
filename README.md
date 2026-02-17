# E-Tickets Manager

An e-ticket management platform that helps event organizers create, sell, and manage tickets for events, with QR code-based entry validation for attendees.

## Problem Statement

When hosting a paid event (e.g., a conference or concert), organizers often have two poor options:

- Build a custom website, which is expensive and time-consuming
- Use tools like Google Forms where users manually upload payment receipts

Neither option handles ticket validation or event-day entry well. Manually checking tickets or receipts at the venue is slow, error-prone, and difficult to scale.

## Solution

This application provides a simple platform where organizers can:

- Create events and manage ticket types
- Collect payments online
- Track attendance and revenue
- Validate tickets instantly by scanning QR codes at the venue

Attendees can:

- Browse and purchase tickets online
- Receive QR codes via email after payment
- Gain quick entry by presenting their QR code at the event

## User Roles

### Event Planner

The person or team responsible for creating and managing an event. They act as the event's administrators with full control over event settings, tickets, team management, and analytics.

### Ticket Scanner

Users authorized by event planners to scan and validate tickets at the event venue. They have limited access focused solely on the check-in process.

### Ticket Buyer

Users who purchase tickets to attend events (e.g., conference attendees or concert fans).

## Key Features

### For Event Planners

- **Event Management**: Create events with name, date, ticket sales window, and payment details
- **Ticket Types**: Define multiple ticket types (Regular, VIP, Table) with quantities, prices, and optional metadata (seat number, section)
- **Custom Forms**: Build custom forms for ticket buyers to collect required information
- **Team Management**: Add or remove other event planners and ticket scanners
- **Public Sales Links**: Generate and share public ticket sales pages
- **Analytics Dashboard**: View tickets sold per type, total revenue, and attendance statistics
- **Form Responses**: Searchable and sortable list of buyer form submissions

### For Ticket Scanners

- Real-time attendance count
- QR code scanning interface
- Instant validation with status feedback:
  - Valid (not used)
  - Already used
  - Invalid / wrong event
- Automatic check-in recording with timestamps

### For Ticket Buyers

- Browse event details and available tickets
- View ticket availability and pricing
- Complete custom forms during checkout
- Secure payment processing
- Receive confirmation emails with QR codes
- Download or present QR codes at event entry

## User Flows

### Event Planner Flow

```
Create Event → Create Tickets → Build Form → Publish → Monitor Dashboard
```

1. Create an event with details and payment account information
2. Define ticket types with quantities and pricing
3. Build a custom form for attendees
4. Publish the event to generate a public sales link
5. Monitor sales, revenue, and check-ins via the dashboard

### Ticket Buyer Flow

```
View Event → Select Tickets → Fill Form → Pay → Receive QR Code → Attend Event
```

1. Access the public event page via shared link
2. Select ticket type(s) and quantity
3. Complete the required form fields
4. Complete payment
5. Receive confirmation email with QR code
6. Present QR code at event entrance

### Ticket Scanner Flow

```
Login → Select Event → Scan QR Code → Validate → Check-in Attendee
```

1. Log in and select assigned event
2. Open the QR scanning interface
3. Scan attendee QR code
4. View validation result
5. Grant entry for valid tickets

## Technology Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Framework      | Nuxt 4                  |
| Database       | Convex                  |
| Authentication | Better-auth             |
| Email Service  | Nodemailer + Gmail SMTP |
| Payments       | Paystack                |
| Observability  | Sentry                  |

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Convex account and CLI
- Paystack account (for payments)
- Gmail account (for email notifications)

### Installation

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Configure your environment variables in .env.local:
# - CONVEX_DEPLOYMENT
# - CONVEX_URL
# - CONVEX_SITE_URL
```

### Development

Run both Nuxt and Convex together:

```bash
bun run dev:all
```

Or run Nuxt only:

```bash
bun run dev
```

### Build for Production

```bash
bun run build
```

## Development Commands

```bash
# Linting and formatting
bun run lint:fix          # Fix ESLint issues
bun run format:fix        # Fix Prettier formatting

# Testing
bun run test              # Run all tests
bun run test:unit         # Unit tests only
bun run test:nuxt         # Component tests only
bun run test:e2e          # E2E tests only
bun run test:watch        # Watch mode
```

## Project Structure

```
app/
├── components/       # Vue components (auto-imported)
├── composables/      # Composables (auto-imported)
├── layouts/          # Page layouts
├── middleware/       # Route middleware
├── pages/            # File-based routing
├── utils/            # Utility functions
└── assets/css/       # TailwindCSS styles

convex/
├── _generated/       # Auto-generated (DO NOT EDIT)
├── schema.ts         # Database schema
├── auth.ts           # Auth configuration
├── auth.config.ts    # Auth user fields
└── http.ts           # HTTP routes

test/
├── unit/             # Unit tests
├── nuxt/             # Component tests
└── e2e/              # E2E tests
```

## License

[MIT License](LICENSE)
