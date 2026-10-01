"use client";

import dynamic from "next/dynamic";
import type { DemoKind } from "@/lib/case-studies";
import { GraphDemo } from "./GraphDemo";
import { HashDemo } from "./HashDemo";
import { FlashcardDemo, KnowledgeDemo, LibraryDemo, ListDemo, SqlDemo, TcpDemo } from "./MiniDemos";

const GymScanViewer = dynamic(() => import("@/components/GymScanViewer").then((m) => m.GymScanViewer), {
  ssr: false,
  loading: () => <p className="muted">Loading the gym scan…</p>,
});

export function DemoSlot({ kind }: { kind: DemoKind }) {
  if (kind === "graph") return <GraphDemo />;
  if (kind === "hash") return <HashDemo />;
  if (kind === "flash") return <FlashcardDemo />;
  if (kind === "tcp") return <TcpDemo />;
  if (kind === "library") return <LibraryDemo />;
  if (kind === "list") return <ListDemo />;
  if (kind === "sql") return <SqlDemo />;
  if (kind === "kg") return <KnowledgeDemo />;
  return <GymScanViewer compact />;
}
