"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/profile";
import { excerptFor } from "@/lib/excerpts";
import { SCROLL_CHAPTERS, type ScrollChapter } from "@/lib/scroll-chapters";
import { CodeExhibit } from "@/components/CodeExhibit";
import { KnowledgeGraphView } from "@/components/KnowledgeGraphView";
import { GraphDemo } from "@/components/demos/GraphDemo";
import { ContactBlock } from "./bits";

const GymScanViewer = dynamic(() => import("@/components/GymScanViewer").then((m) => m.GymScanViewer), {
  ssr: false,
  loading: () => <p className="muted">Loading the gym scan…</p>,
});

function firstSentence(text: string) {
  const match = text.match(/^.*?[.!?](\s|$)/);
  return (match ? match[0] : text).trim();
}

function hasCode(slug: string | undefined) {
  if (!slug) return false;
  const excerpt = excerptFor(slug);
  return Boolean(excerpt && excerpt.code && !excerpt.code.startsWith("// source not"));
}

function Backdrop({ chapter }: { chapter: ScrollChapter }) {
  if (chapter.id === "gym-scan" || chapter.id === "gym-role") {
    return (
      <div className="showcase-visual showcase-visual-gym">
        <GymScanViewer compact />
      </div>
    );
  }
  if (chapter.id === "graph") {
    return (
      <div className="showcase-visual showcase-visual-live">
        <GraphDemo />
      </div>
    );
  }
  if (chapter.id === "knowledge-graph") {
    return (
      <div className="showcase-visual showcase-visual-live">
        <KnowledgeGraphView />
      </div>
    );
  }
  if (chapter.slug && hasCode(chapter.slug)) {
    return (
      <div className="showcase-visual showcase-visual-code" aria-hidden="true">
        <CodeExhibit slug={chapter.slug} />
      </div>
    );
  }
  return <div className="showcase-visual showcase-field" data-kicker={chapter.kicker} aria-hidden="true" />;
}

function ChapterScreen({ chapter }: { chapter: ScrollChapter }) {
  const code = hasCode(chapter.slug);
  return (
    <section className="showcase-screen" id={chapter.id} aria-labelledby={`showcase-${chapter.id}`}>
      <Backdrop chapter={chapter} />
      <div className="showcase-copy">
        <p className="kicker">{chapter.kicker}</p>
        <h2 id={`showcase-${chapter.id}`}>{chapter.title}</h2>
        <p className="sub">{firstSentence(chapter.plain)}</p>
      </div>
      <div className="showcase-actions">
        {chapter.href ? (
          <Link className="pill solid" href={chapter.href}>
            View project
          </Link>
        ) : (
          <Link className="pill solid" href="/resume">
            One-pager
          </Link>
        )}
        {code && chapter.slug ? (
          <Link className="pill ghost" href={`/projects/${chapter.slug}#code`}>
            See code
          </Link>
        ) : null}
      </div>
    </section>
  );
}

export function ShowcaseHome({ profile }: { profile: Profile }) {
  const reduce = useReducedMotion();
  const id = profile.identity;
  return (
    <main id="main" className={reduce ? "home-showcase reduce" : "home-showcase"}>
      <section className="showcase-screen" aria-labelledby="showcase-name">
        <div className="showcase-visual showcase-visual-gym">
          <GymScanViewer compact />
        </div>
        <div className="showcase-copy">
          <h1 id="showcase-name">{id.name}</h1>
          <p className="sub">{id.headline}</p>
        </div>
        <div className="showcase-actions">
          <a className="pill solid" href="#akkodis">
            View work
          </a>
          <Link className="pill ghost" href="/resume">
            One-pager
          </Link>
        </div>
      </section>
      {SCROLL_CHAPTERS.map((chapter) => (
        <ChapterScreen key={chapter.id} chapter={chapter} />
      ))}
      <section className="showcase-screen" id="contact" aria-labelledby="showcase-contact">
        <div className="showcase-visual showcase-field" aria-hidden="true" />
        <div className="showcase-copy">
          <p className="kicker">Contact</p>
          <h2 id="showcase-contact">Ask, or write.</h2>
          <p className="sub">The chat answers from the resume file.</p>
        </div>
        <div className="showcase-contact">
          <ContactBlock identity={id} />
        </div>
      </section>
    </main>
  );
}
