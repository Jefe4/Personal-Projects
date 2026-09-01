import Link from "next/link";
import { getProfile, heroJobs } from "@/lib/profile";

export default function OpsPage() {
  const p = getProfile();
  const gym = heroJobs().find((j) => j.org.includes("Iron"));
  const dc = heroJobs().find((j) => j.org === "Akkodis");
  return (
    <main id="main" className="wrap">
      <header className="hero">
        <p className="kicker">Operator narrative · not a founder page</p>
        <h1>Gym-floor systems + datacenter floor</h1>
        <p className="lede">
          Same facts as the recruiter briefing. Different emphasis: I keep rooms and racks running. I am a Team Member and Systems Administrator at DMV Iron Gym — Leo Torres Williams is founder/CEO — and a Datacenter Technician at Akkodis on a Google data center assignment in Leesburg.
        </p>
        <div className="cta">
          <Link className="ghost" href="/">
            Recruiter briefing
          </Link>
        </div>
      </header>
      <section>
        <h2>Datacenter</h2>
        <p>
          {dc?.title} — {dc?.org}. {dc?.assignment}. {dc?.bullets.join(" ")}
        </p>
      </section>
      <section>
        <h2>Gym operations (staff)</h2>
        <p>
          {gym?.title} — {gym?.org}, {gym?.address}. {gym?.owner}
        </p>
        <ul>
          {gym?.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>How this maps</h2>
        <p>{p.roleFit.datacenter_it}</p>
        <p>{p.roleFit.gym_product}</p>
      </section>
    </main>
  );
}
