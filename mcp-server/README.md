# SettlementForge — Truth Server (MCP)

A **local, read-only** [Model Context Protocol](https://modelcontextprotocol.io)
server that serves a SettlementForge **world export** as the receipts-bearing
truth layer under any AI. Instead of fighting the habit of asking ChatGPT about
your world, become the source it reads.

- **No cloud, no keys, no telemetry** — it runs on your machine over stdio.
- **Read-only by construction** — the four tools only *read* the world; there is
  no tool that writes anything, and no network write path.
- **Every answer carries receipts** — each response cites the export, variant,
  settlement, and tick it came from. No raw LLM can do that about your world.
- **Dependency-free** — a minimal stdio JSON-RPC/MCP implementation, zero
  third-party packages.

## The secrets seam

The server serves **the export variant it is given** and never redacts:

- Point it at a **player** export and it can only ever surface player-safe content
  (the export already stripped every covert mark, secret, and seed).
- Point it at a **DM** export and it surfaces your DM-private content — keep that
  file to yourself.

The redaction happened at export time in the app; the server honors the variant by
passing it through.

## Tools

| Tool | What it answers |
| --- | --- |
| `get_settlement` | One settlement dossier, by name or id (+ receipts). |
| `get_npc` | An NPC by name, across the world or within one settlement (+ receipts). |
| `search_events` | Chronicle headlines matching a query, each with its tick + affected settlements. |
| `ask_ledger` | A question about the realm answered FROM STATE (wars, faiths, trade, arcs) — never invented — citing the ledger rows. |

## Run it

1. In SettlementForge, export a world (DM or Player variant) → a
   `settlementforge-world` `.json` file.
2. Start the server on that file:

   ```sh
   node bin/cli.js ./my-world.player.json
   # or
   SF_WORLD_EXPORT=./my-world.player.json node bin/cli.js
   ```

3. Register it with any MCP client (Claude Desktop, etc.) as a stdio server whose
   command is `node /path/to/mcp-server/bin/cli.js /path/to/world.json`.

Human-facing logs go to **stderr**; **stdout** carries only JSON-RPC frames, so the
protocol channel stays clean.

## Publishing

Publication is intentionally the SettlementForge owner's call: this package is
`"private": true` and carries no registry configuration or tokens. The owner
removes `private` (and adds a `bin` shim / `npx` name) when they choose to
publish. Until then it runs perfectly well locally via `node bin/cli.js`.
