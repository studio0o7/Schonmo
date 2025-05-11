import { ReactNode, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function CameraRig({ children, basePosition }: { children: ReactNode; basePosition: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    const [bx, by, bz] = basePosition;
    camera.position.set(bx, by, bz);
    camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
} 