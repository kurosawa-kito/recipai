"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import withAuth from "@/components/withAuth";

function IngredientsPage() {
  // 仮のAI認識済み食材リスト
  const [ingredients, setIngredients] = useState(["たまご", "牛乳", "トマト"]);
  const [input, setInput] = useState("");

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

  const handleSave = () => {
    alert("保存しました（ダミー）");
  };

  return (
    <main className="flex flex-col min-h-screen pb-16 bg-white sm:bg-gray-50">
      <AppHeader />
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 pt-20">
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
        <button
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 w-full"
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
