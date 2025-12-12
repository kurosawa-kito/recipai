import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prismaClient";

// ユーザーの材料リストを取得
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        userIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    const ingredients = user.userIngredients.map((ui) => ({
      id: ui.ingredient.id,
      name: ui.ingredient.name,
      quantity: ui.quantity,
      memo: ui.memo,
    }));

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error("Ingredient fetch error:", error);
    return NextResponse.json(
      { error: "材料の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// 材料リストを保存・更新
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { ingredients } = await request.json();
    if (!Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "材料リストが不正です" },
        { status: 400 }
      );
    }

    // ユーザーを取得または作成
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // ユーザーが存在しない場合は作成（NextAuthで作成されているはず）
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // 既存の材料リストをクリア
    await prisma.userIngredient.deleteMany({
      where: { userId: user.id },
    });

    // 新しい材料リストを保存
    for (const ingredientName of ingredients) {
      if (typeof ingredientName !== "string" || !ingredientName.trim()) {
        continue;
      }

      // 材料マスタに存在するか確認、なければ作成
      let ingredient = await prisma.ingredient.findUnique({
        where: { name: ingredientName.trim() },
      });

      if (!ingredient) {
        ingredient = await prisma.ingredient.create({
          data: { name: ingredientName.trim() },
        });
      }

      // ユーザーの材料リストに追加
      await prisma.userIngredient.create({
        data: {
          userId: user.id,
          ingredientId: ingredient.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ingredient save error:", error);
    return NextResponse.json(
      { error: "材料の保存に失敗しました" },
      { status: 500 }
    );
  }
}
