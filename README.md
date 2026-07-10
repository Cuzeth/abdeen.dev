# abdeen.dev

Small tools, carefully engineered. The source for [abdeen.dev](https://abdeen.dev): product pages for native apps (Frost, Hush) and a set of free, open-source browser tools (password generator, QR generator, regex tester, pomodoro timer, 2FA QR generator, CoverQuad).

Built with [Next.js](https://nextjs.org) (App Router), Tailwind CSS v4, and TypeScript. Deployed on Vercel.

## Development

This project uses [Bun](https://bun.sh):

```bash
bun install
bun run dev      # dev server at http://localhost:3000
bun run lint     # eslint
bun run build    # production build
```

## Layout

- `src/app/` · routes. Each browser tool is a folder with a `page.tsx` (metadata + shell) and one client component.
- `src/components/` · shared UI (tool page shell, section header, fade-in wrapper).
- `src/lib/catalog.ts` · the single index of apps and tools that drives the homepage, footer, and cross-links.
- `src/app/globals.css` · brand tokens and the shared control vocabulary (buttons, inputs, segmented controls, etc.).
- `public/data/` · word lists and lookup data fetched by the tools at runtime.

## License

Content and branding are © Jaafar Abdeen. See individual tool pages for third-party data credits (EFF word list, BIP-39, MusicBrainz/Cover Art Archive).
