# Engineering Living Systems — Spatial Architecture & Refactoring Plan

A comprehensive, phased engineering blueprint to elevate the "Engineering Living Systems" agency portfolio into an Awwwards SOTD / CSS Design Awards grade spatial web application, systematically replacing legacy editorial cards with 3D WebGL portals, live GitHub telemetry for `OttoJoe1128`, 3D device simulators, and an embedded SLISS AI terminal assistant.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Based on your explicit inputs in Phase 1, the following core architectural decisions are locked into this plan:

- **Confirmed Decision 1 (GitHub Telemetry & API)**: Configured for user `OttoJoe1128` with GitHub GraphQL API integration, edge-cached (3600s ISR revalidation), querying the last 365 days of contribution calendar, language distributions, and the latest 5 commits with SHA and messages.
- **Confirmed Decision 2 (3D Device Simulator)**: Dynamic device frame selection in Selected Works — automatically rendering a procedural 3D MacBook Pro for desktop/web systems (e.g., Nova Agro, Brook Resort) or an iPhone 16 Pro for mobile/tactile systems (e.g., SudokuMap / LensAI), embedding live interactive frames via `@react-three/drei` `<Html>`.
- **Confirmed Decision 3 (Execution Milestones)**: Strict phased delivery starting with **Step 0** (complete DOM removal of legacy agency cards) and **Step 1** (purge of mechanical pseudo-technical labels), presenting clear reports for approval before proceeding to subsequent 3D and API layers.

---

### 1. Overview & Core Concept

- **What It Does**: Transforms a traditional editorial agency layout into a living, reactive spatial ecosystem. Content transitions from flat 2D cards into a 3D Z-axis spatial corridor, live GitHub commit telemetry, procedural hardware and particle sandboxes, and an integrated system-level terminal AI.
- **Target Audience**: High-caliber creative directors, venture studios, deep-tech founders, and industrial IoT clients seeking world-class creative engineering and physical-digital systems architecture.
- **Key Value**: Demonstrates authentic technical depth — replacing synthetic HUD text with genuine GitHub GraphQL data, real R3F procedural shaders, physical computing schematics, and an ultra-fast Gemini 3.8 Flash terminal interface.

---

### 2. User Experience & Visual Design

#### Visual Identity & Theme
- **Aesthetic Direction**: High-end brutalist / spatial creative technologist aesthetic, drawing inspiration from Linear.app, Active Theory, and Awwwards Site of the Year nominees.
- **Color Palette & Atmosphere**:
  - Dominant Neutral Canvas (60%): Deep obsidian void (`#060709`, `#0D0D0D`).
  - Structural Surfaces (30%): Hairline grid boundaries (`border-white/10`), frosted glass overlays (`bg-black/60`).
  - Accent Budget (10%): Phosphor green (`#10B981`), electric cyber cyan (`#06B6D4`), and crisp pure white (`#FFFFFF`) concentrated strictly at primary points of interaction.
- **Typography & Scale**:
  - Display / Hero: Bold condensed geometric typography (`font-display`, `tracking-tight`).
  - Prose: Clean readable sans-serif (`font-sans`, 15–16px, balanced line wraps).
  - Telemetry & Data: `JetBrains Mono` / `tabular-nums` strictly for commit SHAs, timestamps, and JSON brief inspection.
- **Zero-Pill & Clean HUD Discipline**: Complete eradication of fake compiler tags, mock latency lines, and static pill boxes. All metadata is presented as clean unboxed typographic pairs separated by subtle hairline rules.

#### Key Interaction Flows
1. **Hero**: Editorial manifesto with staggered text reveal and interactive living network topology canvas.
2. **Kinetic Marquee**: Velocity-responsive velocity scrub reflecting real viewport scroll momentum.
3. **3D GitHub Telemetry & R&D Lab (Step 0 & 2)**: Replaces legacy agency cards with an interactive 3D contribution matrix (cuboid monoliths reflecting commit density on hover with minimalist tooltips), live kinetic commit ticker, and an asymmetric Bento Grid (procedural ESP32 3D model, WebGL particle simulation, live node topology).
4. **Anamorphic Z-Axis Spatial Portal (Step 3)**: Eliminates static HTML cards. Disperses system discipline typography across deep 3D coordinates ($z = -10, -20, -30$). As the user scrolls, camera moves through the Z-axis toward a precise "sweet spot" where anamorphic alignment forms a crisp, readable 2D layout before smoothly flying through to the next station.
5. **Selected Works & Real Experience Simulators (Step 4)**: Large project titles smoothly fade back as an interactive 3D MacBook or iPhone glides into focus, housing a functional interactive live demo frame.
6. **SLISS Terminal Assistant (Step 5)**: Global command palette (`Cmd+K` / `Ctrl+K` or bottom-right floating trigger) launching a deterministic AI terminal powered by Gemini 3.8 Flash, featuring real navigation commands (`[NAV: <target>]`) and terminal log diagnostics.
7. **Cyber-Tactile Technical Brief Engine (Step 6)**: Linear-style configuration matrix with instant typewriter JSON preview at `/api/v1/system-brief`.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Removal of Agency Showcase (Step 0)**:
  - *Chosen Approach*: Completely unmount and purge `AgencyShowcase.tsx` and related DOM markup.
  - *Why*: Eliminates traditional resume-style card blocks and makes room for the dynamic 3D GitHub matrix and R&D Lab.
