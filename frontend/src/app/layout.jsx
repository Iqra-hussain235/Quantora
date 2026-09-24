"use client";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import SessionWrapper from "@/components/SessionWrapper";
import { useRouter, usePathname } from "next/navigation";
import Providers from "./providers";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/TopBar";

const AUTH_PAGES = ["/login", "/signup", "/onboarding", "/forgot-password", "/reset-password", "/verify-email"];
const PUBLIC_PAGES = ["/idea-flow", "/business-upload"];

export default function RootLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen,  setIsOpen]  = useState(true);

  const isAuthPage   = AUTH_PAGES.some(p => pathname === p || pathname?.startsWith(p + "/"));
  const isPublicPage = PUBLIC_PAGES.some(p => pathname?.startsWith(p));

  const clearAllTokens = () => {
    ["token","accessToken","refreshToken"].forEach(k => localStorage.removeItem(k));
    ["token","accessToken","refreshToken"].forEach(k => {
      document.cookie = `${k}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    });
  };

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token && !isAuthPage && !isPublicPage) {
      router.push("/login");
    }
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      const h = (ev) => { if (ev?.reason?.name === "AbortError") ev.preventDefault(); };
      window.addEventListener("unhandledrejection", h);
      return () => window.removeEventListener("unhandledrejection", h);
    }
  }, [pathname, router]);

  const sidebarW = isOpen ? "var(--q-sidebar-w)" : "var(--q-sidebar-w-col)";

  return (
    <html lang="en">
      <head>
        <title>Quantora — AI Business Decision Intelligence</title>
        <meta name="description" content="Turn business data into better decisions. Diagnose. Predict. Simulate. Decide. Grow." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <SessionWrapper>
        <body suppressHydrationWarning style={{ background: "var(--q-bg)", color: "var(--q-text-1)" }}>
          <Providers>
            {!mounted ? (
              <div style={{ minHeight: "100vh", background: "var(--q-bg)" }} />
            ) : isAuthPage ? (
              /* ── AUTH PAGES — no sidebar ── */
              <>{children}</>
            ) : (
              /* ── APP SHELL ── */
              <div style={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                <div style={{
                  marginLeft: sidebarW,
                  flex: 1,
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  transition: "margin-left 300ms cubic-bezier(0.4,0,0.2,1)",
                  background: "var(--q-bg)",
                }}>
                  <TopBar />
                  <main style={{ flex: 1, overflowY: "auto" }}>
                    {children}
                  </main>
                </div>
              </div>
            )}
          </Providers>
        </body>
      </SessionWrapper>
    </html>
  );
}