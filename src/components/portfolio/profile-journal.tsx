import { portfolio } from "@/data/portfolio";
import { ResumeAccess } from "./contact-resources";
import { ContentTodos } from "./content-ui";
import { PortfolioMedia } from "./portfolio-media";

export function ProfileJournal() {
  const { profile } = portfolio;
  return <article className="profile-journal">
    <div className="profile-identity">{profile.portrait && <PortfolioMedia media={profile.portrait} portrait />}<div><h3>{profile.name}</h3><p className="profile-title">{profile.professionalTitle}</p>{profile.location && <p>{profile.location}</p>}</div></div>
    <div className="journal-pages">{profile.detailedIntroduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    <ResumeAccess /><ContentTodos todos={profile.todos} />
  </article>;
}
