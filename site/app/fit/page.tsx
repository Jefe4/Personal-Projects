import { JobFitPanel } from "@/components/JobFitPanel";

export default function FitPage() {
  return (
    <main id="main" className="wrap">
      <header className="hero">
        <p className="kicker">Must / stretch / missing</p>
        <h1>Job-fit</h1>
        <p className="lede">
          Paste a description. I map Java/Python/SQL/C++/datacenter/gym-systems evidence I actually have. Kubernetes, founder titles, a degree in hand, or Google FTE status stay in the missing column if you ask for them.
        </p>
      </header>
      <JobFitPanel />
    </main>
  );
}
