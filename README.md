# Food Rescue Connect | Smart AI Zero-Waste Ecosystem

**RescueConnect** is an enterprise-grade, academic-ready **Food Rescue & Zero-Waste Ecosystem** designed to solve real-world food waste and logistical mismatch at scale. The platform connects canteens, corporate event caterers, and residential donors directly with verified local NGO shelters and orphanages through automated logistics, gamified incentive channels, and deep-learning safety check models.

---

## 🌟 Key Highlights & Advanced Features

1.  **Smart AI Quality Scanner:** Integrates image-based category estimators, freshness indices, and spoilage forecasts to block unsafe food donations.
2.  **Geolocation & Canvas Mapping:** Features a keyless, keyframe-animated Cartesian city grid on HTML Canvas, mapping couriers and rendering flowing pickup routes.
3.  **NGO console & Shortage Broadcaster:** Empowers shelters to declare real-time resource deficits and trigger hierarchical progressive ring notification escalations.
4.  **Volunteer Portal & Gamification:** Standard job boards combined with QR code verification handoffs, player level progressions, badge unlocks, and customizable Canvas-drawn Monthly Certificates.
5.  **Impact Dashboard:** Displays dynamic calculators for carbon savings, agricultural water conservation, and landfill weight diversions alongside responsive SVG charts.
6.  **Accessibility & Localization:** Full localization support (English, Hindi, Telugu) paired with contrast accessibility rules.

---

## 📂 Project Structure & Portfolios

The project is organized to provide clean structural separations suitable for high-grade academic reviews and interviews:

```
├── docs/                      # Comprehensive Academic Portfolios
│   ├── database_schema.sql    # Relational Postgres schema & PL/pgSQL triggers
│   ├── er_diagram.md          # Database constraints in Mermaid
│   ├── system_architecture.md  # Client-Gateway-Model topologies in Mermaid
│   ├── api_documentation.md   # OpenAPI endpoints spec sheet
│   ├── testing_documentation.md# Jest & Cypress validation templates
│   ├── deployment_guide.md    # Multi-stage Docker config files
│   ├── user_manual.md         # Operative step manuals for all actors
│   ├── project_report.md      # 3,000+ word thesis and environmental formulas
│   ├── ppt_presentation.md    # Technical slide script for presentation defense
│   ├── viva_qna.md            # Top 30 technical review questions & answers
│   └── resume_description.md  # Portfolios bullet points & technical keywords
│
├── src/                       # Client Application Source Code
│   ├── components/            # Dedicated modular visual elements
│   ├── index.css              # Custom styling definitions
│   ├── App.tsx                # Central logic hub & local storage DB layer
│   └── main.tsx               # Application entry point
│
├── Dockerfile                 # Stage 1 building & Stage 2 static Nginx serving
├── nginx.conf                 # Production Nginx reverse-routing config
├── docker-compose.yml         # Integrated multi-container orchestration grid
└── package.json               # Modular dependencies definitions
```

---

## 🚀 Quick Start Guide

### Local Development
To launch the hot-reloading development server instantly:
```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Optimized Production Build
To compile lightweight, static assets served under Nginx:
```bash
# 1. Compile bundle
npm run build

# 2. Preview locally on server ports
npm run preview
```

### Complete Docker Orchestration
To spin up the multi-container stack (React Client, Express API, Postgres Database, Redis cache) concurrently:
```bash
docker-compose up --build
```
The React static client dashboard will bind and be accessible on port `80`.
