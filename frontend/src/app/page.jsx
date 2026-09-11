"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check for token in localStorage
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (token) {
      // Authenticated → go to Dashboard
      router.replace("/dashboard");
    } else {
      // Not authenticated → go to Login (not idea-flow)
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#0a0c12]">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-white">Loading Quantora...</h2>
      <p className="text-white/50 text-sm mt-1">Redirecting to your workspace</p>
    </div>
  );
}
