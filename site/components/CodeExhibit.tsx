import { excerptFor, githubBlob, type Excerpt } from "@/lib/excerpts";

export function CodeExhibit({ slug, label, privateRepo }: { slug: string; label?: string; privateRepo?: boolean }) {
  const ex: Excerpt | null = excerptFor(slug);
  if (!ex || !ex.code || ex.code.startsWith("// source not")) {
    return <p className="muted">Excerpt not bundled for {slug}.</p>;
  }
  const href = githubBlob(ex.path);
  return (
    <figure>
      <figcaption className="mono">
        {label || ex.path} · lines {ex.startLine}–{ex.endLine}
        {privateRepo ? " · private repo" : (
          <>
            {" · "}
            <a href={href} target="_blank" rel="noreferrer">
              GitHub blob
            </a>
          </>
        )}
      </figcaption>
      <pre>
        <code>{ex.code}</code>
      </pre>
    </figure>
  );
}
