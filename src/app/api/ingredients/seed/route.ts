import { NextResponse } from "next/server";
import prisma from "@/prismaClient";

// テスト用の食材データを追加
export async function POST() {
  try {
    const sampleIngredients = [
      "たまご",
      "牛乳",
      "トマト",
      "玉ねぎ",
      "にんじん",
      "じゃがいも",
      "鶏肉",
      "豚肉",
      "米",
      "パン",
    ];

    // 既存の食材を削除
    await prisma.ingredient.deleteMany();

    // サンプル食材を追加
    const createdIngredients = await Promise.all(
      sampleIngredients.map((name) =>
        prisma.ingredient.create({
          data: { name },
        })
      )
    );

    return NextResponse.json({
      message: "サンプル食材データを追加しました",
      count: createdIngredients.length,
      ingredients: createdIngredients,
    });
  } catch (error) {
    console.error("シードデータ追加エラー:", error);
    
    const errorMessage = error instanceof Error ? error.message : "不明なエラー";
    
    return NextResponse.json(
      { 
        error: "サンプルデータの追加に失敗しました",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
