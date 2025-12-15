import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Job Tracker",
  description: "Track your job applications intelligently",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#F3F4F6] text-[#374151]">{children}</body>
      </html>
    </ClerkProvider>
  );
}
