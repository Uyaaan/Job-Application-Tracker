import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-4 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#111827] z-0"></div>

      <div className="z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-4xl hover:opacity-80 transition">
            🚀
          </Link>
          <h2 className="mt-4 text-3xl font-extrabold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Clerk Component */}
        <div className="flex justify-center shadow-2xl rounded-xl overflow-hidden">
          <SignIn
            appearance={{
              elements: {
                card: "shadow-none border-none",
                headerTitle: "hidden", // We built our own header
                headerSubtitle: "hidden",
                rootBox: "w-full",
              },
            }}
          />
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#14B8A6] hover:text-[#22D3EE] transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
