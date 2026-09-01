import { notFound } from "next/navigation";
import { projectBySlug } from "@/lib/profile";
import { CodeExhibit } from "@/components/CodeExhibit";
import { githubBlob } from "@/lib/excerpts";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  return (
    <main id="main" className="wrap">
      <header className="hero">
        <p className="kicker">{(p.stack || []).join(" · ")}</p>
        <h1>{p.name}</h1>
        <p className="lede">{p.summary}</p>
        <p className="mono">
          {p.path ? p.path + " · " : ""}
          {p.github ? (
            <a href={p.github}>GitHub</a>
          ) : (
            <span className="muted">no public repo</span>
          )}
          {p.excerptFile ? (
            <>
              {" · "}
              <a href={githubBlob(p.excerptFile)}>blob</a>
            </>
          ) : null}
          {"sitePath" in p && p.sitePath ? (
            <>
              {" · "}
              <a href={p.sitePath}>{p.sitePath}</a>
            </>
          ) : null}
        </p>
      </header>
      {p.slug === "gym-scan" ? (
        <p>
          <a href="/gym">Open the orbit viewer</a>. Written CV is on /resume — this mesh has no resume text.
        </p>
      ) : p.flagship && p.excerptFile ? (
        <section>
          <h2>Live excerpt from this repo</h2>
          <CodeExhibit slug={p.slug} label={p.excerptFile} />
        </section>
      ) : (
        <p className="muted">This item is documented from the resume/WIP notes, not as a fake live demo.</p>
      )}
    </main>
  );
}
