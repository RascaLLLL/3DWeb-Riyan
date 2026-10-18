"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxGeometry, CylinderGeometry, Group, IcosahedronGeometry, MeshStandardMaterial } from "three";
import { playerConfig } from "@/data/player";
import { useGameStore } from "@/stores/game-store";
import type { PlayerRuntimeRef } from "@/types/player";

/** Local feet origin, facing +Z. Replace this visual without changing the capsule/controller. */
export function CivilianCharacter({ runtime }: { runtime: PlayerRuntimeRef }) {
  const root = useRef<Group>(null), torso = useRef<Group>(null), head = useRef<Group>(null);
  const leftLeg = useRef<Group>(null), rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null), rightArm = useRef<Group>(null);
  const phase = useRef(0), systemReducedMotion = useRef(false);
  const reducedMotion = useGameStore((state) => state.playerPreferences.reducedMotion);
  const resources = useMemo(() => ({
    box: new BoxGeometry(1, 1, 1), round: new IcosahedronGeometry(1, 0),
    tunic: new CylinderGeometry(.72, 1, 1, 6),
    materials: {
      tunic: new MeshStandardMaterial({ color: "#b49568", roughness: 1, flatShading: true }),
      trousers: new MeshStandardMaterial({ color: "#746451", roughness: 1 }),
      leather: new MeshStandardMaterial({ color: "#5a3c2b", roughness: 1 }),
      satchel: new MeshStandardMaterial({ color: "#967045", roughness: 1 }),
      skin: new MeshStandardMaterial({ color: "#c8946b", roughness: 1, flatShading: true }),
      hair: new MeshStandardMaterial({ color: "#50392a", roughness: 1, flatShading: true }),
      dark: new MeshStandardMaterial({ color: "#2f3228", roughness: 1 }),
      buckle: new MeshStandardMaterial({ color: "#c0a265", roughness: .8 }),
    },
  }), []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { systemReducedMotion.current = media.matches; };
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => () => {
    resources.box.dispose(); resources.round.dispose(); resources.tunic.dispose();
    Object.values(resources.materials).forEach((material) => material.dispose());
  }, [resources]);
  useFrame((_, delta) => {
    const state = runtime.current;
    if (!root.current || !torso.current || !head.current || !leftLeg.current || !rightLeg.current || !leftArm.current || !rightArm.current) return;
    root.current.rotation.y = state.heading;
    root.current.visible = state.cameraActualDistance > .6;
    if (state.state === "paused") return;
    const dt = Math.min(delta, .05), smoothing = 1 - Math.exp(-14 * dt);
    phase.current += state.speed * dt * 3.5;
    const moving = Math.min(1, state.speed / 1.5), stride = Math.sin(phase.current) * moving * (state.state === "running" ? .85 : .52);
    leftLeg.current.rotation.x += (stride - leftLeg.current.rotation.x) * smoothing;
    rightLeg.current.rotation.x += (-stride - rightLeg.current.rotation.x) * smoothing;
    leftArm.current.rotation.x += (-stride * .65 - leftArm.current.rotation.x) * smoothing;
    const wave = state.animation === "interacting" ? -2.25 + Math.sin(state.elapsed * 12) * .22 : stride * .65;
    rightArm.current.rotation.x += (wave - rightArm.current.rotation.x) * smoothing;
    rightArm.current.rotation.z += ((state.animation === "interacting" ? -.35 : -.08) - rightArm.current.rotation.z) * smoothing;
    torso.current.rotation.y += (Math.max(-.25, Math.min(.25, state.turnAmount * .18)) - torso.current.rotation.y) * smoothing;
    head.current.rotation.y = -torso.current.rotation.y * .5;
    const quiet = reducedMotion || systemReducedMotion.current;
    torso.current.position.y = quiet ? 0 : Math.sin(state.elapsed * 2) * .012 * (1 - moving);
    root.current.position.y = -playerConfig.centerHeight + (quiet ? 0 : Math.abs(Math.sin(phase.current)) * .025 * moving);
  });
  const { box, round, tunic, materials: m } = resources;
  return <group ref={root} position={[0, -playerConfig.centerHeight, 0]} dispose={null}>
    <group ref={leftLeg} position={[-.17, .8, 0]}>
      <mesh geometry={box} material={m.trousers} position={[0, -.28, 0]} scale={[.23, .57, .26]} castShadow />
      <mesh geometry={box} material={m.leather} position={[0, -.65, .055]} scale={[.26, .25, .4]} castShadow />
    </group>
    <group ref={rightLeg} position={[.17, .8, 0]}>
      <mesh geometry={box} material={m.trousers} position={[0, -.28, 0]} scale={[.23, .57, .26]} castShadow />
      <mesh geometry={box} material={m.leather} position={[0, -.65, .055]} scale={[.26, .25, .4]} castShadow />
    </group>
    <group ref={torso}>
      <mesh geometry={tunic} material={m.tunic} position={[0, 1.09, 0]} scale={[.37, .66, .29]} castShadow />
      <mesh geometry={box} material={m.leather} position={[0, .89, 0]} scale={[.66, .1, .49]} castShadow />
      <mesh geometry={box} material={m.buckle} position={[0, .89, .26]} scale={[.13, .1, .035]} />
      <mesh geometry={box} material={m.leather} position={[0, 1.15, .23]} rotation={[0, 0, -.55]} scale={[.065, .72, .06]} />
      <mesh geometry={box} material={m.leather} position={[0, 1.15, -.23]} rotation={[0, 0, -.55]} scale={[.065, .72, .06]} />
      <mesh geometry={box} material={m.satchel} position={[.41, .83, 0]} scale={[.25, .33, .28]} castShadow />
      <mesh geometry={box} material={m.leather} position={[.42, .94, .15]} scale={[.25, .13, .035]} />
      <mesh geometry={round} material={m.buckle} position={[.42, .88, .18]} scale={.035} />
      <group ref={leftArm} position={[-.37, 1.3, 0]} rotation={[0, 0, .08]}>
        <mesh geometry={box} material={m.tunic} position={[0, -.17, 0]} scale={[.25, .37, .28]} castShadow />
        <mesh geometry={round} material={m.skin} position={[0, -.44, 0]} scale={[.12, .16, .12]} castShadow />
      </group>
      <group ref={rightArm} position={[.37, 1.3, 0]} rotation={[0, 0, -.08]}>
        <mesh geometry={box} material={m.tunic} position={[0, -.17, 0]} scale={[.25, .37, .28]} castShadow />
        <mesh geometry={round} material={m.skin} position={[0, -.44, 0]} scale={[.12, .16, .12]} castShadow />
      </group>
      <mesh geometry={box} material={m.skin} position={[0, 1.43, 0]} scale={[.17, .2, .17]} />
      <group ref={head} position={[0, 1.67, 0]}>
        <mesh geometry={round} material={m.skin} scale={[.26, .29, .25]} castShadow />
        <mesh geometry={round} material={m.hair} position={[0, .14, -.02]} scale={[.28, .2, .26]} castShadow />
        <mesh geometry={box} material={m.skin} position={[0, -.02, .25]} scale={[.075, .09, .09]} />
        {[-1, 1].map((side) => <group key={side}>
          <mesh geometry={round} material={m.skin} position={[side * .26, -.01, 0]} scale={[.06, .09, .07]} />
          <mesh geometry={box} material={m.dark} position={[side * .095, .03, .225]} scale={[.035, .045, .04]} />
        </group>)}
      </group>
    </group>
  </group>;
}
