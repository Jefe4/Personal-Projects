import { getProfile, heroJobs, moreJobs } from "@/lib/profile";

export default function ResumePage() {
  const p = getProfile();
  return (
    <main id="main" className="print-resume">
      <h1>{p.identity.name}</h1>
      <p className="mono">
        {p.identity.location} · {p.identity.email} · {p.identity.phone}
        <br />
        {p.identity.linkedin}
        <br />
        {p.identity.github} · {p.identity.languageNote}
      </p>
      <p>{p.identity.summary}</p>
      <h2>Experience</h2>
      {[...heroJobs(), ...moreJobs()].map((job) => (
        <article key={job.org + job.start} className="job">
          <strong>
            {job.title}, {job.org}
          </strong>
          <div className="muted">
            {job.location} · {job.start} – {job.end}
          </div>
          {"assignment" in job && job.assignment ? <div>{job.assignment}</div> : null}
          {job.bullets.length ? (
            <ul>
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
      <h2>Education</h2>
      {p.education.map((ed) => (
        <p key={ed.school}>
          {"line" in ed && ed.line ? ed.line : `${"school" in ed ? ed.school : ""}${"credential" in ed ? ", " + ed.credential : ""} ${"graduated" in ed ? ed.graduated : ""}`}
        </p>
      ))}
      <h2>Skills</h2>
      <p>{p.skills.map((s) => s.name).join(" · ")}</p>
    </main>
  );
}
