"use client";

import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import withAuth from "@/components/withAuth";
import { appApi } from "@/lib/api";

function IngredientsPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    if (input.trim() && !ingredients.includes(input.trim())) {
      setIngredients([...ingredients, input.trim()]);
      setInput("");
    }
  };

  const handleRemove = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleChange = (idx: number, value: string) => {
    setIngredients(ingredients.map((item, i) => (i === idx ? value : item)));
  };

  // 初期データの読み込み
  useEffect(() => {
    fetchIngredients();
  }, []);

  // 食材リストを取得
  const fetchIngredients = async () => {
    try {
      const data = await appApi.ingredients.getAll();
      setIngredients(data.ingredients.map((item: any) => item.name));
    } catch (error) {
      console.error("食材リスト取得エラー:", error);
      setMessage("食材リストの取得に失敗しました");
    }
  };

  const handleSave = async () => {
    if (ingredients.length === 0) {
      setMessage("食材を追加してください");
      return;
    }

    setMessage("");

    try {
      const data = await appApi.ingredients.save(ingredients);
      setMessage("保存しました！");
      // 保存成功後、最新のデータを再取得
      await fetchIngredients();
    } catch (error) {
      console.error("保存エラー:", error);
      setMessage("保存に失敗しました");
    }
  };

  return (
    <main className="flex flex-col min-h-screen pb-16 bg-white sm:bg-gray-50 pt-14">
      <AppHeader />
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4">食材リスト編集</h1>
        <ul className="mb-4">
          {ingredients.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 mb-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                value={item}
                onChange={(e) => handleChange(idx, e.target.value)}
              />
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleRemove(idx)}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded px-2 py-1 flex-1"
            placeholder="食材を追加"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            onClick={handleAdd}
          >
            追加
          </button>
        </div>
        {message && (
          <div
            className={`text-center p-2 mb-4 rounded ${
              message.includes("失敗")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
        <button
          className="px-6 py-2 rounded w-full bg-green-500 hover:bg-green-600 text-white"
          onClick={handleSave}
        >
          保存
        </button>
      </div>
      <BottomNav />
    </main>
  );
}

export default withAuth(IngredientsPage);
