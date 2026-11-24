# Image slots

Drop an image in this folder named after a slot (any of .webp .avif .jpg .png)
and it replaces the placeholder artwork in that spot. Then restart `npm run dev`
(or run `npm run images`) so the site picks it up.

Only add images you have the rights to use.

| File name | Where it appears | Shape |
| --- | --- | --- |
| `depth-01` | Home · full-screen "Built for speed." | 16:9, at least 1920 px wide |
| `depth-02` | Home · full-screen "Made with care." | 16:9, at least 1920 px wide |
| `reel-01` … `reel-10` | Home · 3D reel ring | portrait, about 3:4 |
| `archive-01` … `archive-18` | Home · archive spiral | 4:3 |
| `case-01` … `case-05` | Work · case cards | 16:10 |
| `gallery-01` … `gallery-06` | Work · gallery | 4:5 |
| `studio-portrait` | Studio · the lead | 4:5 |
| `team-01` … `team-04` | Studio · team | 3:4 |
| `journal-01` | Journal · featured post | 16:9 |
| `journal-02` … `journal-06` | Journal · post grid | 4:3 |

Example: `public/images/depth-01.webp`, `public/images/archive-07.jpg`.

## Case, service and page slots (added)

| Slot | Where |
| --- | --- |
| `case-<slug>-hero` | Case page main figure and practice/next-case cards |
| `case-<slug>-depth` | Case page depth section |
| `case-<slug>-<n>a` … `c` | Case page rows (n = 1, 2, 3) |
| `service-<slug>-depth` | Service page depth section |
| `services-depth`, `services-tri-01` … `03` | Services page |
| `studio-depth-01`, `studio-depth-02` | Studio page |
| `work-depth`, `reel-poster` | Work page |

Case slugs: northwind, halo-summit, kilnworks, orbit-labs, saltline.
Service slugs: brand-and-identity, websites-and-digital-products, campaigns-and-content, ai-visibility, creative-retainer.
