# FMG separate-origin deployment

## Contract

Production terrain runs at:

`https://map.settlementforge.com/map/index.html`

The application never substitutes its own `/map/` copy in production.
`src/lib/mapRuntimeConfig.js` rejects a missing URL, HTTP, the app origin, and
any origin not present in the committed CSP allowlist. It appends:

- `v=<MAP_FORK_REVISION>` for cache invalidation;
- `parentOrigin=<application origin>` for the child trust handshake.

Only the origin is sent. Application paths, query parameters, hashes, campaign
codes, and user state do not cross into the frame URL.

The parent bridge accepts messages only when both are true:

1. `event.origin` equals the configured map origin;
2. `event.source` equals the mounted iframe's `contentWindow`.

The child applies the mirror rule: the origin must equal the explicit
`parentOrigin`, and the source must be `window.parent`. All child send paths,
including the FMG-native drag/drop patch, use `sf-origin.js`'s one closed-over
target. There is no wildcard send.

## Deploy topology

1. Create a dedicated Vercel project/domain for
   `map.settlementforge.com`. Deploy the same built static map at `/map/*`.
2. Set the application project's production environment:

   `VITE_FMG_URL=https://map.settlementforge.com/map/index.html`

3. Point DNS and TLS at the map deployment before promoting the app build.
4. Keep the committed host redirects. Requests for `/map/*` on
   `settlementforge.com` and `www.settlementforge.com` redirect to the map host,
   preventing the relaxed fork from executing with app-origin storage.
5. Deploy the map host first, then the app. A stale app can continue using an
   older map revision; a new app must never point at an absent map revision.

Local Vite development may omit `VITE_FMG_URL`. The resolver then loads
`/map/index.html` and the child permits a missing query fallback only on
`localhost`, `127.0.0.1`, or `::1`. Deployed hosts have no fallback.
Arbitrary `*.vercel.app` previews are intentionally not map ancestors; use
local development or an explicitly allowlisted staging app/map origin pair for
end-to-end preview verification.

## Header contract

Both policies are enforced:

- App: strict `script-src`; exact map host in `frame-src`;
  `X-Frame-Options: SAMEORIGIN`.
- Map: fork-compatible `unsafe-inline` and `unsafe-eval`; only the two
  production app hosts in `frame-ancestors`; no `X-Frame-Options`, because
  `SAMEORIGIN` would contradict the intended embed.

Both continue to report violations to `/api/csp-report`.

## Release verification

Run:

```sh
npm run validate:map
npm test -- tests/lib/mapRuntimeConfig.test.js tests/lib/mapBridge.contract.test.js tests/map/sfOrigin.harness.test.js tests/map/sfBridge.harness.test.js tests/security/cspHeaderShape.test.js tests/security/cspForkIsolation.test.js tests/ui/worldMapInWords.test.jsx
```

Then verify the deployed response, not only repository JSON:

1. Run the source/CSP portion as part of the complete post-deploy proof in
   `docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`. It requires both origins'
   `/api/release` identities to match the clean local commit and records the
   served map-index hash.
2. The app document has an enforcing CSP whose `frame-src` includes exactly
   `https://map.settlementforge.com`.
3. The map document has an enforcing CSP with the expected
   `frame-ancestors`, and no `X-Frame-Options`.
4. The iframe request is on the map host, includes one `parentOrigin`, and the
   served index references `sf-origin.js`, `main.js`, and `sf-bridge.js` at the
   current `MAP_FORK_REVISION`.
5. The bridge reaches ready; place/remove, pan/zoom, thumbnail export,
   save/load snapshot, reset, and terrain tools still work.
6. A message from the wrong origin or a sibling frame is ignored.
7. Direct navigation to either production app host's `/map/index.html`
   redirects to the dedicated map host.
8. Review CSP reports after rollout. Fix legitimate violations; do not demote
   the policy to report-only as a shortcut.

DNS, TLS, Vercel project/domain assignment, production environment variables,
and live browser/header verification are deployment-owner actions. The
repository intentionally fails closed until those pieces exist.
