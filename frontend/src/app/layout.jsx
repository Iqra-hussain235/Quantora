"use client";

import "../styles/globals.css";
import { useEffect, useState } from "react";
import SessionWrapper from "@/components/SessionWrapper";
import { useRouter, usePathname } from "next/navigation";
import Providers from "./providers";
import Sidebar from "@/components/sidebar";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // Helper to clear all tokens (localStorage + cookies)
  const clearAllTokens = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Clear cookies too (Next.js middleware reads from cookies)
    ["token", "accessToken", "refreshToken"].forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    });
  };

  useEffect(() => {
    setMounted(true);
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    // If no token and not on a public page → redirect to login
    if (!token && !isAuthPage) {
      router.push("/login");
    }

    // Development helper: ignore AbortError from interrupted media play() promises
    // This prevents noisy console errors during hot-reload / dev interactions.
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      const onUnhandledRejection = (ev) => {
        const reason = ev && ev.reason;
        if (reason && reason.name === "AbortError") {
          ev.preventDefault();
        }
      };
      window.addEventListener("unhandledrejection", onUnhandledRejection);
      return () => window.removeEventListener("unhandledrejection", onUnhandledRejection);
    }
  }, [pathname, router]);

  // Sidebar width values
  const sidebarW = isOpen ? "240px" : "64px";

  return (
    <html lang="en">
      <SessionWrapper children={children}>
            <body className="bg-[#0a0c12] text-white" suppressHydrationWarning>
            <Providers>
              {!mounted ? (
                <div className="min-h-screen" />
              ) : isAuthPage ? (
                /* ── AUTH PAGES ── */
                <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0c12]">
                  {children}
                </div>
              ) : (
                /* ── MAIN APP SHELL ── */
                <div className="flex min-h-screen bg-[#0a0c12]">

                  {/* SIDEBAR – fixed, drives layout */}
                  <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

                  {/* RIGHT COLUMN – header + scrollable content */}
                  <div
                    className="flex flex-col flex-1 min-h-screen transition-all duration-300"
                    style={{ marginLeft: sidebarW }}
                  >
                    {/* TOP BAR */}
                    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-white/8 bg-[#0a0c12]/80 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <span className="text-white/40 text-sm font-medium capitalize">
                          {pathname?.replace("/", "") || "Dashboard"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          clearAllTokens();
                          router.push("/login");
                        }}
                        className="text-xs font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all duration-200"
                      >
                        Sign out
                      </button>
                    </header>

                    {/* PAGE CONTENT */}
                    <main className="flex-1 overflow-y-auto">
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