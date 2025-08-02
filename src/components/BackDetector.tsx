"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { backList } from "./pageConfig";

const BackDetector = () => {
  const pathname = usePathname();

  useEffect(() => {
    // ページ読み込み時に前回のブラウザバックアクションをチェック
    const checkBackAction = () => {
      const lastAction = sessionStorage.getItem("lastPageAction");
      const backedFromPage = sessionStorage.getItem("backedFromPage");

      if (lastAction === "browser_back" && backedFromPage) {
        // アクションをクリア
        sessionStorage.removeItem("lastPageAction");
        sessionStorage.removeItem("backedFromPage");

        // バックリストに含まれているページかチェック
        if (backList.includes(backedFromPage)) {
          console.warn(`${backedFromPage} からブラウザバックが検知されました`);
        }
      }
    };

    checkBackAction();

    // popstateイベントでブラウザバックを検知
    const handlePopState = (event: PopStateEvent) => {
      console.log("Browser back detected from:", pathname);
      sessionStorage.setItem("lastPageAction", "browser_back");
      sessionStorage.setItem("backedFromPage", pathname || "");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  return null;
};

export default BackDetector;
