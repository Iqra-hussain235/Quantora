"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getBusinesses } from "@/config/redux/action/bussinessAction";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router   = useRouter();

  const { businesses, loading } = useSelector((state) => state.business);

  useEffect(() => {
    dispatch(getBusinesses());
  }, [dispatch]);

  return (
    <div className="w-full">

      {/* 🔥 HERO SECTION */}
      <div className="relative h-[70vh] w-full overflow-hidden">

        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-zoom"
          style={{ backgroundImage: "url('/images/logo.png')" }}
        />

        {/* LIGHT OVERLAY */}
        <div className="absolute inset-0 bg-white/40" />

        {/* CENTER BUTTON */}
        <div className="relative z-10 flex items-center justify-center h-full translate-y-8">
          <button
            onClick={() => router.push("/category")}
            className="relative bg-blue-900 cursor-pointer text-white px-10 py-4 rounded-lg text-lg font-medium transition-all duration-300 hover:bg-blue-800 hover:scale-105 shadow-lg hover:shadow-blue-500/30 animate-bounce [animation-duration:3s] group overflow-hidden"
          >
            <span className="relative z-10">Analyze</span>
            <span className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition duration-300" />
          </button>
        </div>
      </div>

      {/* 🔥 MAIN DASHBOARD CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Total Businesses</p>
            <h2 className="text-3xl font-bold mt-2 text-gray-800">
              {businesses?.length || 0}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Status</p>
            <h2 className="text-2xl font-bold mt-2 text-green-600">Active</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Growth</p>
            <h2 className="text-2xl font-bold mt-2 text-blue-600">+12%</h2>
          </div>

        </div>

        {/* BUSINESS LIST */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Your Businesses</h2>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : !businesses?.length ? (
            <div className="text-center py-10 text-gray-400">No businesses found</div>
          ) : (
            <div className="space-y-3">
              {businesses.map((b) => (
                <div
                  key={b.id}          // ✅ PostgreSQL integer PK (not b._id)
                  className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{b.businessName}</p>
                    <p className="text-xs text-gray-400">{b.industry || "No industry"}</p>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.setItem("flowType", "existing");
                      router.push(`/analysis/${b.id}`);  // ✅ PostgreSQL integer PK
                    }}
                    className="text-sm bg-black text-white px-4 py-1.5 rounded-md hover:bg-gray-800"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
