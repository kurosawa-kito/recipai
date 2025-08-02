"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { reloadList } from "./pageConfig";

const ReloadDetector = () => {
  const pathname = usePathname();

  useEffect(() => {
    // ページ読み込み時に前回のリロードアクションをチェック
    const checkReloadAction = () => {
      const lastAction = sessionStorage.getItem("lastPageAction");
      const reloadedPage = sessionStorage.getItem("reloadedPage");

      if (lastAction === "unexpected_reload" && reloadedPage) {
        // アクションをクリア
        sessionStorage.removeItem("lastPageAction");
        sessionStorage.removeItem("reloadedPage");

        // リロードリストに含まれているページかチェック
        if (reloadList.includes(reloadedPage)) {
          console.warn(`${reloadedPage} からリロードが検知されました`);
        }
      }
    };

    checkReloadAction();

    // pagehideイベントでリロードを検知
    const handlePageHide = (event: PageTransitionEvent) => {
      // ユーザーが確認済みの場合はアクションを記録しない
      if (sessionStorage.getItem("userConfirmedExit") === "true") {
        sessionStorage.removeItem("userConfirmedExit");
        return;
      }

      // リロードの検知
      sessionStorage.setItem("lastPageAction", "unexpected_reload");
      sessionStorage.setItem("reloadedPage", pathname || "");
      console.log("Reload detected on:", pathname);
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [pathname]);

  return null;
};

export default ReloadDetector;
