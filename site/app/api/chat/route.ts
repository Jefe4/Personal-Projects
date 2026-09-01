import { NextRequest, NextResponse } from "next/server";
import { answerFromRetrieval, maybeOpenAI, type ChatTurn } from "@/lib/retrieve";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const messages = (body.messages || []) as ChatTurn[];
  const last = [...messages].reverse().find((m) => m.role === "user");
  const query = last?.content || "";
  const { answer, facts, highlights } = answerFromRetrieval(query);
  const llm = await maybeOpenAI(query, messages, facts);
  return NextResponse.json({
    reply: llm || answer,
    highlights,
    usedOpenAI: Boolean(llm),
  });
}
