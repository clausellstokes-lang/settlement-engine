# Status Page Runbook

How to run the public status page and how to write an incident on it. The page is
`public/status.html`; this runbook is the operating procedure and the incident
communication template.

> **What this is.** A hand-maintained, self-contained status page. It has **no
> monitoring service behind it** and makes **no network calls**. It is served from
> `/status.html`, outside the app bundle, so it stays readable when the app or the
> database is down. Keeping it accurate is a **human step** `[OWNER]` during an
> incident.

---

## Why it lives outside the app

A status page that is part of the app it reports on goes dark exactly when it is
needed. `public/status.html` is plain HTML with inline styles and no scripts, so it
survives a broken bundle, a failed deploy, or a database outage. Vercel serves it
directly (the SPA rewrite skips dotted paths), and it inherits the site's default
security headers. It is `noindex` so it does not compete with real pages in search.

## The status vocabulary

Each service row and the overall banner use one of four states. Keep them honest.

| State | Pill class | Banner class | Means |
|---|---|---|---|
| Operational | `pill-ok` | `banner-ok` | Working normally. |
| Degraded | `pill-degraded` | `banner-degraded` | Working, but slow or partial. |
| Down | `pill-down` | `banner-down` | Not working. |
| Maintenance | `pill-maintenance` | `banner-maintenance` | Deliberately offline for planned work. |

The overall banner should reflect the **worst** service state. If checkout is Down,
the banner is Down even if everything else is fine.

## Updating the page during an incident

1. **Set the banner.** Change the `<section class="banner ...">` class and its message
   to the worst current state.
2. **Set the affected rows.** Change the `<span class="pill ...">` class on each
   affected service. Leave the rest Operational.
3. **Post an incident.** In the "Current incidents" section, remove the
   `<p class="none">` line and add an incident block (template below).
4. **Set "Last updated"** at the foot to now.
5. **Deploy.** Commit and run a normal front-end deploy. The file ships with `dist/`.
6. **On resolution,** flip the banner and rows back to Operational, add a final
   "Resolved" line to the incident, and (optionally) move older incidents out after a
   day so the page stays current.

## Incident block template

Newest first. Plain, factual, one idea per sentence. No blame, no jargon, no
guessing at causes you have not confirmed. State what is affected, what is not, and
what you are doing.

```html
<div class="incident">
  <div class="when">1 August 2026, 14:20 UTC</div>
  <div class="head">Narration is slow to respond</div>
  <p>Narrated dossiers are taking longer than usual to return. Generation and
     checkout are unaffected. We are investigating and will update this page.</p>
  <!-- Follow-ups, added as it progresses (each with its own time): -->
  <p class="when">14:45 UTC. Identified. A provider slowdown is the cause. We have
     lowered concurrency and response times are recovering.</p>
  <p class="when">15:10 UTC. Resolved. Narration is back to normal.</p>
</div>
```

## Writing register (house voice)

- State facts, do not reassure. "Checkout is down. We are working on it." not "We are
  so sorry for any inconvenience."
- Name the concrete thing: "Saved worlds are not loading," not "some users may
  experience issues."
- No exclamation points. No blame. No promised timelines you cannot keep. If you do
  not know when it will be fixed, say you will post the next update by a time.
- Reassure only with what is true and specific: a same seed rebuilds the same world
  once service returns; saved data is not lost, only unreachable.

## See also
- `public/status.html` — the page (its header comment has the quick edit map).
- `docs/ops/DEPLOY_ROLLBACK_RUNBOOK.md` — rolling back the deploy that caused the incident.
- `docs/PERIMETER_RUNBOOK.md` / `docs/ops/DATA_BACKUP_RUNBOOK.md` — the systems behind the service rows.
