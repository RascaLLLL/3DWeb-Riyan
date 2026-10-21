import type { Education } from "@/types/portfolio";
import { sourceComponent } from "./source";

export const education: Education[] = [
  { id: "telkom-information-technology", institution: "Telkom University", studyProgram: "Bachelor of Information Technology",
    dateRange: { start: "2024", end: null, ongoing: true },
    academicInformation: ["Focus areas: Web Development, Machine Learning, Database Systems, and Cloud Computing.", "Building projects alongside academic study to develop practical software engineering skills."],
    source: sourceComponent("Education"), todos: [{ field: "dates", message: "Confirm the start month and an expected graduation date if you want to publish one. No GPA or honors were provided." }] },
];
