# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router project. PostHog client-side analytics were initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+). A reverse proxy was configured in `next.config.ts` to route PostHog ingestion through `/ingest` so events are less likely to be blocked by ad blockers. Two client-side interaction events were added to track the core event discovery flow: exploring events and clicking event cards.

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" button on the home page | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details (includes title, slug, location, date) | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/425730/dashboard/1717379)
- **Insight**: [Explore Events Clicked (30d)](https://us.posthog.com/project/425730/insights/ByPbqD8C)
- **Insight**: [Event Card Clicks (30d)](https://us.posthog.com/project/425730/insights/G4nfJuzM)
- **Insight**: [Unique Users Exploring Events (30d)](https://us.posthog.com/project/425730/insights/DMf7VPV4)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
