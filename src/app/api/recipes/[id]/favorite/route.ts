import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/prismaClient";

// お気に入りフラグを切り替え
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // レシピを取得
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "レシピが見つかりません" },
        { status: 404 }
      );
    }

    // 自分のレシピかどうかチェック
    if (recipe.userId !== user.id) {
      return NextResponse.json(
        { error: "このレシピを編集する権限がありません" },
        { status: 403 }
      );
    }

    // お気に入りフラグをトグル
    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: { isFavorite: !recipe.isFavorite },
    });

    return NextResponse.json({
      id: updatedRecipe.id,
      isFavorite: updatedRecipe.isFavorite,
    });
  } catch (error) {
    console.error("Favorite toggle error:", error);
    return NextResponse.json(
      { error: "お気に入りの更新に失敗しました" },
      { status: 500 }
    );
  }
}
