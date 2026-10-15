# Initial dataset provenance

Retrieved **15 October 2026** from the public UI at https://iul-ca-projects.vercel.app and the publicly documented file https://iul-ca-projects.vercel.app/data/projects.json. The raw snapshot was used only as data; no application implementation was copied.

## Observed structure

- Session 2026–2027; repository year 2027.
- BCA: groups A–L, 15 team slots per group (180 records).
- MCA: groups A–C, 15 team slots per group (45 records).
- Up to five members per team, but no actual member details in the source.
- Two non-placeholder titles; 224 source statuses `pending`, one `In Progress`.
- 223 titles are `Project details pending`.

These are public demo allocations. Faculty approval is still required before treating them as official.

## Conflicts kept visible

| Source record                                           | Issue                                                                                                      | Treatment                                                                                                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| BCA C14                                                 | `PUGID26044` also assigned to H12                                                                          | Retain allocation; stable internal ID/slug `unverified-bca-c14`; `sourceProjectId: PUGID26044`; official project ID and repository name null. |
| BCA H12, Personal Expense & Budget Management System    | Same project ID as C14                                                                                     | Retain title/allocation; stable internal ID/slug `unverified-bca-h12`; same source-ID annotation; official ID and repository name null.       |
| BCA G08, Smart Healthcare Appointment Management System | Project ID `PUGID26191`, repository name `BCA2027-PUGID26191-G08`; supplied URLs name **H12 / PUGID26044** | Retain title, description, ID, group/team, and repository name; suppress disputed links and explain on details page.                          |

G08's original source URLs, recorded here for coordinator investigation only:

- https://github.com/Integral-Software-Solutions/BCA2027-PUGID26044-H12
- https://bca2027-pugid26044-h12.vercel.app/

No replacement official IDs, student identities, faculty names, or approval dates were invented. Source dates were absent and remain null. Source states were mapped to the site's supported terms: `pending` → `Awaiting details`, `In Progress` → `In Development`.

The two disputed source-ID records remain searchable by `PUGID26044`. Their unique internal URLs distinguish them without pretending a new official project ID has been issued.

## Illustrative collection

Eight separate sample records demonstrate filled-out projects across programmes, groups, technologies, statuses, and link availability. Every sample uses `isSample: true` and is excluded from the home and programme session statistics. All example members are named `Sample learner …` and have no invented contact details or enrollment numbers.

CareerUp AI is an unassigned sample. Its programme, project ID, group, team ID, mentor, links and member information are unset. Its description and technology suggestions must be replaced with the actual project's approved scope.

Taskflow points to the independent TodoMVC public reference; LibraryLens points to the independent Open Library reference. They demonstrate the link UI and are explicitly labeled as references. Neither is claimed as university/student-owned work.
