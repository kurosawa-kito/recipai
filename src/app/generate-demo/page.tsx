"use client";
import { useState } from "react";
import { appApi } from "@/lib/api";

export default function GenerateDemoPage() {
  const [imageUrl, setImageUrl] = useState("");

  const handleGenerate = async () => {
    setImageUrl("");
    const data = await appApi.images.generate("テスト");
    setImageUrl(data.imageUrl);
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">画像生成デモ</h1>
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        画像生成
      </button>
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="生成画像" className="rounded shadow" />
        </div>
      )}
    </main>
  );
}
