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

## Spacing Scale

Use these consistent vertical spacing values across all sections and components:

- **Subheading to Heading**: `mt-4` (16px)
- **Heading to Body/Description**: `mt-6` (24px)
- **Body to Supporting Elements** (avatars, trust row, etc.): `mt-8` (32px)
- **Section to Next Section**: `py-14` to `py-20` (56–80px, responsive)
- **Element gaps within rows**: `gap-4` or `gap-5` for flex layouts (16–20px)

## Line-Height Rules

- Never override paragraph `line-height` unless design explicitly requires it.
- Use default `leading-7` (1.75) for body text, matching `--line-height-body: 1.7`.
- Decrease line-height only for display text (titles, large graphics) where density aids readability.

## Consistency Rules

- Reuse the same heading sizes everywhere instead of creating one-off text sizes.
- Keep spacing, borders, and section treatments visually minimal and aligned with the two-color system.
- Buttons, navigation, cards, and forms must follow the same type scale and color rules above.
- Apply spacing scale uniformly: if a section uses `mt-6` between heading and body, all sibling sections must do the same.
- Any new page or component should be checked against these rules before being considered complete.
