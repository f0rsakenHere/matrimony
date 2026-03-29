<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design System Rules

All future design and frontend work must follow this system to keep the site visually consistent.

## Color Palette

Use only these two base colors across the site:

- Light color: `#efefe3`
- Dark color: `#1c413a`

Rules:

- Do not introduce any third color for backgrounds, text, borders, buttons, icons, highlights, or accents.
- If contrast variation is needed, use opacity variations of these two colors only.
- Backgrounds should use `#efefe3` by default.
- Text, icons, borders, and interactive elements should use `#1c413a` by default.
- In inverted sections, swap the two colors, but still use only these two values.
- Avoid gradients unless they are built only from `#efefe3` and `#1c413a`.

## Typography Scale

Use these as the default type sizes for the full site:

- `h1`: `72px`, `line-height: 1`, `font-weight: 700`
- `h2`: `48px`, `line-height: 1.05`, `font-weight: 700`
- `h3`: `32px`, `line-height: 1.1`, `font-weight: 600`
- Subheading: `20px`, `line-height: 1.2`, `font-weight: 600`
- Paragraph (`p`): `16px`, `line-height: 1.7`, `font-weight: 400`

## Responsive Type

For smaller screens, keep the same hierarchy with these reduced sizes:

- Mobile `h1`: `48px`
- Mobile `h2`: `36px`
- Mobile `h3`: `28px`
- Mobile subheading: `18px`
- Mobile paragraph: `16px`

## Consistency Rules

- Reuse the same heading sizes everywhere instead of creating one-off text sizes.
- Keep spacing, borders, and section treatments visually minimal and aligned with the two-color system.
- Buttons, navigation, cards, and forms must follow the same type scale and color rules above.
- Any new page or component should be checked against these rules before being considered complete.
