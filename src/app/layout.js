// src/app/layout.js
import "./globals.css"; // or wherever your css is

export const metadata = {
  title: "Job Tracker",
  description: "Track your job applications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
