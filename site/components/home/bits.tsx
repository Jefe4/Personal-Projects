import type { Profile } from "@/lib/profile";

export function JobPanels({ jobs }: { jobs: Profile["experience"] }) {
  return (
    <>
      {jobs.map((job) => (
        <article className="job-panel" key={job.org + job.title}>
          <p className="mono job-meta">
            {job.start} – {job.end}
            {job.current ? " · now" : ""}
          </p>
          <h3>
            {job.title}
            <span> {job.org}</span>
          </h3>
          <p className="muted">
            {job.location}
            {"address" in job && job.address ? ` · ${job.address}` : ""}
          </p>
          {"assignment" in job && job.assignment ? <p>{job.assignment}</p> : null}
          {"owner" in job && job.owner ? <p className="muted">{job.owner}</p> : null}
          {job.bullets.length ? (
            <ul>
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </>
  );
}

export function EducationBlocks({ education }: { education: Profile["education"] }) {
  return (
    <>
      {education.map((ed) => (
        <article className="job-panel" key={ed.school}>
          <h3>{ed.school}</h3>
          {"line" in ed && ed.line ? <p>{ed.line}</p> : null}
          {"credential" in ed ? (
            <p>
              {ed.credential}
              {"graduated" in ed && ed.graduated ? ` · ${ed.graduated}` : ""}
              {"location" in ed && ed.location ? ` · ${ed.location}` : ""}
            </p>
          ) : null}
          {"status" in ed && ed.status === "enrolled" ? <p className="muted">Still enrolled. Not a completed degree.</p> : null}
          {"notes" in ed && ed.notes ? <p className="muted">{ed.notes.join(" · ")}</p> : null}
          {"athletics" in ed && ed.athletics ? <p className="muted">{ed.athletics.detail}</p> : null}
        </article>
      ))}
    </>
  );
}

export function SkillRow({ skills }: { skills: Profile["skills"] }) {
  return (
    <div className="chips" aria-label="Skills">
      {skills.map((s) => (
        <span key={s.name} title={s.evidence}>
          {s.name}
        </span>
      ))}
    </div>
  );
}

export function ContactBlock({ identity }: { identity: Profile["identity"] }) {
  return (
    <ul className="contact-list">
      <li>
        <a href={`mailto:${identity.email}`}>{identity.email}</a>
      </li>
      <li>
        <a href={`tel:${identity.phone.replace(/[^\d+]/g, "")}`}>{identity.phone}</a>
      </li>
      <li>
        <a href={identity.linkedin}>LinkedIn</a>
      </li>
      <li>
        <a href={identity.github}>GitHub · Jefe4</a>
      </li>
      <li>{identity.location}</li>
      <li>{identity.languageNote}</li>
    </ul>
  );
}
