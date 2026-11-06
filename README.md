# Aggarwal Agencies — B2B Wholesale Web Platform

[![Test & Deploy to GitHub Pages](https://github.com/RaghavMoudgil/aggarwal-agencies/actions/workflows/test-and-deploy.yml/badge.svg)](https://github.com/RaghavMoudgil/aggarwal-agencies/actions/workflows/test-and-deploy.yml)
[![Tests Passing](https://img.shields.io/badge/tests-38%20passed-10b981.svg)](https://raghavmoudgil.github.io/aggarwal-agencies/tests/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-3b82f6.svg)](https://nodejs.org/)
[![Live Demo](https://img.shields.io/badge/live%20demo-online-059669.svg)](https://raghavmoudgil.github.io/aggarwal-agencies/)
[![License: MIT](https://img.shields.io/badge/license-MIT-64748b.svg)](LICENSE)

A high-performance, responsive B2B digital flagship engineered for bulk toy distribution across India. Built with clean semantic HTML5, modern CSS3 custom properties, Vanilla ES6+ JavaScript, and GSAP 3 animation libraries with **zero framework overhead**.

🌐 **Production Website**: [https://raghavmoudgil.github.io/aggarwal-agencies/](https://raghavmoudgil.github.io/aggarwal-agencies/)  
🧪 **In-Browser Test Runner**: [https://raghavmoudgil.github.io/aggarwal-agencies/tests/](https://raghavmoudgil.github.io/aggarwal-agencies/tests/)

---

## 🛠️ Architecture & Tech Stack

- **Core Frontend**: Semantic HTML5, CSS3 Custom Properties (Design System), Vanilla ES6+ JavaScript.
- **Animation Engine**: [GSAP 3](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/) for hardware-accelerated entrances and micro-interactions.
- **Business Logic Engine**: Universal UMD module (`js/calculator.js`) running boundary calculations, margin estimations, and deep WhatsApp RFQ links across browser and Node.js test environments.
- **Testing Framework**: Native Node.js Test Runner (`node:test` + `node:assert/strict`) — zero third-party testing dependencies.
- **CI/CD & Deployment**: GitHub Actions automated pipeline targeting Node.js 22 LTS with automated deployment to GitHub Pages.
- **Local Dev Server**: Zero-dependency Node.js HTTP server (`server.js`).

---

## 🚀 Key Engineering Highlights

### 1. Dual-Environment Business Engine (`js/calculator.js`)
Exposes `AggarwalLogic` as a UMD module, sharing pure calculation functions between browser runtime and Node.js testing harness:
- **Wholesale Tier Slicing**: Calculates discounts, retailer profit margins, and freight dispatch SLAs based on bulk volume tiers (`<200`, `200-499`, `500-999`, `≥1000`).
- **RFQ URL Construction**: Generates sanitised, encoded `wa.me` deep links formatting multi-line procurement requests.
- **Form Validator**: Client-side validation enforcing Indian mobile numbers (`+91`, `0` prefixes, 10-digit formats).

### 2. Category Filter & Anti-Regression Layout
- Real-time client-side category filtering using `data-category` and `data-filter` bindings.
- Protected by `.category-card.is-hidden { display: none !important; }` to eliminate layout thrashing and prevent stylesheet specificity overrides.

### 3. Native Dark / Light Theme System
- CSS variable token architecture mapping surfaces (`--bg-main`, `--bg-card`, `--bg-surface`), typography (`--text-main`, `--text-muted`), and accents.
- Flash-free theme initialization evaluating `localStorage` preferences with fallback to `prefers-color-scheme`.

### 4. Fully Responsive Navigation & Drawers
- Mobile navigation transition breakpoint at `992px` preventing horizontal overflows on tablets and split screens.
- Hamburger animation morphing into a close icon (`✕`) with outside-click and route-click auto-dismissal.

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── test-and-deploy.yml       # GitHub Actions CI/CD test & deploy workflow
├── images/
│   └── owner.jpg                     # Optimized leadership portrait asset
├── js/
│   └── calculator.js                 # Universal UMD business & tier calculation module
├── tests/
│   ├── integration/
│   │   └── site-integrity.test.js    # Semantic DOM, contact data & asset verification
│   ├── unit/
│   │   ├── calculator.test.js        # Wholesale tier & form validator unit tests
│   │   └── css-integrity.test.js     # Regression protection & responsive query tests
│   ├── index.html                    # Client-side visual test suite runner UI
│   └── run-all.js                    # Cross-platform CLI test runner script
├── index.html                        # Semantic HTML5 landing structure
├── styles.css                        # CSS design tokens, utility classes & media queries
├── main.js                           # UI controllers, GSAP bindings & DOM interactions
├── server.js                         # Zero-dependency local development HTTP server
├── package.json                      # Project metadata and test scripts
├── netlify.toml                      # Netlify configuration & security headers
├── vercel.json                       # Vercel static routing configuration
├── robots.txt                        # Search engine crawler directives
└── README.md                         # Developer documentation
```

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v20.0.0 or higher
- Git

### Setup & Run
1. **Clone the repository:**
   ```bash
   git clone https://github.com/RaghavMoudgil/aggarwal-agencies.git
   cd aggarwal-agencies
   ```

2. **Start the local development server:**
   ```bash
   npm start
   ```
   *Or with node directly:*
   ```bash
   node server.js
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## 🧪 Automated Testing

The project includes an automated test suite with **38 test cases across 16 test suites** verifying business logic, DOM integrity, asset availability, and CSS layout regression guards.

### Run Tests via CLI
```bash
npm test
```

### Test Coverage Highlights
- **Business Logic Unit Tests**: Boundary calculations (199 vs 200, 499 vs 500, 999 vs 1000 units), invalid/NaN/zero fallbacks, WhatsApp link encoding, 10-digit phone verification.
- **Site Integrity Integration Tests**: Validates confirmed business information (shop name, owner name, address, phone number, Google Maps location), verifies strict `XXXXXX` placeholder rule, tests for broken anchor links (`#about`, `#categories`, etc.), and verifies that all images have non-empty `alt` attributes.
- **CSS Anti-Regression Tests**: Ensures `.mobile-cta-row` remains hidden by default on desktop, enforces `white-space: nowrap` on `.nav-link`, and confirms responsive breakpoints (`992px`, `768px`, `480px`).

### In-Browser Test Suite
Open the interactive test dashboard locally or on production:
- Local: `http://localhost:3000/tests/`
- Production: [https://raghavmoudgil.github.io/aggarwal-agencies/tests/](https://raghavmoudgil.github.io/aggarwal-agencies/tests/)

---

## 🔄 CI/CD Pipeline

The project uses a GitHub Actions workflow (`.github/workflows/test-and-deploy.yml`) configured with:
1. **Test Stage**: Checks out repository on `ubuntu-latest`, provisions Node.js 22 LTS, and executes `npm test`.
2. **Deploy Stage**: Runs upon successful test completion on the `main` branch, bundles the static assets, and deploys directly to GitHub Pages with HTTPS.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
