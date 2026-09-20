# UrbanEye — Sahasrāksha (सहस्राक्ष)
### AI-Powered Mobile Urban Intelligence Platform

> **Smart India Hackathon 2026** | PS ID: 26124 | Organization: Bharat Electronics Limited (BEL)  
> **Team**: CodeXcle (ID: 130979) | **Live Demo**: [urban-eye-beryl.vercel.app](https://urban-eye-beryl.vercel.app)  
> **GitHub**: [sonalideshmukh102006-cmyk/UrbanEye](https://github.com/sonalideshmukh102006-cmyk/UrbanEye)

---

## Overview

UrbanEye transforms the existing public transport bus fleet into a city-wide AI sensing network. Buses detect road defects, traffic events, and vehicle violations at the edge, sending only verified, geotagged JSON alerts to a central intelligence dashboard — eliminating the need for expensive fixed CCTV infrastructure.

---

## Central Platform — Feature Validation

The table below validates each feature claimed in the **SIH Presentation (SIH PS 1 Final.pdf)** against what is **actually implemented** in the codebase. Edge hardware features are excluded from this validation (not yet set up).

| # | Feature (PDF Claim) | Slide | Code Implementation | Status |
|---|---|---|---|:---:|
| 1 | **GIS Map with live fleet, layer toggles, search & recenter** | Slide 2, 5 | `MapArea.tsx` — MapLibre GL map with 8 independently toggleable layers (Fleet, Defects, Pedestrian Safety, Bottlenecks, Vehicle Density, Violations, Crowd Density, Infrastructure) | ✅ Done |
| 2 | **Traffic corridor density & bottleneck identification** | Slide 2, 4 | `SidebarLeft.tsx` — Corridor cards with density %, status (Gridlock/Slow/Moving), delay in minutes, source bus ID, color-coded progress bars | ✅ Done |
| 3 | **Live traffic bottleneck markers on map** | Slide 2 | `MapArea.tsx` — Critical corridors (density > 85%) render animated pulsing red circles on the map with hover tooltips showing delay | ✅ Done |
| 4 | **Origin-Destination (O-D) traffic pattern analysis** | Slide 2 | `ODAnalysisModal.tsx` + `MOCK_OD_FLOWS` — Full O-D matrix modal showing top demand corridors, volume (Veh/Hr), and trend (increasing/stable/decreasing) | ✅ Done |
| 5 | **Crowd density heatmap & pedestrian hotspots** | Slide 2, 5 | `SidebarLeft.tsx` + `MapArea.tsx` — Crowd hotspot cards with density %, estimated count, source bus; MapLibre circle heatmap layer | ✅ Done |
| 6 | **Road defect detection — Potholes & Waterlogging** | Slide 2, 3 | `SidebarRight.tsx` — Defect Radar panel with clickable Pothole and Waterlogging categories, navigating to full `DefectList.tsx` page with per-incident detail | ✅ Done |
| 7 | **Infrastructure defects — Missing Signs, Zebra Crossings, Broken Dividers** | Slide 2, 3 | `SidebarRight.tsx` — Infrastructure Defects section with Missing Zebra Crossing, Missing Sign, Broken Divider categories; dedicated `DefectList.tsx` page | ✅ Done |
| 8 | **ANPR hit-and-run & rash driving — plate, GPS, timestamp, evidence image** | Slide 2, 4 | `VehicleEmergencyAlertsPanel.tsx` + `TopNavModals.tsx` — Full violation panel with plate numbers (`MH 12 L 1934`), GPS, timestamp, cropped evidence image | ✅ Done |
| 9 | **Vulnerable pedestrian safety (school children crossing)** | Slide 2 | `MapArea.tsx` — `VulnerablePedestrian` event type renders an amber pulsing ping animation on the map; dedicated layer toggle | ✅ Done |
| 10 | **Stale data freshness warning (>30 min, no bus update)** | Slide 4 | `SidebarLeft.tsx` — Corridor card shows a yellow warning banner when `lastUpdatedMinutesAgo >= 30` ("No bus has passed this location in the last 30 minutes") | ✅ Done |
| 11 | **Incident evidence modal (image, crop, severity, assignee, status)** | Slide 2 | `IncidentModal.tsx` — Full detail modal with evidence image, cropped detection, severity badge, assignee, location, status update, multi-bus verification confidence | ✅ Done |
| 12 | **All Reports page with filters and export** | Slide 5 | `AllReports.tsx` — Filterable incident report table by type and severity | ✅ Done |
| 13 | **Lightweight JSON events instead of HD video (bandwidth compression)** | Slide 2, 4 | `server/main.py` — Ingest endpoint accepts ~2KB structured JSON payloads + targeted `croppedImageUrl`; no video stream | ✅ Done |
| 14 | **Idempotent ingest — exactly-once processing for dead-zone reconnects** | Slide 4 | `server/main.py` — UUID registry deduplicate incoming requests; duplicate payloads return `status: ignored, reason: duplicate_uuid` | ✅ Done |
| 15 | **Live WebSocket broadcast to central dashboard** | Slide 3 | `server/main.py` `/ws/telemetry` endpoint + `src/services/websocket.ts` client with auto-reconnect | ✅ Done |
| 16 | **Live connection indicator & real-time alert counters in navbar** | Slide 5 | `TopNav.tsx` — Pulsing `Live Edge Connected` badge + dynamic `criticalAlerts` counter updating without page reload | ✅ Done |
| 17 | **Fleet heatmaps & route delay estimation** | Slide 2 | `TopNavModals.tsx` — Fleet modal with per-bus route, delay, status; route delay rollup in corridor cards | ✅ Done |
| 18 | **Action Center for operator task management** | Slide 5 | `ActionCenter.tsx` — Task management panel for assigning and tracking incident responses | ✅ Done |

---

## Tech Stack — Central Platform

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Maps | MapLibre GL + react-map-gl |
| State Management | Zustand |
| Routing | React Router DOM v7 |
| Charts | Recharts |
| Backend (Ingest) | FastAPI + Uvicorn + WebSockets |
| Edge Simulator | Python 3.12 |

---

## Git Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production code, deployed to Vercel |
| `dynamic-testing` | FastAPI + edge simulator (merged into main) |

