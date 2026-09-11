"use client";

import { useRouter } from "next/navigation";

export default function UpgradePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-950 to-black px-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-blue-900 shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-white mb-4">🚀 Upgrade to Pro</h1>
        <p className="text-gray-300 mb-6">
          Unlock advanced analytics, unlimited reports, and priority support.
        </p>
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-white">Pro Plan - $29/month</h3>
            <ul className="text-left text-gray-300 mt-2 space-y-1">
              <li>✓ Unlimited analyses</li>
              <li>✓ Advanced market insights</li>
              <li>✓ Export reports</li>
              <li>✓ Priority email support</li>
            </ul>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition">
            Subscribe Now
          </button>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}