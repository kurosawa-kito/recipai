"use client";

import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import withAuth from "@/components/withAuth";

function IngredientsPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 初回ロード時にデータベースから材料を取得
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const res = await fetch("/api/ingredients");
      if (res.ok) {
        const data = await res.json();
        if (data.ingredients && Array.isArray(data.ingredients)) {
          setIngredients(
            data.ingredients.map((i: { name: string; id: string }) => i.name)
          );
        }
      }
    } catch (error) {
      console.error("材料取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      if (res.ok) {
        alert("保存しました");
      } else {
        const error = await res.json();
        alert(`保存に失敗しました: ${error.error || "不明なエラー"}`);
      }
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  // 画像から材料を解析
  const handleAnalyzeImages = async (files: FileList) => {
    if (files.length === 0) return;

    setAnalyzing(true);
    const imageUrls: string[] = [];

    try {
      // 1. 画像をBlobにアップロード
      for (const file of Array.from(files)) {
        const res = await fetch(
          `/api/analyze-image?filename=${encodeURIComponent(file.name)}`,
          {
            method: "POST",
            body: file,
          }
        );
        const data = await res.json();
        imageUrls.push(data.url);
      }

      setUploadedImages(imageUrls);

      // 2. 材料解析APIを呼び出し
      const formData = new FormData();
      imageUrls.forEach((url) => formData.append("imageUrl", url));

      const analyzeRes = await fetch("/api/ingredients/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await analyzeRes.json();

      if (result.ingredients && Array.isArray(result.ingredients)) {
        // 既存の材料と重複しないものだけ追加
        const newIngredients = result.ingredients.filter(
          (item: string) => !ingredients.includes(item)
        );
        setIngredients([...ingredients, ...newIngredients]);
      }
    } catch (error) {
      console.error("材料解析エラー:", error);
      alert("材料の解析に失敗しました。もう一度お試しください。");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen pb-16 bg-white sm:bg-gray-50">
      <AppHeader />
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 pt-20">
        <h1 className="text-2xl font-bold mb-4">食材リスト編集</h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : (
          <>
            {/* 画像アップロードセクション */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold mb-3">
                📷 画像から材料を追加
              </h2>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files) {
                    handleAnalyzeImages(e.target.files);
                  }
                }}
              />
              <button
                className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => document.getElementById("imageUpload")?.click()}
                disabled={analyzing}
              >
                {analyzing ? "解析中..." : "冷蔵庫の写真を選ぶ"}
              </button>

              {uploadedImages.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {uploadedImages.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`アップロード画像${idx + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>

            <h2 className="text-lg font-semibold mb-3">
              {ingredients.length > 0 ? "テスト：検出した材料" : "材料リスト"}
            </h2>
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
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </main>
  );
}

export default withAuth(IngredientsPage);
