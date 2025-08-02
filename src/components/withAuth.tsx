"use client";
import { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

function withAuth<T extends {}>(WrappedComponent: ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      // セッションCookieからログイン状態を確認
      const userId = document.cookie.match(/userId=([^;]+)/);
      if (!userId) {
        router.push("/login");
        return;
      }
      setIsLoggedIn(true);
      setIsLoading(false);
    }, [router]);

    if (isLoading) {
      return (
        <main className="flex flex-col min-h-screen pb-16 bg-white">
          <AppHeader />
          <div className="flex-1 flex items-center justify-center pt-14">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          </div>
          <BottomNav />
        </main>
      );
    }

    if (!isLoggedIn) {
      return (
        <main className="flex flex-col min-h-screen pb-16 bg-white">
          <AppHeader />
          <div className="flex-1 flex items-center justify-center pt-14">
            <div className="text-center">
              <p className="text-gray-600 mb-4">ログインが必要です</p>
              <a
                href="/login"
                className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
              >
                ログインする
              </a>
            </div>
          </div>
          <BottomNav />
        </main>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
