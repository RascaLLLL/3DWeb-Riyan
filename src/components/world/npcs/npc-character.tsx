"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useGameStore } from "@/stores/game-store";
import { useDialogueStore } from "@/stores/dialogue-store";
import { useInteractionStore } from "@/stores/interaction-store";
import { shortestAngle } from "@/systems/player/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { NpcDefinition } from "@/types/npc";
import type { PlayerRuntimeRef } from "@/types/player";
import type { NpcResources } from "./npc-resources";
import { NpcCostume, NpcHandProp, NpcHeadDetails } from "./npc-costume";

export function NpcCharacter({ npc, runtime, resources }: { npc: NpcDefinition; runtime: PlayerRuntimeRef; resources: NpcResources }) {
  const root = useRef<Group>(null), torso = useRef<Group>(null), head = useRef<Group>(null), right = useRef<Group>(null), left = useRef<Group>(null);
  const motion = useRef({ elapsed: npc.rotation * 2, wasNear: false, wave: 0 });
  const quiet = useReducedMotion();
  useFrame((_, delta) => {
    if (!root.current || !torso.current || !head.current || !left.current || !right.current) return;
    const conversation = useDialogueStore.getState();
    const talking = conversation.session?.npcId === npc.id;
    if (useGameStore.getState().gamePaused && !talking) return;
    const near = useInteractionStore.getState().nearbyNpcId === npc.id, state = motion.current, dt = Math.min(delta, .05);
    if (near && !state.wasNear && npc.animations.wave) state.wave = 1.4;
    state.wasNear = near; state.elapsed += dt; state.wave = Math.max(0, state.wave - dt);
    const player = runtime.current.position;
    const yaw = near || talking ? Math.atan2(player.x - npc.position[0], player.z - npc.position[2]) : npc.rotation;
    root.current.rotation.y += shortestAngle(root.current.rotation.y, yaw) * (1 - Math.exp(-npc.animations.turnSpeed * dt));
    const t = state.elapsed, settings = npc.animations;
    torso.current.position.y = quiet ? 0 : Math.sin(t * settings.idle.frequency) * settings.idle.breathing;
    torso.current.rotation.z = quiet ? 0 : Math.sin(t * .7) * settings.idle.sway;
    head.current.rotation.x = quiet ? 0 : talking ? Math.sin(t * 2.8) * .045 : Math.sin(t * .8) * .025;
    const gesture = quiet ? 0 : talking ? -.4 + Math.sin(t * settings.talking.frequency) * settings.talking.gesture : state.wave > 0 ? -2.1 + Math.sin(t * 9) * .18 : -.08;
    right.current.rotation.x += (gesture - right.current.rotation.x) * (1 - Math.exp(-7 * dt));
    left.current.rotation.x = npc.id === "lyra" || npc.id === "elara" ? -.65 : .04;
  });
  const g = resources.geometry, s = resources.shared, m = resources.palettes[npc.id];
  return <group ref={root} rotation={[0, npc.rotation, 0]} scale={npc.appearance.scale} dispose={null}>
    {[-1, 1].map((side) => <group key={side} position={[side * .17, 0, 0]}>
      <mesh geometry={g.box} material={s.dark} position={[0, .48, 0]} scale={[.24, .63, .25]} castShadow />
      <mesh geometry={g.box} material={s.leather} position={[0, .13, .05]} scale={[.27, .26, .39]} castShadow />
    </group>)}
    <group ref={torso}>
      <mesh geometry={g.tunic} material={m.tunic} position={[0, 1.09, 0]} scale={[.38, .66, .29]} castShadow />
      <mesh geometry={g.box} material={s.leather} position={[0, .86, 0]} scale={[.68, .09, .48]} />
      <mesh geometry={g.box} material={s.gold} position={[0, .86, .25]} scale={[.12, .09, .035]} />
      <NpcCostume npc={npc} resources={resources} />
      <group ref={left} position={[-.39, 1.31, 0]} rotation={[-.1, 0, .09]}>
        <mesh geometry={g.box} material={m.tunic} position={[0, -.18, 0]} scale={[.24, .4, .26]} castShadow />
        <mesh geometry={g.round} material={m.skin} position={[0, -.44, 0]} scale={[.12, .15, .12]} />
        <NpcHandProp npc={npc} resources={resources} hand="left" />
      </group>
      <group ref={right} position={[.39, 1.31, 0]} rotation={[0, 0, -.09]}>
        <mesh geometry={g.box} material={m.tunic} position={[0, -.18, 0]} scale={[.24, .4, .26]} castShadow />
        <mesh geometry={g.round} material={m.skin} position={[0, -.44, 0]} scale={[.12, .15, .12]} />
        <NpcHandProp npc={npc} resources={resources} hand="right" />
      </group>
      <group ref={head} position={[0, 1.67, 0]}>
        <mesh geometry={g.round} material={m.skin} scale={[.26, .29, .25]} castShadow />
        <mesh geometry={g.round} material={m.hair} position={[0, .15, -.025]} scale={[.28, .2, .26]} />
        <mesh geometry={g.box} material={m.skin} position={[0, -.02, .25]} scale={[.07, .09, .09]} />
        {[-1, 1].map((side) => <mesh key={side} geometry={g.box} material={s.dark} position={[side * .1, .03, .23]} scale={[.032, .043, .035]} />)}
        <NpcHeadDetails npc={npc} resources={resources} />
      </group>
    </group>
  </group>;
}
