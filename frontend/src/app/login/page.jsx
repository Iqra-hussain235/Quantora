"use client";

import { useDispatch } from "react-redux";
import { loginUser } from "@/config/redux/action/authAction";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await dispatch(loginUser({ email, password }));

    if (res.meta.requestStatus === "fulfilled") {
      setSuccess("✓ Login successful!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } else {
      const err =
        res.payload ||
        res.error?.message ||
        "Login failed. Please check your credentials.";
      setError(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black px-4 sm:px-6 lg:px-8 overflow-hidden">


      {/* FORM CONTAINER */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">

        {/* CARD */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">

          {/* TITLE */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">Quantora</h1>
            <p className="text-white/60 text-sm mt-1">
              Welcome Back, Founder
            </p>
          </div>

          {/* SUCCESS */}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded text-green-300 text-sm text-center">
              {success}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={submitHandler} className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* SIGNUP */}
          <p className="text-center text-white/70 text-sm mt-6">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-400 font-semibold"
            >
              Sign up
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}