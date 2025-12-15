import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-4 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#14B8A6] z-0"></div>

      <div className="z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-4xl hover:opacity-80 transition">
            🚀
          </Link>
          <h2 className="mt-4 text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-teal-100">
            Start tracking your applications today
          </p>
        </div>

        {/* Clerk Component */}
        <div className="flex justify-center shadow-2xl rounded-xl overflow-hidden">
          <SignUp
            appearance={{
              elements: {
                card: "shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                rootBox: "w-full",
              },
            }}
          />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#111827] hover:underline transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
