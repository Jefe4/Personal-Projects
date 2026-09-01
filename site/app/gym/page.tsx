"use client";

import dynamic from "next/dynamic";

const GymScanViewer = dynamic(() => import("@/components/GymScanViewer").then((m) => m.GymScanViewer), {
  ssr: false,
});

export default function GymPage() {
  return (
    <main id="main" className="wrap">
      <header className="hero">
        <p className="kicker">Photogrammetry · Falls Church floor · staff, not owner</p>
        <h1>Gym scan / digital twin</h1>
        <p className="lede">
          I captured a walkable 3D scan of the DMV Iron Gym I work in — open-ceiling dollhouse of connected bays — toward QR/AR gym software (Swift / RealityKit, GymMasterPro, WIP). Orbit and zoom. This is <strong>not</strong> a 3D paper resume and has zero readable CV text. Written resume facts are on{" "}
          <a href="/resume">/resume</a>.
        </p>
      </header>
      <GymScanViewer />
    </main>
  );
}
