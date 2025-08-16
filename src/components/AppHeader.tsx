"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const [mypageOpen, setMypageOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    const userId = document.cookie.match(/userId=([^;]+)/);
    setIsLoggedIn(!!userId);
  };

  useEffect(() => {
    // 初回チェック
    checkLoginStatus();

    // 定期的にログイン状態をチェック（他のタブでログアウトした場合など）
    const interval = setInterval(checkLoginStatus, 1000);

    // ストレージイベントを監視（他のタブでの変更を検知）
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b flex items-center px-4 shadow-sm">
      {/* ハンバーガーメニュー */}
      <button
        className="mr-3 flex flex-col justify-center items-center w-9 h-9 p-1 rounded hover:bg-gray-100 focus:outline-none"
        aria-label="メニューを開く"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
        <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
        <span className="block w-6 h-0.5 bg-gray-800" />
      </button>
      <span className="font-bold text-lg tracking-wide">RECIPAI</span>

      {/* ログイン/ログアウトボタン */}
      <div className="ml-auto">
        {isLoggedIn ? (
          <button
            className="text-sm text-gray-600 hover:text-primary-600"
            onClick={() => {
              document.cookie =
                "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              setIsLoggedIn(false);
              window.location.href = "/";
            }}
          >
            ログアウト
          </button>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
          >
            ログイン
          </Link>
        )}
      </div>

      {/* メニュー（サイドドロワー風） */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setOpen(false)}
        >
          <nav
            className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-6 flex flex-col gap-4 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end mb-4"
              onClick={() => setOpen(false)}
              aria-label="閉じる"
            >
              <span className="text-2xl">×</span>
            </button>

            {/* ログイン後のユーザー情報 */}
            {isLoggedIn && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold">👤</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      ユーザー名
                    </div>
                    <div className="text-sm text-gray-500">
                      test@example.com
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Link href="/" className="py-2 text-gray-700 hover:text-blue-600">
              ホーム
            </Link>
            {/* 今後のバージョンでリリース予定
            <Link
              href="/search"
              className="py-2 text-gray-700 hover:text-blue-600"
            >
              検索
            </Link>
            */}
            {isLoggedIn && (
              <>
                <Link
                  href="/ingredients"
                  className="py-2 text-gray-700 hover:text-blue-600"
                >
                  材料管理
                </Link>
                <Link
                  href="/history"
                  className="py-2 text-gray-700 hover:text-blue-600"
                >
                  レシピ履歴
                </Link>
                <Link
                  href="/favorites"
                  className="py-2 text-gray-700 hover:text-blue-600"
                >
                  お気に入り
                </Link>
                <hr className="my-2 border-gray-200" />
                <Link
                  href="/settings"
                  className="py-2 text-gray-700 hover:text-blue-600"
                >
                  設定
                </Link>
                <button
                  className="py-2 text-gray-700 hover:text-blue-600 text-left"
                  onClick={() => {
                    setMypageOpen(true);
                    setOpen(false);
                  }}
                >
                  アカウント情報
                </button>
                <button
                  className="py-2 text-red-600 hover:text-red-700 text-left font-medium"
                  onClick={() => {
                    document.cookie =
                      "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    setIsLoggedIn(false);
                    setOpen(false);
                    window.location.href = "/";
                  }}
                >
                  ログアウト
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <hr className="my-2 border-gray-200" />
                <Link
                  href="/login"
                  className="py-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="py-2 text-green-600 hover:text-green-700 font-semibold"
                >
                  新規会員登録
                </Link>
              </>
            )}
            {/* 追加メニューはここに */}
          </nav>
        </div>
      )}

      {/* アカウント情報ダイアログ */}
      {mypageOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/30"
          onClick={() => setMypageOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-2xl"
              onClick={() => setMypageOpen(false)}
              aria-label="閉じる"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">アカウント情報</h2>

            {/* ユーザープロフィール */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">👤</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">ユーザー名</div>
                  <div className="text-sm text-gray-500">test@example.com</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-primary-600">12</div>
                  <div className="text-xs text-gray-600">保存レシピ</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600">8</div>
                  <div className="text-xs text-gray-600">作ったレシピ</div>
                </div>
              </div>
            </div>

            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">表示名</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="ユーザー名"
                  defaultValue="ユーザー名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  placeholder="example@email.com"
                  defaultValue="test@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  新しいパスワード
                </label>
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  placeholder="変更する場合のみ入力"
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white rounded py-2 font-bold hover:bg-blue-700 transition"
                onClick={(e) => {
                  e.preventDefault();
                  alert("設定を保存しました（デモ）");
                  setMypageOpen(false);
                }}
              >
                変更を保存
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
