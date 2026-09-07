/**
 * Pure policy helpers shared by secret-gated pg_net workers.
 *
 * The workers deliberately keep their fail-closed gate order in their own
 * entrypoints. This module only centralizes the byte-comparison and scalar
 * parsing details that would otherwise drift between copies.
 */

export type CronDispatcherConfig = {
  url: string;
  secret: string;
};

/**
 * Compare two secrets without leaking their lengths or an early differing byte.
 *
 * SHA-256 first normalizes both inputs to fixed-size digests. XOR accumulation
 * then examines every digest byte before returning.
 */
export async function timingSafeEqualText(
  left: string,
  right: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const [leftDigest, rightDigest] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const leftBytes = new Uint8Array(leftDigest);
  const rightBytes = new Uint8Array(rightDigest);

  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }
  return difference === 0;
}

/** Coerce an operator-supplied value into an inclusive, bounded integer. */
export function boundedInteger(
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.max(minimum, Math.min(maximum, Math.trunc(parsed)))
    : fallback;
}

/**
 * Read the dispatcher's activation pair from a validated system_config value.
 *
 * A URL and secret are both required because migrations seed these fields as
 * null. Their joint presence distinguishes an intentionally activated cron
 * from a merely enabled but still inert configuration.
 */
export function readCronDispatcherConfig(
  config: Record<string, unknown>,
): CronDispatcherConfig | null {
  const url = typeof config.url === "string" ? config.url.trim() : "";
  const secret = typeof config.secret === "string"
    ? config.secret.trim()
    : "";
  return url && secret ? { url, secret } : null;
}
