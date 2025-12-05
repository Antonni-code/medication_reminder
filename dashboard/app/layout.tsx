import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Footer from "@/components/footer";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Medication Reminder Dashboard",
  description: "Monitor and manage your medication reminders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#EF7722] hover:bg-[#FFF5ED] rounded-lg transition-all"
    >
      {label}
    </Link>
  );
}
