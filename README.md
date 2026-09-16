# Sai Keerthana — React Portfolio

A React + TypeScript frontend for a senior AI engineering portfolio. The application source lives in `src/`; `index.html` is only Vite’s entry shell. Pages, chatbot, filters, search, evaluation, and forms are React components.

## Stack

- **React 19 + TypeScript** — typed components, hooks, and state
- **Vite 7** — development server, optimized build, and code splitting
- **React Router 7** — client-side page navigation and project routes
- **Three.js** — real WebGL architecture with orbit controls, raycasting, lighting, materials, and layer selection
- **Motion** — route content and filter transitions with reduced-motion support
- **Lucide React** — interface icons
- **Vitest** — retrieval and profile-answer logic tests
- **GitHub Actions / Pages** — reproducible build and deployment

## Run

Requires Node.js 22.12+ (or a supported newer LTS).

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

## Source map

```text
src/
  App.tsx                      Routing, layout, error boundary, metadata
  main.tsx                     React application entry
  pages/                       Overview, work, case studies, systems, career, contact
  components/
    NetworkScene.tsx            Three.js lifecycle, camera and scene interaction
    ProfileAssistant.tsx        Accessible popup assistant
    RetrievalLab.tsx            Editable BM25 search and evaluation
    ProjectCard.tsx             Reusable project card
    UI.tsx                      Shared page and section components
  hooks/                       Reduced-motion and speech synthesis hooks
  lib/                         Typed search, evaluation, and profile matching
  data/                        Curated profile, career, skills, and case studies
  styles.css                   Responsive visual system
```

## Deployment

In repository **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**. The `deploy.yml` workflow installs the lockfile, runs tests, type-checks, builds, and deploys `dist/` on each main-branch push. Run the workflow manually after enabling Pages if needed.

The production build generates entry files for the eight public routes and a 404 fallback, so direct case-study URLs and refreshes work on GitHub Pages. No server or paid API is required. Compiled files and `node_modules` are intentionally not committed.

## Chatbot and voice — clear limits

The popup is a local profile assistant with curated answers and source links. It is **not a generative LLM** and does not answer arbitrary questions outside its public profile knowledge. Unmatched questions receive an explicit fallback. It sends no chat history to a model service.

Read-aloud uses available browser/device voices; it does **not** imitate Sai’s voice. Voice availability depends on the browser. To use her own voice without API fees, add her actual recorded answers under `public/audio/` and map each answer ID to its path in `src/lib/profile.ts`. The recordings map is empty because no recordings have been supplied. This is recorded-answer playback, not voice cloning.

## Content and accessibility

- Client case studies are based on resume-reported experience. Metrics are not independently audited.
- The architecture is conceptual; retrieval documents are synthetic and editable.
- The downloadable resume is excluded pending explicit public-upload approval.
- The 3D scene can be paused, respects reduced motion, and has equivalent text/button controls if WebGL is unavailable.
- Native dialog semantics handle focus, Escape, and close behavior for the popup.
- The contact form opens an email draft and does not send or store form data.

## Validation

The local production build includes TypeScript checking. Five Vitest checks cover relevant-document ranking, empty/no-match paths, evaluation metrics, supported profile routing, and unknown-question fallback. Browser visual verification is not included in these checks.

## Immersive gallery update

The homepage now uses ProjectWorld, a full-stage Three.js project gallery with three original sculptures representing clinical intelligence, financial knowledge, and search. Project selection updates the scene, accent palette, reported outcome, and case-study link. Visitors can orbit, pause, reset, and select projects through keyboard-accessible buttons. Reduced motion and WebGL fallback preserve navigation. No paid API or external 3D asset is required.

Design references: https://bruno-simon.com/ (spatial portfolio exploration), https://lusion.co/ (dimensional project presentation). Original geometry and implementation; no copied assets.

Validation: production build and five logic tests passed. Local browser verification was blocked by the browser environment; mobile visual QA remains unverified.
