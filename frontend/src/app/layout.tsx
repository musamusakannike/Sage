import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sage — Know who's real before you pay",
  description: "Payroll verification and employee management platform for government ministries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased" style={{ fontFamily: 'var(--font-sans)' }}>
        {children}
      </body>
    </html>
  );
}
