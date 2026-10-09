# Diagnostic Care — Product Design System & Brand Identity

**Brand:** Diagnostic Care  
**Tagline:** Your Healthcare Marketplace  
**Helpline:** 01886748564  
**Company Email:** diagonosticcare@gmail.com  
**Primary B2B Customer:** Diagnostic Centers  
**Design Philosophy:** Trust, Clarity, Clinical Professionalism, Speed, and Accessibility  

---

## 1. Brand Tokens & Color Palette

The Diagnostic Care design system moves away from generic, plain blues and reds, establishing a curated, high-trust healthcare technology aesthetic:

| Token Name | Hex Code | HSL Value | Purpose & Usage |
|---|---|---|---|
| `--color-primary-900` | `#0B2545` | `hsl(212, 72%, 16%)` | Deep Navy: Brand authority, headers, primary navigation |
| `--color-primary-700` | `#134074` | `hsl(213, 72%, 27%)` | Primary interactive buttons, key headings |
| `--color-teal-600` | `#0E7490` | `hsl(192, 82%, 31%)` | Clinical Teal: Diagnostic badges, verified markers |
| `--color-emerald-500` | `#10B981` | `hsl(160, 84%, 39%)` | Success: Available slots, confirmed bookings, verified badge |
| `--color-amber-500` | `#F59E0B` | `hsl(38, 92%, 50%)` | Warning / Hold: 5-minute temporary held slot, queue waiting |
| `--color-rose-600` | `#E11D48` | `hsl(347, 77%, 50%)` | Danger / Full: Slot full, cancelled booking, emergency alert |
| `--color-slate-50` | `#F8FAFC` | `hsl(210, 40%, 98%)` | Clean canvas background |
| `--color-slate-100` | `#F1F5F9` | `hsl(210, 40%, 96%)` | Card surface, table header background |
| `--color-slate-200` | `#E2E8F0` | `hsl(214, 32%, 91%)` | Subtle borders, dividers |
| `--color-slate-900` | `#0F172A` | `hsl(222, 47%, 11%)` | High-contrast readable body text |

---

## 2. Typography & Bilingual Script Rendering

Diagnostic Care supports native dual-script rendering for English and Bangla:

- **English Font Stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Bangla Font Stack:** `'Hind Siliguri', 'Noto Sans Bengali', sans-serif`

### Type Scale
- `Display / Hero`: `36px` (Mobile: `28px`), SemiBold (600), Line-Height 1.2
- `H1 / Page Title`: `28px` (Mobile: `24px`), SemiBold (600), Line-Height 1.25
- `H2 / Section Title`: `22px` (Mobile: `18px`), Medium (500), Line-Height 1.3
- `H3 / Card Title`: `18px`, Medium (500), Line-Height 1.4
- `Body Text`: `15px`, Regular (400), Line-Height 1.5
- `Small / Captions`: `13px`, Regular (400), Line-Height 1.4

---

## 3. Core UI Components

### 3.1 Real-Time Slot Selector
- Slots render as clean, pill-shaped interactive buttons.
- State representations:
  - **Available:** White surface, slate border, hover subtle teal ring.
  - **Held (by current user):** Amber fill, pulsating glow with countdown badge: `Hold: 04:42`.
  - **Booked / Full:** Subdued gray surface, strikethrough time, non-clickable.

### 3.2 Live Queue Token Card
- Prominently displays:
  - **Your Token:** Large, bold circular badge (e.g., `Token 08`).
  - **Currently Serving:** Real-time flashing indicator (e.g., `Serving: Token 05`).
  - **Estimated Wait:** E.g., `Approx. 45 mins`.
  - **Action Button:** "Directions to Chamber", "Call Customer Care: 01886748564".

### 3.3 Diagnostic Test Card
- Displays Test Name (e.g., *CBC - Complete Blood Count*), Category (*Hematology*), Price (*৳500*), Expected Report Delivery (*Same Day*), Sample Type (*Blood*), and Home Sample Collection toggle.

### 3.4 PWA Touch Targets & Accessibility
- Minimum touch target: `44px x 44px` on mobile screens.
- Full color-contrast compliance (WCAG AAA for text, AA for UI components).
- High-priority Customer Care button `01886748564` always accessible in mobile navigation header and footer.
