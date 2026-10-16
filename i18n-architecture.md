# Diagnostic Care — Complete Bilingual Architecture (English & Bangla)

## 1. Executive Summary

**Diagnostic Care** (`diagnosticcare.vercel.app`) is Bangladesh's nationwide digital healthcare marketplace connecting patients, specialist physicians, accredited diagnostic centers, partner hospitals, pharmacies, and 24/7 emergency dispatch services.

To serve both metropolitan clinical operations and local patients across all 8 divisions and 64 districts (anchored by the Sylhet Division & Moulvibazar Sadar hub), the application implements an end-to-end, production-grade bilingual internationalization (i18n) system.

- **Default Language**: English (`en-BD`) — default for all new visitors with no saved preference.
- **Secondary Language**: Bangla / বাংলা (`bn-BD`) — instant full UI translation.
- **Brand Identity**: Consistent across languages with localized taglines and verification badges.
- **Customer Care Helpline**: `01886748564` (Display: `01886-748564`).

---

## 2. Language Specifications

| Parameter | English (Primary) | Bangla (Secondary) |
| :--- | :--- | :--- |
| **Language Code** | `en` | `bn` |
| **Locale Tag** | `en-BD` | `bn-BD` |
| **Script Direction** | Left-to-Right (LTR) | Left-to-Right (LTR) |
| **Display Name** | English | বাংলা |
| **Currency** | BDT (`৳1,500`) | BDT (`৳১,৫০০`) |
| **Numerals** | Western Arabic (`0-9`) | Eastern Bengali (`০-৯`) |
| **Primary Fonts** | Plus Jakarta Sans, system-ui | Noto Sans Bengali, Hind Siliguri |
| **Default Selection** | **Yes** (For new visitors) | Optional |

---

## 3. Centralized Architecture & Module Map

The architecture consists of 5 modular layers designed for high performance, zero hydration mismatches, and instantaneous client-side switching:

```
src/
├── app/
│   ├── layout.tsx                # Pre-hydration anti-flicker script & font loader
│   └── globals.css               # CSS variables (--font-sans, --font-bangla, LTR layout)
├── config/
│   ├── brand.ts                  # Brand constants, supported languages ('en' | 'bn')
│   └── seo.ts                    # Multilingual alternates, hreflang, OpenGraph
├── context/
│   └── LanguageContext.tsx       # React Context provider, hook (useLanguage), broadcast sync
├── i18n/
│   ├── index.ts                  # Localization engines (numbers, dates, currency, translate)
│   └── translations.ts           # Master bidirectional dictionaries (en & bn: 316+ keys)
├── components/
│   ├── common/
│   │   └── LanguageSwitcher.tsx  # Accessible switcher (pills, minimal, header, mobile)
│   ├── Header.tsx                # Desktop utility bar & mobile header toggles
│   └── navigation/
│       └── GlobalMobileNavigation.tsx # Bottom dock with translated labels
└── scripts/
    └── verify-i18n.js            # Automated key parity & formatting test suite
```

---

## 4. Anti-Flicker Pre-Hydration Strategy

To prevent Flash of Untranslated Content (FOUC) and hydration mismatches during server-side rendering and client rehydration:

1. **Inline HTML Head Execution**:
   In `src/app/layout.tsx`, a synchronous script runs before browser rendering:
   ```html
   <script
     dangerouslySetInnerHTML={{
       __html: `(function(){try{var l=localStorage.getItem('dc_lang');if(!l){var m=document.cookie.match(/(?:^|; )dc_lang=([^;]*)/);if(m)l=m[1];}if(l==='bn'||l==='en'){document.documentElement.lang=l;document.documentElement.setAttribute('data-lang',l);}}catch(e){}})();`
     }}
   />
   ```
2. **Server-Client HTML Synchronization**:
   The `<html>` tag uses `suppressHydrationWarning`, allowing the pre-hydration script to update the `lang` attribute without triggering React hydration warnings.
3. **Cookie Mirroring**:
   The selected language is stored simultaneously in `localStorage.setItem('dc_lang', lang)` and a long-lived cookie (`dc_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`). This allows future server components or middleware to read the user's preference upfront.

---

## 5. Multi-Tier Preference Hierarchy

