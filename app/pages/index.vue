<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import type { HomeNavSectionId } from '~/composables/useHomeNavSection'

definePageMeta({
  auth: false
})

useSeoMeta({
  title: 'Ticketly — Create Events. Sell Tickets. Validate Entry.',
  description:
    'Run paid events end-to-end: ticket sales, secure payments, QR tickets, and fast check-in. No custom dev, no manual receipts.',
  ogTitle: 'Ticketly — Event Ticketing Made Simple',
  ogDescription:
    'Create events, sell tickets, and validate entry instantly with QR codes.',
  ogType: 'website'
})

const activeHomeSection = useActiveHomeSection()

const featuresSectionRef = ref<HTMLElement | null>(null)
const howItWorksSectionRef = ref<HTMLElement | null>(null)
const rolesSectionRef = ref<HTMLElement | null>(null)

const sectionRefs: Record<HomeNavSectionId, Ref<HTMLElement | null>> = {
  features: featuresSectionRef,
  'how-it-works': howItWorksSectionRef,
  roles: rolesSectionRef
}

let sectionObserver: IntersectionObserver | null = null
const visibleSections = new Map<HomeNavSectionId, IntersectionObserverEntry>()

const updateActiveSection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    const sectionId = entry.target.id as HomeNavSectionId

    if (entry.isIntersecting) {
      visibleSections.set(sectionId, entry)
      return
    }

    visibleSections.delete(sectionId)
  })

  if (!visibleSections.size) {
    activeHomeSection.value = null
    return
  }

  const nextActiveSection = [...visibleSections.entries()]
    .sort((entryA, entryB) => {
      const ratioDiff =
        entryB[1].intersectionRatio - entryA[1].intersectionRatio

      if (ratioDiff !== 0) {
        return ratioDiff
      }

      return (
        Math.abs(entryA[1].boundingClientRect.top) -
        Math.abs(entryB[1].boundingClientRect.top)
      )
    })
    .at(0)?.[0]

  activeHomeSection.value = nextActiveSection ?? null
}

const stopSectionObserver = () => {
  sectionObserver?.disconnect()
  sectionObserver = null
  visibleSections.clear()
}

const startSectionObserver = async () => {
  stopSectionObserver()

  if (!import.meta.client) {
    activeHomeSection.value = null
    return
  }

  await nextTick()

  const sections = Object.values(sectionRefs)
    .map((sectionRef) => sectionRef.value)
    .filter((section): section is HTMLElement => Boolean(section))

  if (!sections.length) {
    activeHomeSection.value = null
    return
  }

  sectionObserver = new IntersectionObserver(updateActiveSection, {
    rootMargin: '-25% 0px -55% 0px',
    threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
  })

  sections.forEach((section) => sectionObserver?.observe(section))
}

onMounted(() => {
  void startSectionObserver()
})

onBeforeUnmount(() => {
  stopSectionObserver()
  activeHomeSection.value = null
})

const howItWorksSteps = [
  {
    step: 1,
    title: 'Planner Publishes',
    description:
      'Create your event, set ticket types and prices, build a custom buyer form, and publish your event link.',
    icon: 'i-lucide-calendar-plus',
    accent: 'primary'
  },
  {
    step: 2,
    title: 'Buyer Pays & Gets QR',
    description:
      'Attendees select tickets, fill the buyer form, pay securely via Paystack, and receive their QR code instantly by email.',
    icon: 'i-lucide-credit-card',
    accent: 'secondary'
  },
  {
    step: 3,
    title: 'Scanner Validates at Entry',
    description:
      'Scan QR codes at the door for instant valid, invalid, or already-used results. Attendance counts update in real time.',
    icon: 'i-lucide-scan-line',
    accent: 'primary'
  }
] as const

