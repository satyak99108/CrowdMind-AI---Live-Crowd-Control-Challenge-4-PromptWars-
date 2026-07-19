import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { Edges } from "@react-three/drei";

const DEFAULT_BG_HEX = "#0e0e10";
const DEFAULT_LINE_HEX = "#58585e";
const LINE_WIDTH = 1.2;

let activeBgHex = DEFAULT_BG_HEX;
let activeLineHex = DEFAULT_LINE_HEX;

function makeStripeTexture(opacity = 0.35) {
  const size = 64;
  const lineSpacing = 4;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = `rgba(${activeLineHex === DEFAULT_LINE_HEX ? '88, 88, 94' : '120, 120, 130'}, ${opacity})`;
  ctx.lineWidth = 1;
  for (let y = 0; y < size; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(size, y + 0.5);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  return tex;
}

function useStripeMaterial(opacity = 0.35) {
  const texture = useMemo(() => makeStripeTexture(opacity), [opacity]);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
      }),
    [texture]
  );
  return mat;
}

function SlowSpin({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });
  return <group ref={ref}>{children}</group>;
}

function StripeFace({
  position,
  rotation,
  args,
  opacity = 0.35,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  args?: [number, number];
  opacity?: number;
}) {
  const texture = useMemo(() => makeStripeTexture(opacity), [opacity]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={args || [1.3, 1.3]} />
      <meshBasicMaterial map={texture} transparent side={THREE.FrontSide} depthWrite={false} />
    </mesh>
  );
}

function StripedBox({
  width = 1.3,
  height = 1.3,
  depth = 1.3,
  opacity = 0.25,
}: {
  width?: number;
  height?: number;
  depth?: number;
  opacity?: number;
}) {
  const hx = width / 2 + 0.01;
  const hy = height / 2 + 0.01;
  const hz = depth / 2 + 0.01;
  const faces: { pos: [number, number, number]; rot: [number, number, number]; args: [number, number] }[] = [
    { pos: [0, 0, hz], rot: [0, 0, 0], args: [width, height] },
    { pos: [0, 0, -hz], rot: [0, Math.PI, 0], args: [width, height] },
    { pos: [hx, 0, 0], rot: [0, Math.PI / 2, 0], args: [depth, height] },
    { pos: [-hx, 0, 0], rot: [0, -Math.PI / 2, 0], args: [depth, height] },
    { pos: [0, hy, 0], rot: [-Math.PI / 2, 0, 0], args: [width, depth] },
    { pos: [0, -hy, 0], rot: [Math.PI / 2, 0, 0], args: [width, depth] },
  ];
  return (
    <>
      {faces.map((f, i) => (
        <StripeFace key={i} position={f.pos} rotation={f.rot} args={f.args} opacity={opacity} />
      ))}
    </>
  );
}

function CubeHighlight() {
  return (
    <SlowSpin>
      <group rotation={[Math.PI * 0.15, Math.PI * 0.25, 0]}>
        <mesh>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshBasicMaterial transparent opacity={0} />
          <Edges lineWidth={LINE_WIDTH} color={activeLineHex} />
        </mesh>
        <StripedBox width={1.3} height={1.3} depth={1.3} opacity={0.3} />
      </group>
    </SlowSpin>
  );
}

function StackedCubes() {
  return (
    <SlowSpin>
      <group rotation={[Math.PI * 0.15, Math.PI * 0.25, 0]}>
        {[0.5, 0, -0.5].map((y, i) => (
          <group key={i} position={[i * 0.12, y, -i * 0.12]}>
            <mesh>
              <boxGeometry args={[0.7, 0.35, 0.7]} />
              <meshBasicMaterial color={activeBgHex} toneMapped={false} />
              <Edges lineWidth={LINE_WIDTH} color={activeLineHex} />
            </mesh>
            <StripedBox width={0.7} height={0.35} depth={0.7} opacity={0.2} />
          </group>
        ))}
      </group>
    </SlowSpin>
  );
}

function Prism() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const s = 0.75;
    shape.moveTo(0, s);
    shape.lineTo(-s * 0.866, -s * 0.5);
    shape.lineTo(s * 0.866, -s * 0.5);
    shape.closePath();
    const extrudeSettings = { depth: 0.8, bevelEnabled: false };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const mat = useStripeMaterial(0.25);

  return (
    <SlowSpin>
      <group rotation={[Math.PI * 0.15, Math.PI * 0.25, 0]}>
        <mesh geometry={geometry} position={[0, 0, -0.4]} material={mat} />
        <mesh geometry={geometry} position={[0, 0, -0.4]}>
          <meshBasicMaterial transparent opacity={0} />
          <Edges lineWidth={LINE_WIDTH} color={activeLineHex} />
        </mesh>
      </group>
    </SlowSpin>
  );
}

const LOGOS = [
  { name: "Cube", component: CubeHighlight },
  { name: "Stacked", component: StackedCubes },
  { name: "Prism", component: Prism },
];

function CameraZoomController({ zoom }: { zoom: number }) {
  const { camera } = useThree();

  useEffect(() => {
    const ortho = camera as THREE.OrthographicCamera;
    ortho.zoom = zoom;
    ortho.updateProjectionMatrix();
  }, [camera, zoom]);

  return null;
}

export { LOGOS };

export function Logo3D({ variant = 0, size = 28, zoom: zoomOverride, bgHex, lineHex }: { variant?: number; size?: number; zoom?: number; bgHex?: string; lineHex?: string }) {
  const LogoComponent = LOGOS[variant]?.component || CubeHighlight;

  activeBgHex = bgHex || DEFAULT_BG_HEX;
  activeLineHex = lineHex || DEFAULT_LINE_HEX;

  const zoom = zoomOverride ?? size * (200 / 28);

  return (
    <div style={{ width: size, height: size }} className="shrink-0">
      <Canvas
        flat
        orthographic
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], zoom: zoom }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <CameraZoomController zoom={zoom} />
        <LogoComponent />
      </Canvas>
    </div>
  );
}
