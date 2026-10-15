# Verification report

Completed locally on **15 October 2026**. No hosting or deployment was performed.

## Build and automated checks

| Check | Result |
| --- | --- |
| Dependency install | 103 packages installed; audit reported no vulnerabilities |
| Data validation | 225 directory records and 8 explicitly marked samples passed |
| ESLint | Passed, no errors or warnings |
| Node tests | 19 passed, 0 failed |
| Production build | Passed, no build warnings |
| CSV import | Valid template imported successfully; an attempt to overwrite the output was correctly rejected |

The test suite covers search fields and case handling, combined filters, resets, statistics and scoped identities, optional/malformed data, URL safety, duplicates, supported values, team limits, date checks, CareerUp AI's unknown allocation, disputed links, and quoted CSV input. Stable fixtures keep utility tests independent from future dataset additions.

## Browser verification

Automated Chromium checks inspected **12 representative routes at 1440, 1024, 768 and 390 pixels: 48 route/viewport combinations**. All had a single main heading and no horizontal overflow. Routes included home, directory, examples, BCA, MCA, a group, three detail types, the conflicted allocation, guidelines, and 404. Desktop and mobile screenshots were visually inspected. The final homepage was checked again at all four widths after the loading-layout improvement.

The final production preview passed 11 interaction groups with no uncaught runtime errors:

1. Case-insensitive real-time title search.
2. Programme/group/search combination and persistence after a direct refresh.
3. Reset, pagination, grid/list display, and rapid reset-followed-by-filter changes.
4. Technology/category/status/session filtering, empty results, and recovery.
5. Member search, global search, CareerUp AI details, and absent optional links.
6. Conditional external links, safe new tabs, five-member team display, and copy feedback.
7. Search for both disputed PUGID26044 allocations.
8. Programme → group → team discovery and switching groups.
9. Invalid programme, group, project and arbitrary routes; corrected Not Found titles.
10. Mobile menu, native focus containment, Escape, navigation, and skip link.
11. Reduced-motion preference.

Two additional development-server checks injected failures without changing the shipped data: a failed project-data import displayed an error notice, while malformed optional fields and invalid records stayed isolated and a missing image fell back to its generated visual.

Both reference GitHub repositories and both reference websites returned HTTP 200 when checked. These are deliberately labeled independent public examples, not student-owned work. Future links will require their own verification.

## Accessibility and performance

Automated axe-core WCAG A/AA scans reported **zero violations** on home, directory, examples, programme, detail, guidelines, 404, and the open mobile navigation dialog. Keyboard navigation and focus behavior were also exercised. Automated checks do not replace a full assistive-technology audit.

A Lighthouse **mobile emulation** audit against the local production preview returned:

| Category / metric | Result |
| --- | --- |
| Performance | **99 / 100** |
| Accessibility | **100 / 100** |
| Best practices | **100 / 100** |
| SEO | **100 / 100** |
| First contentful paint | 1.4 s |
| Largest contentful paint | 1.8 s |
| Total blocking time | 20 ms |
| Cumulative layout shift | **0** |

These are local laboratory results, not a guarantee of real-world hosting scores. No production domain, mobile device, Safari or Firefox deployment was available for testing. The initial loading-screen layout shift was corrected before the final audit.

The generated main JavaScript is approximately **100.77 KB gzip**, CSS **10.34 KB gzip**, and the two local data chunks total **8.06 KB gzip**. No font or image download is required to render the interface. Development dependencies and documentation screenshots are not included in the browser payload.

## Remaining data work

Application checks pass. Academic records still require faculty approval. Review [data-provenance.md](data-provenance.md), resolve the C14/H12 duplicate ID and G08 URL mismatch, and replace pending/sample content with approved project and student information. This work does not require changes to the application's architecture.
