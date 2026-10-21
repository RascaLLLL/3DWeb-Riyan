import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { portfolio, getProject } from "../src/data/portfolio";
import { missingPortfolioContent } from "../src/data/portfolio/missing-content";
import { skillCategories } from "../src/data/portfolio/skills";
import { projectCategories } from "../src/data/portfolio/projects";
import { usablePortfolioLink } from "../src/systems/portfolio/links";
import { ProjectCaseStudy } from "../src/components/portfolio/project-case-study";
import { ContactResources } from "../src/components/portfolio/contact-resources";
import { SkillWorkshop } from "../src/components/portfolio/skill-workshop";
import { ExperienceTimeline, EducationArchive, CertificationArchive } from "../src/components/portfolio/archive-records";
import { PortfolioSectionContent } from "../src/components/portfolio/portfolio-section-content";
import type { VerifiedLink } from "../src/types/portfolio";

test("library archive records nest below section headings without changing conventional portfolio headings", () => {
  for (const section of ["experience", "education", "certifications"] as const) {
    const village = renderToStaticMarkup(<PortfolioSectionContent section={section} village />);
    const conventional = renderToStaticMarkup(<PortfolioSectionContent section={section} />);
    assert.match(village, /<h4>/);
    assert.doesNotMatch(village, /<h3>/);
    assert.match(conventional, /<h3>/);
    assert.doesNotMatch(conventional, /<h4>/);
    assert.equal(village.replaceAll("h4>", "h3>"), conventional, "only the heading level should change; records must stay identical");
  }
});

test("migration preserves the five published project titles and three real roles", () => {
  assert.equal(portfolio.profile.name, "Riyandi Heri Pitono");
  assert.equal(portfolio.profile.source.url, "https://heyriyan.vercel.app/");
  assert.deepEqual(portfolio.projects.map((project) => project.title), ["Mount Adventure Roblox", "Car Evaluation Classifier", "Cybersecurity Learning Platform", "IoT Monitoring Dashboard", "Chibii Snack Website"]);
  assert.deepEqual(portfolio.experience.map((entry) => [entry.role, entry.organization, entry.dateRange.start]), [
    ["Freelance Web Developer", "Self-Employed", "2024"], ["Roblox Game Developer", "Self-Employed", "2025"], ["Maintenance Helper", "Astra Visteon Indonesia", "2023"],
  ]);
  assert.equal(portfolio.education[0].institution, "Telkom University");
  assert.equal(portfolio.certifications.length, 5);
});

