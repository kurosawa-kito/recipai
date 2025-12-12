"use client";
import { useState, useEffect } from "react";
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

function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recipes?favorite=true");
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
      setError("お気に入りレシピの取得に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (recipeId: string) => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}/favorite`, {
        method: "POST",
      });
      if (res.ok) {
        // お気に入り解除後、リストから削除
        setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
      }
    } catch (err) {
      console.error("お気に入り解除に失敗しました", err);
    }
  };

  return (
    <main className="flex flex-col min-h-screen pb-16 bg-white sm:bg-gray-50">
      <AppHeader />
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 pt-20">
        <h1 className="text-2xl font-bold mb-4">お気に入りレシピ</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-400 mb-4"></div>
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">お気に入りレシピがありません</p>
            <Link href="/history" className="text-blue-500 hover:underline">
              履歴からお気に入りを追加する
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {recipes.map((r) => (
              <li key={r.id} className="border rounded p-4 bg-white shadow-sm">
                <div className="font-bold flex items-center justify-between">
                  <span>{r.title}</span>
                  <button
                    onClick={() => handleRemoveFavorite(r.id)}
                    className="text-yellow-400 text-xl hover:scale-110 transition-transform"
                    title="お気に入りから削除"
                  >
                    ★
                  </button>
                </div>
                <div className="text-sm text-gray-500 mt-1">
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

export default withAuth(FavoritesPage);
