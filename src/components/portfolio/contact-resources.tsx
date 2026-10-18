import { portfolio } from "@/data/portfolio";

export function ContactResources() {
  const { email, socialProfiles, cv } = portfolio.contact;
  return <div className="contact-resources">
    {email && <a href={`mailto:${email}`}>Email Riyan</a>}
    {socialProfiles.length > 0 ? <ul>{socialProfiles.map((profile) => <li key={profile.href}><a href={profile.href} target="_blank" rel="noopener noreferrer">{profile.label}<span aria-hidden="true"> ↗</span></a></li>)}</ul>
      : <p>Social profiles: awaiting approved links.</p>}
    {cv ? <a href={cv.href} download={cv.fileName}>Download CV</a> : <p>CV download: unavailable until an approved document is provided.</p>}
  </div>;
}
