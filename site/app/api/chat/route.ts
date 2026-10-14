import { NextRequest, NextResponse } from "next/server";
import { guardRecruiterAnswer } from "@/lib/answer-guard";
import { answerFromRetrieval, maybeOpenAI, type ChatTurn } from "@/lib/retrieve";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const messages = (body.messages || []) as ChatTurn[];
  const last = [...messages].reverse().find((m) => m.role === "user");
  const query = last?.content || "";
  const { answer, facts, highlights } = answerFromRetrieval(query);
  const llm = await maybeOpenAI(query, messages, facts);
  const guarded = guardRecruiterAnswer(llm || answer);
  return NextResponse.json({
    reply: guarded.text,
    flags: guarded.flags,
    highlights,
    usedOpenAI: Boolean(llm),
  });
}
