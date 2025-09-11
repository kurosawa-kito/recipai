import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 食材リストを取得
export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error("食材リスト取得エラー:", error);
    return NextResponse.json(
      { error: "食材リストの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// 食材リストを保存
export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json();

    if (!Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "食材リストの形式が正しくありません" },
        { status: 400 }
      );
    }

    // 既存の食材を削除
    await prisma.ingredient.deleteMany();

    // 新しい食材リストを保存
    const savedIngredients = await Promise.all(
      ingredients.map((name: string) =>
        prisma.ingredient.create({
          data: { name },
        })
      )
    );

    return NextResponse.json({
      message: "食材リストを保存しました",
      ingredients: savedIngredients,
    });
  } catch (error) {
    console.error("食材リスト保存エラー:", error);
    return NextResponse.json(
      { error: "食材リストの保存に失敗しました" },
      { status: 500 }
    );
  }
}
