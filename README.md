# azentio.ai - Website & Intelligent Collaboration Portal
**Azentio Hackathon Build Requirements v1.0 • Complete End-to-End Delivery**

> **Tagline:** Build intelligence. Create shared value.  
> **Mission:** Public discovery. Employee innovation. Client collaboration. Governed collective learning that improves our offerings.

---

## 🌟 Executive Overview & Architectural Scope

This system implements the complete **azentio.ai** enterprise AI website and secure collaboration portal adhering strictly to the Hackathon Requirements specification (Sections 01 through 12):

1. **Public Discovery & Catalog:** Showcase of Azentio's applied AI products (`/products`), solutions (`/solutions`), architecture & technology (`/technology`), live broadcasts (`/live`), perspectives & whitepapers (`/insights`), about (`/about`), demo requests (`/connect`), and hackathon registration (`/hackathon/register`).
2. **Server-Side IAM-01 & IAM-02 RBAC:** Strict server-enforced access boundaries across 7 distinct personas. Authority is never derived from client-side cookies, localStorage flags, or unverified email suffixes.
3. **Client Portal & Workspaces:** Isolated multi-tenant environments (e.g. Apex Global Bank, Meridian Trust, Gulf Financial Corp). Client administrators can invite colleagues with single-use expiring links.
4. **Structured Observation Capture (Section 07 & 09):** Real-time automated sensitive data scanner (detecting PII, account numbers, and pricing), starting strictly as private drafts, with granular separate consents for storage, de-identified publishing, opt-in attribution, and model training.
5. **Governance & Moderation Workboard (Section 08):** Independent review queue for learning moderators. Side-by-side comparison of private tenant source versus de-identified public copy, evidence grading, redaction, clarification requests, and **synchronous withdrawal (0s SLA)**.
6. **Cohort Safeguard & Aggregated Themes (Section 10):** Enforces minimum $k \ge 3$ distinct contributing organisations. Suppresses breakdowns when $< 3$ institutions to prevent re-identification.
7. **Product Owner Improvement Loop Closure (Section 10):** Complete delivery of the illustrative end-to-end scenario (3 banks reporting seasonal SME cash-flow distortion &rarr; Seasonality Context theme &rarr; Product Owner initiates Seasonality-Aware Underwriting Model).
8. **AIRA (Azentio Intelligent Retrieval & Assistant):** AI-assisted synthesis engine that strictly honors IAM boundaries, cites verified de-identified contributions, and immediately purges withdrawn records.
9. **Advanced Track 11 (P2): Federated Model-Learning Simulator:** Genuine federated learning coordinator aggregating weight deltas from 3 isolated synthetic client datasets using FedAvg, differential privacy noise calibration ($\epsilon, \delta$), L2 gradient clipping ($C=1.5$), poisoning detection, dropout handling, holdout evaluation, and candidate model rollback.

---

## 👥 Interactive Persona Demo Switcher

The top evaluation bar enables 1-click switching between all 7 evaluated personas:

| Persona | Name | Role / Tenant | Primary Permitted Boundaries |
|---|---|---|---|
| **Public Visitor** | Anonymous | Public (`usr_pub_01`) | Public catalog, solutions, insights, registration, demo inquiries. Zero private data. |
| **Employee (PO)** | Priya Sharma | Azentio Internal (`usr_emp_priya`) | Internal Playground, PO improvement ideas loop, knowledge library. |
| **Learning Moderator** | Aisha Al-Mansoor | Azentio Governance (`usr_emp_aisha`) | Review queue, redactions, publication, clarification requester. |
| **Content Publisher** | Marcus Vance | Azentio Marketing (`usr_emp_marcus`) | CMS banners, video broadcast audience configuration. |
| **Client Member** | David Chen | Apex Global Bank (`usr_client_apex_david`) | Tenant workspace, entitled sandboxes, observation authoring, shared hub. |
| **Client Admin** | Sarah Jenkins | Apex Global Bank (`usr_client_apex_sarah`) | Member management, single-use invite generation. Cannot elevate to platform admin. |
| **Portal Administrator** | Kiran Rao | Platform Engineering (`usr_admin_kiran`) | System audit logs, organization config, federated learning coordinator. |

*(Also preloaded: Tariq Al-Sayed from Meridian Trust and Fatima Zahra from Gulf Financial to test multi-organisation collective learning).*

---

## 🚀 Running the Application

### 1. Verification Test Suite (31 Automated Acceptance Tests)
To run the automated verification test suite:
```bash
node test-suite.js
```

### 2. Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Start
```bash
npm run build
npm start
```

---

## 🧪 Acceptance Test Walkthrough (Section 10 Featured Scenario)

1. **View Preloaded Scenario:**
   - On the homepage or at `/portal/learning`, view the aggregated theme: **"Seasonality Context in SME Cash Flow & Working Capital Evaluation"**.
   - Notice that the theme verifies $3$ distinct contributing institutions (Apex Global Bank, Meridian Trust, Gulf Financial Corp) and displays the compliance badge.
   - Click into the theme to view the linked de-identified citations: `OBS-SEASONALITY-01`, `OBS-SEASONALITY-02`, and `OBS-SEASONALITY-03`.
2. **Product Owner Loop Closure:**
   - Switch to **Priya Sharma (Product Owner)** using the top demo bar.
   - Navigate to `/portal/employee/ideas`.
   - Inspect the linked Improvement Idea: *"Financial Analysis Intelligence: Add Seasonality-Aware Working Capital Comparison Model"*.
   - Update its status or view the client-safe public summary that closes the loop without exposing private client tickets.
3. **Test Entitled Sandbox & Comparison:**
   - Switch to **David Chen (Apex Global Bank)**.
   - Navigate to `/portal/client/sandbox`.
   - Run the simulator to see the side-by-side comparison between the *Baseline Static Model v1.0* (which falsely rejects the seasonal SME) versus the *Seasonality-Aware Model v1.2* (which approves with a seasonal covenant).
4. **Test Synchronous Withdrawal (0s SLA):**
   - In `/portal/client/observations`, click **"Synchronous Withdraw (0s)"** on an observation.
   - Open AIRA Copilot (bottom right) and query *"What collective learning exists for SME cash flow seasonality?"*.
   - Notice that the observation is instantly purged from active search and AIRA retrieval.
5. **Test Advanced Track 11 Federated Learning Simulator:**
   - Switch to **Kiran Rao (Portal Administrator)**.
   - Navigate to `/portal/federated`.
   - Toggle **"Dropout Scenario"** or **"Poisoning Attack Check"** and click **"Execute Federated Round"**.
   - Inspect the FedAvg aggregation, L2 clipping at $C=1.5$, differential privacy accounting ($\epsilon, \delta$), holdout metric gains (+12.9%), and candidate model rollback.
