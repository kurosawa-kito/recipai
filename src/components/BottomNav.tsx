"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    const userId = document.cookie.match(/userId=([^;]+)/);
    setIsLoggedIn(!!userId);
  };

  useEffect(() => {
    // 初回チェック
    checkLoginStatus();

    // 定期的にログイン状態をチェック
    const interval = setInterval(checkLoginStatus, 1000);

    // ストレージイベントを監視
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ログイン前でも使える基本機能
  const basicNavItems = [
    { href: "/", label: "ホーム", icon: "🏠" },
    { href: "/search", label: "検索", icon: "🔍" },
  ];

  // ログイン後の追加機能
  const loggedInNavItems = [
    { href: "/", label: "ホーム", icon: "🏠" },
    { href: "/ingredients", label: "材料", icon: "🥕" },
    { href: "/search", label: "検索", icon: "🔍" },
    { href: "/history", label: "履歴", icon: "🕑" },
    { href: "/favorites", label: "お気に入り", icon: "❤️" },
  ];

  const navItems = isLoggedIn ? loggedInNavItems : basicNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow-md md:hidden">
      <ul className="flex justify-between items-center h-16 px-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (pathname && pathname.startsWith(item.href) && item.href !== "/");
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 rounded transition-colors duration-200 ${
                  active
                    ? "text-blue-600 font-bold bg-blue-50"
                    : "text-gray-500"
                }`}
                style={{ minWidth: 0 }}
              >
                <span className="text-xl mb-0.5" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-[11px] leading-tight">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
