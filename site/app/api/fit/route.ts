import { NextRequest, NextResponse } from "next/server";
import { fitJob } from "@/lib/jobfit";
import { answerFromRetrieval } from "@/lib/retrieve";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const jd = String(body.jobDescription || "");
  const fit = fitJob(jd);
  const chat = answerFromRetrieval("How do I fit this role? " + jd.slice(0, 400));
  return NextResponse.json({ ...fit, narrative: chat.answer, highlights: chat.highlights });
}
