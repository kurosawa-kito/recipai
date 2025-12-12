"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  instructions: string;
  imageUrl: string | null;
  estimatedTime: string | null;
  isFavorite: boolean;
  authorName: string;
  createdAt: string;
  ingredients: { name: string; quantity: string }[];
}

export default function RecipeDetailPage() {
  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("レシピが見つかりません");
          } else {
            setError("レシピの取得に失敗しました");
          }
          return;
        }
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("レシピの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const toggleFavorite = async () => {
    if (!recipe) return;

    setTogglingFavorite(true);
    try {
      const res = await fetch(`/api/recipes/${id}/favorite`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setRecipe({ ...recipe, isFavorite: data.isFavorite });
      } else {
        const data = await res.json();
        alert(data.error || "お気に入りの更新に失敗しました");
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
      alert("お気に入りの更新に失敗しました");
    } finally {
      setTogglingFavorite(false);
    }
  };

  // 手順を配列に変換
  const parseInstructions = (instructions: string): string[] => {
    if (!instructions) return [];
    // 改行区切りまたは番号付きの手順を配列に
    return instructions
      .split(/\n|(?=\d+\.)/)
      .map((s) => s.replace(/^\d+\.?\s*/, "").trim())
      .filter(Boolean);
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen pb-16 bg-white sm:bg-gray-50">
        <AppHeader />
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 pt-20 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
          <p className="text-gray-500">読み込み中...</p>
        </div>
        <BottomNav />
      </main>
    );
  }

  if (error || !recipe) {
    return (
      <main className="flex flex-col min-h-screen pb-16 bg-white sm:bg-gray-50">
        <AppHeader />
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 pt-20 text-center">
          <p className="text-red-500 mb-4">
            {error || "レシピが見つかりません"}
          </p>
          <Link href="/history" className="text-blue-500 hover:underline">
            履歴に戻る
          </Link>
        </div>
        <BottomNav />
      </main>
    );
  }

  const instructions = parseInstructions(recipe.instructions);

  return (
    <main className="flex flex-col min-h-screen pb-16 bg-white sm:bg-gray-50">
      <AppHeader />
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 pt-20">
        {/* 戻るリンク */}
        <Link
          href="/history"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← 履歴に戻る
        </Link>

        {/* 画像 */}
        <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">🍳</span>
          )}
        </div>

        {/* タイトル */}
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          {recipe.title}
          {recipe.isFavorite && <span className="text-yellow-400">★</span>}
        </h1>

        {/* メタ情報 */}
        <div className="mb-2 text-gray-600">
          調理時間: {recipe.estimatedTime || "不明"}
        </div>
        <div className="text-xs text-gray-500 mb-2">by {recipe.authorName}</div>
        <div className="text-xs text-gray-400 mb-4">
          {new Date(recipe.createdAt).toLocaleDateString("ja-JP")}
        </div>

        {/* 説明 */}
        {recipe.description && (
          <p className="text-gray-700 mb-4">{recipe.description}</p>
        )}

        {/* 材料 */}
        <h2 className="font-semibold mt-4 mb-2 text-lg">🥬 材料</h2>
        {recipe.ingredients.length > 0 ? (
          <ul className="space-y-1 mb-4 bg-gray-50 rounded-lg p-4">
            {recipe.ingredients.map((item, i) => (
              <li
                key={i}
                className="flex justify-between py-1 border-b border-gray-100 last:border-0"
              >
                <span>{item.name}</span>
                <span className="text-gray-500">{item.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mb-4">材料情報がありません</p>
        )}

        {/* 手順 */}
        <h2 className="font-semibold mb-2 text-lg">📝 作り方</h2>
        {instructions.length > 0 ? (
          <ol className="space-y-3 mb-4">
            {instructions.map((step, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <p className="flex-1 pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500 mb-4">手順がありません</p>
        )}

        {/* アクションボタン */}
        <div className="flex gap-2 mt-6">
          <button
            className={`flex-1 rounded-lg py-2 font-bold transition ${
              recipe.isFavorite
                ? "bg-yellow-400 text-white hover:bg-yellow-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={toggleFavorite}
            disabled={togglingFavorite}
          >
            {togglingFavorite
              ? "更新中..."
              : recipe.isFavorite
                ? "★ お気に入り解除"
                : "☆ お気に入りに追加"}
          </button>
          <button
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-bold hover:bg-blue-700 transition"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: recipe.title,
                  text: `${recipe.title}のレシピ`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("URLをコピーしました");
              }
            }}
          >
            シェア
          </button>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
