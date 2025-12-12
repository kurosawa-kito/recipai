import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prismaClient";

// ユーザーのレシピ一覧を取得（履歴用）
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const favoriteOnly = searchParams.get("favorite") === "true";
    const keyword = searchParams.get("keyword") || "";

    const recipes = await prisma.recipe.findMany({
      where: {
        userId: user.id,
        ...(favoriteOnly ? { isFavorite: true } : {}),
        ...(keyword
          ? {
              OR: [
                { title: { contains: keyword, mode: "insensitive" } },
                { description: { contains: keyword, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      recipes: recipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        estimatedTime: recipe.estimatedTime,
        isFavorite: recipe.isFavorite,
        createdAt: recipe.createdAt,
        ingredients: recipe.recipeIngredients
          .map((ri) => ri.ingredient.name)
          .join(", "),
      })),
    });
  } catch (error) {
    console.error("Recipes fetch error:", error);
    return NextResponse.json(
      { error: "レシピの取得に失敗しました" },
      { status: 500 }
    );
  }
}
