"use client"
import { useDispatch } from "react-redux";
import { registerUser } from "@/config/redux/action/authAction";
import { useSession, signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Signup() {
  const toastObj = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);


  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await dispatch(registerUser(data));

    if (res.meta.requestStatus === "fulfilled") {
      setSuccess("🎉 Account created successfully!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } else {
      const err =
        res.payload ||
        res.error?.message ||
        "Signup failed. Try again.";
      setError(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 to-black px-4 sm:px-6 lg:px-8 overflow-hidden">


      {/* CONTAINER */}
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">

        {/* CARD */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">

          {/* TITLE */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">Quantora</h1>
            <p className="text-white/60 text-sm mt-1">
              Create your founder account
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
              type="text"
              placeholder="Enter your name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
            />

            <input
              type="password"
              placeholder="Create password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="py-3 bg-blue-600 cursor-pointer text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/50 text-xs">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* GOOGLE */}
          <button onClick={() => { signIn("google"); toast.success("You have successfully signed in with Google!", toastObj); }} className="w-full py-3 cursor-pointer border border-white/20 text-white rounded-lg flex justify-center items-center hover:bg-white/10 transition">
            <FcGoogle size={28} className="inline-block mr-2" />
            Continue with Google
          </button>

          {/* LOGIN LINK */}
          <p className="text-center text-white/70 text-sm mt-6">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-400 font-semibold cursor-pointer"
            >
              Sign in
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}