import type { NpcDefinition } from "@/types/npc";
import type { NpcResources } from "./npc-resources";

export function NpcCostume({ npc, resources }: { npc: NpcDefinition; resources: NpcResources }) {
  const g = resources.geometry, s = resources.shared, m = resources.palettes[npc.id], variant = npc.appearance.variant;
  return <>
    {variant !== "smith" && <mesh geometry={g.cloak} material={m.accent} position={[0, 1.02, -.03]} scale={[1, variant === "elder" ? 1.25 : 1, 1]} castShadow />}
    {variant === "elder" && <mesh geometry={g.cylinder} material={s.wood} position={[.55, .9, .13]} rotation={[0, 0, -.06]} scale={[.035, 1.8, .035]} castShadow />}
    {variant === "keeper" && <>
      <mesh geometry={g.box} material={s.leather} position={[0, 1.14, .27]} rotation={[0, 0, -.5]} scale={[.07, .72, .045]} />
      <mesh geometry={g.round} material={s.gold} position={[.23, 1.35, .27]} scale={.09} />
    </>}
    {variant === "smith" && <>
      <mesh geometry={g.box} material={m.accent} position={[0, .99, .29]} scale={[.59, .72, .07]} castShadow />
      {[-1, 1].map((side) => <mesh key={side} geometry={g.box} material={m.accent} position={[side * .23, 1.33, .26]} scale={[.08, .35, .05]} />)}
      <mesh geometry={g.box} material={s.dark} position={[0, .91, .34]} scale={[.3, .16, .025]} />
    </>}
    {variant === "scholar" && <mesh geometry={g.tunic} material={m.tunic} position={[0, .59, 0]} scale={[.37, .56, .3]} castShadow />}
    {variant === "gatekeeper" && <>
      <mesh geometry={g.round} material={s.gold} position={[.2, 1.29, .29]} scale={[.09, .11, .035]} />
      <mesh geometry={g.ring} material={s.metal} position={[-.37, .89, .08]} />
      {[-1, 1].map((side) => <group key={side} position={[-.37 + side * .04, .7, .08]}>
        <mesh geometry={g.box} material={s.metal} scale={[.025, .23, .025]} />
        <mesh geometry={g.box} material={s.metal} position={[.03, -.07, 0]} scale={[.09, .025, .025]} />
      </group>)}
    </>}
  </>;
}

export function NpcHeadDetails({ npc, resources }: { npc: NpcDefinition; resources: NpcResources }) {
  const g = resources.geometry, s = resources.shared, m = resources.palettes[npc.id], variant = npc.appearance.variant;
  return <>
    {(variant === "elder" || variant === "smith") && <mesh geometry={g.cone} material={m.hair} position={[0, -.18, .18]} rotation={[Math.PI, 0, 0]} scale={[.21, variant === "elder" ? .37 : .22, .16]} />}
    {variant === "keeper" && [0, 1, 2].map((i) => <mesh key={i} geometry={g.round} material={m.hair} position={[.19, -.14 - i * .12, -.13]} scale={[.09, .12, .09]} />)}
    {variant === "scholar" && <>
      {[-1, 1].map((side) => <mesh key={side} geometry={g.ring} material={s.gold} position={[side * .105, .015, .238]} scale={.82} />)}
      <mesh geometry={g.box} material={s.gold} position={[0, .015, .24]} scale={[.05, .016, .02]} />
    </>}
    {variant === "gatekeeper" && <>
      <mesh geometry={g.cylinder} material={m.accent} position={[0, .23, -.02]} scale={[.29, .18, .28]} />
      <mesh geometry={g.cylinder} material={s.leather} position={[0, .15, .03]} scale={[.32, .045, .31]} />
      <mesh geometry={g.round} material={s.gold} position={[0, .25, .26]} scale={[.055, .065, .025]} />
    </>}
  </>;
}

export function NpcHandProp({ npc, resources, hand }: { npc: NpcDefinition; resources: NpcResources; hand: "left" | "right" }) {
  const g = resources.geometry, s = resources.shared;
  if (npc.appearance.variant === "smith" && hand === "right") return <group position={[0, -.48, .05]}>
    <mesh geometry={g.cylinder} material={s.wood} rotation={[Math.PI / 2, 0, 0]} scale={[.025, .4, .025]} />
    <mesh geometry={g.box} material={s.metal} position={[0, 0, .2]} scale={[.22, .12, .1]} castShadow />
  </group>;
  if ((npc.appearance.variant === "scholar" || npc.appearance.variant === "keeper") && hand === "left") return <group position={[0, -.37, .18]} rotation={[-.3, 0, 0]}>
    <mesh geometry={g.box} material={s.book} scale={[.36, .16, .4]} castShadow />
    <mesh geometry={g.box} material={s.pages} position={[.015, 0, .015]} scale={[.34, .11, .36]} />
    {npc.appearance.variant === "scholar" && <mesh geometry={g.cylinder} material={s.pages} position={[0, .16, 0]} rotation={[0, 0, Math.PI / 2]} scale={[.055, .4, .055]} />}
  </group>;
  return null;
}
