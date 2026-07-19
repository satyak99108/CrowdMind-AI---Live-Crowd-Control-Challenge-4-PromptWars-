# CrowdMind AI - Live Crowd Control & Fan Intelligence Platform

CrowdMind AI is a real-time stadium crowd intelligence and incident operations platform designed for live sports venues and mega events. By combining live telemetry monitoring with 5–10 minute predictive forecasting and transparent Generative AI recommendation engines, CrowdMind AI transforms crowd management from reactive crowd control into proactive fan experience optimization.

---

## MVP Roadmap & Feature Status

### MVP Phase 1 - Live Crowd Heatmap (Completed)
* Real-time attendance density across perimeter access gates and seating sectors.
* Interactive SVG stadium heatmap with green, yellow, and red density zones.
* Live gate entry rates and queue backlog metrics.

### MVP Phase 2 - AI Crowd Prediction (Completed)
* 5–10 minute predictive forecasting engine for gates, seating rings, food courts, and restrooms.
* Time-Travel Forecast Selector (`LIVE NOW`, `+5 MIN FORECAST`, `+10 MIN FORECAST`).
* Predictive early warning alerts highlighting projected surges before capacity thresholds are breached.

### MVP Phase 3 - AI Recommendation Engine (Completed)
* Converts predictions into actionable recommendations (e.g., Gate rerouting, concession alternatives, restroom guidance, halftime timing).
* Transparent LLM Reasoning Engine explaining WHY each recommendation is made, detailing telemetry evidence and crowd flow physics.
* Interactive AI Recommendation Deck with fan time-saved tracking.

### MVP Phase 4 - Personalized Fan Copilot (Future Expansion)
* Individual spectator mobile routing, fastest route to seat, personalized amenity guidance, and conversational assistant.

---

## Architecture & Minimal UI System

* **Lenis Smooth Inertial Scroll**: Smooth scrolling physics across all application views.
* **Minimalist Workspace Layout**: Spacious navigation tabs, clear typography hierarchy, and glassmorphic card design.
* **3D Hardware Acceleration**: Three.js orthographic render engine for 3D logo and visual branding.
* **Incident Triage Queue**: Operations triage supporting Table and Kanban views across detection, dispatching, mitigation, and resolution.

---

## Required External Dependencies

The project relies on the following external npm dependencies. Running `npm install` automatically downloads and configures these packages:

| Package Category | Dependencies to Install |
| :--- | :--- |
| **Core & Routing** | `react`, `react-dom`, `react-router-dom` |
| **Styling & Tokens** | `tailwindcss`, `postcss`, `autoprefixer`, `clsx`, `tailwind-merge`, `tailwindcss-animate` |
| **Icons & Motion** | `lucide-react`, `next-themes`, `lenis` |
| **3D Rendering** | `three`, `@react-three/fiber`, `@react-three/drei` |
| **Component Primitives** | `@radix-ui/react-accordion`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-select`, `@radix-ui/react-progress`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `sonner` |
| **Analytics & Data** | `recharts`, `@tanstack/react-query`, `date-fns` |
| **Developer Tools** | `vite`, `typescript`, `vite-tsconfig-paths`, `@types/react`, `@types/node` |

---

## Step-by-Step Installation & Execution Guide

### Prerequisites
Node.js (v18.0.0 or higher) and npm (v9.0.0 or higher) installed on your system.

### Step 1: Clone the Repository
```bash
git clone https://github.com/satyak99108/CrowdMind-AI---Live-Crowd-Control-Challenge-4-PromptWars-.git
```

### Step 2: Navigate to Project Folder
```bash
cd CrowdMind-AI---Live-Crowd-Control-Challenge-4-PromptWars-
```

### Step 3: Install External Dependencies
Run the command below to install all external dependencies listed in `package.json`:
```bash
npm install
```

### Step 4: Launch Development Server
Start the local Vite development server:
```bash
npm run dev
```

### Step 5: Open in Web Browser
Open your browser and navigate to:
```
http://localhost:3000
```

### Step 6: Build for Production
To test or generate an optimized production build bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## Environment Configuration (Optional)

### OpenAI API Integration
CrowdMind AI includes a built-in intelligent Generative Recommendation Engine that produces transparent LLM explanations locally without requiring API keys or incurring costs.

If you wish to connect directly to external OpenAI APIs, create a `.env.local` file in the root directory:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```
