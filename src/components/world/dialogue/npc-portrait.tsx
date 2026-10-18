import type { DialogueExpression } from "@/types/dialogue";
import type { NpcDefinition } from "@/types/npc";

/** Original vector avatars mirror the procedural costumes; no image or font downloads. */
export function NpcPortrait({ npc, expression }: { npc: NpcDefinition; expression?: DialogueExpression }) {
  const a = npc.appearance;
  return <svg viewBox="0 0 100 116" className="npc-portrait" aria-hidden="true">
    <rect x="2" y="2" width="96" height="112" rx="45" fill="#e1d2aa" stroke="#a18b56" strokeWidth="2" />
    <path d="M12 110 23 77 40 69 61 69 79 78 89 110Z" fill={a.tunic} />
    <path d="M24 80 37 71 50 95 64 71 78 80 86 110 14 110Z" fill={a.accent} />
    <path d="M43 62h15v15H43Z" fill={a.skin} />
    <ellipse cx="50" cy="44" rx="24" ry="29" fill={a.hair} />
    <path d="M30 37Q49 11 71 37L68 57 59 68H41L32 57Z" fill={a.skin} />
    <path d="M28 37 32 22 48 15 64 20 73 35 57 29 44 27Z" fill={a.hair} />
    <path d="M43 44h-4m22 0h-4" stroke="#343d31" strokeWidth="2.8" strokeLinecap="round" />
    <path d={expression === "thoughtful" ? "M45 58h10" : "M44 55q6 6 12 0"} fill="none" stroke="#78513c" strokeWidth="1.7" strokeLinecap="round" />
    {a.variant === "elder" && <>
      <path d="M34 52 43 59 58 59 68 51 62 72 50 85 39 72Z" fill={a.hair} />
      <path d="M82 109 86 31q0-9-7-8" fill="none" stroke="#785c36" strokeWidth="4" />
    </>}
    {a.variant === "keeper" && <>
      <path d="M70 44 74 67 69 80" fill="none" stroke={a.hair} strokeWidth="9" strokeLinecap="round" />
      <path d="m27 82 9-5 5 9-8 6Z" fill="#c2a35f" />
      <path d="M52 98h27v13H52Z" fill="#794c39" /><path d="M55 101h21v6H55Z" fill="#e8dab7" />
    </>}
    {a.variant === "smith" && <>
      <path d="M32 51 41 57H60L69 51 64 66 50 75 36 65Z" fill={a.hair} />
      <path d="M33 78h35v34H33Z" fill="#69432f" /><path d="M73 88v22" stroke="#765735" strokeWidth="5" />
      <path d="M62 85h23v10H62Z" fill="#79817a" />
    </>}
    {a.variant === "scholar" && <>
      <g fill="none" stroke="#a38a4d" strokeWidth="2"><circle cx="40" cy="44" r="8" /><circle cx="60" cy="44" r="8" /><path d="M48 44h4" /></g>
      <path d="M52 90h30v21H52Z" fill="#864b42" /><path d="M56 94h23v13H56Z" fill="#eadcb7" /><path d="M50 90v21" stroke="#4d3931" strokeWidth="3" />
    </>}
    {a.variant === "gatekeeper" && <>
      <path d="M26 31q1-23 25-22 22 1 24 22Z" fill={a.accent} /><path d="M25 30h51v7H25Z" fill="#5b4230" />
      <path d="m48 15 6 5-5 7-5-6Z" fill="#c2a35f" />
      <g fill="none" stroke="#b4ad8c" strokeWidth="3"><circle cx="29" cy="93" r="5" /><path d="M29 98v12m0-4h6" /></g>
    </>}
  </svg>;
}
