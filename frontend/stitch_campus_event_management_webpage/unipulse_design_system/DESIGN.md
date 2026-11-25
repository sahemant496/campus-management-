---
name: UniPulse Design System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system embodies the intersection of forward-thinking collegiate technology, dynamic student culture, and academic vibrancy. It is designed to feel as fast-paced, social, and connected as modern university life, rejecting outdated institutional bureaucracy in favor of an energetic, consumer-grade campus social hub.

The visual style pairs **Corporate Modern** rigor with **Vibrant Kinetic Accents**:
- **Clarity & Vitality:** High-contrast typographic hierarchy set against ultra-crisp slate surfaces keeps discovery, scheduling, and registration frictionless.
- **Micro-Interactions & State Vibrancy:** Live telemetry—such as remaining venue capacities, real-time check-ins, and ticket tiers—uses punchy chromatic signals (Emerald and Amber) to cultivate urgency and excitement without inducing clutter.
- **Exclusion of Extraneous Gateways:** The platform assumes single-sign-on or persistent campus token authentication; no persistent login or signup actions appear in standard interface states or universal headers.

## Colors

The color palette is built on high-energy Indigo and Violet hues balanced by clinical slate grounds to sustain high contrast and accessibility during prolonged screen use across bright outdoor campuses and low-light dorm rooms.

### Palette Architecture
- **Primary Indigo (`#4F46E5`, interactive hover `#4338CA`):** Anchors primary actions, active navigational states, and key interactive focal points.
- **Electric Violet (`#6366F1`):** Serves as an expressive accent for event categories, visual gradients, progress indicators, and spotlight features.
- **Capacity & Status Colors:**
  - **Emerald Green (`#10B981`):** Denotes open availability, confirmed RSVP, active club tags, and successful ticket acquisitions.
  - **Amber (`#F59E0B`):** Warns of low ticket availability ("Spots filling fast"), registration deadlines, and schedule conflicts.
- **Neutrals & Surfaces:**
  - **Canvas Base:** `#F8FAFC` (Slate-50) delivers an ultra-clean, low-glare backdrop.
  - **Card Surface:** `#FFFFFF` offers clear elevation against the slate ground.
  - **Borders & Dividers:** `#E2E8F0` defines distinct functional containers without harsh delineation.
  - **Typography:** Deep slate (`#0F172A`) for high-legibility headings and subdued slate (`#475569`) for metadata, timestamps, and secondary body copy.

## Typography

The type system uses **Plus Jakarta Sans** uniformly across all functional tiers. Its balanced geometric construction, wide apertures, and humanist touches deliver contemporary energy suited for student life, while remaining legible on mobile screens outdoors.

### Typographic Guidelines
- **Weight Pairing:** Reserve 700 and 800 weights exclusively for event titles, metric counts, and primary banner headlines to establish clear visual hierarchy.
- **Metadata Treatment:** Micro-labels, date badges, and capacity indicators use `label-md` or `label-sm` with tight vertical tracking and medium-to-semibold weights to ensure readability at smaller scales.
- **Contextual Line-Heights:** Maintain proportional line-heights (1.5x–1.6x) on body text to handle multi-line event descriptions and student guild bios cleanly.

## Layout & Spacing

The layout runs on a responsive 12-column grid system designed around rapid card scanning and flexible calendar or feed representations.

### Form Factor Adaptations
- **Desktop (1024px and above):** 12-column grid with 24px (`1.5rem`) gutters and 32px (`2rem`) margins. Content caps at a maximum width of 1280px to preserve scanning speed on ultra-wide displays.
- **Tablet (768px – 1023px):** 8-column layout with 20px gutters. Dual-pane schedules and filtered discovery views collapse into a top filter ribbon with stacked event cards.
- **Mobile (Below 768px):** 4-column layout with 16px (`1rem`) gutters and 16px margins. Filter chips become horizontally scrollable edge-to-edge carousels; action targets occupy full card widths.

## Elevation & Depth

