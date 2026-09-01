"use client";

import dynamic from "next/dynamic";

const ResumeViewer3D = dynamic(() => import("@/components/ResumeViewer3D").then((m) => m.ResumeViewer3D), {
  ssr: false,
});

export default function ThreeDPage() {
  return (
    <main id="main" className="wrap">
      <header className="hero">
        <p className="kicker">glTF · orbit · no OCR yet</p>
        <h1>3D resume</h1>
        <p className="lede">
          Recruiter can orbit and zoom. The mesh file belongs at <code>site/public/resume.glb</code>. Until it is there, you get the lighting rig and a brass slab — not invented resume text. Reduced-motion users get a static layout from jeffrey.json.
        </p>
      </header>
      <ResumeViewer3D />
    </main>
  );
}
