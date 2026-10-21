from lib import apply
apply([(r''' | `envoyDiplomacyEnabled` | 200 | derived at master (persisted with WR-7d) |''',
        r''' | `envoyDiplomacyEnabled` | `ransomClaim.js` 178 · `envoyRansomStage.js` 98 (OP adds nothing) | derived at master (persisted with WR-7d) |''')], 'b1fix')
