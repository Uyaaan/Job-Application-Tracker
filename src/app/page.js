// src/app/page.js
"use client";
import Link from "next/link";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#22D3EE] opacity-10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#14B8A6] opacity-10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-3xl text-center space-y-8 z-10">
        <div className="inline-block p-5 bg-white rounded-2xl shadow-xl mb-4 border border-gray-100">
          <span className="text-6xl">🚀</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-tight">
          Land Your <span className="text-[#14B8A6]">Dream Job</span>.
        </h1>
        <p className="text-xl text-[#374151] max-w-lg mx-auto leading-relaxed">
          Stop losing track of your applications. Organize your job search with
          your own personal automated dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-[#14B8A6] hover:bg-teal-600 text-white text-lg font-bold rounded-full shadow-lg transition transform hover:-translate-y-1">
                Go to Dashboard →
              </button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up">
                <button className="px-8 py-4 bg-[#14B8A6] hover:bg-teal-600 text-white text-lg font-bold rounded-full shadow-lg transition transform hover:-translate-y-1">
                  Get Started for Free
                </button>
              </Link>
              <div className="text-sm text-[#374151] font-medium">
                Already have an account?{" "}
                <Link href="/sign-in">
                  <span className="text-[#14B8A6] font-bold hover:underline cursor-pointer">
                    Sign In
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
