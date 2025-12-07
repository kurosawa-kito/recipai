"use client";
import Link from "next/link";
import { Camera, ChefHat, Heart, Sparkles } from "lucide-react";
import HamburgerMenu from "@/components/HamburgerMenu";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = require("next/navigation").useRouter();

  // 画像URLがpublic配下の場合はBlobにアップロードしてからAPI保存
  const uploadImageToBlob = async (imageUrl: string): Promise<string> => {
    if (!imageUrl.startsWith("/")) return imageUrl;
    // public配下の画像をfetch→Blobアップロード
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const file = new File([blob], imageUrl.split("/").pop() || "image.png", {
      type: blob.type,
    });
    const { upload } = await import("@vercel/blob/client");
    const { url } = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "",
    });
    return url;
  };

  // レシピ候補画像を生成APIで取得
  const handleShowRecipes = async () => {
    setModalOpen(true);
    setLoading(true);
    // 5件分画像生成APIを呼ぶ
    const results = await Promise.all(
      Array(5)
        .fill(0)
        .map(() =>
          fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: "おすすめレシピ" }),
          })
            .then((res) => res.json())
            .then((data) => data.imageUrl)
        )
    );
    setImages(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 pb-16">
      {/* ヘッダー */}
      <AppHeader />

      {/* メインコンテンツ */}
      <main className="pt-14">
        {/* ヒーローセクション */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              冷蔵庫の写真を撮るだけで
              <span className="text-primary-600 block">
                美味しいレシピを提案
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              AIが冷蔵庫の中身を認識して、あなたにぴったりのレシピを提案します。
              食材の無駄をなくし、毎日の献立を楽しく簡単に。
            </p>

            {/* アップロード機能 */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full p-4 mb-4 inline-block">
                <span className="text-3xl">📷</span>
              </div>

              {/* 冷蔵庫を撮るボタンとinput[type=file]（カメラ起動・複数可） */}
              <input
                id="cameraInput"
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                style={{ display: "none" }}
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  // 1枚ずつblobにアップロード
                  const uploadedUrls: string[] = [];
                  for (const file of Array.from(files)) {
                    const res = await fetch(
                      `/api/analyze-image?filename=${encodeURIComponent(file.name)}`,
                      {
                        method: "POST",
                        body: file,
                      }
                    );
                    const data = await res.json();
                    uploadedUrls.push(data.url);
                  }
                  // 画像プレビュー（1枚目のみ表示例）
                  setImages((prev) => [uploadedUrls[0], ...prev.slice(1)]);
                  // 必要に応じてuploadedUrlsを利用
                }}
              />
              <button
                className="w-full bg-blue-600 text-white rounded-lg py-3 mb-3 font-bold text-lg hover:bg-blue-700 transition"
                onClick={() => {
                  document.getElementById("cameraInput")?.click();
                }}
              >
                冷蔵庫を撮る
              </button>

              {/* 写真を選ぶボタンとinput[type=file] */}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  // 1枚ずつblobにアップロード
                  const uploadedUrls: string[] = [];
                  for (const file of Array.from(files)) {
                    const res = await fetch(
                      `/api/analyze-image?filename=${encodeURIComponent(file.name)}`,
                      {
                        method: "POST",
                        body: file,
                      }
                    );
                    const data = await res.json();
                    uploadedUrls.push(data.url);
                  }
                  // 画像プレビュー（1枚目のみ表示例）
                  setImages((prev) => [uploadedUrls[0], ...prev.slice(1)]);
                  // 必要に応じてuploadedUrlsを利用
                }}
              />
              <button
                className="w-full bg-gray-200 text-gray-700 rounded-lg py-3 mb-3 font-bold text-lg hover:bg-gray-300 transition"
                onClick={() => {
                  document.getElementById("fileInput")?.click();
                }}
              >
                写真を選ぶ
              </button>

              {/* デモ用：テスト画像から選ぶ（複数選択可） */}
              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-2">
                  🧪 テスト画像から選ぶ（タップで選択/解除）
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "/images/analyze_image_test/fridge.jpeg",
                    "/images/analyze_image_test/110797_01-1.jpg",
                    "/images/analyze_image_test/21-11-05-ogp.jpg",
                    "/images/analyze_image_test/img01-1.jpg",
                  ].map((src, idx) => {
                    const isSelected = images.includes(src);
                    return (
                      <button
                        key={idx}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition relative ${
                          isSelected
                            ? "border-green-500"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            // 選択解除
                            setImages((prev) =>
                              prev.filter((img) => img !== src)
                            );
                          } else {
                            // 選択追加
                            setImages((prev) => [...prev.filter(Boolean), src]);
                          }
                        }}
                      >
                        <img
                          src={src}
                          alt={`テスト画像${idx + 1}`}
                          className="object-cover w-full h-full"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 選択済み画像のサムネイル表示 */}
              {images.filter(Boolean).length > 0 && (
                <div className="flex gap-2 mb-3 w-full overflow-x-auto">
                  {images.filter(Boolean).map((img, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded overflow-hidden border bg-gray-100 flex items-center justify-center flex-shrink-0"
                    >
                      <img
                        src={img}
                        alt={`選択画像${idx + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* レシピ候補を表示するボタン */}
              <button
                className="w-full bg-yellow-400 text-white rounded-lg py-3 font-bold text-lg hover:bg-yellow-500 transition"
                onClick={handleShowRecipes}
              >
                レシピ候補を見る
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="border border-primary-600 text-primary-600 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors"
              >
                ログインして履歴・お気に入りを見る
              </Link>
            </div>
          </div>
        </section>

        {/* 機能紹介セクション */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                3つの簡単ステップ
              </h2>
              <p className="text-lg text-gray-600">
                誰でも簡単に美味しいレシピが見つかります
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  1. 写真を撮る
                </h3>
                <p className="text-gray-600">
                  冷蔵庫の中身をスマートフォンで撮影するだけ
                </p>
              </div>

              <div className="text-center">
                <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-secondary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  2. AIが解析
                </h3>
                <p className="text-gray-600">
                  AIが食材を自動認識し、最適なレシピを検索
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  3. 調理開始
                </h3>
                <p className="text-gray-600">
                  詳しい手順を見ながら美味しい料理を作る
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                RECIPAIの特徴
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  高精度なAI認識
                </h3>
                <p className="text-gray-600">
                  Google Cloud Vision AIを使用し、食材を正確に認識します
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  豊富なレシピ
                </h3>
                <p className="text-gray-600">
                  OpenAI GPT-4により、無限のレシピバリエーションを提供
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  お気に入り機能
                </h3>
                <p className="text-gray-600">
                  気に入ったレシピを保存して、いつでも確認できます
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  食材管理
                </h3>
                <p className="text-gray-600">
                  認識した食材リストを編集・追加して正確な提案を受けられます
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  レシピ履歴
                </h3>
                <p className="text-gray-600">
                  過去のレシピ提案を振り返って、再度作ることができます
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  簡単操作
                </h3>
                <p className="text-gray-600">
                  直感的なUIで、誰でも簡単に使えるデザインです
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* レシピ候補モーダル */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[320px] max-w-full p-4 flex flex-col items-center relative">
            <button
              className="absolute top-2 right-2 text-gray-400 text-2xl"
              onClick={() => setModalOpen(false)}
              aria-label="閉じる"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4">おすすめレシピ候補</h2>
            {loading ? (
              <div className="text-center py-8">画像生成中...</div>
            ) : (
              <div className="w-full overflow-x-auto flex gap-4 pb-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="min-w-[280px] max-w-[280px] bg-gray-50 border rounded-xl shadow p-4 flex-shrink-0 flex flex-col items-stretch h-[420px]"
                  >
                    <div className="h-40 w-full bg-gray-200 rounded mb-3 flex items-center justify-center overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={`レシピ${i + 1}`}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        "画像"
                      )}
                    </div>
                    <div className="font-bold text-lg mb-1">
                      レシピ候補 {i + 1}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      材料例: たまご, 牛乳, トマト
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span>調理時間: 20分</span>
                      <span>・</span>
                      <span>難易度: ★★☆</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      カロリー: 350kcal
                    </div>
                    <div className="text-xs text-gray-700 mb-3 line-clamp-3">
                      ふわふわ卵とトマトの優しい味わい。忙しい日でも簡単に作れるおすすめレシピです。
                    </div>
                    <div className="flex-1" />
                    <button
                      className="w-full bg-blue-600 text-white rounded py-2 font-bold hover:bg-blue-700 transition mt-2"
                      disabled={saving}
                      onClick={async () => {
                        setSaving(true);
                        // セッションCookieからuserId取得
                        const getUserId = () => {
                          const match = document.cookie.match(/userId=([^;]+)/);
                          return match ? match[1] : "";
                        };
                        const userId = getUserId();
                        const recipeData = {
                          title: `レシピ候補${i + 1}`,
                          description:
                            "ふわふわ卵とトマトの優しい味わい。忙しい日でも簡単に作れるおすすめレシピです。",
                          instructions: "材料を混ぜる。焼く。盛り付ける。",
                          imageUrl: img,
                          estimatedTime: "20分",
                          userId,
                        };
                        const res = await fetch("/api/save-recipe", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(recipeData),
                        });
                        const data = await res.json();
                        setSaving(false);
                        setModalOpen(false);
                        if (data.id) {
                          router.push(`/recipes/${data.id}`);
                        } else {
                          alert("保存に失敗しました");
                        }
                      }}
                    >
                      {saving ? "保存中..." : "このレシピを選ぶ"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">
              左右にスライドして選択できます
            </div>
          </div>
        </div>
      )}

      <BottomNav />

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ChefHat className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-2xl font-bold">RECIPAI</span>
            </div>
            <p className="text-gray-400 mb-4">
              AIが提案する美味しいレシピで、毎日の食事をもっと楽しく
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                プライバシーポリシー
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                利用規約
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
