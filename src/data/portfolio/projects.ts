import type { PortfolioImage, PortfolioProject, ProjectCategory } from "@/types/portfolio";
import { sourceComponent } from "./source";

export const projectCategories: Record<ProjectCategory, string> = {
  "game-development": "Roblox Game Development", "machine-learning": "Machine Learning", "web-application": "Web Application",
  iot: "IoT Monitoring", "business-website": "Business Website",
};
const screenshot = (file: string, sourceFile: string, width: number, height: number, alt: string, caption: string): PortfolioImage => ({
  src: `/assets/portfolio/${file}`, width, height, alt, caption, sourceUrl: `https://heyriyan.vercel.app/${sourceFile}`,
});
const missingContext = { field: "problemStatement", message: "Describe the original challenge, users, constraints, and project context." };
const missingLinks = { field: "links", message: "Supply verified live demo and repository URLs; the source portfolio uses # placeholders." };
const source = sourceComponent("Projects");

export const projects: PortfolioProject[] = [
  { id: "mount-adventure-roblox", title: "Mount Adventure Roblox", category: "game-development", featured: true,
    shortDescription: "An interactive Roblox mountain exploration map with custom terrain, gameplay mechanics, and optimized Lua scripting.",
    problemStatement: null,
    solution: "Built a mountain exploration environment in Roblox Studio, combining custom terrain, gameplay mechanics, and scripting.",
    personalContribution: "Designed and developed the exploration map, terrain, and gameplay mechanics, with optimized scripting.",
    technologyStack: ["Roblox Studio", "Lua"], outcome: "An interactive mountain exploration map.", outcomeNote: "Player counts, performance measurements, and release details are not supplied.",
    screenshots: [screenshot("mount-adventure.png", "rob.png", 1918, 1078, "Roblox Studio environment published with Mount Adventure Roblox", "Original portfolio capture. Its editor window is titled EVERTRAIL EXPEDITION; the public portfolio title is retained.")],
    liveDemoUrl: null, repositoryUrl: null, technicalNote: null, source,
    todos: [missingContext, missingLinks, { field: "titleAndRelease", message: "Confirm the relationship between Mount Adventure Roblox and the screenshot’s EVERTRAIL EXPEDITION editor title, and provide release details." }] },
  { id: "car-evaluation-classifier", title: "Car Evaluation Classifier", category: "machine-learning", featured: true,
    shortDescription: "A Python classification project using Decision Tree, SMOTE, hyperparameter tuning, and model evaluation.", problemStatement: null,
    solution: "Built and evaluated a classification model with Decision Tree, SMOTE, and hyperparameter tuning.",
    personalContribution: "Built the classification model and applied the training, tuning, and evaluation methods described in the original portfolio.",
    technologyStack: ["Python", "Scikit-Learn", "Pandas", "Decision Tree", "SMOTE"],
    outcome: "The original portfolio reports classification accuracy above 98%.",
    outcomeNote: "Source-reported result. The dataset, split, metric definition, and reproducible evaluation have not been supplied; this is not independently validated here.",
    screenshots: [screenshot("car-classifier.png", "ML.png", 1122, 423, "Decision Tree training and test confusion matrices from the original portfolio", "Training and test confusion matrices, as published. They do not establish the full evaluation protocol.")],
    liveDemoUrl: null, repositoryUrl: null, technicalNote: null, source,
    todos: [missingContext, missingLinks, { field: "evaluation", message: "Provide the dataset, data split, evaluation protocol, and report supporting the published accuracy claim." }] },
  { id: "cybersecurity-learning-platform", title: "Cybersecurity Learning Platform", category: "web-application", featured: true,
    shortDescription: "An educational cybersecurity web platform with interactive learning materials and workshop resources for students.", problemStatement: null,
    solution: "Developed a web platform that presents cybersecurity awareness materials and student workshop resources.",
    personalContribution: "Developed the educational web platform described in the portfolio; authorship of the teaching materials is not specified.",
    technologyStack: ["HTML", "CSS", "JavaScript", "Firebase"], outcome: "A web platform providing interactive cybersecurity learning and workshop resources.", outcomeNote: "Usage, learning outcomes, and release details are not supplied.",
    screenshots: [screenshot("cyber-learning.png", "cybersec.png", 1918, 977, "Cybersecurity workshop module about personal data protection and digital footprints", "Original Indonesian-language learning module, retained without altering the project interface.")],
    liveDemoUrl: null, repositoryUrl: null, technicalNote: null, source, todos: [missingContext, missingLinks] },
  { id: "iot-monitoring-dashboard", title: "IoT Monitoring Dashboard", category: "iot", featured: true,
    shortDescription: "A real-time IoT dashboard for sensor visualization, device status tracking, and responsive web-based analytics.", problemStatement: null,
    solution: "The published project describes live sensor visualization and device status tracking using ESP32, Firebase, and Chart.js.",
    personalContribution: null, technologyStack: ["ESP32", "Firebase", "Chart.js"], outcome: "A monitoring dashboard with live sensor data and device status views, as described in the original portfolio.",
    outcomeNote: "No deployment, reliability, or device-count measurements are supplied.", screenshots: [], liveDemoUrl: null, repositoryUrl: null, technicalNote: null, source,
    todos: [missingContext, missingLinks, { field: "personalContribution", message: "Describe your own implementation responsibilities and any collaborators." },
      { field: "screenshots", message: "Supply a genuine dashboard capture. The source’s Unsplash stock illustration was intentionally excluded." }] },
  { id: "chibii-snack-website", title: "Chibii Snack Website", category: "business-website", featured: true,
    shortDescription: "A responsive ordering website with a product catalog, ordering flow, and WhatsApp integration for a local snack business.", problemStatement: null,
    solution: "Developed an ordering website combining a product catalog, responsive pages, and a WhatsApp ordering flow.",
    personalContribution: "Developed the responsive ordering website and integration described in the source portfolio.",
    technologyStack: ["React", "Tailwind CSS", "WhatsApp API"], outcome: "A website presenting the business catalog and an ordering flow with WhatsApp integration.",
    outcomeNote: "Sales, conversion, and customer usage results are not supplied.",
    screenshots: [screenshot("chibii-snack.png", "Chibi.png", 1901, 977, "Chibii Snack homepage with product promotion and an order action", "Business website screenshot published on the original portfolio.")],
    liveDemoUrl: null, repositoryUrl: null,
    technicalNote: "The stack above is listed by the original portfolio. The owner’s public CHIBI-Snacks repository has matching branding but uses HTML, CSS, and JavaScript. Confirm the implementation/version before linking it as this project’s repository.",
    source, todos: [missingContext, missingLinks, { field: "implementationVersion", message: "Confirm the published React/Tailwind stack versus the matching HTML/CSS/JavaScript source, then approve the correct repository link." }] },
];
