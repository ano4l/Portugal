import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type TranslationRequest = {
  title: string
  excerpt: string
  body: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  if (!authData.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("user_id")
    .eq("user_id", authData.user.id)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: "Editorial access required." }, { status: 403 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "AI translation is not configured." }, { status: 503 })
  }

  let body: TranslationRequest
  try {
    body = (await request.json()) as TranslationRequest
  } catch {
    return NextResponse.json({ error: "Invalid translation request." }, { status: 400 })
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TRANSLATION_MODEL || "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "Translate Education in Portugal editorial content from English to European Portuguese. Preserve Markdown, links, names, facts, tone, and paragraph structure. Return only valid JSON with title, excerpt, and body string fields.",
        },
        { role: "user", content: JSON.stringify(body) },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "article_translation",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              excerpt: { type: "string" },
              body: { type: "string" },
            },
            required: ["title", "excerpt", "body"],
          },
        },
      },
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    return NextResponse.json({ error: "The translation service rejected the request." }, { status: 502 })
  }

  const result = await response.json()
  const outputText = result.output
    ?.flatMap((item: { content?: Array<{ type: string; text?: string }> }) => item.content ?? [])
    .find((item: { type: string }) => item.type === "output_text")?.text

  if (!outputText) {
    return NextResponse.json({ error: "The translation service returned no content." }, { status: 502 })
  }

  return NextResponse.json(JSON.parse(outputText))
}
