#!/bin/bash
perl -0pi -e 's/    \} else if \(!col\.closed\) \{/    } else if (false) {/' src/domain/prose/entryWalker.js
perl -0pi -e "s/    \.split\(\/\(\?<=\[\.\?!\]\)\\\\s\+\(\?=\[A-Z\\\"'\(\]\)\/\)\.filter\(Boolean\)\.length;/    .split(\/(?<=[.?!;])\\\\s+\/).filter(Boolean).length;/" src/domain/prose/grammarWalker.js
perl -0pi -e "s/    'What was said is what was so\.',\n//" src/domain/display/heraldIntegrity.js
perl -0pi -e "s/        closed: false,\n        values: Object\.freeze\(band \? \[band\] : \[\]\),/        closed: true,\n        values: Object.freeze(band ? [band] : []),/" src/domain/institutions/institutionTable.js
perl -0pi -e "s/  smell: Object\.freeze\(\[/  smellRemoved: Object.freeze([/" src/domain/prose/presenceMeasure.js
