/**
 * capsule.mjs — AUTO-REPRO CAPSULES (SK-2B; ODQ §143.5).
 *
 * Every DETERMINISTIC tripwire firing bundles checkpoint + full config + seed + tick +
 * tripwire id + head sha into one directory with a `replay.mjs` that reproduces the
 * firing in one command. A finding's fix-lane dispatch cost drops to the artifact path.
 *
 * ⛔ CAPSULES LIVE OUTSIDE EVERY ARCHIVE. The archive is deleted after the run; a capsule
 * inside it dies with it, and the finding it documented has to be re-earned at full
 * century cost. The durable home is supplied by the caller (SK-6 owns its single
 * spelling) and this module REFUSES to invent one — a home this file guessed would be a
 * second spelling of a location that must have exactly one.
 *
 * ⛔ ONLY THE DETERMINISTIC CLASS MINTS A CAPSULE. A wall-clock blowout under pool
 * pressure is not a reproducible finding; a capsule for one would be an artifact that
 * replays green forever and teaches a fix lane to distrust capsules.
 */

import { renderReplayScript, replayVerdict } from './replay.template.mjs';

/**
 * The capsule identity. It IS the census key, so it carries the full cell identity plus
 * the tripwire and the tick band — never the bare seed. The banked-failure identity law:
 * a key that smears two findings together makes both uncountable.
 */
export function capsuleId({ tripwireId, cellKey, tickBand }) {
  return [tripwireId, cellKey, `tick-${tickBand}`]
    .map((part) => String(part).replace(/[^A-Za-z0-9_.:-]+/g, '_'))
    .join('__');
}

/** Tick bands keep repeat firings of ONE finding from counting as many. */
export function tickBandOf(tick, width = 52) {
  const n = Number(tick);
  if (!Number.isFinite(n) || n < 0) return 'unknown';
  return `${Math.floor(n / width) * width}-${Math.floor(n / width) * width + width - 1}`;
}

/**
 * Assemble a capsule as DATA — `{ path, contents }` rows the caller writes. Returned
 * rather than written so the shape is testable without touching a filesystem.
 *
 * @param {{stateHome: string, firing: {id: string, class: string, detail: string},
 *          cell: object, checkpoint: object, sourceSha: string, tick: number,
 *          soakArgv: string[], host: {nodeVersion: string, platform: string, arch: string}}} input
 * @returns {{refusals: string[], id: string|null, directory: string|null,
 *            files: Array<{path: string, contents: string, mode?: number}>}}
 */
export function buildCapsule({
  stateHome, firing, cell, checkpoint, sourceSha, tick, soakArgv, host,
}) {
  const refusals = [];
  if (!String(stateHome || '').trim()) {
    refusals.push(
      'REFUSED: no durable capsule home supplied. A capsule written inside the run archive '
      + 'dies with the archive teardown, and a home this module invented would be a second '
      + 'spelling of a location that must have exactly one.',
    );
  }
  if (firing?.class !== 'deterministic') {
    refusals.push(
      `REFUSED: ${firing?.id ?? '(unknown)'} is class ${firing?.class ?? '(none)'}. Only the `
      + 'DETERMINISTIC class mints capsules — a host-observability firing is not reproducible, '
      + 'and a capsule that replays green forever teaches a fix lane to distrust capsules.',
    );
  }
  if (refusals.length) return { refusals, id: null, directory: null, files: [] };

  const band = tickBandOf(tick);
  const id = capsuleId({ tripwireId: firing.id, cellKey: cell.key, tickBand: band });
  const directory = `${stateHome.replace(/\/+$/, '')}/capsules/${id}`;
  const manifest = {
    kind: 'soak_capsule',
    id,
    tripwire: { id: firing.id, class: firing.class, detail: firing.detail },
    cell,
    tick,
    tickBand: band,
    // The three facts that make a replay honest about its substrate.
    sourceSha: String(sourceSha),
    nodeVersion: String(host.nodeVersion),
    platform: String(host.platform),
    arch: String(host.arch),
    soakArgv,
  };
  return {
    refusals: [],
    id,
    directory,
    files: [
      { path: `${directory}/capsule.json`, contents: `${JSON.stringify(manifest, null, 2)}\n` },
      { path: `${directory}/checkpoint.json`, contents: `${JSON.stringify(checkpoint, null, 2)}\n` },
      {
        path: `${directory}/replay.mjs`,
        mode: 0o755,
        contents: renderReplayScript({
          capsuleId: id,
          sourceSha,
          nodeVersion: host.nodeVersion,
          platform: host.platform,
          arch: host.arch,
          tripwireId: firing.id,
          seed: cell.seed,
          years: cell.years,
          settlements: cell.settlements,
          tick,
          soakArgv,
        }),
      },
    ],
  };
}

export { replayVerdict };
