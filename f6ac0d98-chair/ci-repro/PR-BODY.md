Title: Deploy the build era to master: the composite-r4 slot (a5876c0ea) plus the chair's deploy-day cars

Open at: https://github.com/clausellstokes-lang/settlement-engine/compare/master...ci-fixes-2026-09-16?expand=1

## What this merges

Master still sits on the July review-fix line (d024286ee). This branch carries the whole build era up to the §931 landing (the build slot `claude/composite-r4` = a5876c0ea) plus nine chair cars cut on deploy day, 2026-09-16:

- migration 191 drop-before-replace (the production apply failed on a changed return type)
- `supabase/applied-head.json` moved to 200 (the production database is at migration 200; 32 edge functions deployed)
- the PDF worker graph excluded from React Fast Refresh (a dev-only crash in the e2e run)
- a 120 s budget on the campaign-runtime lazy-load build test
- THE GENESIS FREEZE of the generator golden master, owner-signed (`Owner-Signed: §901`): every future golden move goes through the signed shift-record door
- CI failure receipts as public annotations (job logs need sign-in; annotations do not)
- Playwright at 2 workers locally, 1 on CI, with a per-test budget on flow C
- the boot smoke answering the modulepreload probe like a browser and closing the network (Vite's preload polyfill was racing the runner's resolver)
- the footer home icon button at 44 px wide on mobile (the pointer-target audit)

## Why master and not a force-push

Master is protected (pull request + required status checks + no force push). The deploy to Vercel builds master only when CI is green.

## State of the checks on the tip (f23881382)

Green: validation, type ratchets, lint, build and dist, Chromium end-to-end, Deno edge tests, golden master under tr_TR + Chatham, browser performance. The two long jobs (test ratchet, coverage floors) were still running when this was written; merge on their green.

## After the merge

Vercel deploys the client. The production database is already ahead of the client (migrations 001–200 applied), which is the safe direction.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
