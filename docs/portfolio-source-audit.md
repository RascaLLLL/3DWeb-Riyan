# Portfolio content source audit

Reviewed on **21 October 2026**. The owner identified
[heyriyan.vercel.app](https://heyriyan.vercel.app/) as the source of truth.
The pre-existing local data contained explicit empty states, not a second set of
personal records. No real local project information was removed.

## Verification method

The web reader could not access the site, and the initial sandbox HTTP request
failed DNS resolution. An approved network request retrieved its public HTML.
The published GitHub link led to the owner's public repositories. The
[`personalweb-riyan` repository](https://github.com/RascaLLLL/personalweb-riyan)
declares the same deployed site in its homepage field. Relevant source modules
were read as data and corroborated against the rendered HTML; no downloaded
application code was executed or installed.

The application now uses local TypeScript records and local media. It does not
fetch the source site or GitHub at runtime. The source site's third-party contact
submission service was not copied; this application uses a real mailto fallback.
Research downloads are kept outside tracked source in ignored build/cache space.

## Sources and migrated information

| Source | Information retained |
| --- | --- |
| [Public portfolio](https://heyriyan.vercel.app/) | Full name from the footer, public contact links/email, student/developer introduction |
| [About](https://github.com/RascaLLLL/personalweb-riyan/blob/main/src/components/About.tsx) | Telkom University, web/ML/database/cloud interests, portrait reference |
| [Skills](https://github.com/RascaLLLL/personalweb-riyan/blob/main/src/components/Skills.tsx), [TechStack](https://github.com/RascaLLLL/personalweb-riyan/blob/main/src/components/TechStack.tsx), [CurrentlyLearning](https://github.com/RascaLLLL/personalweb-riyan/blob/main/src/components/CurrentlyLearning.tsx) | Listed skills and tools; Framer Motion, Docker, and Cloud Computing remain labeled as being explored |
| [Projects](https://github.com/RascaLLLL/personalweb-riyan/blob/main/src/components/Projects.tsx) | Exact five project titles, descriptions, stacks, featured status, original screenshot references |
| [Experience](https://github.com/RascaLLLL/personalweb-riyan/blob/main/src/components/Experience.tsx) | Three roles, organizations, year ranges, and responsibilities |
| [Education](https://github.com/RascaLLLL/personalweb-riyan/blob/main/src/components/Education.tsx) | Bachelor of Information Technology, Telkom University, 2024–Present, academic focus areas |
| [Certificates](https://github.com/RascaLLLL/personalweb-riyan/blob/main/src/components/Certificates.tsx) | Five original certificate titles and issuers |

The display title “Information Technology Student & Web Developer” combines
explicit student status with the published freelance role. No job title,
employer, qualification, skill level, geographic location, GPA, graduation date,
testimonial, client statistic, or business metric was invented.

Project outcomes describe published delivered functionality. The source provides
no separately documented business outcomes for the work roles, so those arrays
remain empty with TODOs. Brief solution/contribution text paraphrases only the
published description. The IoT project's personal contribution is not specified
and remains null. Original problem context/constraints remain null for every case.

## Outbound links

- Email: `hpitono24@gmail.com`, published as a mailto link on the source site.
  Mailbox delivery was not tested and no message was sent.
- [GitHub](https://github.com/RascaLLLL): published link; HTTP 200.
- [LinkedIn](https://www.linkedin.com/in/riyandi-heri-p-311166331/): exact link
  published on the owner's site. HEAD returned 405; GET returned LinkedIn's
  automated-access block (999). Association is verified from the source;
  independent browser availability is not claimed. Its data records this limit.
- [Instagram](https://www.instagram.com/riyanhrp_/): published link; HTTP 200.
- All five original “View Project” anchors are `#`. None became a demo button.
  No exact project demo URL or unambiguous implementation repository was supplied.
- No public resume URL/file, certificate credential URL, or certificate issue
  date was found in the inspected content. No paths or credentials were guessed.

## Source conflicts and exclusions

1. **Mount Adventure Roblox:** retain the published project title. The supplied
   Roblox Studio capture has the editor title “EVERTRAIL EXPEDITION.” The caption
   discloses that difference; ask the owner to confirm the mapping/name.
2. **Car Evaluation Classifier:** the source reports accuracy above 98%. That
   statement is retained as a **source-reported result**, with a visible warning
   that dataset, split, metric definition, and reproducible evaluation are absent.
   The published train/test confusion matrix is retained. No new percentage was
   calculated, generalized, or advertised as independently verified.
3. **IoT Monitoring Dashboard:** the source uses an Unsplash stock illustration,
   not an identifiable capture of the dashboard. It was neither downloaded nor
   displayed as project evidence. The gallery has an explicit screenshot TODO.
4. **Chibii Snack Website:** preserve the published React/Tailwind/WhatsApp API
   stack as source-listed. The owner's
   [CHIBI-Snacks repository](https://github.com/RascaLLLL/CHIBI-Snacks) has matching
   “Chibii Meets Crunch” branding/layout but uses HTML/CSS/JavaScript. The version
   association is unresolved, so it is not advertised as this case's repository.
   A visible technical note and TODO request clarification.
5. No unrelated repository was assigned to a project based on a similar name.
   In particular, no machine-learning or monitoring repository was treated as
   the classifier/IoT project without corroboration.

## Media provenance and permission

Five first-party files were copied unchanged from the owner-identified portfolio
under the user's instruction to migrate their portfolio content. All returned
HTTP 200 and `image/png`; the local images were visually inspected. This is
owner-directed first-party content reuse, not a third-party asset-pack license.
No CC0/MIT license or separate redistribution grant is fabricated. The excluded
stock illustration is not covered by that first-party reuse basis.

| Local file | Original source | Dimensions |
| --- | --- | --- |
| `public/assets/portfolio/profile.png` | [Riyan.png](https://heyriyan.vercel.app/Riyan.png) | 1086 × 981 |
| `public/assets/portfolio/mount-adventure.png` | [rob.png](https://heyriyan.vercel.app/rob.png) | 1918 × 1078 |
| `public/assets/portfolio/car-classifier.png` | [ML.png](https://heyriyan.vercel.app/ML.png) | 1122 × 423 |
| `public/assets/portfolio/cyber-learning.png` | [cybersec.png](https://heyriyan.vercel.app/cybersec.png) | 1918 × 977 |
| `public/assets/portfolio/chibii-snack.png` | [Chibi.png](https://heyriyan.vercel.app/Chibi.png) | 1901 × 977 |

SHA-256 of the unchanged local files:

```text
profile.png          74236A5A069E40F522F55AF00A293B0A6C3BD75055EC8B1D9FE2213FE0FBA2F6
mount-adventure.png  85AF8D33260315CDEE1D9FC064F0AE269602557FEC44DD5B74A04355C6D6BDE4
car-classifier.png   B6577F85D541A25B942DF511311D04C9294E6379B75EA03F92CAB54A8F7263E4
cyber-learning.png   8BB6D22961FEA60ABBC56EEB060765FDD47DC08E74012F99AABA39525D9A31D7
chibii-snack.png     90F68B6025AD59BEBA6B2598483F4125A7F31979130EDB775DEC07B9A84D398C
```

These references document what was published on the review date, not an issuer
background check, independent validation of every claim, or ongoing URL monitor.