const faqItems: AccordionItem[] = [
  {
    label: 'What happens if a payment fails?',
    content:
      'If a payment fails or times out, no ticket is issued and inventory is not reserved. The buyer can retry the payment immediately. Duplicate payment signals are handled safely — the same payment cannot create multiple tickets.'
  },
  {
    label: 'Can a QR code be used twice?',
    content:
      'No. Each QR code is single-use. Once scanned and validated, the ticket is marked as checked-in. Any subsequent scan of the same QR code will show an "Already Used" status with the time it was first scanned.'
  },
  {
    label: 'What if tickets sell out during checkout?',
    content:
      'Ticket inventory is checked in real time. If tickets sell out while someone is filling the form, they are notified before payment. Inventory is only locked after successful payment verification.'
  },
  {
    label: 'What happens after the sales window closes?',
    content:
      'When the ticket sales end time passes, the public event page shows a "Sales Ended" banner. No new purchases are accepted. Existing tickets remain valid for event-day check-in.'
  },
  {
    label: 'How do I add scanners to my event?',
    content:
      'From your event dashboard, go to Team Management and invite users by email with the "Scanner" role. They will be able to access the scanning interface for your event once they accept.'
  },
  {
    label: 'Is payment information secure?',
    content:
      'All payments are processed through Paystack, a PCI-DSS compliant payment processor. We never store card details on our servers. Payment webhooks are verified with cryptographic signatures.'
  }
]
</script>