When determining the active language, the system follows a deterministic 4-stage priority cascade:

```
[1. Explicit Session Selection] (User clicks English or বাংলা button)
               ↓
[2. Authenticated Profile Preference] (Fetched from Supabase `profiles.language_preference`)
               ↓
[3. Local Client Storage] (`localStorage.getItem('dc_lang')` or `document.cookie`)
               ↓
[4. Default Platform Standard] (`en` - English)
```

### Multi-Tab & Intra-Window Synchronization
- **Browser Storage Event**: Changes in one tab trigger `window.addEventListener('storage', ...)` in all other active tabs to keep preferences unified.
- **Intra-Window Custom Event**: Dispatching `dc-language-changed` immediately triggers UI updates without requiring a page reload.
- **Supabase Cloud Sync**: When an authenticated user changes language, `AuthService.updateLanguagePreference(userId, lang)` updates their record in PostgreSQL asynchronously without blocking the UI.

---

## 6. Translation Dictionary Parity & Interpolation

### Key Parity Standard
The dictionaries in `src/i18n/translations.ts` maintain **100% key parity** between English and Bangla:
- English Keys: 316
- Bangla Keys: 316
- Parity Ratio: **1.00 (Zero missing keys)**

### Dot-Notation & CamelCase Mapping
The `translate()` function supports both direct camelCase keys (`authLoginTitle`) and standard dot-notation (`auth.login.title`) via an internal lookup map (`DOT_KEY_MAP`).

### Parameter Interpolation
Dynamic strings support single-brace `{param}` and double-brace `{{param}}` interpolation:
```typescript
translate('bn', 'welcomeUser', 'স্বাগতম, {name}!', { name: 'রহিম' });
// Output: "স্বাগতম, রহিম!"
```

### Fallback Protection
If an unexpected key is requested or an empty string is encountered, `translate()` systematically falls back to the English dictionary entry before falling back to the raw key string, ensuring end-users never see raw technical identifiers.

---

## 7. Bengali Typography & Unicode Layout

Bangla is an Indic Unicode script written Left-to-Right (LTR). It features complex conjuncts (যুক্তবর্ণ), vowel signs (কার), and ascenders/descenders.

1. **Font Stack**:
   - Primary Bengali Fonts: `Noto Sans Bengali` (Google Fonts) and `Hind Siliguri`.
   - Primary English Font: `Plus Jakarta Sans`.
   - Font Definition in `globals.css`:
     ```css
     :root {
       --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
       --font-bangla: 'Noto Sans Bengali', 'Hind Siliguri', var(--font-sans);
     }
     html[lang="bn"], html[data-lang="bn"] {
       font-family: var(--font-bangla);
     }
     ```
2. **Text Clipping Prevention**:
   - Bengali conjuncts have higher vertical reach than Latin letters. All typography tokens maintain `line-height >= 1.4` (headings) and `line-height >= 1.55` (body text).
   - Card headers, buttons, navigation pills, and data table cells use flexbox and grid layouts with `min-width` rather than fixed `width`, preventing string overflow when Bengali words are longer than English equivalents.
3. **No RTL Inversion**:
   Bangla is strictly LTR. No Right-to-Left CSS mirroring or direction swapping is applied.

---

## 8. Localization of Numbers, Currency, Dates & BST

Interface text and data formatting are separated cleanly:

### Number Conversion (`formatLocalizedNumber`)
- English: `01886748564`
- Bangla: `০১৮৮৬৭৪৮৫৬৪`
- Implementation uses a digit mapping array: `['০','১','২','৩','৪','৫','৬','৭','৮','৯']`.

### Currency Formatting (`formatLocalizedCurrency`)
- Uses Bangladesh Taka symbol `৳`.
- English: `৳1,500` (Western numerals with standard comma grouping).
- Bangla: `৳১,৫০০` (Eastern Bengali numerals with standard comma grouping).
- Raw numbers in calculations and payment APIs remain unmutated IEEE 754 floats.

### Dates & Time (`formatLocalizedDate` / `formatLocalizedTime`)
- Localized using the native browser `Intl.DateTimeFormat` API:
  - English: `locale: 'en-US'` or `'en-BD'` (e.g., `Oct 25, 2026`).
  - Bangla: `locale: 'bn-BD'` (e.g., `২৫ অক্টোবর, ২০২৬`).
