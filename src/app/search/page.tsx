"use client";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  // 仮データ: 公開レシピ
  const recipes = [
    {
      id: 1,
      title: "ふわとろオムレツ",
      authorName: "他ユーザーA",
      ingredients: "たまご, 牛乳, バター",
      isFavorite: false,
      isPublic: true,
    },
    {
      id: 2,
      title: "鶏肉のトマト煮",
      authorName: "他ユーザーB",
      ingredients: "鶏肉, トマト, 玉ねぎ",
      isFavorite: true,
      isPublic: true,
    },
    {
      id: 3,
      title: "野菜スープ",
      authorName: "他ユーザーC",
      ingredients: "にんじん, じゃがいも, 玉ねぎ",
      isFavorite: false,
      isPublic: true,
    },
  ];
  const filtered = recipes.filter(
    (r) =>
      r.isPublic &&
      (keyword === "" ||
        r.title.includes(keyword) ||
        r.ingredients.includes(keyword) ||
        (r.authorName && r.authorName.includes(keyword)))
  );
  return (
    <main className="flex flex-col min-h-screen pb-16 bg-white">
      <AppHeader />
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 pt-20">
        <h1 className="text-2xl font-bold mb-4">レシピ検索</h1>
        <input
          className="border rounded px-2 py-1 w-full mb-4"
          placeholder="レシピ名・材料・ユーザー名で検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <ul className="space-y-4">
          {filtered.length === 0 && (
            <li className="text-gray-400 text-center py-8">
              該当するレシピがありません
            </li>
          )}
          {filtered.map((r) => (
            <li key={r.id} className="border rounded p-4 bg-white shadow-sm">
              <div className="font-bold flex items-center gap-2">
                {r.title}
                {r.isFavorite && <span className="text-yellow-400">★</span>}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                by {r.authorName}
              </div>
              <div className="text-sm text-gray-500">
                材料例: {r.ingredients}
              </div>
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
