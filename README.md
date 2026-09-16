# Sai Keerthana — Interactive AI Engineering Portfolio

Eight-page portfolio with a draggable 3D capability network, architecture explorer, client case studies, search and evaluation workbench, and popup profile assistant.

## Run locally

Use any static server from the repository root, for example `python -m http.server 8000`, then open http://localhost:8000.

## GitHub Pages

In Settings → Pages select **Deploy from a branch**, **main**, and **/ (root)**. No build step or paid service is required. The intended URL is https://saikeerthanat26.github.io.

## Assistant and voice

`assistant.js` contains curated profile facts and local keyword retrieval. It is not a generative LLM and cannot answer arbitrary questions outside the supplied profile. It returns an explicit fallback for unmatched questions. No chat messages are stored or sent to a server.

Read-aloud uses the browser Web Speech API and device voices. Voice availability varies by device; these are not Sai’s voice. This site has no paid API dependency.

To use Sai’s own voice at zero API cost, record the curated answers and add the audio files to `audio/`. Before assistant.js loads, define `window.PORTFOLIO_VOICE_RECORDINGS = {intro: '/audio/intro.mp3', vatica: '/audio/vatica.mp3'}` using only recordings that exist. Recorded clips play for matching answers. This is prerecorded playback, not voice cloning or arbitrary text generation. No personal voice recording has been supplied yet.

## Files

- `index.html` and route directories: portfolio content and metadata
- `style.css`, `enhancements.css`: responsive layout and interaction styles
- `immersive.js`: projected 3D skill network, pause and drag controls
- `assistant.js`: popup assistant, source links, voice playback
- `retrieval.js`: editable BM25 search, scoring, relevance labels and evaluation export
- `app.js`: navigation, filtering, architecture controls and email composer

## Content integrity

Case studies summarize resume-reported client engagements. Metrics are not independently audited. Demonstrations contain synthetic data. No client code, private datasets, testimonials, invented credentials, or fabricated voice recordings are included.

## Accessibility

Keyboard navigation, native modal focus management, reduced-motion preference, motion pause, text alternatives, and responsive layouts are included. The core content stays available without the animated canvas. Browser visual QA has not been performed in this environment.
