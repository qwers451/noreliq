---
name: Atelier Court
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#414844'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#727973'
  outline-variant: '#c1c8c2'
  surface-tint: '#436653'
  primary: '#002517'
  on-primary: '#ffffff'
  primary-container: '#183b2b'
  on-primary-container: '#80a690'
  inverse-primary: '#a9cfb9'
  secondary: '#59605c'
  on-secondary: '#ffffff'
  secondary-container: '#dae1dc'
  on-secondary-container: '#5d6460'
  tertiary: '#331900'
  on-tertiary: '#ffffff'
  tertiary-container: '#512c00'
  on-tertiary-container: '#d09050'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4ecd4'
  primary-fixed-dim: '#a9cfb9'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#2b4e3d'
  secondary-fixed: '#dde4df'
  secondary-fixed-dim: '#c1c8c3'
  on-secondary-fixed: '#161d1a'
  on-secondary-fixed-variant: '#414845'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#feb874'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3b00'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Geist
    fontSize: 34px
    fontWeight: '500'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-caps:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
  label-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-interactive:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.005em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a digital environment for an exclusive athletic enclave. It bridges the engineering precision of contemporary productivity software (Linear, Stripe) with the tactile discretion and enduring grace of high-end private sporting clubs. 

The aesthetic is architectural, calm, and uncompromisingly restrained. The interface intentionally suppresses decorative noise, relying instead on structural alignment, disciplined whitespace, subtle hair-thin borders, and refined typographic contrast. The emotional response is one of quiet privilege, effortless competence, and spatial clarity.

The UI avoids flashy gamification or hyper-saturated sports aesthetics. Every viewport is treated as a bespoke gallery of space, schedule, and performance. Transitions are crisp and measured (120ms to 200ms ease-out), mimicking precision-milled physical mechanisms rather than bouncy consumer apps.

## Colors

The palette is anchored in heritage sporting luxury translated into a pristine modern light interface.

- **Canvas & Backdrops:** Warm architectural ivory (`#FAF9F6`) and secondary recessed backdrops (`#F5F4F0`) provide an organic gallery feel that prevents sterile eye fatigue.
- **Surfaces & Cards:** Crisp pure white (`#FFFFFF`) layered with feather-weight perimeter strokes (`#E8E6DF`) to distinguish interactive modules without visual bulk.
- **Typography:** Primary text is set in deep obsidian charcoal (`#161616`), preserving stark readability without the harshness of raw `#000000`. Secondary metadata, microcopy, and auxiliary labels resolve in calibrated warm slates (`#686763` and `#8C8A84`).
- **Brand Signature Accent:** British Court Green (`#183B2B` with hover state `#1F4D38`) acts as the authoritative visual anchor for primary commitments, primary buttons, and selected states. Soft sage tints (`#EBF2ED` with border tone `#D3E2D8`) are deployed for low-stress secondary indicators, active time tags, and contextual badges.
- **Subdued Status Indicators:**
  - *Available / Active:* Deep Emerald (`#226343` text on `#EDF6F1` background).
  - *Limited / Pending:* Warm Muted Amber (`#946328` text on `#FAF3E8` background).
  - *Booked / Occupied:* Soft Terracotta Slate (`#8A4B42` text on `#F9EFEB` background).
  - *Muted Inactive:* Hairline neutral gray (`#D4D2CB`).

## Typography

The typographical foundation utilizes `Geist` for its neutral, highly legible geometry, high-precision Cyrillic glyph crafting, and impeccable numeric readability.

- **Tabular Figures:** All temporal counters, court numbers, price breakdowns, and timeline indices must utilize `font-variant-numeric: tabular-nums` to guarantee strict vertical alignment in grids and booking summaries.
- **Cyrillic Display Treatments:** Uppercase labels (`label-caps`) like `КОРТ`, `БРОНИРОВАНИЕ`, `ТРЕНЕРЫ` require tracked uppercase treatment (`letter-spacing: 0.08em`) to lend an editorial, architectural gravitas.
- **Editorial Contrast:** Display levels balance ultra-tight kerning with ample structural leading. Body copy avoids dense walls of text, preferring bite-sized hierarchical segments paired with crisp tabular metadata.

## Layout & Spacing

The layout is built upon an architectural 12-column grid system that conforms to a fixed maximum container width of `1360px` for desktop viewports, ensuring content never drifts unmoored on expansive studio monitors. 

### Breakpoints & Adaptive Logic
- **Mobile (< 768px):** 4-column layout. Margin: `1rem` (`16px`), Gutter: `0.75rem` (`12px`). Interactive elements—such as court schedules—convert from horizontal multi-lane charts into stacked day-views with horizontal drag carousels for time-slot chips.
- **Tablet (768px – 1024px):** 8-column layout. Margin: `2rem` (`32px`), Gutter: `1.25rem` (`20px`). Sidebars collapse into an elegant bottom dock or floating drawer.
- **Desktop (> 1024px):** 12-column layout. Margin: `3rem` (`48px`), Gutter: `2rem` (`32px`). Multi-pane operational views (e.g., floorplan architectural diagram on the left 7 columns, dynamic booking configuration panel on the right 5 columns).