test("IDs, source provenance, section associations, and technology categories remain complete", () => {
  for (const collection of [portfolio.projects, portfolio.skills, portfolio.experience, portfolio.education, portfolio.certifications]) {
    assert.equal(new Set(collection.map((record) => record.id)).size, collection.length);
    for (const record of collection) { assert.match(record.id, /^[a-z0-9-]+$/); assert.match(record.source.url, /^https:\/\//); assert.equal(record.source.retrievedOn, "2026-10-21"); }
  }
  assert.deepEqual(portfolio.sections.map((section) => section.id), ["about", "projects", "skills", "experience", "education", "certifications", "contact"]);
  for (const skill of portfolio.skills) { assert.ok(skillCategories[skill.category]); assert.ok(!("percentage" in skill) && !("proficiency" in skill)); }
  for (const project of portfolio.projects) { assert.ok(projectCategories[project.category]); assert.equal(getProject(project.id), project); assert.ok(project.solution && project.technologyStack.length); }
  assert.equal(getProject("not-a-project"), undefined);
});

test("public profile/contact links share data, with no invented location or resume", () => {
  assert.equal(portfolio.contact.email, "hpitono24@gmail.com");
  assert.equal(portfolio.profile.location, null); assert.equal(portfolio.profile.resumeUrl, null);
  assert.equal(portfolio.profile.resumeUrl, portfolio.contact.cv);
  assert.equal(portfolio.profile.socialLinks, portfolio.contact.socialProfiles);
  assert.deepEqual(portfolio.contact.socialProfiles.map((link) => link.href), ["https://github.com/RascaLLLL", "https://www.linkedin.com/in/riyandi-heri-p-311166331/", "https://www.instagram.com/riyanhrp_/"]);
  for (const profile of portfolio.contact.socialProfiles) assert.ok(usablePortfolioLink(profile));
  assert.equal(portfolio.contact.socialProfiles.find((link) => link.id === "linkedin")?.verification, "published-on-source");
});

test("only safe, sourced destinations become outbound actions", () => {
  const source: VerifiedLink = { href: "https://github.com/RascaLLLL", sourceUrl: portfolio.source.url, checkedOn: "2026-10-21", verification: "reachable" };
  assert.equal(usablePortfolioLink(source), source.href);
  assert.equal(usablePortfolioLink(null), null);
  for (const href of ["#", "", "javascript:alert(1)", "data:text/html,hello", "https://example.com", "/assets/../private.pdf", "https://name:secret@github.com"]) assert.equal(usablePortfolioLink({ ...source, href }), null, href);
  assert.equal(usablePortfolioLink({ ...source, sourceUrl: "" }), null);
  for (const project of portfolio.projects) { assert.equal(project.liveDemoUrl, null); assert.equal(project.repositoryUrl, null); }
  for (const certificate of portfolio.certifications) { assert.equal(certificate.date, null); assert.equal(certificate.credentialUrl, null); }
});

test("first-party media exists locally with the verified PNG dimensions; stock IoT imagery is excluded", () => {
  const root = resolve("public");
  for (const media of [portfolio.profile.portrait!, ...portfolio.projects.flatMap((project) => project.screenshots)]) {
    const file = resolve(root, `.${media.src}`); assert.ok(file.startsWith(root));
    const bytes = readFileSync(file);
    assert.equal(bytes.subarray(1, 4).toString(), "PNG");
    assert.equal(bytes.readUInt32BE(16), media.width); assert.equal(bytes.readUInt32BE(20), media.height);
    assert.ok(media.sourceUrl.startsWith("https://heyriyan.vercel.app/"));
  }
  assert.equal(getProject("iot-monitoring-dashboard")!.screenshots.length, 0);
});

test("missing context, disputed metrics, and implementation conflicts remain explicit TODO records", () => {
  for (const project of portfolio.projects) {
    assert.equal(project.problemStatement, null);
    assert.ok(project.todos.some((todo) => todo.field === "problemStatement"));
    assert.ok(project.todos.some((todo) => todo.field === "links"));
  }
  assert.match(getProject("car-evaluation-classifier")!.outcomeNote!, /not independently validated/);
  assert.match(getProject("chibii-snack-website")!.technicalNote!, /HTML, CSS, and JavaScript/);
  assert.equal(getProject("iot-monitoring-dashboard")!.personalContribution, null);
  assert.ok(missingPortfolioContent.some((record) => record.todos.some((todo) => todo.field === "resumeUrl")));
  assert.ok(missingPortfolioContent.some((record) => record.todos.some((todo) => todo.field === "evaluation")));
});

test("HTML contact rendering includes a real mailto fallback and no fabricated CV action", () => {
  const html = renderToStaticMarkup(<ContactResources />);
  assert.match(html, /href="mailto:hpitono24@gmail.com"/);
  assert.match(html, /github.com\/RascaLLLL/); assert.match(html, /linkedin.com/);
  assert.match(html, /approved resume/); assert.doesNotMatch(html, /download=|href="#"/);
});

test("shared case studies render documented content, galleries, and missing actions without 3D", () => {
  for (const project of portfolio.projects) {
    const html = renderToStaticMarkup(<ProjectCaseStudy project={project} />);
    for (const title of [project.title, "Screenshot gallery", "Challenge", "Solution", "My contribution", "Tech stack", "Outcome"]) assert.ok(html.includes(title), `${project.id}: ${title}`);
    assert.match(html, /TODO/); assert.doesNotMatch(html, /href="#"|<a\b[^>]*>Live demo|<a\b[^>]*>Repository/);
  }
  const iot = renderToStaticMarkup(<ProjectCaseStudy project={getProject("iot-monitoring-dashboard")!} embedded />);
  assert.match(iot, /genuine project screenshot/); assert.match(iot, /<h3>/); assert.doesNotMatch(iot, /<h1>/);
});

test("skills and archives are server-renderable, preserving exploring labels and original records", () => {
  const skills = renderToStaticMarkup(<SkillWorkshop village />);
  assert.match(skills, /Core materials/); assert.match(skills, /Exploring/); assert.match(skills, /Python/);
  const work = renderToStaticMarkup(<ExperienceTimeline />), education = renderToStaticMarkup(<EducationArchive />), certificates = renderToStaticMarkup(<CertificationArchive />);
  assert.match(work, /Astra Visteon Indonesia/); assert.match(work, /dateTime="2023"/i);
  assert.match(education, /Telkom University/); assert.match(certificates, /Dicoding Indonesia/);
  assert.doesNotMatch(certificates, /Verify credential/);
});
