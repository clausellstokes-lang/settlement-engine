# SettlementForge — World Importer (Foundry VTT)

A thin Foundry VTT module that imports a **SettlementForge world export** — the
`settlementforge-world` JSON produced by the app — into your world as journal
entries: one realm index plus a dossier journal per settlement.

The play surface owns the session; SettlementForge owns the world beneath it. This
is the bridge between them.

## The two export variants (the secrets seam)

SettlementForge exports a world in one of two variants, and this module simply
renders whichever it is handed:

- **DM variant** — carries your DM-private content (NPC secrets, plot hooks, NPC
  goals). Keep it to yourself.
- **Player variant** — fail-closed to player-safe content: **zero** covert marks,
  no NPC secrets/goals/whereabouts, no seeds. Safe to import into a world your
  players can browse.

The module never adds secrets that were not already in the file — a player export
has none to show.

## Install

1. Copy the `settlementforge-world-importer/` folder into your Foundry
   `Data/modules/` directory (this repository folder *is* the module).
2. Enable the module in your world (**Game Settings → Manage Modules**).

> Publishing this module to the Foundry package registry is intentionally left to
> the SettlementForge owner — there is no registry manifest URL baked in here.

## Use

1. In SettlementForge, export a world (DM or Player variant) — you get a
   `settlementforge-world` `.json` file.
2. In Foundry, as GM, open the **Journal** sidebar and click **Import World**.
3. Pick the exported `.json`. The module creates a `SettlementForge — <realm>`
   folder holding a **Realm** index journal and one **Dossier** journal per
   settlement.

You can also import from a macro or the console:

```js
const data = JSON.parse(await (await fetch('path/to/world.json')).text());
await game.settlementforge.importWorld(data);
```

## What gets created

- **Realm** journal — overview (settlement count, in-world time), the realm arcs,
  the member list, and a recent-history chronicle when the export carries one.
- **Dossier** journal per settlement — Overview, Notable People, Power & Factions,
  and (DM variant only) Plot Hooks.

All content is rendered as plain markdown journal pages with a game-system-agnostic
shape — no system dependency. Every string is escaped, so settlement content can
never inject markup.

## Scope (v1)

Manual export → import, **read-only**: the module only creates journal documents on
your explicit action and never writes back to the exported world. Live sync and
scene-pin creation are planned follow-ons.

Compatible with Foundry VTT **v11–v13**.
