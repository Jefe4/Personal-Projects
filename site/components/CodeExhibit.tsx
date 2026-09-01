import { excerptFor, githubBlob, type Excerpt } from "@/lib/excerpts";

export function CodeExhibit({ slug, label }: { slug: string; label?: string }) {
  const ex: Excerpt | null = excerptFor(slug);
  if (!ex || !ex.code || ex.code.startsWith("// source not")) {
    return <p className="muted">Excerpt not bundled for {slug}.</p>;
  }
  const href = githubBlob(ex.path);
  return (
    <figure>
      <figcaption className="mono">
        {label || ex.path} · lines {ex.startLine}–{ex.endLine} ·{" "}
        <a href={href} target="_blank" rel="noreferrer">
          GitHub blob
        </a>
      </figcaption>
      <pre>
        <code>{ex.code}</code>
      </pre>
    </figure>
  );
}