Visual hierarchy combines **crisp micro-borders** (`#E2E8F0`) with **tinted ambient shadows**. Rather than stark skeuomorphic drop shadows, the system creates depth by tinting elevations with a touch of deep slate and indigo.

### Elevation Hierarchy
- **Level 0 (Canvas Base):** Plain `#F8FAFC`, no border, no shadow. Hosts the global workspace and calendar grids.
- **Level 1 (Card & Content Blocks):** `#FFFFFF` background with a subtle border (`1px solid #E2E8F0`) and an ambient glow: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`.
- **Level 2 (Interactive Floating Elements / Hover States):** Applied when hovering over cards, active date segments, or pinned toolbars: `box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Slide-over Drawers, RSVP Sheets):** Crisp perimeter border with a diffuse drop shadow: `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`.

## Shapes

The interface embraces a modern rounded aesthetic with generous corner radii to project an accessible, student-friendly character:

- **Containers & Event Cards:** Standardized on `rounded-xl` (1rem / 16px) for interior segments and `rounded-2xl` (1.5rem / 24px) for full outer event cards and modal dialogs.
- **Inputs & Interactive Form Controls:** Styled with `rounded-xl` (0.75rem to 1rem) for an approachable feel without compromising internal content padding.
- **Pill Badges & Meta Chips:** Fully rounded (`border-radius: 9999px`) to immediately set status counters, category tags, and capacity pills apart from rectangular content boxes.

## Components

### Buttons & Interactive Triggers
- **Primary RSVP / Action Button:** Solid `#4F46E5` with `#FFFFFF` text, `rounded-xl`, 12px vertical by 24px horizontal padding. On hover, transitions cleanly to `#4338CA` with an ambient indigo shadow.
- **Secondary / Filter Button:** Pure `#FFFFFF` surface, `1px solid #E2E8F0`, `#0F172A` text, `rounded-xl`. On hover, adopts `#F8FAFC` and an indigo border tint.
- **Destructive / Leave Event:** Light coral background (`#FEE2E2`) with crimson text (`#DC2626`).
- *Strict Note:* No global or localized "Sign In", "Log In", or "Create Account" buttons are permitted within the interface headers or footers.

### Chips & Pill Badges
- **Status Indicators (Pill-shaped, `rounded-full`):**
  - *Open Spots Available:* `#ECFDF5` surface, `#047857` text, paired with a solid `#10B981` pulsing mini-dot.
  - *Spots Filling Fast:* `#FFFBEB` surface, `#B45309` text, paired with an `#F59E0B` icon or alert dot.
  - *Academic / Department Tag:* `#EEF2FF` surface, `#4F46E5` text.
  - *Social / Greek Life Tag:* `#F5F3FF` surface, `#7C3AED` text.

### Form Inputs & Search Fields
- **Search & Filter Bars:** `#FFFFFF` background, `1px solid #E2E8F0`, text in `#0F172A`, placeholder in `#94A3B8`.
- **Focus State:** 2px ring in Electric Violet (`#6366F1`) offset by 2px white spacing (`box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #6366F1`).
- **Checkboxes & Radios:** `rounded-md` (checkbox) or `rounded-full` (radio) using `#4F46E5` fill when selected, inset within an `#E2E8F0` border frame.

### Event Cards
- **Structural Blueprint:** Outer container in pure `#FFFFFF`, `rounded-2xl`, bordered with `1px solid #E2E8F0`.
- **Header Segment:** Embedded aspect-ratio media with overlay category pill and real-time availability indicator.
- **Content Body:** Event title (`headline-md`), subdued slate datetime icon row, location indicator, followed by an attendee counter and the primary RSVP action button.
- **Interactivity:** Subtle upward translation (`translate-y: -2px`) and Level 2 elevation on hover.

### Specialized Component: Live Capacity Gauge
- A miniature horizontal segmented bar (4px height, `rounded-full`) showing current occupancy against total capacity:
  - Green (`#10B981`) for `< 75%` capacity.
  - Amber (`#F59E0B`) for `75% - 95%` capacity.
  - Subdued slate for sold-out/full states.