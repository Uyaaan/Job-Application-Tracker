"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
// Updated import path for the root directory
import { loginAction } from "./actions/login";
import { registerAction } from "./actions/register";
import { useRouter } from "next/navigation";

// --- SUBMIT BUTTON COMPONENT ---
function SubmitButton({ text, loadingText, colorClass }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 mt-4 text-white
        ${colorClass} hover:shadow-xl hover:-translate-y-0.5 
        ${pending ? "opacity-75 cursor-wait" : ""}
      `}
    >
      {pending ? loadingText : text}
    </button>
  );
}

// --- LOGIN BUTTON COMPONENT ---
function LoginSubmitButton({ countdown }) {
  const { pending } = useFormStatus();
  const isLocked = countdown > 0;

  return (
    <button
      type="submit"
      disabled={pending || isLocked}
      className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 mt-4 text-white
        ${
          isLocked
            ? "bg-red-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5"
        }
        ${pending ? "opacity-75 cursor-wait" : ""}
      `}
    >
      {isLocked
        ? `Try again in ${countdown}s`
        : pending
        ? "Signing In..."
        : "Sign In"}
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  const [loginState, loginDispatch] = useFormState(loginAction, {
    errors: {},
    success: false,
    fields: {},
  });

  const [registerState, registerDispatch] = useFormState(registerAction, {
    errors: {},
    success: false,
    fields: {},
  });

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (loginState?.lockout && loginState.lockout > 0) {
      setCountdown(loginState.lockout);
    }
  }, [loginState]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (loginState?.success) {
      router.push("/dashboard");
    }
  }, [loginState?.success, router]);

  useEffect(() => {
    if (registerState?.success) {
      setIsSignUp(false);
    }
  }, [registerState?.success]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl min-h-[600px] md:min-h-[700px]">
        {/* --- SIGN UP FORM --- */}
        <div
          className={`absolute top-0 h-full w-full md:w-1/2 transition-all duration-700 ease-in-out bg-white z-10
            ${
              isSignUp
                ? "md:translate-x-full opacity-100 visible"
                : "md:translate-x-full opacity-0 invisible"
            }`}
        >
          <div className="h-full flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500 mb-6">Godspeed.</p>

            <form action={registerDispatch} className="space-y-4">
              <div>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  defaultValue={registerState?.fields?.name || ""}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    registerState?.errors?.name
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-green-600"
                  }`}
                />
                {registerState?.errors?.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {registerState.errors.name}
                  </p>
                )}
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  defaultValue={registerState?.fields?.email || ""}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    registerState?.errors?.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-green-600"
                  }`}
                />
                {registerState?.errors?.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {registerState.errors.email}
                  </p>
                )}
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password (Min 8 chars)"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    registerState?.errors?.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-green-600"
                  }`}
                />
                {registerState?.errors?.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {registerState.errors.password}
                  </p>
                )}
              </div>
              <SubmitButton
                text="Sign Up"
                loadingText="Creating..."
                colorClass="bg-green-600 hover:bg-green-700"
              />
            </form>

            <p className="md:hidden mt-6 text-center text-sm">
              Already have an account?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-green-600 font-bold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* --- LOGIN FORM --- */}
        <div
          className={`absolute top-0 h-full w-full md:w-1/2 transition-all duration-700 ease-in-out bg-white z-20
            ${
              isSignUp
                ? "md:-translate-x-full opacity-0 invisible"
                : "translate-x-0 opacity-100 visible"
            }`}
        >
          <div className="h-full flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Resume Recycling Center
              </span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-8">
              Enter your details to access dashboard.
            </p>

            <form action={loginDispatch} className="space-y-4">
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  defaultValue={loginState?.fields?.email || ""}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    loginState?.errors?.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-green-600"
                  }`}
                />
                {loginState?.errors?.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {loginState.errors.email}
                  </p>
                )}
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    loginState?.errors?.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-green-600"
                  }`}
                />
                {loginState?.errors?.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {loginState.errors.password}
                  </p>
                )}
              </div>
              <LoginSubmitButton countdown={countdown} />
            </form>

            <p className="md:hidden mt-6 text-center text-sm">
              New here?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-green-600 font-bold"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* --- OVERLAY SLIDER --- */}
        <div
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 rounded-l-[100px]
            ${
              isSignUp
                ? "-translate-x-full rounded-l-none rounded-r-[100px]"
                : ""
            }
          `}
        >
          <div
            className={`bg-gray-900 relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out
              ${isSignUp ? "translate-x-1/2" : "translate-x-0"}
            `}
          >
            {/* LOGIN PROMPT (Left Panel) */}
            <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-12 text-white">
              <img
                src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1740&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt="Workspace"
              />
              <div className="absolute inset-0 bg-green-900/60 mix-blend-multiply"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">
                  Making rejection productive?
                </h2>
                <p className="mb-8 text-lg text-green-100">
                  Don't have an account yet?
                </p>
                <button
                  onClick={() => setIsSignUp(true)}
                  className="border-2 border-white rounded-xl px-12 py-3 font-bold hover:bg-white hover:text-green-900 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* REGISTER PROMPT (Right Panel) */}
            <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-12 text-white">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1742&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt="Growth"
              />
              <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">
                  Already have an account?
                </h2>
                <p className="mb-8 text-lg text-blue-100">
                  Login to track your applications.
                </p>
                <button
                  onClick={() => setIsSignUp(false)}
                  className="border-2 border-white rounded-xl px-12 py-3 font-bold hover:bg-white hover:text-blue-900 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
