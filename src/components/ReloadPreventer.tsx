"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { reloadBeforeList } from "./pageConfig";

const ReloadPreventer = () => {
  const pathname = usePathname();

  useEffect(() => {
    // beforeunloadイベント（リロード・離脱防止）
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // 現在のページがリロード防止リストに含まれているかチェック
      if (!pathname || !reloadBeforeList.includes(pathname)) {
        return;
      }

      // ブラウザの標準確認ダイアログを表示してリロードを防止
      event.preventDefault();
      event.returnValue = ""; // モダンブラウザでは空文字列でも確認ダイアログが表示される
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);

  return null;
};

export default ReloadPreventer;
