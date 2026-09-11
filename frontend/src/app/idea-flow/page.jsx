"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IdeaFlow() {

  const router = useRouter();

  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    name: "",
    idea: "",
    problem: "",
    users: "",
    market: "",
    solution: "",
    usp: "",
    competitor: "",
    model: "",
    cost: "",
    revenue: ""
  });

  const totalSteps = 6;

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

//   const submit = () => {
//     console.log("IDEA DATA:", data);

//     localStorage.setItem("ideaData", JSON.stringify(data));

//     router.push("/analysis");
//   };

  useEffect(() => {
    try {
      const edit = localStorage.getItem("ideaEdit");
      if (edit) {
        setData(JSON.parse(edit));
        localStorage.removeItem("ideaEdit");
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const submit = async () => {

  try {

    const API_BASE = process.env.NEXT_PUBLIC_PY_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    // Send idea as JSON body to FastAPI /analyze (app.py)
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idea: JSON.stringify(data) })
    });

    const result = await res.json();
    localStorage.setItem("analysisResult", JSON.stringify(result));
    localStorage.setItem("flowType", "idea");
    // persist the submitted idea so sidebar can show it
    localStorage.setItem("ideaData", JSON.stringify(data));

    router.push("/analysis");

  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-950 to-black px-4">

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-blue-900 shadow-2xl">

        {/* HEADER */}
        <h2 className="text-white text-2xl font-bold mb-2">
          Startup Idea Analyzer 🚀
        </h2>

        <p className="text-gray-400 mb-6">
          Step {step} of {totalSteps}
        </p>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-700 h-2 rounded mb-6">
          <div
            className="bg-blue-700 h-2 rounded transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* FORM STEPS */}

        {step === 1 && (
          <div className="space-y-4">
            <input
              placeholder="Startup Name"
              className="w-full p-3 bg-black border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-700 outline-none"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />

            <input
              placeholder="One-line idea (e.g. Food delivery for students)"
              className="w-full p-3 bg-black border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-700 outline-none"
              value={data.idea}
              onChange={(e) => setData({ ...data, idea: e.target.value })}
            />
            <select
  className="w-full p-3 bg-black border border-gray-600 rounded text-white"
  value={data.industry || ""}
  onChange={(e)=>setData({...data,industry:e.target.value})}
>
  <option value="">Select Industry</option>
  <option>Tech</option>
  <option>Food</option>
  <option>Healthcare</option>
  <option>Education</option>
</select>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              placeholder="Problem you're solving"
              className="w-full p-3 bg-black border border-gray-600 rounded text-white"
              value={data.problem}
              onChange={(e) => setData({ ...data, problem: e.target.value })}
            />

            <input
              placeholder="Target Users (students, businesses, etc.)"
              className="w-full p-3 bg-black border border-gray-600 rounded text-white"
              value={data.users}
              onChange={(e) => setData({ ...data, users: e.target.value })}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <select
              className="w-full p-3 bg-black border border-gray-600 rounded text-white"
              value={data.market}
              onChange={(e) => setData({ ...data, market: e.target.value })}
            >
              <option value="">Market Size</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>

            <label className="block mt-3">
  <p className="text-gray-400 mb-1">Upload solution doc (optional)</p>

            <input
    type="file"
    className="w-full text-white"
    onChange={(e)=>setData({...data,file:e.target.files[0]})}
  />
</label>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <input
              placeholder="USP (Why will people choose you?)"
              className="w-full p-3 bg-black border border-gray-600 rounded text-white"
              value={data.usp}
              onChange={(e) => setData({ ...data, usp: e.target.value })}
            />

            <input
              placeholder="Competitor (optional)"
              className="w-full p-3 bg-black border border-gray-600 rounded text-white"
              value={data.competitor}
              onChange={(e) => setData({ ...data, competitor: e.target.value })}
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <input
              placeholder="Revenue Model (subscription, ads, etc.)"
              className="w-full p-3 bg-black border border-gray-600 rounded text-white"
              value={data.model}
              onChange={(e) => setData({ ...data, model: e.target.value })}
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <input
              placeholder="Estimated Cost"
              className="w-full p-3 bg-black border border-gray-600 rounded text-white"
              value={data.cost}
              onChange={(e) => setData({ ...data, cost: e.target.value })}
            />

            <input
              placeholder="Expected Revenue"
              className="w-full p-3 bg-black border border-gray-600 rounded text-white"
              value={data.revenue}
              onChange={(e) => setData({ ...data, revenue: e.target.value })}
            />
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between mt-8">

          {step > 1 && (
            <button
              onClick={prev}
              className="px-6 py-2 border border-gray-500 text-white rounded hover:bg-white/10 transition"
            >
              ← Back
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={next}
              className="ml-auto px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submit}
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
            >
              Analyze 🚀
            </button>
          )}

        </div>

      </div>
    </div>
  );
}