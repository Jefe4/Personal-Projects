import { KnowledgeGraphView } from "@/components/KnowledgeGraphView";

export default function GraphPage() {
  return (
    <main id="main" className="wrap">
      <header className="hero">
        <p className="kicker">Provenance on every edge</p>
        <h1>Knowledge graph</h1>
        <p className="lede">
          People, orgs, schools, and flagship repo projects from jeffrey.json. Hover an edge for the source (resume date or GitHub path). The recruiter chat can highlight nodes when it talks about Akkodis, the gym, Frostburg, or the graph/hash/TCP work.
        </p>
      </header>
      <KnowledgeGraphView />
    </main>
  );
}
