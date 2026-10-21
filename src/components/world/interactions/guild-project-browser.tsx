"use client";

import { useEffect, useRef, useState } from "react";
import { getProject } from "@/data/portfolio";
import { ProjectBoard } from "@/components/portfolio/project-board";
import { ProjectCaseStudy } from "@/components/portfolio/project-case-study";

export function GuildProjectBrowser() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null), lastSelected = useRef<string | null>(null);
  const project = selectedId ? getProject(selectedId) : null;
  useEffect(() => {
    if (selectedId) container.current?.focus({ preventScroll: false });
    else if (lastSelected.current) container.current?.querySelector<HTMLButtonElement>(`[data-project-id="${lastSelected.current}"]`)?.focus();
  }, [selectedId]);
  return <div className="guild-project-browser" ref={container} tabIndex={-1} role="region" aria-label={project ? `Guild record: ${project.title}` : "Featured project board"}>
    {project ? <><button className="button button-secondary button-small guild-back" onClick={() => setSelectedId(null)}>← Back to the quest board</button><ProjectCaseStudy project={project} embedded /></>
      : <ProjectBoard featuredOnly onSelectProject={(id) => { lastSelected.current = id; setSelectedId(id); }} />}
  </div>;
}
