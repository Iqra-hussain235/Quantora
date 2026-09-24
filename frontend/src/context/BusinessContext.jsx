"use client";
/**
 * BusinessContext
 * ---------------
 * Single source of truth for the currently-selected business.
 * Every page reads from here instead of hardcoding "NovaMart".
 *
 * MODE:
 *   "demo"  → NovaMart demo data (only when user explicitly chose "Explore Demo")
 *   "real"  → live data fetched from backend for the selected business
 *   null    → no business selected yet (show onboarding / empty states)
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "@/config/api";

const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [mode, setMode]             = useState(null);   // "demo" | "real" | null
  const [businesses, setBusinesses] = useState([]);     // list of user's businesses
  const [selected, setSelected]     = useState(null);   // selected business object
  const [metrics, setMetrics]       = useState(null);   // fetched KPI data
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // ── Fetch metrics for the selected business ───────────────────────────────────
  const fetchMetrics = useCallback(async (businessId) => {
    if (!businessId || mode === "demo") return;
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/businesses/${businessId}/metrics`);
      const data = res.data?.data || res.data || null;
      setMetrics(data);
    } catch (e) {
      // 404 or no data → set minimal metrics so dashboard shows business info
      // (instead of collapsing to "no business selected" state)
      setMetrics({ _empty: true });
    } finally {
      setLoading(false);
    }
  }, [mode]);

  // ── Fetch user's businesses from backend ─────────────────────────────────────
  const fetchBusinesses = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (!token) return;
      setLoading(true);
      const res = await API.get("/businesses");
      const list = res.data?.data || res.data?.businesses || res.data || [];
      const arr = Array.isArray(list) ? list : [];
      setBusinesses(arr);

      // Auto-select the first business if nothing is selected yet
      if (arr.length > 0 && mode !== "demo") {
        const savedBiz = localStorage.getItem("q_selected_business");
        let bizToSelect = arr[0];
        if (savedBiz) {
          try {
            const parsed = JSON.parse(savedBiz);
            const found = arr.find((b) => b.id === parsed.id);
            if (found) bizToSelect = found;
          } catch (_) {}
        }
        setSelected(bizToSelect);
        setMode("real");
      }
    } catch (e) {
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  // ── Re-read from localStorage on mount ───────────────────────────────────────
  useEffect(() => {
    const savedMode = localStorage.getItem("q_mode");
    if (savedMode === "demo") {
      setMode("demo");
      setSelected(NOVAMART_DEMO);
      setMetrics(NOVAMART_METRICS);
    } else {
      fetchBusinesses();
    }
  }, []);

  // ── Fetch metrics whenever selected business changes ─────────────────────────
  useEffect(() => {
    if (selected?.id && mode === "real") {
      fetchMetrics(selected.id);
    }
    if (selected) {
      localStorage.setItem("q_selected_business", JSON.stringify(selected));
    }
  }, [selected?.id, mode]);

  const enterDemoMode = () => {
    localStorage.setItem("q_mode", "demo");
    setMode("demo");
    setSelected(NOVAMART_DEMO);
    setMetrics(NOVAMART_METRICS);
  };

  const exitDemoMode = () => {
    localStorage.removeItem("q_mode");
    localStorage.removeItem("q_selected_business");
    setMode(null);
    setSelected(null);
    setMetrics(null);
    fetchBusinesses();
  };

  const selectBusiness = (biz) => {
    setSelected(biz);
    setMode("real");
    setMetrics(null);
  };

  const addBusiness = (biz) => {
    setBusinesses((prev) => [biz, ...prev]);
    selectBusiness(biz);
  };

  // Call this after uploading a file to refresh metrics
  const refreshMetrics = useCallback(() => {
    if (selected?.id && mode === "real") {
      fetchMetrics(selected.id);
    }
  }, [selected?.id, mode, fetchMetrics]);

  const isDemo = mode === "demo";
  const businessName = isDemo
    ? "NovaMart (Demo)"
    : selected?.businessName || selected?.name || null;

  // hasData: true if we have actual numeric metrics (not just the _empty placeholder)
  const hasData = isDemo
    ? true
    : metrics !== null && !metrics?._empty &&
      (metrics?.revenue != null || metrics?.customers != null || metrics?.healthScore != null);

  return (
    <BusinessContext.Provider value={{
      mode, isDemo, businesses, selected, metrics,
      loading, error, businessName, hasData,
      enterDemoMode, exitDemoMode, selectBusiness, addBusiness,
      fetchBusinesses, fetchMetrics, refreshMetrics,
    }}>
      {children}
    </BusinessContext.Provider>
  );
}

export const useBusiness = () => {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used inside BusinessProvider");
  return ctx;
};


// ── NovaMart demo snapshot (ONLY used in demo mode) ─────────────────────────
export const NOVAMART_DEMO = {
  id: "demo",
  businessName: "NovaMart (Demo)",
  industry: "E-commerce",
  type: "B2C",
  country: "India",
  size: "11–50 people",
};

export const NOVAMART_METRICS = {
  revenue:      1240000,
  revenueLabel: "₹12.4L",
  revenueDelta: "+14.2%",
  profit:       320000,
  profitLabel:  "₹3.2L",
  profitDelta:  "+9.4%",
  customers:    8420,
  customersDelta:"+6.8%",
  churnRate:    4.2,
  healthScore:  82,
  revenueChart: [
    { month: "Apr", revenue: 820, profit: 210 },
    { month: "May", revenue: 940, profit: 250 },
    { month: "Jun", revenue: 890, profit: 230 },
    { month: "Jul", revenue: 1050, profit: 280 },
    { month: "Aug", revenue: 1180, profit: 310 },
    { month: "Sep", revenue: 1240, profit: 320 },
  ],
  customerChart: [
    { month: "Apr", new: 340, returning: 510, churned: 42 },
    { month: "May", new: 380, returning: 560, churned: 38 },
    { month: "Jun", new: 310, returning: 590, churned: 51 },
    { month: "Jul", new: 420, returning: 610, churned: 35 },
    { month: "Aug", new: 460, returning: 650, churned: 44 },
    { month: "Sep", new: 480, returning: 630, churned: 49 },
  ],
  alerts: [
    { id: 1, severity: "high",   title: "Revenue Declined Last 2 Weeks", body: "Revenue decreased 8.4% in the last 14 days.", impact: "High" },
    { id: 2, severity: "medium", title: "Marketing ROI Falling",          body: "ROAS declined from 4.2x to 3.1x.",              impact: "Medium" },
    { id: 3, severity: "high",   title: "High-Value Customers At Risk",   body: "43 customers show declining activity.",         impact: "High" },
  ],
};
