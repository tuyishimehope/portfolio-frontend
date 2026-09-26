# PostHog troubleshooting

## Local development

Local events are intentionally disabled by default. To test them, set `NEXT_PUBLIC_POSTHOG_DEBUG=true` in `.env` and restart `npm run dev`. This enables local capture and SDK debug logs without overriding consent, Do Not Track, or internal-browser exclusions. Set it back to `false` after debugging.

Test a public page. `/admin`, `/login`, `/signup`, and `/reset-password` are excluded. Console diagnostics start with `[analytics]` and explain initialization or a disabled state. SDK logs such as `send "$pageview"` and `send "case_study_opened"` confirm capture, but do not independently prove ingestion.

The legacy `analytics-dev=1` localStorage flag still enables local capture. `?notrack=1` permanently marks that browser as internal. If this was set accidentally, remove only the `analytics-internal` key using browser developer tools, then reload. Do not clear consent or disable Do Not Track to force capture.

## Deployed site

Set `NEXT_PUBLIC_POSTHOG_KEY` to the project key in the hosting provider's build environment and redeploy. Next.js embeds public environment values during the build; a runtime-only change does not update the browser bundle. Set `NEXT_PUBLIC_POSTHOG_HOST` to the ingestion host for that project. The proxy now derives its event and asset destinations from that setting.

In the matching PostHog project, inspect recent events without filters that exclude localhost or anonymous visitors. The integration uses `person_profiles: "identified_only"`, so anonymous events need not create person profiles. A dashboard must have an insight configured for the event you want to see.

## Verification

- Run `node --test tests/analytics.test.mjs` for the capture gating and route privacy tests.
- Run `npm run lint` and `npx tsc --noEmit`.
- On September 26, 2026, a synthetic `analytics_integration_check` sent through the local `/ingest/capture/` proxy received HTTP 200 and `{"status":"Ok"}`.
- A browser visit initialized the SDK, emitted `$pageview` and `$web_vitals`, and clicking a case-study link emitted `case_study_opened`.
- Dashboard visibility and deployed-site configuration must be checked separately; they were not verified by these local checks.
