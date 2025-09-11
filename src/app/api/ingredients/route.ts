import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prismaClient";

// 食材リストを取得
export async function GET() {
  try {
    console.log("食材リストの取得を開始");

    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: "asc" },
    });

    console.log("取得した食材数:", ingredients.length);
    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error("食材リスト取得エラー:", error);
    
    const errorMessage = error instanceof Error ? error.message : "不明なエラー";
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : { message: String(error) };
    
    console.error("エラーの詳細:", errorDetails);
    
    return NextResponse.json(
      { 
        error: "食材リストの取得に失敗しました",
        details: errorMessage 
      },
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
    
    const errorMessage = error instanceof Error ? error.message : "不明なエラー";
    
    return NextResponse.json(
      { 
        error: "食材リストの保存に失敗しました",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
