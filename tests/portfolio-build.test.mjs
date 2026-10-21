import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = (path) => readFileSync(`.next/server/app/${path}.html`, "utf8").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
const projectIds = ["mount-adventure-roblox", "car-evaluation-classifier", "cybersecurity-learning-platform", "iot-monitoring-dashboard", "chibii-snack-website"];

test("world route has a distinct immersive shell and a script-free escape to conventional mode", () => {
  const html = page("world");
  assert.match(html, /<main[^>]*class="world-shell"/);
  assert.match(html, /<h1 class="sr-only">The Village of Riyan<\/h1>/);
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /<noscript>[\s\S]*href="\/portfolio"/);
  assert.match(html, /<noscript>[\s\S]*href="\/"/);
  assert.doesNotMatch(html, /class="(?:site-header|world-heading|world-viewport|village-directory|world-description)"|A resident for a day|Know your way around/);
  assert.doesNotMatch(html, /Developer tools|Show player diagnostics|Collision wireframes/);
});

test("built Quick Portfolio exposes all sections, project routes, contact, and indexing metadata without scripts", () => {
  const html = page("portfolio");
  for (const section of ["about", "projects", "skills", "experience", "education", "certifications", "contact"]) assert.ok(html.includes(`id="${section}"`), section);
  for (const id of projectIds) assert.ok(html.includes(`href="/portfolio/projects/${id}"`), id);
  assert.match(html, /<h1>Riyandi Heri Pitono<\/h1>/);
  assert.match(html, /href="mailto:hpitono24@gmail.com"/);
  assert.match(html, /name="description"/);
  assert.doesNotMatch(html, /<canvas|noindex|href="#"|download=/);
});

test("all five built case studies contain readable HTML, real records, and no placeholder actions", () => {
  for (const id of projectIds) {
    const html = page(`portfolio/projects/${id}`);
    for (const heading of ["Screenshot gallery", "Challenge", "Solution", "My contribution", "Tech stack", "Outcome"]) assert.ok(html.includes(`<h2>${heading}</h2>`), `${id}: ${heading}`);
    assert.match(html, /<h1>/); assert.match(html, /TODO/);
    assert.match(html, /href="\/portfolio#projects"/); assert.match(html, /href="\/portfolio#contact"/);
    assert.doesNotMatch(html, /<canvas|images\.unsplash\.com|href="#"|<a\b[^>]*>Live demo|<a\b[^>]*>Repository/);
  }
});
