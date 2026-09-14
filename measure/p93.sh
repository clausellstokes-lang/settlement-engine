perl -0pi -e "s/  if \(base\.pool !== tip\.pool\) return 'REPLACED';/  if (base.textSha !== tip.textSha) return 'WORDING-ONLY';/" scripts/prose-manifest-diff.mjs
