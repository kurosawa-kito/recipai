"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

function RecipePreviewContent() {
  const searchParams = useSearchParams();
  const title = searchParams?.get("title") || "レシピ";
  const ingredientsStr = searchParams?.get("ingredients") || "";
  const imageUrl = searchParams?.get("imageUrl") || "";

  const ingredients = ingredientsStr ? ingredientsStr.split(",") : [];

  // 材料に基づいた仮のレシピ手順を生成
  const generateSteps = (ingredients: string[]) => {
    if (ingredients.length === 0) {
      return ["材料を準備します", "調理します", "盛り付けて完成"];
    }

    const mainIngredients = ingredients.slice(0, 3).join("、");
    return [
      `${mainIngredients}を準備し、洗って切ります`,
      "フライパンに油を熱し、材料を炒めます",
      "調味料で味を整えます",
      "火が通ったら器に盛り付けます",
      "お好みで薬味を添えて完成です",
    ];
  };

  const steps = generateSteps(ingredients);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <AppHeader />

      <div className="pt-16 px-4 max-w-2xl mx-auto">
        {/* 戻るリンク */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← トップに戻る
        </Link>

        {/* レシピ画像 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-orange-200 to-yellow-200 flex items-center justify-center">
              <span className="text-6xl">🍳</span>
            </div>
          )}
        </div>

        {/* レシピタイトル */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>

        {/* レシピ情報 */}
        <div className="flex gap-4 mb-6 text-sm text-gray-600">
          <span>⏱ 調理時間: 約20分</span>
          <span>👤 1〜2人分</span>
          <span>⭐ 難易度: ★★☆</span>
        </div>

        {/* 材料セクション */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            🥬 材料（{ingredients.length}品目）
          </h2>

          {ingredients.length > 0 ? (
            <ul className="space-y-2">
              {ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-800">{ing}</span>
                  <span className="text-gray-400 text-sm">適量</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">材料情報がありません</p>
          )}
        </div>

        {/* 作り方セクション */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            📝 作り方
          </h2>

          <ol className="space-y-4">
            {steps.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-800">{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ポイント */}
        <div className="bg-yellow-50 rounded-xl p-6 mb-6 border border-yellow-200">
          <h2 className="text-lg font-bold text-yellow-800 mb-2">
            💡 ポイント
          </h2>
          <p className="text-yellow-700 text-sm">
            材料は新鮮なものを使うと、より美味しく仕上がります。
            調味料はお好みで調整してください。
          </p>
        </div>

        {/* 注意書き */}
        <div className="text-center text-gray-400 text-xs mb-6">
          ※ このレシピはAIによる提案です。
          <br />
          実際の調理時は材料や手順を確認してください。
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 bg-gray-200 text-gray-700 rounded-lg py-3 font-bold text-center hover:bg-gray-300 transition"
          >
            別のレシピを探す
          </Link>
          <button
            className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-bold hover:bg-blue-700 transition"
            onClick={() => {
              // TODO: お気に入り保存機能
              alert("お気に入り機能は今後実装予定です");
            }}
          >
            お気に入りに追加
          </button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

export default function RecipePreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          読み込み中...
        </div>
      }
    >
      <RecipePreviewContent />
    </Suspense>
  );
}
