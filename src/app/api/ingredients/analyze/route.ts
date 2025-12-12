import { NextResponse } from "next/server";

// Gemini APIを使用(OpenAIの代わり)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// 材料名の正規化マップ
const normalizeIngredient = (name: string): string => {
  const normalizeMap: Record<string, string> = {
    // 卵系
    egg: "たまご",
    eggs: "たまご",
    卵: "たまご",
    玉子: "たまご",
    // 牛乳系
    milk: "牛乳",
    ミルク: "牛乳",
    // トマト系
    tomato: "トマト",
    tomatoes: "トマト",
    とまと: "トマト",
    // 鶏肉系
    chicken: "鶏肉",
    "chicken breast": "鶏肉",
    "chicken thigh": "鶏もも肉",
    とりにく: "鶏肉",
    // 豚肉系
    pork: "豚肉",
    ぶたにく: "豚肉",
    // 牛肉系
    beef: "牛肉",
    ぎゅうにく: "牛肉",
    // 野菜系
    onion: "玉ねぎ",
    onions: "玉ねぎ",
    たまねぎ: "玉ねぎ",
    carrot: "にんじん",
    carrots: "にんじん",
    人参: "にんじん",
    potato: "じゃがいも",
    potatoes: "じゃがいも",
    ジャガイモ: "じゃがいも",
    cabbage: "キャベツ",
    きゃべつ: "キャベツ",
    lettuce: "レタス",
    れたす: "レタス",
    // その他
    cheese: "チーズ",
    butter: "バター",
    bread: "パン",
    rice: "米",
    こめ: "米",
  };

  const lower = name.toLowerCase().trim();
  return normalizeMap[lower] || name;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageUrls: string[] = [];

    // 複数画像対応
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      if (key === "imageUrl" && typeof value === "string") {
        imageUrls.push(value);
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json({ error: "画像URLが必要です" }, { status: 400 });
    }

    // OpenAI Vision APIで画像を解析
    const allIngredients: Set<string> = new Set();

    for (const imageUrl of imageUrls) {
      try {
        // 画像をBase64に変換
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString("base64");

        // Gemini APIに送信
        const response = await fetch(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: 'この画像に写っている食材をすべてリストアップしてください。JSON形式で、配列として返してください。例: {"ingredients": ["たまご", "牛乳", "トマト"]}。日本語で返してください。',
                    },
                    {
                      inline_data: {
                        mime_type: "image/jpeg",
                        data: base64Image,
                      },
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          console.error("Gemini API error:", await response.text());
          continue;
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) continue;

        // JSONレスポンスをパース
        try {
          // JSONブロックを抽出（```json ... ``` の形式に対応）
          const jsonMatch =
            content.match(/```json\s*([\s\S]*?)\s*```/) ||
            content.match(/\{[\s\S]*\}/);

          if (jsonMatch) {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const parsed = JSON.parse(jsonStr);
            if (parsed.ingredients && Array.isArray(parsed.ingredients)) {
              parsed.ingredients.forEach((ingredient: string) => {
                const normalized = normalizeIngredient(ingredient);
                allIngredients.add(normalized);
              });
            }
          }
        } catch {
          // JSONパースに失敗した場合、テキストから材料を抽出
          console.warn("JSON parse failed, extracting from text:", content);
          const lines = content.split("\n");
          lines.forEach((line: string) => {
            const match = line.match(/[「『"](.+?)[」』"]/);
            if (match) {
              const normalized = normalizeIngredient(match[1]);
              allIngredients.add(normalized);
            }
          });
        }
      } catch (imageError) {
        console.error("Image analysis error:", imageError);
      }
    }

    const ingredients = Array.from(allIngredients);

    return NextResponse.json({
      ingredients,
      count: ingredients.length,
      analyzed: imageUrls.length,
    });
  } catch (error) {
    console.error("Ingredient analysis error:", error);
    return NextResponse.json(
      {
        error: "材料の解析に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
