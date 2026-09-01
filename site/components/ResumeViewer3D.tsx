"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Html, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import profile from "@/content/jeffrey.json";

function LoadedMesh({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} dispose={null} />;
}

function EmptyRig() {
  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.6, 0.08, 1.1]} />
        <meshStandardMaterial color="#c4a574" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.7, 0.9]} />
        <meshStandardMaterial color="#1b1e24" metalness={0.2} roughness={0.55} />
      </mesh>
      <Html position={[0, 1.05, 0]} center>
        <div style={{ color: "#ece8df", fontFamily: "IBM Plex Mono, monospace", fontSize: 12, textAlign: "center", width: 220 }}>
          Resume mesh pending
          <br />
          drop GLB at site/public/resume.glb
        </div>
      </Html>
    </group>
  );
}

export function ResumeViewer3D() {
  const [url, setUrl] = useState<string | null>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    fetch("/resume.glb", { method: "HEAD" }).then((r) => {
      if (r.ok) setUrl("/resume.glb");
    });
  }, []);

  if (reduce) {
    const id = profile.identity;
    return (
      <div className="card">
        <p className="kicker mono">Reduced motion — static layout from verified JSON</p>
        <h2>{id.name}</h2>
        <p>
          {id.headline} · {id.location}
        </p>
        <p>
          {id.email} · {id.phone}
        </p>
        <p className="muted">3D orbit is off because of reduced-motion. Use /resume for the one-pager.</p>
      </div>
    );
  }

  return (
    <div className="canvas-wrap" role="img" aria-label="Interactive 3D resume viewer">
      <Canvas shadows camera={{ position: [2.4, 1.6, 2.8], fov: 42 }}>
        <color attach="background" args={["#050607"]} />
        <ambientLight intensity={0.35} />
        <spotLight position={[4, 6, 3]} angle={0.4} penumbra={0.6} intensity={2} castShadow />
        <pointLight position={[-3, 2, -2]} intensity={0.6} color="#c4a574" />
        <Suspense fallback={null}>{url ? <LoadedMesh url={url} /> : <EmptyRig />}</Suspense>
        <ContactShadows opacity={0.45} scale={8} blur={2.2} far={4} />
        <Environment preset="warehouse" />
        <OrbitControls enablePan makeDefault />
      </Canvas>
    </div>
  );
}
