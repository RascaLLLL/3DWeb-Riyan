import type { WorkExperience } from "@/types/portfolio";
import { sourceComponent } from "./source";

const source = sourceComponent("Experience");
const todos = [
  { field: "dates", message: "Confirm start/end months and whether source-listed ongoing work is current." },
  { field: "outcomes", message: "Add documented outcomes; the source lists responsibilities without measured results." },
];
export const experience: WorkExperience[] = [
  { id: "freelance-web-developer", role: "Freelance Web Developer", organization: "Self-Employed",
    dateRange: { start: "2024", end: null, ongoing: true },
    responsibilities: [
      "Developed responsive web applications using React, HTML, CSS, JavaScript, and Tailwind CSS.",
      "Built reusable UI components and responsive layouts for desktop and mobile devices.",
      "Integrated third-party APIs to add website functionality and improve the user experience.",
    ], technologies: ["React", "HTML", "CSS", "JavaScript", "Tailwind CSS"], outcomes: [], source, todos },
  { id: "roblox-game-developer", role: "Roblox Game Developer", organization: "Self-Employed",
    dateRange: { start: "2025", end: null, ongoing: true },
    responsibilities: [
      "Designed and developed interactive 3D environments in Roblox Studio.",
      "Implemented gameplay mechanics, UI interactions, and game logic in Lua.",
      "Debugged, optimized, and refactored scripts for game stability and performance.",
    ], technologies: ["Roblox Studio", "Lua"], outcomes: [], source, todos },
  { id: "maintenance-helper", role: "Maintenance Helper", organization: "Astra Visteon Indonesia",
    dateRange: { start: "2023", end: "2024", ongoing: false },
    responsibilities: [
      "Assisted with hardware and software troubleshooting on company computer systems.",
      "Collected, recorded, and maintained machine performance data for preventive maintenance and operational reporting.",
      "Managed inventory records and documentation for machine parts and maintenance activities.",
    ], technologies: [], outcomes: [], source,
    todos: [...todos, { field: "technologies", message: "Provide the specific maintenance or reporting tools used, if appropriate to publish." }] },
];
