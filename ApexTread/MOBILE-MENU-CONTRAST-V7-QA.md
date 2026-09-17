# ApexTread V7 QA — Mobile Menu & Contrast

## Responsive hamburger / drawer
Automated Chromium DOM/layout checks passed at:
- 320 px
- 360 px
- 390 px
- 414 px
- 768 px
- 1024 px

Checks: hamburger visible, drawer opens, close button closes, nav-link click closes, body scroll lock toggles correctly, drawer is above backdrop, horizontal overflow = 0.

## Theme / direction
- Dark-mode drawer uses high-contrast surfaces and readable text.
- Theme control remains visible in the drawer.
- Direction control remains visible and changes LTR ↔ RTL.
- Drawer side switches correctly in RTL.

## Overlay visibility
- Home 2 fleet hero: heading/subtext high contrast in Light and Dark.
- Blog detail hero: heading/subtext high contrast in Light and Dark.
- Mobile overlay text receives additional text shadow / contrast protection.

## Static QA
- HTML pages: 35
- Missing V7 CSS/JS references: 0
- Broken local references: 0
- Duplicate IDs: 0
- JavaScript syntax: PASS
