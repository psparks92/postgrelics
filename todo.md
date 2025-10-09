# Milestone 1: UX polish (low risk, high win)

- Mission display: table or cards with sorting/filtering (planet, type, rotation).
- Search UX: debounced search, fuzzy search (don't have to type prime all the time), highlight matches, quick filters (Era, mission type).
- Drop-rate formatting: percent bars and rarity coloring.

# Milestone 2: Enhancement levels and math

- Add relic refinement levels (Intact/Exceptional/Flawless/Radiant).
- Compute reward drop rates per level; show side-by-side compare + expected value.
- Small "cost helper" showing resource cost vs increased odds.

# Milestone 3: Farming planner (core value)

- "My Targets" list: track parts you want; show all relics that drop them and best missions.
- Scoring: rank missions by efficiency (drop chance × rotation time × squad size modifiers if relevant).
- Local-first: start with localStorage; abstract a storage service for easy swap to DB later.

# Milestone 4: Accounts (optional, later)

- Add auth only if you need cross-device sync.
- Simple route: NextAuth (or Lucia) + Postgres; store user targets and preferences.

# Milestone 5: Data integrity and refresh

- Scheduled scraper (cron) with checksum/versioning.
- Diff view: show what changed since last fetch.
- Basic admin dashboard to re-scrape and monitor errors.

# Milestone 6: Performance and DX

- Indexing on Postgres for relic_id, mission_id, era, reward_name.
- API caching (ETag/Cache-Control) and server-side rendering for search page.
- Seed scripts and a devcontainer for frictionless setup.

# Nice-to-haves

- Shareable links for target lists (URL-encoded or short IDs).
- "Best current rotations" view based on today's/this week's missions (if dynamic).
- Mobile-first layout for quick in-game reference.
