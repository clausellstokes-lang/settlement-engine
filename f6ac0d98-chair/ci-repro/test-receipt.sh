#!/bin/sh
# Local test of the test-ratchet failure receipt: extract the node script from ci.yml, feed it a
# real vitest JSON report with one row flipped to failed and a fake log, and show what it emits.
set -e
D=/Users/cstokes/Desktop/settlement-engine-deploy
MY=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad/ci-repro
cd "$D"
awk '/Failure receipt \(test ratchet\)/{g=1} g&&/node - <<.EOF./{f=1;next} f&&/^          EOF$/{exit} f{sub(/^          /,""); print}' .github/workflows/ci.yml > "$MY/receipt.cjs"
node --check "$MY/receipt.cjs" && echo "receipt syntax ok ($(wc -l < "$MY/receipt.cjs" | tr -d ' ') lines)"
T=$(node -p "require('os').tmpdir()")
if [ -f "$T/test-ratchet-last-red.json" ]; then cp "$T/test-ratchet-last-red.json" "$T/test-ratchet-last-red.json.bak-0916"; fi
npx vitest run tests/build/bootSmoke.test.js --reporter=json --outputFile="$MY/sample-report.json" > /dev/null 2>&1 || true
node -e '
const fs = require("fs");
const [src, dst] = process.argv.slice(1);
const r = JSON.parse(fs.readFileSync(src, "utf8"));
const t = r.testResults[0].assertionResults[0];
t.status = "failed";
t.failureMessages = ["[31mAssertionError: expected 3 to be 4[39m\n at x.js:1"];
r.numFailedTests = 1;
fs.writeFileSync(dst, JSON.stringify(r));
console.log("sample red written:", dst);
' "$MY/sample-report.json" "$T/test-ratchet-last-red.json"
cd "$MY"
printf 'line A\n[test-ratchet] RED: 1 regression\n100%% done\n' > test-ratchet.log
rm -f summary.md
GITHUB_STEP_SUMMARY="$MY/summary.md" node receipt.cjs | cut -c1-260
echo "--- summary.md:"
head -12 summary.md
rm -f test-ratchet.log
if [ -f "$T/test-ratchet-last-red.json.bak-0916" ]; then mv "$T/test-ratchet-last-red.json.bak-0916" "$T/test-ratchet-last-red.json"; else rm -f "$T/test-ratchet-last-red.json"; fi
echo "tmp restored"
