#!/bin/sh
# usage: gate14.sh — STYLE-2-MERGE-14: point 49's gate at the save tip, each step alone through scripts/gate-tail.sh; summary /home/user/rec14/gate.sum
cd /home/user/wt-merge14 || exit 2
SUM=/home/user/rec14/gate.sum; : > $SUM
step() { name=$1; shift; sh scripts/gate-tail.sh -n 15 "$@" > /home/user/rec14/gate-$name.log 2>&1; rc=$?; echo "$name exit $rc" >> $SUM; }
for v in hazard-registry premortem packets data custom-content-manifest migration-head edge map tuning-bands foundry-module mcp-server; do step validate-$v npm run validate:$v; done
step typecheck-ratchet npm run typecheck:ratchet
step domain-strict npm run typecheck:domain:strict
step lint npm run lint
step wiring-check node scripts/wiring-census.mjs --check
step stateprose-check node scripts/generate-dossier-state-prose.mjs --check
step writer-reach node scripts/check-writer-reach.mjs
step observed-shape node scripts/check-observed-shape-readers.mjs
step presumed-door node scripts/presumed-things-door.mjs --check
step layers-door node scripts/fact-layers-door.mjs
step pool-guard node scripts/census/pool-dominance.mjs
step pagecensus-grid node scripts/census/page-census.mjs --grid
step build npm run build
step boot-smoke npm run smoke:boot
step governing npx vitest run --maxWorkers=2 $(cat /home/user/rec14/gov.txt)
step verify-dist npm run verify:dist
echo DONE >> $SUM
