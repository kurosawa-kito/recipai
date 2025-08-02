"use client";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import withAuth from "@/components/withAuth";

function FavoritesPage() {
  return (
    <main className="flex flex-col min-h-screen pb-16 bg-white sm:bg-gray-50">
      <AppHeader />
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 pt-20">
        <h1 className="text-2xl font-bold mb-4">お気に入りレシピ</h1>
        {/* カテゴリ分けUIは後で追加 */}
        <ul className="space-y-4">
          {[1, 2].map((i) => (
            <li key={i} className="border rounded p-4 bg-white shadow-sm">
              <div className="font-bold">お気に入りレシピ {i}</div>
              <button className="text-blue-500 hover:underline mt-2">
                詳細を見る
              </button>
            </li>
          ))}
        </ul>
      </div>
      <BottomNav />
    </main>
  );
}

export default withAuth(FavoritesPage);
