"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const ISO = { pos: [11, 13, 11] as [number, number, number], target: [0, 0.4, 0] as [number, number, number] };
const TOP = { pos: [0, 22, 0.15] as [number, number, number], target: [0, 0, 0] as [number, number, number] };

function LoadedMesh({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    const scene = gltf.scene;
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    scene.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    scene.scale.setScalar(10 / maxDim);
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [gltf]);
  return (
    <group ref={group}>
      <primitive object={gltf.scene} />
    </group>
  );
}

/** Schematic dollhouse used when gym.glb is not in the repo yet. Captions match the scan, not invented CV text. */
function GymPlaceholder() {
  const brick = "#6a3d32";
  const floor = "#141414";
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color={floor} roughness={0.92} />
      </mesh>
      <Text position={[0, 0.02, 1.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.55} color="#d8d8d8" anchorX="center" anchorY="middle" letterSpacing={0.12}>
        DMV IRON GYM
      </Text>

      <mesh position={[0, 1.4, -5.9]} castShadow>
        <boxGeometry args={[16, 2.8, 0.12]} />
        <meshStandardMaterial color="#e6c200" roughness={0.55} />
      </mesh>
      <Text position={[0, 1.85, -5.82]} fontSize={0.62} color="#111" anchorX="center" anchorY="middle">
        DON'T QUIT
      </Text>
      <mesh position={[0, 1.85, -5.8]}>
        <boxGeometry args={[3.6, 0.06, 0.02]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <Text position={[0, 1.15, -5.82]} fontSize={0.42} color="#111" anchorX="center" anchorY="middle">
        DO IT
      </Text>

      <mesh position={[0, 1.4, 5.9]}>
        <boxGeometry args={[16, 2.8, 0.12]} />
        <meshStandardMaterial color={brick} roughness={0.85} />
      </mesh>
      <mesh position={[-7.94, 1.4, 0]}>
        <boxGeometry args={[0.12, 2.8, 12]} />
        <meshStandardMaterial color={brick} roughness={0.85} />
      </mesh>
      <mesh position={[7.94, 1.4, -1.5]}>
        <boxGeometry args={[0.12, 2.8, 9]} />
        <meshStandardMaterial color="#2a2a2e" />
      </mesh>
      <Text position={[7.86, 1.7, -1.2]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.38} color="#ff4fa3" anchorX="center">
        DMV IRON GYM
      </Text>

      {[-5, -2.5, 0, 2.5].map((x) => (
        <group key={x} position={[x, 0.7, -3.2]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 1.4, 0.7]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {[-4, -1, 2].map((x) => (
        <mesh key={"b" + x} position={[x, 0.28, 0.4]} castShadow>
          <boxGeometry args={[1.4, 0.35, 0.45]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
      ))}
      <mesh position={[5.2, 0.9, 3.4]} castShadow>
        <boxGeometry args={[1.1, 1.8, 0.8]} />
        <meshStandardMaterial color="#8a1f2b" />
      </mesh>
      <Text position={[-6.2, 2.35, 5.82]} fontSize={0.22} color="#ff2a2a" anchorX="center">
        EXIT
      </Text>
      <mesh position={[4.5, 1.7, 5.82]}>
        <planeGeometry args={[0.7, 0.4]} />
        <meshStandardMaterial color="#3c3b8a" />
      </mesh>
      <mesh position={[5.4, 1.7, 5.82]}>
        <planeGeometry args={[0.7, 0.4]} />
        <meshStandardMaterial color="#1a3a8a" />
      </mesh>
      <mesh position={[6.3, 1.7, 5.82]}>
        <planeGeometry args={[0.7, 0.4]} />
        <meshStandardMaterial color="#8a1515" />
      </mesh>
    </group>
  );
}

function GymLights() {
  return (
    <>
      <color attach="background" args={["#070708"]} />
      <ambientLight intensity={0.07} />
      <directionalLight position={[2, 14, 4]} intensity={0.35} color="#c8d0d8" />
      <spotLight position={[0, 6, -4]} angle={0.55} penumbra={0.5} intensity={3.2} color="#ffe566" castShadow />
      <spotLight position={[0, 5, 1.4]} angle={0.7} penumbra={0.8} intensity={1.8} color="#f2f0e8" />
      <pointLight position={[6, 2.2, -1]} intensity={0.45} color="#ff4fa3" />
      <pointLight position={[-6, 2.4, 5]} intensity={0.35} color="#ff2a2a" />
    </>
  );
}

function CameraCue({ view }: { view: "iso" | "top" }) {
  const { camera } = useThree();
  const dest = view === "top" ? TOP : ISO;
  useEffect(() => {
    camera.position.set(...dest.pos);
    camera.lookAt(...dest.target);
    camera.updateProjectionMatrix();
  }, [view, camera, dest]);
  return null;
}

export function GymScanViewer({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  const [reduce, setReduce] = useState(false);
  const [view, setView] = useState<"iso" | "top">("iso");
  const cam = useMemo(() => (view === "top" ? TOP : ISO), [view]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    fetch("/gym.glb", { method: "HEAD" })
      .then((r) => {
        if (r.ok) setUrl("/gym.glb");
      })
      .catch(() => undefined);
  }, []);

  const captions = (
    <ul className="muted">
      <li>Floor letters: DMV IRON GYM</li>
      <li>Yellow mural: DON&apos;T QUIT, with strike-throughs so it also reads DO IT</li>
      <li>Pink DMV IRON GYM wall graphic</li>
      <li>Red EXIT signs; US flag, Thin Blue Line, Thin Red Line, US Coast Guard seal as wall decor — not a service claim</li>
      <li>Open-ceiling dollhouse of connected bays: racks, dumbbells, benches, vending, brick</li>
    </ul>
  );

  if (reduce) {
    return (
      <div className="card">
        <p className="mono">Reduced motion — no orbit. This file is a gym scan, not a resume.</p>
        {compact ? null : captions}
        <p>
          Written CV facts live on <a href="/resume">/resume</a> (jeffrey.json). Nothing on the mesh is resume text.
        </p>
      </div>
    );
  }

  return (
    <div>
      {compact ? <p className="mono">Orbit preview · staff scan, not a resume</p> : null}
      {compact ? null : (
      <div className="chips" style={{ marginBottom: "0.6rem" }}>
        <button type="button" onClick={() => setView("iso")} aria-pressed={view === "iso"}>
          Isometric
        </button>
        <button type="button" onClick={() => setView("top")} aria-pressed={view === "top"}>
          Top-down
        </button>
        <span className="muted">{url ? "gym.glb loaded" : "placeholder rig — add site/public/gym.glb (Git LFS)"}</span>
      </div>
      )}
      <div className={compact ? "canvas-wrap gym-canvas compact" : "canvas-wrap gym-canvas"} role="img" aria-label="Photogrammetry scan of DMV Iron Gym interior">
        <Canvas shadows camera={{ position: cam.pos, fov: 42, near: 0.1, far: 200 }}>
          <GymLights />
          <CameraCue view={view} />
          <Suspense fallback={null}>{url ? <LoadedMesh url={url} /> : <GymPlaceholder />}</Suspense>
          <OrbitControls makeDefault enablePan target={cam.target} minDistance={4} maxDistance={36} maxPolarAngle={Math.PI / 2.05} />
        </Canvas>
      </div>
      {compact ? null : (
      <div className="card" style={{ marginTop: "0.8rem" }}>
        <p className="mono">On this mesh (nothing else invented)</p>
        {captions}
      </div>
      )}
    </div>
  );
}
