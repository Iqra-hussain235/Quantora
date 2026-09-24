"use client";

import { useRouter, usePathname } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import {
  LayoutDashboard, Zap, Building2, BarChart3, Bot, Target,
  TrendingUp, AlertTriangle, Lightbulb, Shuffle, Eye,
  Users, Package, Flag, Globe, FileText, Bell,
  User, Settings, LogOut, ChevronLeft, ChevronRight,
  ChevronDown, Plus, Sparkles,
} from "lucide-react";

const NAV = [
  { section: "MAIN",         items: [
    { icon: LayoutDashboard, label: "Dashboard",          path: "/dashboard" },
  ]},
  { section: "BUSINESS",     items: [
    { icon: Building2,       label: "Businesses",         path: "/businesses" },
    { icon: Zap,             label: "Startup Ideas",      path: "/idea-flow" },
  ]},
  { section: "INTELLIGENCE", items: [
    { icon: BarChart3,       label: "Analytics",          path: "/analytics" },
    { icon: Bot,             label: "AI Business Doctor", path: "/ai-doctor",   badge: "AI" },
    { icon: Target,          label: "Next Best Actions",  path: "/actions" },
    { icon: TrendingUp,      label: "Predictions",        path: "/predictions" },
    { icon: AlertTriangle,   label: "Risk Radar",         path: "/risks" },
    { icon: Lightbulb,       label: "Opportunity Radar",  path: "/opportunities" },
    { icon: Shuffle,         label: "Decision Simulator", path: "/simulator" },
  ]},
  { section: "CUSTOMERS",    items: [
    { icon: Users,           label: "Customers",          path: "/customers" },
    { icon: Package,         label: "Products",           path: "/products" },
  ]},
  { section: "STRATEGY",     items: [
    { icon: Flag,            label: "Goals",              path: "/goals" },
    { icon: Globe,           label: "Market Intelligence",path: "/market" },
    { icon: Eye,             label: "Investor Readiness", path: "/investor-readiness" },
  ]},
  { section: "REPORTING",    items: [
    { icon: FileText,        label: "Reports",            path: "/reports" },
  ]},
];

const BOTTOM_NAV = [
  { icon: Bell,     label: "Notifications", path: "/notifications", badge: 0 },
  { icon: User,     label: "Profile",       path: "/profile" },
  { icon: Settings, label: "Settings",      path: "/settings" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { selected, isDemo, businesses, selectBusiness, enterDemoMode, exitDemoMode } = useBusiness();

  const go = (path) => router.push(path);
  const isActive = (path) => pathname === path || (path !== "/dashboard" && pathname?.startsWith(path));

  // Resolve business display name — never hardcode
  const displayName = isDemo
    ? "NovaMart (Demo)"
    : selected?.businessName || selected?.name || "No business selected";

  const displayInitial = (isDemo ? "N" : (displayName[0] || "?")).toUpperCase();
  const bgColor = isDemo ? "linear-gradient(135deg,#1e40af,#7c3aed)" : "linear-gradient(135deg,#8B1A1A,#C0392B)";

  const clearAllTokens = () => {
    ["token","accessToken","refreshToken"].forEach(k => localStorage.removeItem(k));
    ["q_mode","q_selected_business"].forEach(k => localStorage.removeItem(k));
    ["token","accessToken","refreshToken"].forEach(k => {
      document.cookie = `${k}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    });
  };

  return (
    <aside
      className="q-sidebar"
      style={{ width: isOpen ? "var(--q-sidebar-w)" : "var(--q-sidebar-w-col)" }}
    >
      {/* Logo + Toggle */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: isOpen ? "space-between" : "center",
        padding: isOpen ? "0 14px 0 16px" : "0",
        height: "var(--q-topbar-h)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        {isOpen && (
          <button onClick={() => go("/dashboard")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#8B1A1A,#C0392B)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>Quantora</span>
          </button>
        )}
        <button onClick={() => setIsOpen(!isOpen)} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Business selector */}
      {isOpen && (
        <div style={{ padding: "12px 12px 0" }}>
          <button
            onClick={() => go("/businesses")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", cursor: "pointer", fontSize: "0.8125rem", fontWeight: 500, fontFamily: "inherit" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span style={{ width: 20, height: 20, borderRadius: 4, background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                {displayInitial}
              </span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{displayName}</span>
            </span>
            <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
          </button>
          {isDemo && (
            <div style={{ marginTop: 6, padding: "4px 10px", background: "rgba(37,99,235,0.2)", borderRadius: 6, textAlign: "center" }}>
              <span style={{ fontSize: "0.7rem", color: "#60a5fa", fontWeight: 600 }}>🎮 DEMO MODE</span>
            </div>
          )}
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 8px 0" }}>
        {NAV.map(({ section, items }) => (
          <div key={section}>
            {isOpen && <div className="q-nav-section-label">{section}</div>}
            {items.map(({ icon: Icon, label, path, badge }) => {
              const active = isActive(path);
              return (
                <button key={path} onClick={() => go(path)}
                  className={`q-nav-item${active ? " active" : ""}`}
                  title={!isOpen ? label : undefined}
                  style={{ justifyContent: isOpen ? "flex-start" : "center", marginBottom: 2 }}>
                  <Icon size={17} style={{ flexShrink: 0 }} />
                  {isOpen && (
                    <>
                      <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                      {badge === "AI" && (
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, background: "#8B1A1A", color: "#fff", padding: "1px 5px", borderRadius: 4 }}>AI</span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom nav */}
      <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        {BOTTOM_NAV.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <button key={path} onClick={() => go(path)}
              className={`q-nav-item${active ? " active" : ""}`}
              title={!isOpen ? label : undefined}
              style={{ justifyContent: isOpen ? "flex-start" : "center", marginBottom: 2 }}>
              <Icon size={17} style={{ flexShrink: 0 }} />
              {isOpen && <span style={{ flex: 1, textAlign: "left" }}>{label}</span>}
            </button>
          );
        })}

        {/* Logout */}
        <button
          onClick={() => { clearAllTokens(); router.push("/login"); }}
          className="q-nav-item"
          title={!isOpen ? "Sign out" : undefined}
          style={{ justifyContent: isOpen ? "flex-start" : "center", color: "rgba(220,38,38,0.7)", marginTop: 2 }}>
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {isOpen && <span>Sign out</span>}
        </button>

        {isOpen && (
          <div style={{ textAlign: "center", padding: "8px 0 2px", fontSize: "0.6875rem", color: "rgba(255,255,255,0.2)" }}>
            Quantora v1.0 · AI Powered
          </div>
        )}
      </div>
    </aside>
  );
}