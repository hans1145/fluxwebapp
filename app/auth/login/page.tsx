"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const FluxBackground = () => (
  <div className="absolute inset-0 grid grid-cols-6 pointer-events-none select-none">
    <div className="bg-gradient-to-b from-[#FFCB74] to-[#E6AE47]" />
    <div className="bg-gradient-to-b from-[#F6F6F6] to-[#CFA348]" />
    <div className="bg-gradient-to-b from-[#2F2F2F] to-[#2F2F2F]" />
    <div className="bg-gradient-to-b from-[#FFCB74] to-[#5C5C5C]" />
    <div className="bg-gradient-to-b from-[#111111] to-[#F0D28C]" />
    <div className="bg-gradient-to-b from-[#F6F6F6] to-[#B0A48C]" />
  </div>
);

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Login gagal");
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // rememberMe bisa dipakai nanti utk atur expiry, sekarang abaikan dulu
      }

      router.push("/dashboard");
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-800 relative h-full">
        <FluxBackground />
        <div className="relative z-10 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl p-10 flex flex-col items-center max-w-md">
          <Image src="/logo2.png" alt="Logo" width={160} height={160} priority />
          <h1 className="text-3xl font-bold mt-4 text-gray-900">FLUX</h1>
          <p className="text-sm text-gray-700 mt-2 font-medium tracking-wide">
            YOUR PERSONAL FLOW IN MOTION
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center h-full relative lg:bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <div className="lg:hidden absolute inset-0 z-0">
          <FluxBackground />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 w-full max-w-[340px] sm:max-w-sm bg-white/90 lg:bg-transparent p-5 sm:p-8 rounded-2xl shadow-2xl lg:shadow-none lg:p-0 border border-white/20 lg:border-none backdrop-blur-md lg:backdrop-blur-none mx-4">
          {/* Mobile branding */}
          <div className="lg:hidden flex flex-col items-center mb-2 text-center">
            <div className="relative w-16 h-16 mb-1 drop-shadow-md">
              <Image src="/logo2.png" alt="Logo Mobile" fill className="object-contain" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 drop-shadow-sm">FLUX</h1>
            <p className="text-[10px] text-gray-600 font-medium tracking-widest">
              FLOW IN MOTION
            </p>
          </div>

          <button
            onClick={() => router.push("/auth/landing")}
            className="text-[10px] sm:text-xs text-gray-600 lg:text-gray-700 mb-2 hover:underline transition-colors hover:text-amber-600 flex items-center"
          >
            ← Back to Home
          </button>

          <h1 className="text-xl sm:text-2xl font-bold mb-1 text-gray-900">Sign In</h1>
          <p className="text-gray-600 lg:text-gray-700 text-xs mb-3">
            Welcome back! Please enter your details
          </p>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1.5 rounded-lg mb-3 text-[10px] text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {/* Email */}
            <div className="relative group">
              <MdOutlineEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 lg:text-gray-400 text-sm sm:text-lg group-focus-within:text-amber-600 transition-colors" />
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="border border-gray-300 bg-white/80 lg:bg-white py-2 pl-10 rounded-xl w-full text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm lg:shadow-none"
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 lg:text-gray-400 text-xs sm:text-sm group-focus-within:text-amber-600 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="border border-gray-300 bg-white/80 lg:bg-white py-2 pl-9 pr-9 rounded-xl w-full text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm lg:shadow-none"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 lg:text-gray-400 hover:text-gray-700 p-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Remember me + forgot */}
            <div className="flex items-center justify-between mt-1 text-[10px] sm:text-xs text-gray-600">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3 w-3 text-amber-500 border-gray-300 rounded focus:ring-amber-400"
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-amber-600 hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-amber-400 lg:bg-amber-400 text-gray-900 py-2 rounded-xl font-semibold text-sm hover:bg-amber-500 active:scale-[0.98] disabled:opacity-70 transition-all mt-1 shadow-md lg:shadow-none"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-[10px] sm:text-xs text-gray-600 mt-1">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/register")}
                className="font-bold text-amber-600 lg:text-amber-500 hover:text-amber-700 hover:underline"
              >
                Sign Up Now
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