- **Decision 2: Genuine Telemetry vs Synthetic Gimmicks (Step 1 & 2)**:
  - *Chosen Approach*: Strip out all fake status strings (`RS485: 120Ω TERMINATED`, `TICK: 16.6ms (60 FPS)`, `SYSTEM_READY // 200 OK`) and replace them with real GitHub GraphQL data for `OttoJoe1128`.
  - *Why*: Elevates credibility to the highest engineering standards and adheres strictly to the anti-slop constitution.
- **Decision 3: Server-Side API Architecture & Caching**:
  - *Chosen Approach*: Provide `/api/github` with 3600-second in-memory ISR cache on the Express/Vite server, while also generating `app/api/github/route.ts` for modular portability.
  - *Why*: Ensures rapid sub-millisecond responses without hitting GitHub rate limits or exposing tokens to the client.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / FRONTEND (Vite + R3F)                  │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar [Navbar] (Strict 3-zone contract)                             │
│  ├── Hero (Manifesto + LivingTopologyCanvas)                           │
│  ├── KineticMarquee (Lenis + GSAP velocity scrub)                      │
│  ├── [STEP 2] GitHub 3D Monolith Matrix (R3F) + R&D Lab Bento          │
│  │   ├── 365-day 3D Extruded Cuboids + Drei Html Tooltips             │
│  │   ├── JetBrains Mono Live Commit Ticker                            │
│  │   └── Bento: Procedural ESP32 3D + WebGL Particles + Node Topology │
│  ├── [STEP 3] Anamorphic Z-Axis Spatial Tunnel (R3F Drei <Text>)       │
│  │   └── GSAP ScrollTrigger Camera Path (Sweet Spot Anamorphosis)      │
│  ├── [STEP 4] Selected Works & 3D Device Simulator                     │
│  │   └── Procedural MacBook / iPhone 3D Models with Drei <Html>        │
│  ├── [STEP 6] Cyber-Tactile Brief Engine (Linear UI + Typewriter JSON) │
│  └── [STEP 5] SLISS Terminal Assistant (Cmd+K Global Overlay)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ fetch('/api/*')
┌───────────────────────────────────▼────────────────────────────────────┐
│                    BACKEND CORE (Express Server / API)                 │
├────────────────────────────────────────────────────────────────────────┤
│  ├── GET /api/github (GraphQL Proxy + 3600s Edge Cache)                │
│  │   └── Queries GitHub: contributionsCollection, commits, languages   │
│  ├── POST /api/sliss/chat (Gemini 3.8 Flash + SLISS Persona)           │
│  │   └── Deterministic systems architect instructions & NAV tags       │
│  └── POST /api/v1/system-brief (Brief ingestion & JSON validation)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Step-by-Step Execution Plan

- [x] **Step 0: Legacy Agency DOM Purge**
  - Unmount `AgencyShowcase` from `App.tsx` and delete references.
  - Verify layout integrity and report status for Step 0.
- [x] **Step 1: General UI Cleanup & Synthetic Tag Purge**
  - Remove all fake HUD strings, `SYSTEM_READY // 200 OK`, `TICK: 16.6ms`, `ANAMORPHIC Z-AXIS PORTAL, DEPTH: 720m`, `GRID: 48x48`, etc. across `Hero.tsx`, `KineticMarquee.tsx`, `SpatialTunnel.tsx`, `CaseStudies.tsx`, `Navbar.tsx`, and `Footer.tsx`.
  - Maintain genuine brand headlines, project descriptions, and navigation links.
- [x] **Step 2: 3D GitHub Telemetry Matrix & R&D Lab Bento Grid**
  - Configure `.env.local` with `GITHUB_USERNAME=OttoJoe1128` and token.
  - Implement `/api/github` (with `app/api/github/route.ts` and Express proxy route in `server.ts`) with 3600s ISR caching.
  - Build `GitHub3DMatrix.tsx` using `@react-three/fiber` with Z-height monoliths and interactive tooltips.
  - Build `CommitTicker.tsx` with flowing SHA/commit stream in `JetBrains Mono`.
  - Build `RnDLabBento.tsx` with 3D ESP32 model, WebGL particles, and live topology node view.
- [x] **Step 3: Anamorphic Z-Axis Spatial Corridor**
  - Replace DOM cards in `SpatialTunnel.tsx` with R3F Drei `<Text>` positioned in 3D coordinate space ($z = -10, -20, -30$).
  - Integrate GSAP ScrollTrigger camera trajectory settling into the 2D planar perspective sweet spot before passing through.
- [x] **Step 4: Selected Works 3D Device Simulators**
  - Refactor `CaseStudies.tsx` to remove traditional magazine editorial layouts.
  - Implement 3D procedural MacBook Pro and iPhone 16 Pro models with interactive screen viewports (`@react-three/drei` `<Html>`).
- [x] **Step 5: SLISS AI Terminal Command Palette**
  - Purge any legacy deployment guide module.
  - Finalize `CommandPalette.tsx` with Cmd+K trigger and bottom-right quick indicator.
  - Connect to `/api/sliss/chat` with Gemini 3.8 Flash, deterministic persona, and auto-scrolling terminal execution.
- [ ] **Step 6: Cyber-Tactile Technical Brief Engine**
  - Refactor `BriefModule.tsx` to a high-contrast Linear.app aesthetic with hairline grids and neon state glows.
  - Implement dynamic typewriter syntax highlighting for the live `/api/v1/system-brief` JSON payload.
