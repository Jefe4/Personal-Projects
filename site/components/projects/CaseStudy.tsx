"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Profile } from "@/lib/profile";
import { studyFor } from "@/lib/case-studies";
import { CodeExhibit } from "@/components/CodeExhibit";
import { useUi } from "@/components/UiProvider";
import { DemoSlot } from "@/components/demos/DemoSlot";
import { excerptFor } from "@/lib/excerpts";
import { ProjectCard } from "./ProjectCard";

type Project = Profile["projects"][number];

function CaveatList({ lines }: { lines?: string[] }) {
  if (!lines?.length) return null;
  return (
    <aside className="caveat-callout">
      <strong>Keep these limits in view</strong>
      <ul>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </aside>
  );
}

export function CaseStudy({ project, related }: { project: Project; related: Project[] }) {
  const { ui } = useUi();
  const reduce = useReducedMotion();
  const [active, setActive] = useState("problem");
  const study = studyFor(project.slug);
  const excerpt = "excerptFile" in project && project.excerptFile ? project.excerptFile : null;
  const wip = "wip" in project && project.wip;
  const privateRepo = "privateRepo" in project && Boolean(project.privateRepo);
  const placeholder = "placeholder" in project && Boolean(project.placeholder);
  const sourceComing = "sourceComing" in project && Boolean(project.sourceComing);
  const sitePath = "sitePath" in project && project.sitePath ? project.sitePath : null;

  const chapters: { id: string; title: string; body: ReactNode }[] = [
    {
      id: "problem",
      title: "Problem",
      body: <p>{study.problem}</p>,
    },
  ];

  if (study.constraints?.length) {
    chapters.push({
      id: "constraints",
      title: "Constraints",
      body: (
        <ul>
          {study.constraints.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ),
    });
  }

  chapters.push({
      id: "built",
      title: study.decisions ? "Decisions" : "What I built",
      body: (
        <ul>
          {study.built.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ),
    });

  if (study.result?.length) {
    chapters.push({
      id: "result",
      title: "Measured result",
      body: (
        <ul>
          {study.result.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ),
    });
  }

  if (study.history?.length) {
    chapters.push({
      id: "history",
      title: "Older QA, kept as history",
      body: (
        <ul>
          {study.history.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ),
    });
  }

  if (study.quotes?.length) {
    chapters.push({
      id: "excerpt",
      title: "Excerpt",
      body: (
        <>
          {study.quotes.map((quote) => (
            <figure key={quote.caption}>
              <figcaption className="mono">{quote.caption}</figcaption>
              <pre tabIndex={0}>
                <code>{quote.code}</code>
              </pre>
            </figure>
          ))}
        </>
      ),
    });
  }

  chapters.push(
    {
      id: "stack",
      title: "Stack",
      body: (
        <>
          <div className="chips">
            {(project.stack || []).map((s) => (
              <span key={s}>{s}</span>
            ))}
            {wip ? <span>WIP</span> : null}
          </div>
          <p className="mono">
            {project.path ? project.path : "No path in this repo"}
            {project.github ? (
              <>
                {" · "}
                <a href={project.github}>GitHub</a>
              </>
            ) : (
              " · no public repo"
            )}
            {sitePath ? (
              <>
                {" · "}
                <Link href={sitePath}>{sitePath}</Link>
              </>
            ) : null}
          </p>
        </>
      ),
    },
  );

  if (excerpt) {
    chapters.push({
      id: "code",
      title: "Live code",
      body: <CodeExhibit slug={project.slug} label={excerpt} privateRepo={privateRepo} />,
    });
  }

  if (study.demo) {
    chapters.push({
      id: "demo",
      title: "Try it",
      body: (
        <>
          <p className="muted">{study.demoNote}</p>
          <DemoSlot kind={study.demo} />
        </>
      ),
    });
  }

  chapters.push({
    id: "probe",
    title: "How a recruiter can probe it",
    body: (
      <ol className="probe">
        {study.probe.map((line) => (
          <li key={line}>
            <code>{line}</code>
          </li>
        ))}
      </ol>
    ),
  });

  chapters.push({
    id: "related",
    title: "Related",
    body: (
      <div className="project-grid">
        {related.map((item, i) => (
          <ProjectCard key={item.slug} project={item} index={i} />
        ))}
      </div>
    ),
  });

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".chapter"));
    if (!nodes.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [project.slug]);

  const enter = reduce
    ? false
    : ui === "editorial"
      ? { opacity: 0, y: 18 }
      : ui === "spatial"
        ? { opacity: 0, y: 28, scale: 0.985 }
        : ui === "showcase"
          ? { opacity: 0 }
          : { opacity: 0, y: 22 };

  if (ui === "showcase") {
    const bundled = excerpt ? excerptFor(project.slug) : null;
    const showCode = Boolean(bundled && bundled.code && !bundled.code.startsWith("// source not"));
    return (
      <main id="main" className={reduce ? "home-showcase case-showcase reduce" : "home-showcase case-showcase"}>
        <section className="showcase-screen" aria-labelledby="showcase-project">
          {study.demo ? (
            <div className="showcase-visual showcase-visual-live">
              <DemoSlot kind={study.demo} />
            </div>
          ) : showCode ? (
            <div className="showcase-visual showcase-visual-code" aria-hidden="true">
              <CodeExhibit slug={project.slug} label={excerpt || undefined} privateRepo={privateRepo} />
            </div>
          ) : study.quotes?.[0] ? (
            <div className="showcase-visual showcase-visual-code" aria-hidden="true">
              <pre>
                <code>{study.quotes[0].code}</code>
              </pre>
            </div>
          ) : (
            <div className="showcase-visual showcase-field" aria-hidden="true" />
          )}
          <div className="showcase-copy">
            <p className="kicker">
              {sourceComing ? "In progress, source coming" : placeholder ? "Placeholder" : wip ? "Work in progress" : "Project"}
              {privateRepo ? " · private repo" : ""}
            </p>
            <h1 id="showcase-project">{project.name}</h1>
            <p className="sub">{project.summary}</p>
            <CaveatList lines={study.caveats} />
          </div>
          <div className="showcase-actions">
            <a className="pill solid" href="#problem">
              View project
            </a>
            {showCode ? (
              <a className="pill ghost" href="#code">
                See code
              </a>
            ) : study.quotes?.length ? (
              <a className="pill ghost" href="#excerpt">
                See code
              </a>
            ) : null}
          </div>
        </section>
        {chapters.map((c) => (
          <section key={c.id} id={c.id} className="showcase-screen showcase-chapter">
            <div className="showcase-copy">
              <h2>{c.title}</h2>
            </div>
            <div className="showcase-body">{c.body}</div>
          </section>
        ))}
      </main>
    );
  }

  return (
    <main id="main" className={`wrap case case-${ui}`}>
      <header className="case-hero">
        <p className="kicker">
          {sourceComing ? "In progress, source coming" : placeholder ? "Placeholder" : wip ? "Work in progress" : "Case study"}
          {privateRepo ? " · private repo" : ""} · {(project.stack || []).join(" · ") || "notes"}
        </p>
        <h1>{project.name}</h1>
        <p className="lede">{project.summary}</p>
        <CaveatList lines={study.caveats} />
        <p>
          <Link href="/projects">All projects</Link>
          {" · "}
          <Link href="/">Home</Link>
        </p>
      </header>
      <div className="case-layout">
        <nav className="chapter-nav" aria-label="Chapters">
          {chapters.map((c, i) => (
            <a key={c.id} href={`#${c.id}`} aria-current={active === c.id ? "true" : undefined}>
              <span>{String(i + 1).padStart(2, "0")}</span> {c.title}
            </a>
          ))}
        </nav>
        <div className="chapters">
          {chapters.map((c, i) => (
            <motion.section
              key={c.id}
              id={c.id}
              className="chapter"
              initial={enter}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow">
                {String(i + 1).padStart(2, "0")} — {c.title}
              </p>
              <h2>{c.title}</h2>
              {c.body}
            </motion.section>
          ))}
        </div>
      </div>
    </main>
  );
}
