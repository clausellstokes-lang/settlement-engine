// Resolve bare packages the read-only code of record imports from fp-p8's node_modules (no install, no edit).
const FALLBACK = 'file:///home/user/fp-p8/package.json';
export async function resolve(specifier, context, next) {
  try { return await next(specifier, context); }
  catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND' && !specifier.startsWith('.') && !specifier.startsWith('/') && !specifier.startsWith('file:')) {
      return next(specifier, { ...context, parentURL: FALLBACK });
    }
    throw err;
  }
}
