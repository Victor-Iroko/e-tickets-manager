import "dotenv/config";
import { reset, seed } from "drizzle-seed";
import { db } from "../../utils/db";
import * as schema from "../schemas";
import { DEMO_USERS, SAMPLE_EVENTS, SCANNER_LOCATIONS } from "./constants";

export async function runDatabaseSeed(): Promise<void> {
  console.log("🌱 Starting database seeding with drizzle-seed...");

  try {
    // 1. Reset database tables using drizzle-seed
    console.log("🧹 Resetting database tables...");
    await reset(db, schema);

    // 2. Generate large baseline synthetic dataset with drizzle-seed
    console.log("⚡ Generating baseline realistic dataset via drizzle-seed...");
    await seed(db, schema, { count: 35, seed: 42 }).refine((funcs) => ({
      user: {
        count: 40,
        columns: {
          name: funcs.fullName(),
          email: funcs.email(),
          role: funcs.valuesFromArray({
            values: [
              { weight: 0.25, values: ["organizer"] },
              { weight: 0.75, values: ["attendee"] },
            ],
          }),
          emailVerified: funcs.default({ defaultValue: true }),
        },
      },
      events: {
        count: 20,
        columns: {
          title: funcs.valuesFromArray({
            values: SAMPLE_EVENTS.map((e) => e.title),
          }),
          description: funcs.loremIpsum({ sentencesCount: 4 }),
          location: funcs.valuesFromArray({
            values: SAMPLE_EVENTS.map((e) => e.location),
          }),
          bannerUrl: funcs.valuesFromArray({
            values: SAMPLE_EVENTS.map((e) => e.bannerUrl),
          }),
          status: funcs.valuesFromArray({
            values: [
              { weight: 0.6, values: ["published"] },
              { weight: 0.2, values: ["draft"] },
              { weight: 0.1, values: ["completed"] },
              { weight: 0.1, values: ["cancelled"] },
            ],
          }),
        },
      },
      ticketTypes: {
        columns: {
          name: funcs.valuesFromArray({
            values: [
              "Early Bird Pass",
              "Standard Access",
              "VIP Executive",
              "Student Discount",
              "All-Access Pass",
            ],
          }),
          price: funcs.number({ minValue: 15, maxValue: 250, precision: 2 }),
          quantity: funcs.int({ minValue: 50, maxValue: 1000 }),
          quantitySold: funcs.int({ minValue: 0, maxValue: 40 }),
        },
      },
      orders: {
        columns: {
          totalAmount: funcs.number({ minValue: 25, maxValue: 500, precision: 2 }),
          status: funcs.valuesFromArray({
            values: [
              { weight: 0.7, values: ["paid"] },
              { weight: 0.15, values: ["pending"] },
              { weight: 0.1, values: ["refunded"] },
              { weight: 0.05, values: ["failed"] },
            ],
          }),
          paymentRef: funcs.uuid(),
        },
      },
      scannerSessions: {
        columns: {
          label: funcs.valuesFromArray({
            values: [...SCANNER_LOCATIONS],
          }),
          token: funcs.uuid(),
          revoked: funcs.default({ defaultValue: false }),
        },
      },
      tickets: {
        columns: {
          qrCode: funcs.uuid(),
          unitPrice: funcs.number({ minValue: 20, maxValue: 250, precision: 2 }),
          status: funcs.valuesFromArray({
            values: [
              { weight: 0.7, values: ["valid"] },
              { weight: 0.25, values: ["used"] },
              { weight: 0.05, values: ["cancelled"] },
            ],
          }),
        },
      },
    }));

    console.log("✨ Baseline data seeded successfully!");

    // 3. Insert specific demo accounts for reliable login & manual testing
    console.log("👤 Provisioning fixed demo accounts & accounts table...");

    const [demoOrganizer] = await db
      .insert(schema.user)
      .values({
        name: DEMO_USERS.organizer.name,
        email: DEMO_USERS.organizer.email,
        role: DEMO_USERS.organizer.role,
        emailVerified: true,
      })
      .returning();

    const [demoAttendee] = await db
      .insert(schema.user)
      .values({
        name: DEMO_USERS.attendee.name,
        email: DEMO_USERS.attendee.email,
        role: DEMO_USERS.attendee.role,
        emailVerified: true,
      })
      .returning();

    const [demoAdmin] = await db
      .insert(schema.user)
      .values({
        name: DEMO_USERS.admin.name,
        email: DEMO_USERS.admin.email,
        role: DEMO_USERS.admin.role,
        emailVerified: true,
      })
      .returning();

    if (!demoOrganizer || !demoAttendee || !demoAdmin) {
      throw new Error("Failed to insert demo users");
    }

    // Provision auth accounts for demo users
    await db.insert(schema.account).values([
      {
        userId: demoOrganizer.id,
        accountId: demoOrganizer.email,
        providerId: "credential",
        password: DEMO_USERS.organizer.password,
      },
      {
        userId: demoAttendee.id,
        accountId: demoAttendee.email,
        providerId: "credential",
        password: DEMO_USERS.attendee.password,
      },
      {
        userId: demoAdmin.id,
        accountId: demoAdmin.email,
        providerId: "credential",
        password: DEMO_USERS.admin.password,
      },
    ]);

    // 4. Create curated showcase events owned by the demo organizer
    console.log("🎪 Creating curated showcase events & ticket types...");
    const now = new Date();

    for (let i = 0; i < SAMPLE_EVENTS.length; i++) {
      const sample = SAMPLE_EVENTS[i];
      if (!sample) continue;

      const startDate = new Date(now.getTime() + (i + 1) * 3 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);

      const [createdEvent] = await db
        .insert(schema.events)
        .values({
          organizerId: demoOrganizer.id,
          title: sample.title,
          description: sample.description,
          location: sample.location,
          bannerUrl: sample.bannerUrl,
          startAt: startDate,
          endAt: endDate,
          status: "published",
        })
        .returning();

      if (!createdEvent) continue;

      // Add ticket types for this event
      const insertedTicketTypes = await db
        .insert(schema.ticketTypes)
        .values(
          sample.ticketTypes.map((tt) => ({
            eventId: createdEvent.id,
            name: tt.name,
            description: `Official ${tt.name} entry pass for ${sample.title}`,
            price: tt.price,
            quantity: tt.quantity,
            quantitySold: 12,
            saleStartsAt: now,
            saleEndsAt: startDate,
          })),
        )
        .returning();

      // Create a fixed scanner session for gate scanning on the first event
      if (i === 0) {
        const [scanner] = await db
          .insert(schema.scannerSessions)
          .values({
            eventId: createdEvent.id,
            token: "test-scanner-token-12345",
            label: "Main Entrance Gate A",
            expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
            revoked: false,
          })
          .returning();

        // Create a realistic order & tickets for the demo attendee
        if (insertedTicketTypes.length > 0 && insertedTicketTypes[0] && scanner) {
          const firstTicketType = insertedTicketTypes[0];

          const [order] = await db
            .insert(schema.orders)
            .values({
              attendeeId: demoAttendee.id,
              eventId: createdEvent.id,
              totalAmount: firstTicketType.price,
              status: "paid",
              paymentRef: `PAY-DEMO-${Date.now()}`,
            })
            .returning();

          if (order) {
            await db.insert(schema.tickets).values([
              {
                orderId: order.id,
                ticketTypeId: firstTicketType.id,
                unitPrice: firstTicketType.price,
                qrCode: `QR-DEMO-TICKET-001`,
                status: "valid",
              },
              {
                orderId: order.id,
                ticketTypeId: firstTicketType.id,
                unitPrice: firstTicketType.price,
                qrCode: `QR-DEMO-TICKET-002`,
                status: "used",
                scannedAt: new Date(),
                scannedBySessionId: scanner.id,
              },
            ]);
          }
        }
      }
    }

    console.log("✅ Database successfully seeded and verified!");
    console.log(`🔑 Demo Accounts Created:`);
    console.log(`   - Organizer: ${DEMO_USERS.organizer.email}`);
    console.log(`   - Attendee:  ${DEMO_USERS.attendee.email}`);
    console.log(`   - Admin:     ${DEMO_USERS.admin.email}`);
    console.log(`🎫 Test Scanner Token: test-scanner-token-12345`);
  } catch (error) {
    console.error("❌ Seeding failed with error:", error);
    throw error;
  }
}

if (process.argv[1]?.includes("seed")) {
  runDatabaseSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
