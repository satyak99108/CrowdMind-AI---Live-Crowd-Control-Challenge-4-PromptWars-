# CrowdMind AI — Live Stadium Crowd Control & Fan Intelligence Platform

**CrowdMind AI** is an AI-powered crowd intelligence and personalized fan copilot platform designed for FIFA World Cup stadiums and mega-events. By combining live telemetry monitoring with 5–10 minute predictive forecasting and transparent Generative AI guidance, CrowdMind AI transforms stadium operations from reactive crowd control into proactive fan experience optimization.

---

## 1. Chosen Vertical

* **Vertical**: **Sports Venue & Mega-Event Stadium Crowd Management & Fan Intelligence**.
* **Problem Focus**: Fans at major stadium events frequently face massive congestion, long entry turnstile queues, overcrowded concourses, extended halftime restroom/food wait times, and hazardous post-match exit bottlenecks. Traditional stadium operations react *after* crowd surges form, creating safety risks and negative fan experiences.
* **Target Audience**: Stadium Operations Command Centers, Event Safety Chiefs, Field Stewards, and Spectators/Fans inside the venue.

---

## 2. Approach and Logic

### Proactive vs. Reactive Paradigm
Instead of dispatching staff only after bottlenecks occur, CrowdMind AI uses a **predictive telemetry + Generative AI recommendation pipeline**:

```
[Live Sensors & Telemetry] ➔ [5m/10m Predictive Forecast Engine] ➔ [Generative AI Layer] ➔ [Personalized Fan Copilot]
```

### 4-Stage Progressive Pipeline:
1. **Sensors & Real-Time Telemetry Grid**: Tracks turnstile ingress rates, concourse density ratios, and queue counts across 8 perimeter gates, 12 seating stand sectors, and 4 major concourse amenity plazas.
2. **Predictive Forecasting Engine**: Projects crowd density and queue lengths 5 and 10 minutes into the future based on arrival rates, match timelines, and historical flow dynamics.
3. **Generative AI Recommendation Layer**: Analyzes telemetry evidence to generate transparent, actionable mitigation steps (e.g. rerouting 300 incoming fans to underutilized Gate C to save 14 minutes).
4. **Personalized Fan Copilot**: Delivers individual guidance directly to fans based on their ticket seat location, transit mode (Metro, Uber, Car, Bus), and journey phase (Entry, In-Seat, Halftime, Exit).

---

## 3. How the Solution Works

### Key Modules & Capabilities

#### A. Live Crowd Heatmap & Telemetry Dashboard (`/dashboard`)
* **Interactive SVG Heatmap**: Real-time visual density overlay across stadium stands and gates with Green (<50%), Yellow (50–80%), and Red (>80%) congestion zoning.
* **Predictive Horizon Selector**: Toggle between `NOW`, `+5MIN PREVIEW`, and `+10MIN PREVIEW` to preview future crowd shifts before they occur.
* **Live Inflow & Density Gauges**: Monitors stadium-wide attendance capacity percentage, peak sector density, and total entry rates per minute.

#### B. Generative AI Recommendation Engine (`/recommendations`)
* **Transparent LLM Reasoning**: Every AI recommendation includes an explicit explanation of **WHY** it was generated, citing source/target zone occupancies, throughput differentials, and projected time savings.
* **One-Click Mitigation Execution**: Operators can execute or dismiss rerouting strategies, recording total fan wait time saved.

#### C. Personalized Fan Copilot (`/copilot`)
* **Interactive Fan Context**: Fans configure their Ticket Section, Row, Seat #, Transit Mode (Metro Line 2, Uber, Car Park, Bus), and Match Phase.
* **Best Entry Gate Advisor**: Compares preferred entry gate with alternative gates based on real-time queues, saving up to 14+ minutes in entry delay.
* **Turn-By-Turn Seat Wayfinder**: Visual SVG indoor route map with illuminated waypoints and step-by-step guidance from gate to exact seat.
* **Lowest Queue Amenity Radar**: Monitors food plazas and restrooms with live and predicted wait times, providing optimal halftime timing advice.
* **Smart Staggered Exit Guidance**: Recommends transit-tailored departure windows and optimal exit gates to prevent post-match exit crushes.
* **Conversational AI Assistant (Copilot Chat)**: Context-aware interactive assistant powered by live stadium data that answers fan questions with transparent reasoning and metric badges.

#### D. Incident Triage & Operations Matrix (`/incidents`)
* **Real-time Incident Queue**: Track and manage crowd alerts, bottlenecks, and security dispatches across Table and Kanban views.

---

## 4. Assumptions Made

1. **Sensor & Gate Telemetry Infrastructure**: Assumes perimeter turnstiles, optical overhead people counters, or Wi-Fi density sensors feed real-time ingress/egress metrics into the data pipeline.
2. **Predictive Queue Dynamics**: Assumes spectator arrival rates follow queueing theory / Poisson arrival patterns influenced by public transit schedules (e.g. Metro arrivals every 6–8 minutes).
3. **Connectivity**: Assumes venue Wi-Fi or 5G Network Slicing is available for spectator mobile copilot access.
4. **Spectator Compliance & Behavior**: Assumes a significant percentage of spectators follow AI route recommendations when presented with transparent time-saved evidence (e.g. "Save 14 mins by taking Gate C").
5. **Stadium Layout**: Modeled after FIFA World Cup standard multi-ring stadium architecture (Lusail Iconic Stadium model: 80,000 capacity, 8 primary gates, 12 stand sectors, concourse food/restroom plazas).

---

## 5. Technical Stack

* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons
* **UI Components**: Radix UI Primitives, Next Themes (Dark Mode UI)
* **Smooth Inertial Scroll**: Lenis Scroll Engine
* **3D Visual Branding**: Three.js & React Three Fiber
* **Data & State Management**: React Context API (`CrowdContext`), TanStack React Query
* **Build Tool**: Vite v6

---

## 6. Installation & Quick Start Guide

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Step 1: Clone the Repository
```bash
git clone https://github.com/satyak99108/CrowdMind-AI---Live-Crowd-Control-Challenge-4-PromptWars-.git
cd CrowdMind-AI---Live-Crowd-Control-Challenge-4-PromptWars-
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```

### Step 4: Open Application
Navigate to `http://localhost:3000` (or `http://localhost:5173`) in your browser.

### Step 5: Production Build
```bash
npm run build
```
