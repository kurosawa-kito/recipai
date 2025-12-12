"use client";
import { useState, useEffect, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import withAuth from "@/components/withAuth";

interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  date: string;
  isFavorite: boolean;
}

function HistoryPage() {
  const [keyword, setKeyword] = useState("");
  const [showFavorite, setShowFavorite] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (showFavorite) params.set("favorite", "true");
      if (keyword.trim()) params.set("keyword", keyword.trim());

      const res = await fetch(`/api/recipes?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 401) {
          setError("ログインが必要です");
          return;
        }
        throw new Error("取得に失敗しました");
      }
      const data = await res.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      setError("レシピの取得に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [showFavorite, keyword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 300); // debounce keyword search
    return () => clearTimeout(timer);
  }, [fetchRecipes]);

  const handleToggleFavorite = async (recipeId: string) => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}/favorite`, {
        method: "POST",
      });
      if (res.ok) {
        setRecipes((prev) =>
          prev.map((r) =>
            r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
          )
        );
      }
    } catch (err) {
      console.error("お気に入り更新に失敗しました", err);
    }
  };

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-400 mb-4"></div>
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {showFavorite ? "お気に入りレシピがありません" : "履歴がありません"}
          </div>
        ) : (
          <ul className="space-y-4">
            {recipes.map((r) => (
              <li key={r.id} className="border rounded p-4 bg-white shadow-sm">
                <div className="font-bold flex items-center gap-2">
                  {r.title}
                  <button
                    onClick={() => handleToggleFavorite(r.id)}
                    className={`text-xl ${r.isFavorite ? "text-yellow-400" : "text-gray-300"} hover:scale-110 transition-transform`}
                  >
                    ★
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  材料: {r.ingredients}
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
        )}
      </div>
      <BottomNav />
    </main>
  );
}

export default withAuth(HistoryPage);
