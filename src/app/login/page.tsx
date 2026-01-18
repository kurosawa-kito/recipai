"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("ログイン中にエラーが発生しました");
    } finally {
      setLoading(false);
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
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-500">
        アカウントをお持ちでない方は新規登録へ
      </p>
    </main>
  );
}
