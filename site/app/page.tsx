import Link from "next/link";
import { flagshipProjects, getProfile, heroJobs } from "@/lib/profile";
import { CodeExhibit } from "@/components/CodeExhibit";

export default function HomePage() {
  const p = getProfile();
  const jobs = heroJobs();
  const projects = flagshipProjects();
  return (
    <main id="main" className="wrap">
      <header className="hero">
        <p className="kicker">Arlington, VA / DC metro · EN/ES</p>
        <h1>{p.identity.name}</h1>
        <p className="lede">{p.identity.summary}</p>
        <div className="cta">
          <a href="#chat-hint">Chat with recruiter bot</a>
          <Link className="ghost" href="/projects">
            View projects
          </Link>
          <Link className="ghost" href="/gym">
            Gym scan
          </Link>
          <Link className="ghost" href="/fit">
            Paste a JD
          </Link>
        </div>
        <p id="chat-hint" className="muted mono">
          Chat stays docked on the right. No API key required.
        </p>
      </header>

      <section>
        <h2>About</h2>
        <p>
          I rack hardware and pull fiber in Leesburg as a Datacenter Technician for Akkodis (Google data center assignment — not a Google FTE). I study CS at Frostburg (expected June 2027). Evenings and weekends I keep gym systems moving at DMV Iron Gym in Falls Church as staff, not ownership.
        </p>
      </section>

      <section>
        <h2>Experience</h2>
        {jobs.map((job) => (
          <article className="job" key={job.org + job.title}>
            <h3>
              {job.title} — {job.org}
            </h3>
            <p className="muted mono">
              {job.location} · {job.start} – {job.end}
            </p>
            {"assignment" in job && job.assignment ? <p>{job.assignment}</p> : null}
            <ul>
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
        <p>
          <Link href="/resume">Older roles</Link> (Under Armour, Advance Auto Parts, UPS, Chick-fil-A) live on the one-pager, not this hero timeline.
        </p>
      </section>

      <section>
        <h2>Skills</h2>
        <div className="chips">
          {p.skills.map((s) => (
            <span key={s.name} title={s.evidence}>
              {s.name}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2>Projects in this repo</h2>
        <div className="grid two">
          {projects.map((proj) => (
            <article className="card" key={proj.slug}>
              <h3>
                <Link href={"/projects/" + proj.slug}>{proj.name}</Link>
              </h3>
              <p className="muted">{proj.summary}</p>
              <p className="mono">
                {proj.stack.join(" · ")}
                {proj.path ? " · " + proj.path : ""}
              </p>
              {proj.excerptFile ? <CodeExhibit slug={proj.slug} /> : null}
              {"sitePath" in proj && proj.sitePath ? (
                <p>
                  <Link href={proj.sitePath}>Open interactive scan</Link>
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Education</h2>
        {p.education.map((ed) => (
          <article className="job" key={ed.school}>
            <h3>{ed.school}</h3>
            <p>{"line" in ed && ed.line ? ed.line : `${"credential" in ed ? ed.credential : ""} ${"graduated" in ed ? ed.graduated : ""}`}</p>
            {"notes" in ed && ed.notes ? <p className="muted">{ed.notes.join(" · ")}</p> : null}
          </article>
        ))}
      </section>
    </main>
  );
}
