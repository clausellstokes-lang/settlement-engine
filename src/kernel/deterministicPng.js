/**
 * Minimal deterministic RGB PNG encoder shared by domain renderers.
 *
 * The IDAT payload uses DEFLATE stored blocks: there is no compression search,
 * timestamp, platform codec, or browser API. Identical dimensions and pixels
 * therefore produce identical bytes on every host. Scanlines use PNG filter 0;
 * CRC-32 protects chunks and Adler-32 closes the zlib stream.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let value = 0; value < 256; value++) {
    let checksum = value;
    for (let bit = 0; bit < 8; bit++) {
      checksum = (checksum & 1)
        ? (0xEDB88320 ^ (checksum >>> 1))
        : (checksum >>> 1);
    }
    table[value] = checksum >>> 0;
  }
  return table;
})();

/** @param {Uint8Array} bytes @returns {number} */
function crc32(bytes) {
  let checksum = 0xFFFFFFFF;
  for (let index = 0; index < bytes.length; index++) {
    checksum = CRC_TABLE[(checksum ^ bytes[index]) & 0xFF] ^ (checksum >>> 8);
  }
  return (checksum ^ 0xFFFFFFFF) >>> 0;
}

/** @param {Uint8Array} bytes @returns {number} */
function adler32(bytes) {
  let first = 1;
  let second = 0;
  for (let index = 0; index < bytes.length; index++) {
    first = (first + bytes[index]) % 65521;
    second = (second + first) % 65521;
  }
  return ((second << 16) | first) >>> 0;
}

/**
 * @param {Uint8Array} output
 * @param {number} offset
 * @param {number} value
 */
function writeUint32(output, offset, value) {
  output[offset] = (value >>> 24) & 0xFF;
  output[offset + 1] = (value >>> 16) & 0xFF;
  output[offset + 2] = (value >>> 8) & 0xFF;
  output[offset + 3] = value & 0xFF;
}

/**
 * @param {string} type
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 */
function pngChunk(type, data) {
  const output = new Uint8Array(12 + data.length);
  writeUint32(output, 0, data.length);
  for (let index = 0; index < 4; index++) {
    output[4 + index] = type.charCodeAt(index);
  }
  output.set(data, 8);
  writeUint32(
    output,
    8 + data.length,
    crc32(output.subarray(4, 8 + data.length)),
  );
  return output;
}

/**
 * Wrap bytes in an RFC 1950 zlib stream containing only RFC 1951 stored blocks.
 * @param {Uint8Array} raw
 * @returns {Uint8Array}
 */
function zlibStore(raw) {
  const maximumBlockLength = 65535;
  const blockCount = Math.max(1, Math.ceil(raw.length / maximumBlockLength));
  const output = new Uint8Array(2 + blockCount * 5 + raw.length + 4);
  let outputOffset = 0;
  output[outputOffset++] = 0x78;
  output[outputOffset++] = 0x01;
  let inputOffset = 0;
  for (let block = 0; block < blockCount; block++) {
    const length = Math.min(maximumBlockLength, raw.length - inputOffset);
    output[outputOffset++] = block === blockCount - 1 ? 1 : 0;
    output[outputOffset++] = length & 0xFF;
    output[outputOffset++] = (length >>> 8) & 0xFF;
    const complement = (~length) & 0xFFFF;
    output[outputOffset++] = complement & 0xFF;
    output[outputOffset++] = (complement >>> 8) & 0xFF;
    output.set(raw.subarray(inputOffset, inputOffset + length), outputOffset);
    outputOffset += length;
    inputOffset += length;
  }
  writeUint32(output, outputOffset, adler32(raw));
  return output;
}

/**
 * Encode an eight-bit RGB framebuffer. Pixels are row-major, top-to-bottom.
 *
 * @param {number} width
 * @param {number} height
 * @param {Uint8Array} rgb
 * @returns {Uint8Array}
 */
export function encodePng(width, height, rgb) {
  if (
    !Number.isInteger(width)
    || !Number.isInteger(height)
    || width <= 0
    || height <= 0
    || rgb.length !== width * height * 3
  ) {
    throw new TypeError('encodePng requires positive dimensions and width*height*3 RGB bytes');
  }

  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const header = new Uint8Array(13);
  writeUint32(header, 0, width);
  writeUint32(header, 4, height);
  header[8] = 8;
  header[9] = 2;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  const stride = width * 3;
  const scanlines = new Uint8Array(height * (stride + 1));
  for (let row = 0; row < height; row++) {
    const target = row * (stride + 1);
    scanlines[target] = 0;
    scanlines.set(
      rgb.subarray(row * stride, row * stride + stride),
      target + 1,
    );
  }

  const chunks = [
    pngChunk('IHDR', header),
    pngChunk('IDAT', zlibStore(scanlines)),
    pngChunk('IEND', new Uint8Array(0)),
  ];
  const totalLength = signature.length
    + chunks.reduce((total, chunk) => total + chunk.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;
  output.set(signature, offset);
  offset += signature.length;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}
