# Diagnostic Care — Product Design System & Brand Identity

**Brand:** Diagnostic Care  
**Tagline:** Your Healthcare Marketplace  
**Helpline:** 01886748564  
**Company Email:** diagonosticcare@gmail.com  
**Primary B2B Customer:** Diagnostic Centers  
**Design Philosophy:** Claymorphism, Tactile Depth, Clinical Clarity, Human Warmth, Speed, and Accessibility  

---

## 1. Claymorphism Aesthetic & Visual Hierarchy

Diagnostic Care embraces a state-of-the-art **Claymorphism** design system. Unlike flat UI or glassy skeuomorphism, Claymorphism provides tactile, 3D inflated pillowy depth, squishy micro-interactions, and friendly physical presence:

- **Porcelain Clay Canvas:** `#EBF2F9` soft tactile background providing rich contrast for floating 3D surfaces.
- **Dual Inner & Outer Shadows:** Top-left highlight (`rgba(255, 255, 255, 0.95)`) + bottom-right shade (`rgba(16, 41, 79, 0.08)`) with soft floating drop shadows.
- **Inflated Pillowy Radii:** `border-radius: 20px - 26px` for cards/containers, `9999px` for tactile pills and buttons.
- **Sunken Inset Controls:** Search inputs and textareas use inner sunken shadows (`var(--clay-input-shadow)`) creating an authentic stamped-clay feel.
- **Spring Bouncy Micro-Interactions:** `cubic-bezier(0.34, 1.56, 0.64, 1)` spring physics for tactile button depress (`translateY(2px) scale(0.97)`) and card lifts (`translateY(-4px)`).

---

## 2. Brand Tokens & Color Palette

The Diagnostic Care design system pairs medical rigor with rich tactile clay surfaces:

| Token Name | Hex Code | HSL Value | Purpose & Usage |
|---|---|---|---|
| `--brand-primary` | `#1769F5` | `hsl(216, 92%, 53%)` | Healthcare Primary Blue: Key interactive buttons, brand markers |
| `--brand-navy` | `#10294F` | `hsl(216, 66%, 19%)` | Deep Authority Navy: Headers, modal tops, typography |
| `--brand-teal` | `#11B8A5` | `hsl(173, 83%, 40%)` | Clinical Teal: Diagnostic badges, verified markers |
| `--brand-success` | `#15976A` | `hsl(159, 76%, 34%)` | Success: Available slots, confirmed bookings, live status |
| `--brand-warning` | `#D99116` | `hsl(38, 81%, 47%)` | Warning / Hold: 5-minute temporary held slot, queue waiting |
| `--brand-danger` | `#DC4545` | `hsl(0, 70%, 57%)` | Danger / Emergency: Ambulance 24/7, cancelled slots |
| `--clay-bg` | `#EBF2F9` | `hsl(211, 48%, 95%)` | Tactile soft porcelain clay background |
| `--clay-surface` | `#FFFFFF` | `hsl(0, 0%, 100%)` | Pure white inflated clay surfaces |
| `--clay-surface-sunken` | `#E5EFF9` | `hsl(211, 55%, 94%)` | Sunken inset inputs & tabs |

---

## 3. Master Claymorphism Depth Tokens

```css
/* Card Clay 3D Shadows */
--clay-card-shadow: 
  10px 14px 28px rgba(16, 41, 79, 0.08),
  -8px -8px 20px rgba(255, 255, 255, 0.95),
  inset 3px 3px 6px rgba(255, 255, 255, 0.85),
  inset -3px -3px 8px rgba(16, 41, 79, 0.04);

/* Squishy 3D Tactile Buttons */
--clay-btn-primary-shadow: 
  0 8px 18px rgba(23, 105, 245, 0.35),
  inset 0 2px 4px rgba(255, 255, 255, 0.5),
  inset 0 -3px 6px rgba(0, 0, 0, 0.22);

/* Inset Sunken Inputs */
--clay-input-shadow: 
  inset 3px 3px 7px rgba(16, 41, 79, 0.08),
  inset -3px -3px 7px rgba(255, 255, 255, 0.95),
  0 2px 4px rgba(16, 41, 79, 0.02);

/* Inflated Badges & Pills */
--clay-pill-shadow: 
  4px 6px 14px rgba(16, 41, 79, 0.06),
  -3px -3px 8px rgba(255, 255, 255, 0.9),
  inset 2px 2px 4px rgba(255, 255, 255, 0.8),
  inset -2px -2px 4px rgba(16, 41, 79, 0.04);
```

---

## 4. Typography & Bilingual Script Rendering

Diagnostic Care supports native dual-script rendering for English and Bangla:

- **English Font Stack:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Bangla Font Stack:** `'Hind Siliguri', 'Noto Sans Bengali', sans-serif`

### Type Scale
- `Display / Hero`: `36px - 48px`, SemiBold / ExtraBold (700-800), Line-Height 1.18
- `H1 / Page Title`: `28px - 32px`, ExtraBold (800), Line-Height 1.25
- `H2 / Section Title`: `22px`, ExtraBold (800), Line-Height 1.3
- `H3 / Card Title`: `16px - 18px`, ExtraBold (800), Line-Height 1.4
- `Body Text`: `14px - 15px`, Regular (400), Line-Height 1.55
- `Small / Captions`: `11px - 12px`, SemiBold (600), Line-Height 1.4

---

## 5. Core UI Components

### 5.1 Real-Time Slot Selector
- Slots render as tactile clay pill buttons (`.day-pill`).
- State representations:
  - **Available:** Tactile white clay surface, hover spring lift.
  - **Held (by current user):** Amber squishy clay pill with pulsating countdown: `Hold: 04:42`.
  - **Booked / Full:** Inset sunken subdued surface, strikethrough time, non-clickable.

### 5.2 Live Queue Token Card
- Prominently displays:
  - **Now Serving Token:** Large, 3D inflated circular sphere badge (`.clay-sphere` e.g., `Token 02`).
  - **Currently Serving Patient:** Real-time flashing indicator (e.g., `Live Network Active`).
  - **Estimated Wait:** E.g., `~15 min per patient consultation`.
  - **Action Button:** Squishy green clay button (`.btn-emerald`) "Call Next Patient".

### 5.3 Diagnostic Test Card
- Rendered using `.service-card` / `.clay-card-interactive`.
- Features 3D clay bubble icon (`.clay-bubble`), transparent pricing (*৳500*), expected turnaround (*4 Hours*), and doorstep sample collection toggle.

### 5.4 PWA Touch Targets & Accessibility
- Minimum touch target: `48px x 48px` on mobile screens.
- Floating clay mobile bottom navigation dock with safe-area inset support (`.mobile-bottom-dock`).
- High-priority Customer Care button `01886748564` always accessible in mobile navigation and header.
