"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Search, ChevronDown, Building2, Plus, Check } from "lucide-react";
import { useSelector } from "react-redux";

const BREADCRUMBS = {
  "/dashboard":          ["Dashboard"],
  "/businesses":         ["Business", "Businesses"],
  "/idea-flow":          ["Business", "Startup Ideas"],
  "/analytics":          ["Intelligence", "Analytics"],
  "/analytics/revenue":  ["Intelligence", "Analytics", "Revenue"],
  "/analytics/customers":["Intelligence", "Analytics", "Customers"],
  "/ai-doctor":          ["Intelligence", "AI Business Doctor"],
  "/actions":            ["Intelligence", "Next Best Actions"],
  "/predictions":        ["Intelligence", "Predictions"],
  "/risks":              ["Intelligence", "Risk Radar"],
  "/opportunities":      ["Intelligence", "Opportunity Radar"],
  "/simulator":          ["Intelligence", "Decision Simulator"],
  "/customers":          ["Customers", "Customers"],
  "/products":           ["Customers", "Products"],
  "/goals":              ["Strategy", "Goals"],
  "/market":             ["Strategy", "Market Intelligence"],
  "/investor-readiness": ["Strategy", "Investor Readiness"],
  "/reports":            ["Reporting", "Reports"],
  "/notifications":      ["Notifications"],
  "/profile":            ["Profile"],
  "/settings":           ["Settings"],
};

export default function TopBar() {
  const router   = useRouter();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const crumbs = BREADCRUMBS[pathname] || [pathname?.replace("/","") || "Dashboard"];

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="q-topbar">
      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <span style={{ color: "var(--q-text-4)", fontSize: "0.875rem" }}>/</span>}
            <span style={{
              fontSize: "0.875rem",
              fontWeight: i === crumbs.length - 1 ? 600 : 400,
              color: i === crumbs.length - 1 ? "var(--q-text-1)" : "var(--q-text-4)",
            }}>{c}</span>
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Search trigger */}
        <button
          onClick={() => { setShowSearch(true); setTimeout(() => searchRef.current?.focus(), 50); }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 12px", borderRadius: 8,
            border: "1px solid var(--q-border)", background: "var(--q-surface-2)",
            color: "var(--q-text-4)", cursor: "pointer", fontSize: "0.8125rem",
            fontFamily: "inherit",
          }}
        >
          <Search size={14} />
          <span>Search...</span>
          <span style={{
            fontSize: "0.6875rem", fontWeight: 600, color: "var(--q-text-4)",
            background: "var(--q-surface-3)", padding: "1px 5px", borderRadius: 4,
          }}>⌘K</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => router.push("/notifications")}
          style={{
            position: "relative", width: 36, height: 36, borderRadius: 8,
            border: "1px solid var(--q-border)", background: "var(--q-surface)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--q-text-3)",
          }}
        >
          <Bell size={17} />
          <span style={{
            position: "absolute", top: 4, right: 4,
            width: 8, height: 8, borderRadius: "50%",
            background: "#DC2626", border: "2px solid var(--q-surface)",
          }} />
        </button>

        {/* User menu */}
        <button
          onClick={() => router.push("/profile")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "4px 10px 4px 4px", borderRadius: 10,
            border: "1px solid var(--q-border)", background: "var(--q-surface)",
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg,#8B1A1A,#C0392B)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.8125rem", fontWeight: 700, color: "#fff",
          }}>I</div>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--q-text-1)" }}>Iqra</span>
          <ChevronDown size={13} style={{ color: "var(--q-text-4)" }} />
        </button>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000,
            display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 120,
          }}
          onClick={() => setShowSearch(false)}
        >
          <div
            style={{
              background: "var(--q-surface)", borderRadius: 16, width: 580, maxWidth: "90vw",
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)", border: "1px solid var(--q-border)", overflow: "hidden",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--q-border)" }}>
              <Search size={18} style={{ color: "var(--q-text-4)", flexShrink: 0 }} />
              <input
                ref={searchRef}
                placeholder="Search pages, features, actions..."
                style={{
                  flex: 1, border: "none", outline: "none", fontSize: "1rem",
                  color: "var(--q-text-1)", background: "transparent", fontFamily: "inherit",
                }}
              />
              <kbd style={{ fontSize: "0.75rem", color: "var(--q-text-4)", background: "var(--q-surface-2)", padding: "2px 6px", borderRadius: 4 }}>Esc</kbd>
            </div>
            <div style={{ padding: "8px 0" }}>
              {[
                { label: "Dashboard", icon: "🏠", path: "/dashboard" },
                { label: "AI Business Doctor", icon: "🤖", path: "/ai-doctor" },
                { label: "Analytics", icon: "📊", path: "/analytics" },
                { label: "Risk Radar", icon: "⚠️", path: "/risks" },
                { label: "Decision Simulator", icon: "🔀", path: "/simulator" },
                { label: "Reports", icon: "📄", path: "/reports" },
              ].map(item => (
                <button
                  key={item.path}
                  onClick={() => { router.push(item.path); setShowSearch(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 18px", border: "none", background: "none",
                    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--q-surface-2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                  <span style={{ fontSize: "0.9375rem", color: "var(--q-text-1)" }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
