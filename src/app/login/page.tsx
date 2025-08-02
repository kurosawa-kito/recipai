"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // API認証
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      // 認証成功: セッション保存はAPI側で
      // 少し待ってからリダイレクト（Cookie設定の反映のため）
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } else {
      setError("ログインに失敗しました");
    }
  };
  const defaultEmail = "test@example.com";
  const defaultPassword = "password";
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <div className="font-bold mb-1">テスト用アカウント</div>
        <div className="mb-2">
          <strong>アカウント1:</strong>
        </div>
        <div>
          メールアドレス: <span className="font-mono">test@example.com</span>
        </div>
        <div className="mb-2">
          パスワード: <span className="font-mono">password</span>
        </div>
        <div className="mb-2">
          <strong>アカウント2:</strong>
        </div>
        <div>
          メールアドレス: <span className="font-mono">user@example.com</span>
        </div>
        <div>
          パスワード: <span className="font-mono">123456</span>
        </div>
      </div>
      <div className="mb-2 text-gray-600 text-sm">
        ※ テスト環境です。上記のテスト用アカウントでログインできます。
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <input
          className="border rounded px-2 py-1"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ログイン
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-500">
        アカウントをお持ちでない方は新規登録へ
      </p>
    </main>
  );
}
