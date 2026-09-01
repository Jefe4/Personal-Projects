import Link from "next/link";
import { publicProjects } from "@/lib/profile";

export default function ProjectsPage() {
  const list = publicProjects();
  return (
    <main id="main" className="wrap">
      <header className="hero">
        <p className="kicker">Public proof first</p>
        <h1>Projects</h1>
        <p className="lede">Flagship work is this GitHub repo. WIP items are labeled. Empty README-only repos are not sold as products. Interview-assist tools are not listed.</p>
      </header>
      <div className="grid two">
        {list.map((p) => (
          <article className="card" key={p.slug}>
            <h3>
              <Link href={"/projects/" + p.slug}>{p.name}</Link>
              {p.wip ? <span className="muted"> · WIP</span> : null}
            </h3>
            <p>{p.summary}</p>
            <p className="mono muted">
              {(p.stack || []).join(" · ")}
              {p.path ? " · " + p.path : ""}
            </p>
            {p.github ? (
              <p>
                <a href={p.github}>GitHub</a>
              </p>
            ) : (
              <p className="muted">No public URL — local/WIP.</p>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
