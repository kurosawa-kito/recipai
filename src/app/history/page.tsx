"use client";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import withAuth from "@/components/withAuth";

function HistoryPage() {
  const [keyword, setKeyword] = useState("");
  const [showFavorite, setShowFavorite] = useState(false);

  // 仮データ
  const recipes = [
    {
      id: 1,
      title: "レシピタイトル 1",
      ingredients: "たまご, 牛乳, トマト",
      date: "2025/07/19",
      isFavorite: true,
    },
    {
      id: 2,
      title: "レシピタイトル 2",
      ingredients: "鶏肉, ねぎ",
      date: "2025/07/18",
      isFavorite: false,
    },
  ];
  const filtered = recipes.filter(
    (r) =>
      (!showFavorite || r.isFavorite) &&
      (keyword === "" ||
        r.title.includes(keyword) ||
        r.ingredients.includes(keyword))
  );
  return (
    <main className="flex flex-col min-h-screen pb-16 bg-white">
      <AppHeader />
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 pt-20">
        <h1 className="text-2xl font-bold mb-4">履歴</h1>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded px-2 py-1 flex-1"
            placeholder="キーワード検索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            className={`px-3 py-1 rounded font-bold border ${showFavorite ? "bg-yellow-400 text-white" : "bg-white text-yellow-500 border-yellow-400"}`}
            onClick={() => setShowFavorite((f) => !f)}
          >
            ★ お気に入り
          </button>
        </div>
        <ul className="space-y-4">
          {filtered.map((r) => (
            <li key={r.id} className="border rounded p-4 bg-white shadow-sm">
              <div className="font-bold flex items-center gap-2">
                {r.title}
                {r.isFavorite && <span className="text-yellow-400">★</span>}
              </div>
              <div className="text-sm text-gray-500">
                材料例: {r.ingredients}
              </div>
              <div className="text-gray-400 text-xs mt-2">{r.date}</div>
              <Link
                href={`/recipes/${r.id}`}
                className="text-blue-500 hover:underline mt-2 block"
              >
                詳細を見る
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <BottomNav />
    </main>
  );
}

export default withAuth(HistoryPage);
