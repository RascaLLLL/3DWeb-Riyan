import { portfolio } from "@/data/portfolio";
import { usablePortfolioLink } from "@/systems/portfolio/links";

export function ResumeAccess() {
  const resume = portfolio.profile.resumeUrl, href = usablePortfolioLink(resume);
  return href ? <a className="button button-secondary button-small" href={href} download={href.startsWith("/assets/") ? resume?.fileName ?? true : undefined} target={href.startsWith("https:") ? "_blank" : undefined} rel="noopener noreferrer">{href.startsWith("/assets/") ? "Download CV" : "Open resume"} <span aria-hidden="true">↗</span></a>
    : <p className="content-todo"><strong>TODO:</strong> An approved resume document or URL has not been provided.</p>;
}

export function ContactResources() {
  const { email, socialProfiles } = portfolio.contact;
  return <div className="contact-resources">
    <p className="contact-lead">Have a project or opportunity to discuss? Use the public channels below.</p>
    {email ? <a className="contact-email" href={`mailto:${email}`}>{email}</a> : <p className="content-todo">TODO: provide a public email address.</p>}
    {socialProfiles.length > 0 ? <ul className="social-links" aria-label="Social profiles">{socialProfiles.map((profile) => {
      const href = usablePortfolioLink(profile);
      return href && <li key={profile.id}><a href={href} target="_blank" rel="noopener noreferrer">{profile.label}<span aria-hidden="true"> ↗</span></a></li>;
    })}</ul>
      : <p>Social profiles: awaiting approved links.</p>}
    <ResumeAccess />
    <p className="portfolio-footnote">Email opens your mail application. No message is submitted through this website.</p>
  </div>;
}
