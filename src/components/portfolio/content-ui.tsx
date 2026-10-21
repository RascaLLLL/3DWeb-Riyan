import type { ContentTodo, PortfolioDateRange, SkillIconReference } from "@/types/portfolio";

export function ContentTodos({ todos }: { todos: ContentTodo[] }) {
  if (!todos.length) return null;
  return <details className="content-todos"><summary>Details to complete</summary><ul>{todos.map((todo) => <li key={todo.field}><strong>TODO:</strong> {todo.message}</li>)}</ul></details>;
}
export function TagList({ tags, label = "Technologies" }: { tags: string[]; label?: string }) {
  if (!tags.length) return null;
  return <ul className="portfolio-tags" aria-label={label}>{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>;
}
export function PublishedPeriod({ period }: { period: PortfolioDateRange }) {
  return <span className="published-period">{period.start ? <time dateTime={period.start}>{period.start}</time> : "Start date TODO"} – {period.ongoing ? "Present" : period.end ? <time dateTime={period.end}>{period.end}</time> : "End date TODO"}</span>;
}
const iconPaths: Record<SkillIconReference, string> = {
  code: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16",
  interface: "M3 3h18v18H3ZM3 8h18M9 8v13",
  server: "M3 3h18v7H3ZM3 14h18v7H3ZM6 6h1m-1 11h1",
  database: "M3 6c0-5 18-5 18 0s-18 5-18 0m0 0v12c0 5 18 5 18 0V6M3 12c0 5 18 5 18 0",
  cloud: "M7 18a5 5 0 1 1 1-10 6 6 0 0 1 11 2 4 4 0 1 1 0 8Z",
  tools: "m4 20 8-8m0 0 4-4m-4 4-4-4 4-5 5 1 3 4-4 5-4-1ZM3 17l4 4",
  research: "M4 3h6v8l-6 9h16l-6-9V3h6M8 3h8M7 16h10",
};
export function SkillIcon({ reference }: { reference: SkillIconReference }) {
  return <svg viewBox="0 0 24 24" className="skill-icon" aria-hidden="true"><path d={iconPaths[reference]} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" /></svg>;
}
