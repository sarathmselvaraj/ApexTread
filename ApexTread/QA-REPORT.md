# ApexTread Final Text, Naming, Spacing & Contrast QA

## Requested changes completed
- Removed visible **Home 1** / **Home 2** naming from all HTML pages.
- Primary centre labels are now **Tyre & Alignment Centre** and **Fleet Service**.
- Desktop centre selector uses the neutral label **Centres** and contains those two destinations.
- Mobile navigation directly shows **Tyre & Alignment Centre** and **Fleet Service**.
- Tightened desktop and mobile section spacing, grid gaps, card padding, hero spacing and footer height.
- Reduced unnecessary fixed/minimum card text heights so pages do not become artificially long.
- Normalized section-heading alignment to centered, constrained intro blocks.
- Kept card/product/service body copy left aligned in LTR and right aligned in RTL for scanability.
- Improved Light and Dark mode text, muted text, dropdown and active-link contrast.
- Unified remaining cyan/lime informational badge helpers into the site orange accent family.

## Contrast palette checks
Approximate WCAG contrast ratios for core UI combinations:
- Light primary text `#172033` on white: **16.27:1**
- Light muted text `#475467` on white: **7.69:1**
- Light orange accent text `#c2410c` on white: **5.18:1**
- Primary CTA white text on `#c2410c`: **5.18:1**
- Dark primary text `#f8fafc` on `#111822`: **17.04:1**
- Dark muted text `#c2cad5` on `#111822`: **10.79:1**
- Dark orange accent text `#fdba74` on `#111822`: **10.57:1**

All listed core text/CTA combinations meet WCAG AA contrast for normal text.

## Automated integrity checks
- HTML pages checked: **35**
- `compact-text-pass.css` loaded: **35 / 35**
- Visible `Home 1` / `Home 2` labels remaining: **0**
- Missing local links/assets: **0**
- Duplicate IDs: **0**
- JavaScript files checked: **2**
- JavaScript syntax failures: **0**

## Final layout layer
`assets/css/compact-text-pass.css` is intentionally loaded last so the requested naming-independent typography, spacing, alignment and contrast rules are not overridden by older template CSS.
