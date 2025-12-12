import { NextResponse } from "next/server";
import prisma from "@/prismaClient";

// レシピ詳細を取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "レシピが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      imageUrl: recipe.imageUrl,
      estimatedTime: recipe.estimatedTime,
      isFavorite: recipe.isFavorite,
      isPublic: recipe.isPublic,
      authorName: recipe.authorName || recipe.user.email.split("@")[0],
      createdAt: recipe.createdAt,
      ingredients: recipe.recipeIngredients.map((ri) => ({
        name: ri.ingredient.name,
        quantity: ri.quantity,
      })),
    });
  } catch (error) {
    console.error("Recipe fetch error:", error);
    return NextResponse.json(
      { error: "レシピの取得に失敗しました" },
      { status: 500 }
    );
  }
}
