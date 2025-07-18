"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { login as loginService } from "@/services/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await loginService(email, password);
      login(response.token, response.user);
      // Redirect is handled by AuthContext
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message: string }).message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left - Image Section */}
      <div className="hidden md:flex w-1/2 relative bg-cover bg-bottom-right rounded-r-3xl overflow-hidden">
        <Image
          src="/oak-bg4.png"
          alt="Login Visual"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right - Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-2">ADMIN PANEL</h2>
          <p className="text-sm text-gray-600 mb-6">Control Panel Log-In</p>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="e.g. johndoe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>

          <div className="mt-10 text-xs text-center text-gray-500">
            Terms of use.{" "}
            <a href="#" className="text-blue-600">
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
