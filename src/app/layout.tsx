import { Inter } from "next/font/google";
import "./globals.css";
import GlobalLoading from "@/components/GlobalLoading";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
        <GlobalLoading />
      </body>
    </html>
  );
}
