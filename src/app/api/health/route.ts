/// <reference types="node" />
import { NextResponse } from "next/server";
import prisma from "@/prismaClient";

// ヘルスチェック用API
export async function GET() {
  try {
    console.log("ヘルスチェック開始");

    // 環境変数の確認
    const databaseUrl = process.env.DATABASE_URL;
    console.log("DATABASE_URL設定:", databaseUrl ? "設定済み" : "未設定");

    // Prisma接続テスト
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log("データベース接続: OK");

    // テーブル存在確認
    try {
      const count = await prisma.ingredient.count();
      console.log("ingredientテーブル存在: OK, レコード数:", count);
      
      return NextResponse.json({
        status: "healthy",
        database: "connected",
        ingredientTable: "exists",
        recordCount: count,
        timestamp: new Date().toISOString()
      });
    } catch (tableError) {
      console.error("テーブルエラー:", tableError);
      
      return NextResponse.json({
        status: "warning",
        database: "connected",
        ingredientTable: "missing or error",
        error: tableError instanceof Error ? tableError.message : "unknown",
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

  } catch (error) {
    console.error("ヘルスチェックエラー:", error);
    
    return NextResponse.json({
      status: "unhealthy",
      database: "disconnected",
      error: error instanceof Error ? error.message : "unknown",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
