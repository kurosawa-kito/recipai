"use client";
import { Inter } from "next/font/google";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/components/AuthProvider";
import { usePathname } from "next/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          {pathname !== "/" && pathname !== "/login" && <AppHeader />}
          <div
            className={
              pathname !== "/" && pathname !== "/login"
                ? "pt-14 min-h-screen bg-gray-50"
                : "min-h-screen bg-gray-50"
            }
          >
            {children}
          </div>
          {pathname !== "/" && pathname !== "/login" && <BottomNav />}
        </AuthProvider>
      </body>
    </html>
  );
}
