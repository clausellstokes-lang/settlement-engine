const orig = globalThis.fetch;
const err = process.stderr; // captured before the smoke swaps `process` for a browser-shaped stub
globalThis.fetch = function spiedFetch(input, init) {
  const url = typeof input === 'string' ? input : (input && input.url) || String(input);
  const stack = new Error().stack.split('\n').slice(2, 9).join('\n');
  err.write(`[fetch-spy] ${(init && init.method) || 'GET'} ${url}\n${stack}\n`);
  return Promise.reject(new TypeError('fetch failed (boot-smoke spy: network closed)'));
};
process.on('unhandledRejection', (e) => { err.write(`[unhandledRejection] ${e && e.message}\n`); });
