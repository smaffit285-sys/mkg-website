# Graph Report - src  (2026-06-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 30 nodes · 29 edges · 4 communities (2 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d391b47f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `toggleMenu()` - 3 edges
2. `openMenu()` - 2 edges
3. `closeMenu()` - 2 edges
4. `./SiteFooter.astro` - 1 edges
5. `../styles/tokens.css` - 1 edges
6. `../styles/base.css` - 1 edges
7. `../styles/layout.css` - 1 edges
8. `../styles/neon.css` - 1 edges
9. `../styles/hero.css` - 1 edges
10. `../styles/service-cards.css` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (4 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (11): ../scripts/interactions.js?url, ../scripts/navigation.js?url, ../styles/base.css, ../styles/hero.css, ../styles/layout.css, ../styles/neon.css, ../styles/our-story.css, ../styles/panels.css (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.60
Nodes (3): closeMenu(), openMenu(), toggleMenu()

## Knowledge Gaps
- **14 isolated node(s):** `./SiteFooter.astro`, `../styles/tokens.css`, `../styles/base.css`, `../styles/layout.css`, `../styles/neon.css` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `./SiteFooter.astro`, `../styles/tokens.css`, `../styles/base.css` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._