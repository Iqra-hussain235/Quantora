# Quantora — Complete SaaS Build Plan

## Background

This is an existing Next.js (frontend) + Express/PostgreSQL (backend) project already branded as **Quantora**. A solid foundation exists with a design system, sidebar, dashboard, AI Doctor, analytics, simulator, risks, and reports pages. The goal is to **complete** the platform to spec — filling in missing pages, improving existing ones, adding key missing pages, and wiring up real backend APIs for the most critical flows.

## What Already Exists (Reuse As-Is)

| Area | Status |
|------|--------|
| Design system (`globals.css`) | ✅ Complete — premium design tokens, components |
| Sidebar | ✅ Complete — all nav links, collapsible |
| TopBar | ✅ Exists |
| Layout shell | ✅ Auth-guard routing, sidebar+topbar shell |
| Dashboard | ✅ Solid — KPIs, Health Score, Alerts, Actions, Charts |
| AI Doctor | ✅ Solid — chat UI, structured responses |
| Analytics | ✅ Partial — needs tabs for Revenue/Customers/Products filled |
| Simulator | ✅ Exists — needs result display improvement |
| Risks | ✅ Exists |
| Reports | ✅ Exists |
| Auth backend | ✅ Register/Login/JWT working |
| User model | ✅ PostgreSQL via Sequelize |

## What Needs to Be Built / Significantly Improved

### Frontend Pages (Missing or Stub)
1. **Login page** — Complete premium 2-panel design (check existing)
2. **Signup page** — Complete premium design
3. **Onboarding flow** — What do you want to accomplish? (missing)
4. **Customers page** (`/customers`) — missing
5. **Products page** (`/products`) — missing  
6. **Goals page** (`/goals`) — stub exists, needs full content
7. **Opportunities page** (`/opportunities`) — stub exists
8. **Predictions page** (`/predictions`) — stub exists
9. **Actions/Next Best Actions page** (`/actions`) — stub exists
10. **Market Intelligence page** (`/market`) — missing
11. **Investor Readiness page** (`/investor-readiness`) — missing
12. **Notifications page** (`/notifications`) — stub exists
13. **Profile page** (`/profile`) — missing
14. **Settings page** (`/settings`) — stub exists, needs tabs
15. **Business Upload page** (`/business-upload`) — exists, needs improvement
16. **Idea Flow pages** (`/ideas`) — exists, needs improvement
17. **Businesses page** (`/businesses`) — stub exists

### Backend APIs (New/Missing)
1. **Products API** — `/api/businesses/:id/products`
2. **Customers API** — `/api/businesses/:id/customers`  
3. **Goals API** — `/api/businesses/:id/goals`
4. **Risks API** — `/api/businesses/:id/risks`
5. **Opportunities API** — `/api/businesses/:id/opportunities`
6. **Predictions API** — `/api/businesses/:id/predictions`
7. **Actions API** — `/api/businesses/:id/actions`
8. **Notifications API** — `/api/notifications`
9. **Profile/Settings API** — `/api/users/me`

### Backend Models (New)
- `products` table
- `customers` table
- `goals` table
- `risks` table
- `opportunities` table
- `predictions` table  
- `actions` (next_best_actions) table
- `notifications` table

---

## Proposed Changes

### Phase 1 — Missing Critical Pages (Frontend)

#### [MODIFY] Login page — Premium 2-panel SaaS design
#### [MODIFY] Signup page — Premium design with validation
#### [NEW] Onboarding page — `/onboarding`
#### [NEW] Customers page — `/customers`
#### [NEW] Products page — `/products`
#### [MODIFY] Goals page — Full goal tracking
#### [MODIFY] Opportunities page — Opportunity cards with evidence
#### [MODIFY] Predictions page — Revenue/churn/customer forecasts
#### [MODIFY] Actions page — Ranked recommendations table
#### [NEW] Market Intelligence — `/market`
#### [NEW] Investor Readiness — `/investor-readiness`
#### [MODIFY] Notifications page — Categorized notifications
#### [NEW] Profile page — `/profile`
#### [MODIFY] Settings page — Full tabbed settings

### Phase 2 — Backend APIs

#### [NEW] Products model + controller + routes
#### [NEW] Customers model + controller + routes
#### [NEW] Goals model + controller + routes
#### [NEW] Risks model (seed data)
#### [NEW] Opportunities model (seed data)
#### [NEW] Predictions model (seed data)
#### [NEW] Actions/NBA model + controller + routes
#### [NEW] Notifications model + routes

### Phase 3 — Polish & Data

#### Improve existing Analytics tabs (Revenue, Customers, Products sub-tabs)
#### Improve Simulator with better result visualization
#### Add realistic seed data (demo business "NovaMart")
#### Add missing pages to sidebar routes

---

## Open Questions

> [!IMPORTANT]
> **Database Schema Extension**: The existing Sequelize models use PostgreSQL. I'll add new tables (products, customers, goals, etc.) using the same Sequelize pattern. These will auto-sync via Sequelize's `sync({ alter: true })`. **Confirm**: Is the PostgreSQL database running locally and accessible?

> [!NOTE]
> **AI Integration (Groq)**: The Groq API key appears commented out in `.env`. For the AI Doctor, I'll keep the existing sophisticated mock/demo approach that already works well. Real API integration can be done once the key is available.

> [!NOTE]
> **Data Scope**: Since you mentioned "use the table which I gave you" — I'll build a comprehensive data schema that supports CSV uploads mapped to the existing column types (Customer ID, Order Date, Product, Category, Quantity, Revenue, Cost, Marketing Spend, Region) as specified.

---

## Verification Plan

### Automated
- Start both dev servers and confirm no compilation errors
- Navigate all routes and verify no blank pages

### Manual Verification  
- Login → Dashboard → all sidebar links work
- Customers, Products, Goals, Profile, Settings load correctly
- AI Doctor chat responds with structured answers
- Simulator shows before/after comparison

---

## Build Order

1. **New frontend pages** (customers, products, profile, market, investor-readiness, onboarding)
2. **Improve existing pages** (goals, opportunities, predictions, actions, notifications, settings)
3. **New backend models** (products, customers, goals, actions, notifications)
4. **New backend routes** (wire up to frontend)
5. **Seed data** (realistic NovaMart demo data)
6. **Polish** (empty states, loading states, analytics sub-tabs)
