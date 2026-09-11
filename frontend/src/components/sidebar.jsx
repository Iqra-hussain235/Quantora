"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import cn from "@/lib/cn";

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const pathname = usePathname();

  const [ideaData, setIdeaData] = useState(null);
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    try {
      const idea = localStorage.getItem("ideaData");
      const existing = localStorage.getItem("existingData");

      if (idea) setIdeaData(JSON.parse(idea));
      if (existing) setExistingData(JSON.parse(existing));
    } catch (e) {
      console.warn("Failed to parse sidebar data", e);
    }
  }, [pathname]);

  return (
    <>
      {/* SIDEBAR */}
      <aside className={cn(
        "fixed top-0 left-0 h-full z-40",
        "flex flex-col",
        "bg-[#0f1117] border-r border-white/8",
        "transition-all duration-300 ease-in-out",
        isOpen ? "w-60" : "w-16"
      )}>
        {/* LOGO + TOGGLE */}
        <div className={cn(
          "flex items-center h-16 border-b border-white/8",
          isOpen ? "px-4 justify-between" : "px-0 justify-center"
        )}>
          {isOpen && (
            <div className={"flex items-center gap-2 overflow-hidden"}>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <Zap size={14} className="text-white" />
              </div>
              <span className="text-white font-semibold text-sm whitespace-nowrap">
                Quantora
              </span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg",
              "text-white/50 hover:text-white hover:bg-white/10",
              "transition-all duration-200 flex-shrink-0",
              !isOpen ? "mx-auto" : ""
            )}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* NAV ITEMS */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-hidden">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            isOpen={isOpen}
            active={pathname === "/dashboard"}
            onClick={() => router.push("/dashboard")}
          />

          <NavItem
            icon={<Zap size={18} />}
            label="Idea"
            isOpen={isOpen}
            active={pathname === "/idea-flow"}
            onClick={() => {
              localStorage.setItem("flowType", "idea");
              router.push("/idea-flow");
            }}
          />

          <NavItem
            icon={<Briefcase size={18} />}
            label="Existing Business"
            isOpen={isOpen}
            active={pathname?.startsWith("/business-upload")}
            onClick={() => {
              localStorage.setItem("flowType", "existing");
              router.push("/business-upload");
            }}
          />

          {/* removed legacy 'Business' route - replaced by user items below */}

          <NavItem
            icon={<BarChart3 size={18} />}
            label="Analysis"
            isOpen={isOpen}
            active={pathname?.startsWith("/analysis")}
            onClick={() => router.push("/analysis")}
          />

          <NavItem
            icon={<FileText size={18} />}
            label="Reports"
            isOpen={isOpen}
            active={false}
            onClick={() => { }}
          />
        </nav>

        {/* USER ITEMS (Idea / Existing Business) */}
        <div className="px-3 mt-4 overflow-hidden">
          {isOpen && (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs text-white/40">Your Idea</h4>

                {ideaData ? (
                  <div className="mt-2 bg-white/3 p-3 rounded-md border border-white/6">
                    <div className="text-sm font-semibold text-white truncate">
                      {ideaData.name || ideaData.idea || "Unnamed"}
                    </div>
                    <div className="text-xs text-white/50 mt-1 truncate">
                      {ideaData.idea || ideaData.problem || "—"}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          localStorage.setItem("ideaEdit", JSON.stringify(ideaData));
                          router.push("/idea-flow");
                        }}
                        className="text-xs px-3 py-1 rounded bg-blue-700/80"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem("flowType", "idea");
                          router.push("/analysis");
                        }}
                        className="text-xs px-3 py-1 rounded bg-white/6"
                      >
                        View Analysis
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-white/30">No idea saved yet</div>
                )}
              </div>

              <div>
                <h4 className="text-xs text-white/40">Your Existing Business</h4>

                {existingData ? (
                  <div className="mt-2 bg-white/3 p-3 rounded-md border border-white/6">
                    <div className="text-sm font-semibold text-white truncate">
                      {existingData.businessName || "Unnamed Business"}
                    </div>
                    <div className="text-xs text-white/50 mt-1 truncate">
                      {existingData.platform || existingData.location || "—"}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          localStorage.setItem("existingEdit", JSON.stringify(existingData));
                          router.push("/business-upload");
                        }}
                        className="text-xs px-3 py-1 rounded bg-blue-700/80"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem("flowType", "existing");
                          router.push("/analysis");
                        }}
                        className="text-xs px-3 py-1 rounded bg-white/6"
                      >
                        View Analysis
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-white/30">No existing business saved</div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* FOOTER */}
        {isOpen && (
          <div className="px-4 py-4 border-t border-white/8">
            <p className="text-white/25 text-xs text-center">
              v1.0 · AI Powered
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

function NavItem({ icon, label, active, onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      title={!isOpen ? label : undefined}
      className={cn(
        "flex items-center gap-3 w-full rounded-lg transition-all duration-200",
        isOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
        active
          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
          : "text-white/50 hover:bg-white/6 hover:text-white border border-transparent"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isOpen && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
    </button>
  );
}