# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server (localhost:3000)
npm run build      # Production build to /build
npm test           # Run tests (watch mode)
npm run deploy     # Build + deploy to GitHub Pages (runs predeploy automatically)
```

Run a single test file:

```bash
npm test -- --testPathPattern=App.test
```

## Architecture

This is a **Create React App** single-page portfolio site deployed to GitHub Pages at
`https://gohilmahaveer.github.io/gohilmahaveer-portfolio/`.

### Single-file design

Nearly all application code lives in `src/App.js` (~1300 lines). There is no routing library — page switching between
the portfolio view and the resume PDF viewer is handled by a single `useState("portfolio" | "resume")` in the `Inner`
component.

### Theme system

A custom Apple "Liquid Glass" design system is implemented via React Context (`ThemeCtx`). `ThemeProvider` holds
`light`/`dark` token objects (defined at the top of `App.js`) and persists the mode to `localStorage`. All components
consume tokens via the `useTheme()` hook. **All styling is done with inline styles using theme tokens** — `App.css` is
essentially unused.

### Component hierarchy

```
App
└── ThemeProvider
    └── Inner
        ├── GlobalStyles       (injects global CSS via <style>)
        ├── MeshBackground     (animated gradient blobs)
        ├── Nav                (sticky top nav with ThemeToggle)
        ├── Hero               (above-fold with "View Resume" CTA)
        ├── About / Experience / Skills / Education / Achievements / Contact
        ├── Footer / BackToTop
        └── ResumePage         (react-pdf viewer, replaces all above when active)
```

### Shared primitives (in App.js)

- `GlassCard` — frosted-glass card with hover-lift; reads blur/border/shadow from theme
- `Pill` — small badge chip
- `FadeIn` — scroll-triggered entrance animation using `useInView` (IntersectionObserver)
- `Section` / `SectionTitle` — layout wrappers for each portfolio section

### PDF viewer

`ResumePage` uses `react-pdf` to render `public/resume.pdf`. The pdfjs worker is loaded from unpkg CDN:

```js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
```

Required CSS is imported from `react-pdf/dist/Page/AnnotationLayer.css` and `TextLayer.css`.
