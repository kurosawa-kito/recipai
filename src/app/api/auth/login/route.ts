import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // テスト用の簡易認証（実際のアプリではデータベースを使用）
  const validCredentials = [
    { id: "1", email: "test@example.com", password: "password" },
    { id: "2", email: "user@example.com", password: "123456" },
  ];

  const user = validCredentials.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    // セッションCookie保存（httpOnly: falseでフロントエンドから読み取り可能に）
    const cookieStore = await cookies();
    await cookieStore.set({
      name: "userId",
      value: user.id,
      path: "/",
      httpOnly: false, // フロントエンドから読み取り可能
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return NextResponse.json({ success: true, userId: user.id });
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
