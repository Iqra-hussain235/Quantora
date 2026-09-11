"use client";

import { useRouter } from "next/navigation";

export default function AnalyzerPage() {

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black flex items-center justify-center p-6">

      <div className="max-w-5xl w-full text-center">

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Choose Your Category 🚀
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* IDEA CARD */}
          <div
            // onClick={() => router.push("/business")}
            onClick={() => router.push("/idea-flow")}
            className="cursor-pointer bg-white/10 backdrop-blur-lg border border-blue-800 p-8 rounded-xl hover:scale-105 hover:bg-blue-900/40 transition-all"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              💡 Startup Idea
            </h2>

            <p className="text-gray-300">
              Have an idea? Let’s validate and analyze your startup concept.
            </p>
          </div>

          {/* BUSINESS CARD */}
          <div
            onClick={() => router.push("/business-upload")}
            className="cursor-pointer bg-white/10 backdrop-blur-lg border border-blue-800 p-8 rounded-xl hover:scale-105 hover:bg-blue-900/40 transition-all"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              🏢 Existing Business
            </h2>

            <p className="text-gray-300">
              Analyze your current business with real data insights.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}