- Timestamps in the PostgreSQL database remain UTC ISO-8601 strings. Display conversion defaults to Bangladesh Standard Time (BST, UTC+6).

---

## 9. Database & Supabase Integration

User language preferences are linked with their Supabase account:

1. **Schema Field**:
   The `profiles` table contains:
   ```sql
   ALTER TABLE profiles 
   ADD COLUMN IF NOT EXISTS language_preference VARCHAR(10) DEFAULT 'en' CHECK (language_preference IN ('en', 'bn'));
   ```
2. **Row Level Security (RLS)**:
   Users can update their own language preference via standard RLS policies:
   ```sql
   CREATE POLICY "Users can update own language preference"
   ON profiles FOR UPDATE
   USING (auth.uid() = id)
   WITH CHECK (auth.uid() = id);
   ```
3. **Reversible & Non-Breaking**:
   Existing records default to `'en'`. Read operations gracefully fall back if null.

---

## 10. Translation Boundaries & Provider Content

The application strictly separates **UI chrome** from **User-Generated and Provider Content**:

| Content Type | Translation Strategy | Rationale |
| :--- | :--- | :--- |
| **UI Chrome / Navigation** | Fully translated (EN & BN) | Universal navigation & clarity |
| **Buttons / Actions / States** | Fully translated (EN & BN) | Accessible interaction |
| **Doctor BMDC Qualifications** | Preserved in original registration | Clinical accuracy; avoiding mistranslation of degrees |
| **Organization Business Names** | Preserved (or bilingual display if provided) | Legal registration alignment |
| **Medical Advice / Clinical Notes**| Kept in original provider language | Patient safety & liability |

---

## 11. Multilingual SEO & Routing

1. **Hreflang & Alternates**:
   Configured in `src/config/seo.ts`:
   ```typescript
   alternates: {
     canonical: canonicalUrl,
     languages: {
       'en': `${canonicalUrl}?lang=en`,
       'bn': `${canonicalUrl}?lang=bn`,
       'x-default': canonicalUrl,
     },
   }
   ```
2. **Canonical URLs**:
   All public indexable pages declare unified canonical URLs, preventing duplicate content penalties.
3. **OpenGraph & Social Cards**:
   OpenGraph tags dynamically render localized title and description tags.
4. **Protected Route Exclusion**:
   Patient health vaults, internal portals, and admin consoles include `robots: { index: false, follow: false }` to protect clinical privacy.

---

## 12. Accessibility (WCAG 2.1 AA)

- **Document Language**: `document.documentElement.lang` updates synchronously to match the active language (`en` or `bn`), allowing screen readers to switch pronunciation engines.
- **ARIA Switcher Attributes**: All `LanguageSwitcher` buttons declare `role="group"`, `aria-label`, and dynamic `aria-pressed="true|false"`.
- **Keyboard Navigation**: Full tab index and visible focus rings on all switcher options.
- **Color Independence**: Active states use both color contrast and visual indicators (badges, pills, bold font weights).

---

## 13. Automated Testing & Verification Suite

The repository includes an automated i18n audit suite run via:
```bash
npm run test:i18n
```

### Verified Test Cases:
- [x] **Test 1**: 100% Key Parity between English and Bangla dictionaries (316 / 316 keys).
- [x] **Test 2**: Domain Coverage across Navigation, Hero, Search, Booking, Queue, Auth, Vault, Footer.
- [x] **Test 3**: Western Arabic to Eastern Bengali numeral conversion.
- [x] **Test 4**: BDT currency formatting with proper decimal and grouping separators.
- [x] **Test 5**: Dynamic string interpolation (`{variable}` and `{{variable}}`).
- [x] **Test 6**: Pre-hydration inline anti-flicker script verification in `layout.tsx`.
- [x] **Test 7**: Noto Sans Bengali & Hind Siliguri font declarations.

---

## 14. Conclusion & Production Readiness

The Diagnostic Care bilingual language system is **fully implemented, tested, and ready for production deployment**. It enables seamless healthcare access for patients across Bangladesh while maintaining strict clinical precision, zero layout breaks, and complete backward compatibility with existing workflows.
