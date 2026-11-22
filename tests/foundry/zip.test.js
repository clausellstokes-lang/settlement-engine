/**
 * zip.test.js — the store-only ZIP writer behind the Foundry module export.
 *
 * Pins: CRC-32 against the standard check vectors, the archive structure
 * (local headers / central directory / EOCD) by parsing our own output, and
 * byte-determinism (fixed DOS timestamp) — the property the manifest tests
 * lean on to pin module output without golden churn.
 */
import { describe, it, expect } from 'vitest';
import { buildZip, crc32 } from '../../src/foundry/zip.js';

const enc = new TextEncoder();
const u32 = (bytes, off) => new DataView(bytes.buffer, bytes.byteOffset).getUint32(off, true);
const u16 = (bytes, off) => new DataView(bytes.buffer, bytes.byteOffset).getUint16(off, true);

describe('crc32 — standard check vectors', () => {
  it('empty input → 0x00000000', () => {
    expect(crc32(new Uint8Array(0))).toBe(0x00000000);
  });
  it('"123456789" → 0xCBF43926 (the CRC-32 check value)', () => {
    expect(crc32(enc.encode('123456789'))).toBe(0xCBF43926);
  });
  it('"The quick brown fox jumps over the lazy dog" → 0x414FA339', () => {
    expect(crc32(enc.encode('The quick brown fox jumps over the lazy dog'))).toBe(0x414FA339);
  });
});

describe('buildZip — archive structure', () => {
  const entries = [
    { path: 'mod/module.json', data: '{"id":"mod"}\n' },
    { path: 'mod/data/ñ-journal.json', data: enc.encode('{"pages":[]}') },
  ];

  it('starts with a local file header signature', () => {
    const zip = buildZip(entries);
    expect(u32(zip, 0)).toBe(0x04034b50);
  });

  it('ends with a well-formed EOCD naming every entry', () => {
    const zip = buildZip(entries);
    const eocd = zip.length - 22; // no archive comment
    expect(u32(zip, eocd)).toBe(0x06054b50);
    expect(u16(zip, eocd + 8)).toBe(entries.length);  // entries this disk
    expect(u16(zip, eocd + 10)).toBe(entries.length); // entries total
    const cdSize = u32(zip, eocd + 12);
    const cdOffset = u32(zip, eocd + 16);
    expect(cdOffset + cdSize).toBe(eocd); // central directory abuts the EOCD
    expect(u32(zip, cdOffset)).toBe(0x02014b50); // central header signature
  });

  it('stores the first entry verbatim (method 0) with a matching CRC', () => {
    const zip = buildZip(entries);
    expect(u16(zip, 8)).toBe(0); // method: store
    const nameLen = u16(zip, 26);
    const name = new TextDecoder().decode(zip.slice(30, 30 + nameLen));
    expect(name).toBe('mod/module.json');
    const size = u32(zip, 22);
    const data = zip.slice(30 + nameLen, 30 + nameLen + size);
    expect(new TextDecoder().decode(data)).toBe('{"id":"mod"}\n');
    expect(u32(zip, 14)).toBe(crc32(data));
  });

  it('flags names as UTF-8 (general-purpose bit 11) and round-trips them', () => {
    const zip = buildZip(entries);
    expect(u16(zip, 6) & 0x0800).toBe(0x0800);
    const utf8Name = enc.encode('mod/data/ñ-journal.json');
    // The second local header follows the first entry's name + data.
    const second = 30 + u16(zip, 26) + u32(zip, 22);
    expect(u32(zip, second)).toBe(0x04034b50);
    const nameLen = u16(zip, second + 26);
    expect(nameLen).toBe(utf8Name.length);
    expect([...zip.slice(second + 30, second + 30 + nameLen)]).toEqual([...utf8Name]);
  });

  it('is byte-deterministic across builds (fixed DOS timestamp)', () => {
    const a = buildZip(entries);
    const b = buildZip(entries);
    expect(a.length).toBe(b.length);
    expect(Buffer.from(a).equals(Buffer.from(b))).toBe(true);
  });

  it('an empty archive is a bare, valid EOCD', () => {
    const zip = buildZip([]);
    expect(zip.length).toBe(22);
    expect(u32(zip, 0)).toBe(0x06054b50);
    expect(u16(zip, 10)).toBe(0);
  });
});