<template>
  <div>
    <UPageHero
      orientation="horizontal"
      :ui="{
        title:
          'font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl',
        description: 'max-w-xl text-lg text-muted sm:text-xl',
        links: 'mt-8'
      }"
      :links="[
        {
          label: 'Create Your Event',
          to: '/signup',
          icon: 'i-lucide-rocket',
          size: 'xl'
        },
        {
          label: 'See How It Works',
          to: '#how-it-works',
          color: 'neutral',
          variant: 'subtle',
          trailingIcon: 'i-lucide-arrow-down',
          size: 'xl'
        }
      ]"
    >
      <template #title>
        Create events. Sell tickets.
        <span class="text-primary">Validate entry</span> — all in one place.
      </template>
      <template #description>
        Run paid events end-to-end: ticket sales, secure payments, QR tickets,
        and instant check-in at the door. No custom website. No manual receipts.
      </template>

      <!-- Hero visual — stylized ticket mockup -->
      <div class="relative mx-auto w-full max-w-md lg:max-w-lg">
        <!-- Ticket card mockup -->
        <div
          class="rounded-2xl border border-default bg-elevated p-6 shadow-2xl ring-1 ring-default/50"
        >
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="font-heading text-lg font-semibold text-highlighted">
                Tech Conference 2026
              </p>
              <p class="text-sm text-muted">March 15, 2026 &middot; 9:00 AM</p>
            </div>
            <UBadge label="Valid" color="success" variant="subtle" size="lg" />
          </div>
          <USeparator class="my-4" />
          <div class="flex items-center gap-4">
            <!-- QR code placeholder -->
            <div
              class="flex size-24 shrink-0 items-center justify-center rounded-xl bg-muted"
            >
              <UIcon name="i-lucide-qr-code" class="size-16 text-highlighted" />
            </div>
            <div class="min-w-0 space-y-1.5">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-user" class="size-4 text-dimmed" />
                <p class="text-sm text-default">Jane Doe</p>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-ticket" class="size-4 text-dimmed" />
                <p class="text-sm text-default">VIP Pass</p>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-hash" class="size-4 text-dimmed" />
                <p class="truncate font-mono text-sm text-muted">
                  TKT-2026-X7K9M
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Decorative floating elements -->
        <div
          class="absolute -top-4 -right-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20"
        >
          <UIcon name="i-lucide-check-circle" class="size-6" />
        </div>
        <div
          class="absolute -bottom-3 -left-3 flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary ring-2 ring-secondary/20"
        >
          <UIcon name="i-lucide-scan-line" class="size-5" />
        </div>
      </div>
    </UPageHero>

    <!-- PROBLEM / SOLUTION -->

    <section id="features" ref="featuresSectionRef">
      <UPageSection
        headline="Why Ticketly?"
        title="Stop juggling forms, receipts, and manual check-ins"
        description="Most event organizers are stuck between building an expensive custom site or relying on Google Forms and payment screenshots. Neither handles ticket validation or event-day entry well."
        :features="[
          {
            title: 'No Custom Dev Needed',
            description:
              'Skip the expensive custom website. Create your event, configure tickets, and go live in minutes.',
            icon: 'i-lucide-zap'
          },
          {
            title: 'No Manual Receipts',
            description:
              'Payments are verified automatically. No more chasing screenshots or matching bank transfers to names.',
            icon: 'i-lucide-receipt'
          },
          {
            title: 'Instant QR Validation',
            description:
              'Every ticket has a unique QR code. Scan at the door for immediate valid, invalid, or already-used results.',
            icon: 'i-lucide-scan-line'
          }
        ]"
      />
    </section>

    <!-- HOW IT WORKS — 3-STEP FLOW -->

    <section id="how-it-works" ref="howItWorksSectionRef">
      <UPageSection
        headline="How It Works"
        title="Three steps from creation to check-in"
        description="A streamlined flow that takes your event from idea to entry validation."
        :ui="{ container: 'max-w-5xl' }"
      >
        <div class="grid gap-8 sm:grid-cols-3">
          <HowItWorksStepCard
            v-for="step in howItWorksSteps"
            :key="step.step"
            :step="step.step"
            :title="step.title"
            :description="step.description"
            :icon="step.icon"
            :accent="step.accent"
          />
        </div>
      </UPageSection>
    </section>

    <!-- ROLE: EVENT PLANNER -->

    <section id="roles" ref="rolesSectionRef">
      <UPageSection
        headline="For Event Planners"
        title="Everything you need to run a professional event"
        description="From creation to closeout — manage your entire event lifecycle in one place."
        orientation="horizontal"
      >
        <div
          class="w-full overflow-hidden rounded-2xl border border-default bg-elevated shadow-xl"
        >
          <!-- Mini dashboard mockup -->
          <div class="border-b border-default bg-muted/50 px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="size-3 rounded-full bg-error/60" />
              <div class="size-3 rounded-full bg-warning/60" />
              <div class="size-3 rounded-full bg-success/60" />
              <span class="ml-2 text-xs text-dimmed">Event Dashboard</span>
            </div>
          </div>
          <div class="space-y-4 p-5">
            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-lg bg-muted p-3">
                <p class="text-xs text-dimmed">Tickets Sold</p>
                <p class="font-heading text-2xl font-bold text-highlighted">
                  847
                </p>
              </div>
              <div class="rounded-lg bg-muted p-3">
                <p class="text-xs text-dimmed">Revenue</p>
                <p class="font-heading text-2xl font-bold text-highlighted">
                  &#8358;4.2M
                </p>
              </div>
              <div class="rounded-lg bg-muted p-3">
                <p class="text-xs text-dimmed">Checked In</p>
                <p class="font-heading text-2xl font-bold text-highlighted">
                  312
                </p>
              </div>
            </div>
            <div class="space-y-2">
              <div
                class="flex items-center justify-between rounded-lg bg-muted px-3 py-2"
              >
                <div class="flex items-center gap-2">
                  <UBadge
                    label="VIP"
                    color="primary"
                    variant="subtle"
                    size="xs"
                  />
                  <span class="text-sm text-default">VIP Pass</span>
                </div>
                <span class="text-sm font-medium text-highlighted"
                  >150 / 200</span
                >
              </div>
              <div
                class="flex items-center justify-between rounded-lg bg-muted px-3 py-2"
              >
                <div class="flex items-center gap-2">
                  <UBadge
                    label="REG"
                    color="secondary"
                    variant="subtle"
                    size="xs"
                  />
                  <span class="text-sm text-default">Regular</span>
                </div>
                <span class="text-sm font-medium text-highlighted"
                  >697 / 1000</span
                >
              </div>
            </div>
          </div>
        </div>
      </UPageSection>
    </section>

    <!-- PLANNER CAPABILITIES GRID -->

    <UPageSection
      :features="[
        {
          title: 'Event Setup',
          description:
            'Configure event name, dates, ticket sales window, and payment details in a guided flow.',
          icon: 'i-lucide-settings'
        },
        {
          title: 'Ticket Types',
          description:
            'Create multiple ticket tiers (Regular, VIP, Table) with individual pricing and quantities.',
          icon: 'i-lucide-layers'
        },
        {
          title: 'Custom Form Builder',
          description:
            'Build a buyer form with text, email, number, and dropdown fields. Mark fields required or optional.',
          icon: 'i-lucide-file-text'
        },
        {
          title: 'One-Click Publish',
          description:
            'Review your setup checklist and go live instantly. Share your public event link anywhere.',
          icon: 'i-lucide-globe'
        },
        {
          title: 'Analytics Dashboard',
          description:
            'Track tickets sold, revenue, and check-in counts per ticket type in real time.',
          icon: 'i-lucide-bar-chart-3'
        },
        {
          title: 'Team Management',
          description:
            'Invite co-planners and ticket scanners by email. Control who can edit vs. scan.',
          icon: 'i-lucide-users'
        }
      ]"
    />

    <!-- ROLE: TICKET SCANNER -->

    <UPageSection
      headline="For Ticket Scanners"
      title="Fast, reliable entry validation"
      description="Scan QR codes in seconds. See ticket status instantly. Track attendance live."
      orientation="horizontal"
      reverse
    >
      <div
        class="w-full overflow-hidden rounded-2xl border border-default bg-elevated shadow-xl"
      >
        <!-- Scanner mockup -->
        <div class="border-b border-default bg-muted/50 px-4 py-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-scan-line" class="size-4 text-dimmed" />
            <span class="text-xs text-dimmed"
              >Scanner — Tech Conference 2026</span
            >
          </div>
        </div>
        <div class="space-y-4 p-5">
          <!-- Scan result: Valid -->
          <div class="rounded-xl border-2 border-success/40 bg-success/5 p-4">
            <div class="mb-2 flex items-center gap-2">
              <UIcon name="i-lucide-check-circle" class="size-6 text-success" />
              <span class="font-heading text-lg font-bold text-success"
                >Valid Ticket</span
              >
            </div>
            <div class="space-y-1 pl-8">
              <p class="text-sm text-default">
                <span class="text-muted">Name:</span> Jane Doe
              </p>
              <p class="text-sm text-default">
                <span class="text-muted">Type:</span> VIP Pass
              </p>
              <p class="text-sm text-default">
                <span class="text-muted">Code:</span>
                <span class="font-mono">TKT-X7K9M</span>
              </p>
            </div>
          </div>
          <!-- Stats row -->
          <div
            class="flex items-center justify-between rounded-lg bg-muted p-3"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-users" class="size-4 text-primary" />
              <span class="text-sm text-muted">Checked In</span>
            </div>
            <span class="font-heading text-xl font-bold text-highlighted"
              >312 / 847</span
            >
          </div>
        </div>
      </div>
    </UPageSection>

    <!-- ============================================= -->
    <!-- ROLE: TICKET BUYER                            -->
    <!-- ============================================= -->
    <UPageSection
      headline="For Attendees"
      title="Buy tickets in under a minute"
      description="Browse events, pick your seats, pay securely, and get your QR ticket delivered to your inbox."
      orientation="horizontal"
    >
      <div
        class="w-full overflow-hidden rounded-2xl border border-default bg-elevated shadow-xl"
      >
        <!-- Checkout mockup -->
        <div class="border-b border-default bg-muted/50 px-4 py-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-shopping-cart" class="size-4 text-dimmed" />
            <span class="text-xs text-dimmed">Checkout</span>
          </div>
        </div>
        <div class="space-y-4 p-5">
          <div class="space-y-2">
            <div
              class="flex items-center justify-between rounded-lg bg-muted px-3 py-2"
            >
              <div>
                <p class="text-sm font-medium text-default">VIP Pass</p>
                <p class="text-xs text-dimmed">x1</p>
              </div>
              <span class="text-sm font-semibold text-highlighted"
                >&#8358;15,000</span
              >
            </div>
            <div
              class="flex items-center justify-between rounded-lg bg-muted px-3 py-2"
            >
              <div>
                <p class="text-sm font-medium text-default">Regular</p>
                <p class="text-xs text-dimmed">x2</p>
              </div>
              <span class="text-sm font-semibold text-highlighted"
                >&#8358;10,000</span
              >
            </div>
          </div>
          <USeparator />
          <div class="flex items-center justify-between">
            <p class="font-heading text-sm font-semibold text-highlighted">
              Total
            </p>
            <p class="font-heading text-lg font-bold text-primary">
              &#8358;25,000
            </p>
          </div>
          <div
            class="flex items-center justify-center rounded-lg bg-primary py-2.5 font-medium text-inverted"
          >
            <UIcon name="i-lucide-lock" class="mr-2 size-4" />
            Pay Securely with Paystack
          </div>
        </div>
      </div>
    </UPageSection>

    <!-- ============================================= -->
    <!-- EVENT-DAY RELIABILITY                         -->
    <!-- ============================================= -->
    <UPageSection
      headline="Built for Event Day"
      title="Reliable when it matters most"
      description="The critical path — from scanner to entry gate — is designed for speed, accuracy, and trust."
      :features="[
        {
          title: 'Instant Check-In',
          description:
            'QR validation takes under a second. No loading screens, no delays at the gate.',
          icon: 'i-lucide-timer'
        },
        {
          title: 'Anti-Duplicate Scans',
          description:
            'Each ticket can only be used once. Second scans immediately show &quot;Already Used&quot; with the original scan time.',
          icon: 'i-lucide-shield-check'
        },
        {
          title: 'Live Attendance Count',
          description:
            'Planners and scanners see real-time check-in numbers. No manual counting, no spreadsheet reconciliation.',
          icon: 'i-lucide-activity'
        },
        {
          title: 'Role-Based Access',
          description:
            'Scanners can only validate — they cannot view revenue, edit events, or access admin tools.',
          icon: 'i-lucide-lock'
        }
      ]"
    />

    <!-- ============================================= -->
    <!-- TRUST & SECURITY                              -->
    <!-- ============================================= -->
    <UPageSection
      headline="Secure by Design"
      title="Your events, payments, and data — protected"
      description="Every layer of the platform is built with security and auditability in mind."
      :features="[
        {
          title: 'Secure Payments',
          description:
            'All transactions processed via Paystack with PCI-DSS compliance. Card details never touch our servers.',
          icon: 'i-lucide-shield'
        },
        {
          title: 'Role-Based Permissions',
          description:
            'Each user has explicit permissions per event. Planners control who can edit vs. who can scan.',
          icon: 'i-lucide-key-round'
        },
        {
          title: 'Buyer Privacy',
          description:
            'Ticket buyers cannot access admin dashboards, revenue data, or other attendee information.',
          icon: 'i-lucide-eye-off'
        },
        {
          title: 'Auditable Actions',
          description:
            'Every scan, role change, and publish event is logged with timestamps and user IDs.',
          icon: 'i-lucide-file-search'
        }
      ]"
    />

    <!-- ============================================= -->
    <!-- FAQ                                           -->
    <!-- ============================================= -->
    <UPageSection
      headline="FAQ"
      title="Common questions, clear answers"
      :ui="{ container: 'max-w-3xl' }"
    >
      <UAccordion
        :items="faqItems"
        :ui="{
          item: 'mb-3 overflow-hidden rounded-xl border border-default bg-default last:mb-0',
          trigger: 'px-4 py-4 sm:px-5',
          label: 'font-heading text-base font-semibold text-highlighted',
          body: 'px-4 pt-0 pb-4 sm:px-5',
          content: 'text-sm leading-relaxed text-muted'
        }"
      />
    </UPageSection>

    <!-- ============================================= -->
    <!-- FINAL CTA                                     -->
    <!-- ============================================= -->
    <UPageCTA
      title="Launch your event in minutes"
      description="Join event planners who trust Ticketly for ticket sales, secure payments, and seamless entry management. Get started for free."
      :links="[
        {
          label: 'Create Your Event',
          to: '/signup',
          icon: 'i-lucide-rocket',
          size: 'xl'
        },
        {
          label: 'See How It Works',
          to: '#how-it-works',
          color: 'neutral',
          variant: 'subtle',
          trailingIcon: 'i-lucide-arrow-up',
          size: 'xl'
        }
      ]"
    />
  </div>
</template>
