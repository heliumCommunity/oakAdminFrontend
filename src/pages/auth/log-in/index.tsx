"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);

      localStorage.setItem("token", res.token);
      document.cookie = `jwt=${res.token}; path=/; SameSite=None; Secure`;

      router.push("/dashboard");
    } catch (err: unknown) {
      type ErrorResponse = {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      const errorObj = err as ErrorResponse;

      if (
        typeof err === "object" &&
        err !== null &&
        errorObj.response &&
        typeof errorObj.response === "object" &&
        errorObj.response.data &&
        typeof errorObj.response.data === "object" &&
        "message" in errorObj.response.data
      ) {
        setError(errorObj.response.data?.message || "Login failed");
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left */}
      <div className="hidden md:flex w-1/2 bg-cover bg-bottom-right rounded-r-3xl overflow-hidden">
        <img
          src="/oak-bg4.png"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-red">ADMIN PANEL</h2>
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
              className="w-full bg-black text-white py-2 rounded hover:opacity-90"
            >
              LOG IN
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