### Rhythm & Alignment
Spacing follows a rigorous 4px baseline rhythm. Components adhere to internal symmetrical padding: chips and pills use asymmetric vertical-to-horizontal distribution (e.g., `space-xs` top/bottom with `space-md` left/right) to sustain an aerodynamic, engineered posture.

## Elevation & Depth

Visual hierarchy is maintained through low-contrast perimeter borders paired with whisper-soft ambient diffusion. Heavy dropshadows are explicitly forbidden.

- **Base Layer (Elevation 0):** Unraised warm canvas (`#FAF9F6`).
- **Card / Surface Layer (Elevation 1):** Solid white surface (`#FFFFFF`) framed by a 1px uniform structural stroke (`#E8E6DF`). Shadow consists of an ultra-diffuse ambient blur: `box-shadow: 0 1px 3px rgba(22, 22, 22, 0.02), 0 4px 12px rgba(22, 22, 22, 0.03)`.
- **Floating Controls & Interactive Hovers (Elevation 2):** Applied to active timeline scrubbers, floating filter bars, and modal sheets: `box-shadow: 0 4px 20px -2px rgba(22, 22, 22, 0.06), 0 0 1px rgba(22, 22, 22, 0.12)`.
- **Translucent Overlays & App Bars:** High-spec glass backdrop filter (`backdrop-filter: blur(16px) saturate(180%)`) with semi-transparent background fill (`rgba(250, 249, 246, 0.82)`) and a delicate bottom border (`#E8E6DF`).

## Shapes

The design system employs a refined "Soft" architectural curvature (`roundedness: 1`), providing an exact, disciplined balance between technical geometry and ergonomic handling.

- **Micro elements & Chips:** `4px` (`0.25rem`). Gives tags, mini-badges, and time slots a crisp, tactile stamp quality.
- **Buttons, Inputs & Small Containers:** `6px` or `8px` (`0.5rem`). Controlled, subtle rounding that integrates seamlessly with architectural line grids.
- **Large Cards, Court Panoramas & Dialogs:** `12px` (`0.75rem`). Ensures larger structural boundaries retain their posture without softening into toy-like circles.
- **Pill Exceptions:** Filter toggles, active segment selectors, and status dots employ full circular radii (`rounded-full` / `9999px`) exclusively to communicate pure dynamic state and effortless switching.

## Components

### 1. Buttons & Segmented Controls
- **Primary Action:** Solid Racing Green (`#183B2B`), text `#FFFFFF`, radius `6px`. Hover: `#1F4D38`. Active: subtle scale down (`0.99`). Typography: `label-interactive`.
- **Secondary Action:** Transparent canvas with a 1px `#E8E6DF` border, text `#161616`. Hover: background `#F5F4F0`, border `#D4D2CB`.
- **Precision Pill Tabs:** Fully rounded pill container in `#F5F4F0` with `3px` internal padding. Selected segment: `#FFFFFF` pill with `box-shadow: 0 1px 4px rgba(0,0,0,0.06)`, text `#183B2B`, weight `500`.

### 2. Timeline Slots & Booking Grid
- Individual hourly booking cells operate as micro-cards with tabular time readouts (`09:00`, `10:30`).
- **Available:** Crisp white, 1px border `#E8E6DF`, text `#161616`. Hover brings subtle sage backdrop `#F2F7F4` and border `#183B2B`.
- **Selected:** Background `#183B2B`, text `#FFFFFF`, border `#183B2B`.
- **Unavailable / Member Reserved:** Subdued diagonal hairline hatching or flat `#F5F4F0` background with struck-through muted slate text (`#8C8A84`). Non-interactive.

### 3. Court Floorplan Cards (Architectural Wireframes)
- Surfaces feature ultra-clean 1px schematic line drawings of standard tennis and table tennis court markings. 
- Inactive court line art renders in `#D3E2D8`; active or selected courts illuminate with a precise `#183B2B` boundary trace accompanied by a floating status badge (`КОРТ 01 · СВОБОДЕН`).

### 4. Coach Discovery Editorial Cards
- Aspect ratio 4:5 portrait media cards with quiet bottom-gradient overlays.
- Typography: Coach name in `headline-sm`, discipline pill in sage tint (`#EBF2ED` with `#183B2B` text), rating/experience rendered in monospaced tabular numerals.

### 5. Input Fields & Selectors
- Background `#FFFFFF`, 1px border `#E8E6DF`, height `42px`, padding `0 14px`, radius `6px`.
- Focus ring: No loud browser outlines; replaced by border `#183B2B` and an ambient glow of `0 0 0 3px rgba(24, 59, 43, 0.08)`. Placeholder color: `#8C8A84`.

### 6. Micro-Badges & Status Tags
- Height `22px`, font size `11px`, weight `600`, tracking `0.04em`.
- Constructed with a 6px inner luminous dot indicator (e.g., emerald `#226343`) followed by succinct Cyrillic labels (`ДОСТУПНО`, `ОГРАНИЧЕНО`, `ЗАНЯТО`).