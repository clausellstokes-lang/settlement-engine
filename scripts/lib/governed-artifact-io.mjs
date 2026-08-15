/**
 * Filesystem and argv boundaries for governed, review-bearing artifacts.
 *
 * A report is not evidence if its output path can alias an input, overwrite the
 * baseline, or race a symlink into the repository. Planning resolves every
 * parent first and publication creates a fully-written inode before atomically
 * linking its final name with no-overwrite semantics.
 */
import { randomBytes } from 'node:crypto';
import {
  closeSync,
  constants,
  fsyncSync,
  linkSync,
  lstatSync,
  openSync,
  realpathSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path';

const plannedOutputs = new WeakSet();
const CASE_FOLD_PATHS = process.platform === 'darwin' || process.platform === 'win32';

function pathKey(path) {
  const normalized = path.normalize('NFC');
  return CASE_FOLD_PATHS ? normalized.toLocaleLowerCase('en-US') : normalized;
}

function inodeKey(stats) {
  return `${stats.dev}:${stats.ino}`;
}

function lstatIfPresent(path) {
  try {
    return lstatSync(path);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function requiredPath(value, label, cwd) {
  if (typeof value !== 'string' || !value.trim() || value.includes('\0')) {
    throw new Error(`${label} must be a nonempty filesystem path`);
  }
  return resolve(cwd, value);
}

function isWithin(root, candidate) {
  const rel = relative(root, candidate);
  return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`));
}

function existingFileDescriptor(path, label, cwd) {
  const absolutePath = requiredPath(path, label, cwd);
  const entry = lstatIfPresent(absolutePath);
  if (!entry) throw new Error(`${label} does not exist: ${absolutePath}`);
  const canonicalPath = realpathSync(absolutePath);
  const stats = statSync(canonicalPath);
  if (!stats.isFile()) throw new Error(`${label} must resolve to a regular file: ${absolutePath}`);
  return {
    absolutePath,
    canonicalPath,
    canonicalKey: pathKey(canonicalPath),
    inodeKey: inodeKey(stats),
  };
}

function outputDescriptor(path, index, cwd) {
  const label = `governed output ${index + 1}`;
  const absolutePath = requiredPath(path, label, cwd);
  const parentPath = dirname(absolutePath);
  let parentRealPath;
  try {
    parentRealPath = realpathSync(parentPath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(`${label} parent directory does not exist: ${parentPath}`, { cause: error });
    }
    throw error;
  }
  const parentStats = statSync(parentRealPath);
  if (!parentStats.isDirectory()) {
    throw new Error(`${label} parent is not a directory: ${parentPath}`);
  }
  const canonicalPath = join(parentRealPath, basename(absolutePath));
  return {
    label,
    requestedPath: path,
    absolutePath,
    canonicalPath,
    canonicalKey: pathKey(canonicalPath),
    parentRealPath,
    parentDevice: parentStats.dev,
    parentInode: parentStats.ino,
    targetStats: lstatIfPresent(canonicalPath),
  };
}

/**
 * Validate all output names as one set and return opaque publication plans.
 * Inputs and protected paths must exist so both their real paths and inodes can
 * participate in alias detection.
 */
export function planExternalArtifactOutputs({
  root,
  outputs,
  inputs = [],
  protectedPaths = [],
  cwd = process.cwd(),
}) {
  if (typeof root !== 'string' || !root.trim()) {
    throw new Error('governed artifact root must be a nonempty path');
  }
  if (!Array.isArray(outputs) || outputs.length === 0) {
    throw new Error('governed artifact publication requires at least one output');
  }
  if (!Array.isArray(inputs) || !Array.isArray(protectedPaths)) {
    throw new Error('governed artifact inputs and protectedPaths must be arrays');
  }

  const rootRealPath = realpathSync(resolve(cwd, root));
  if (!statSync(rootRealPath).isDirectory()) {
    throw new Error(`governed artifact root is not a directory: ${root}`);
  }
  const protectedDescriptors = [
    ...inputs.map((path, index) => existingFileDescriptor(path, `governed input ${index + 1}`, cwd)),
    ...protectedPaths.map((path, index) => (
      existingFileDescriptor(path, `governed protected path ${index + 1}`, cwd)
    )),
  ];
  const protectedPathKeys = new Set(protectedDescriptors.map(({ canonicalKey }) => canonicalKey));
  const protectedInodes = new Set(protectedDescriptors.map(({ inodeKey: key }) => key));
  const descriptors = outputs.map((path, index) => outputDescriptor(path, index, cwd));
  const outputPathKeys = new Set();
  const outputInodes = new Set();

  for (const descriptor of descriptors) {
    if (isWithin(rootRealPath, descriptor.canonicalPath)) {
      throw new Error(`${descriptor.label} must resolve outside the repository: ${descriptor.absolutePath}`);
    }
    if (outputPathKeys.has(descriptor.canonicalKey)) {
      throw new Error(`governed outputs contain a duplicate normalized path: ${descriptor.canonicalPath}`);
    }
    outputPathKeys.add(descriptor.canonicalKey);

    if (protectedPathKeys.has(descriptor.canonicalKey)) {
      throw new Error(`${descriptor.label} aliases a governed input or protected path: ${descriptor.canonicalPath}`);
    }
    if (descriptor.targetStats?.isSymbolicLink()) {
      throw new Error(`${descriptor.label} must not be an existing symlink: ${descriptor.canonicalPath}`);
    }
    if (descriptor.targetStats && !descriptor.targetStats.isFile()) {
      throw new Error(`${descriptor.label} is an existing nonregular target: ${descriptor.canonicalPath}`);
    }
    if (descriptor.targetStats) {
      const targetInode = inodeKey(descriptor.targetStats);
      if (protectedInodes.has(targetInode)) {
        throw new Error(`${descriptor.label} is a hardlink alias of a governed input or protected path`);
      }
      if (outputInodes.has(targetInode)) {
        throw new Error('governed outputs contain hardlink aliases of the same target');
      }
      outputInodes.add(targetInode);
    }
  }

  for (const descriptor of descriptors) {
    if (descriptor.targetStats) {
      throw new Error(`${descriptor.label} already exists; governed publication never overwrites`);
    }
  }

  return Object.freeze(descriptors.map((descriptor) => {
    const plan = Object.freeze({
      path: descriptor.canonicalPath,
      requestedPath: descriptor.requestedPath,
      parentRealPath: descriptor.parentRealPath,
      parentDevice: descriptor.parentDevice,
      parentInode: descriptor.parentInode,
    });
    plannedOutputs.add(plan);
    return plan;
  }));
}

function assertPublicationPlan(plan) {
  if (!plan || typeof plan !== 'object' || !plannedOutputs.has(plan)) {
    throw new Error('governed publication requires a plan returned by planExternalArtifactOutputs');
  }
  const parentStats = statSync(plan.parentRealPath);
  if (!parentStats.isDirectory()
    || parentStats.dev !== plan.parentDevice
    || parentStats.ino !== plan.parentInode) {
    throw new Error(`governed output parent changed after validation: ${plan.parentRealPath}`);
  }
  if (lstatIfPresent(plan.path)) {
    throw new Error(`governed output appeared after validation; refusing to overwrite: ${plan.path}`);
  }
}

function fsyncDirectory(path) {
  let fd;
  try {
    fd = openSync(path, constants.O_RDONLY);
    fsyncSync(fd);
  } catch (error) {
    if (!['EINVAL', 'ENOTSUP', 'EPERM'].includes(error?.code)) throw error;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

/** Publish complete text atomically. The final hard link is exclusive. */
export function publishTextExclusive(plan, text, { mode = 0o600 } = {}) {
  if (typeof text !== 'string') throw new Error('governed text publication requires a string');
  if (!Number.isInteger(mode) || mode < 0 || mode > 0o777) {
    throw new Error(`governed output mode is invalid: ${JSON.stringify(mode)}`);
  }
  assertPublicationPlan(plan);

  const temporaryPath = join(
    plan.parentRealPath,
    `.${basename(plan.path)}.tmp-${process.pid}-${randomBytes(12).toString('hex')}`,
  );
  let fd;
  let linked = false;
  let publicationError = null;
  let cleanupError = null;
  try {
    fd = openSync(
      temporaryPath,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL,
      mode,
    );
    writeFileSync(fd, text, { encoding: 'utf8' });
    fsyncSync(fd);
    const completedFd = fd;
    fd = undefined;
    closeSync(completedFd);
    linkSync(temporaryPath, plan.path);
    linked = true;
  } catch (error) {
    if (error?.code === 'EEXIST') {
      publicationError = new Error(
        `governed output already exists; refusing to overwrite: ${plan.path}`,
        { cause: error },
      );
    } else {
      publicationError = error;
    }
  } finally {
    if (fd !== undefined) {
      try {
        closeSync(fd);
      } catch (error) {
        if (!publicationError) cleanupError = error;
      }
    }
    try {
      unlinkSync(temporaryPath);
    } catch (error) {
      if (error?.code !== 'ENOENT' && !linked) cleanupError = error;
    }
  }
  if (publicationError) throw publicationError;
  if (cleanupError) throw cleanupError;
  fsyncDirectory(plan.parentRealPath);
  return plan.path;
}

/** Publish JSON with a trailing newline; callers may supply their canonical serializer. */
export function publishJsonExclusive(plan, value, {
  stringify = (input) => JSON.stringify(input, null, 2),
  mode,
} = {}) {
  if (typeof stringify !== 'function') throw new Error('governed JSON stringify option must be a function');
  const serialized = stringify(value);
  if (typeof serialized !== 'string') throw new Error('governed JSON serializer did not return a string');
  try {
    JSON.parse(serialized);
  } catch (error) {
    throw new Error('governed JSON serializer returned invalid JSON', { cause: error });
  }
  return publishTextExclusive(plan, serialized.endsWith('\n') ? serialized : `${serialized}\n`, { mode });
}

/**
 * Parse a closed flag vocabulary. A definition is `{kind:'flag'|'value', name}`.
 * Exact literal flags may contain `=` (for example `--migrate-schema=3`), while
 * value flags accept only the `--name=value` form.
 */
export function parseExactFlags(argv, definitions, { conflicts = [] } = {}) {
  if (!Array.isArray(argv) || argv.some((arg) => typeof arg !== 'string')) {
    throw new Error('governed CLI argv must be an array of strings');
  }
  if (!definitions || typeof definitions !== 'object' || Array.isArray(definitions)) {
    throw new Error('governed CLI flag definitions must be an object');
  }
  const entries = Object.entries(definitions);
  const result = {};
  const resultNames = new Set();
  for (const [flag, definition] of entries) {
    if (!/^--\S+$/.test(flag) || !definition || !['flag', 'value'].includes(definition.kind)
      || typeof definition.name !== 'string' || !/^[A-Za-z][A-Za-z0-9]*$/.test(definition.name)) {
      throw new Error(`invalid governed CLI flag definition: ${JSON.stringify({ flag, definition })}`);
    }
    if (definition.kind === 'value' && flag.includes('=')) {
      throw new Error(`governed CLI value flag definition must not contain '=': ${flag}`);
    }
    if (resultNames.has(definition.name)) {
      throw new Error(`governed CLI result name is duplicated: ${definition.name}`);
    }
    resultNames.add(definition.name);
    result[definition.name] = definition.kind === 'flag' ? false : null;
  }

  const seen = new Set();
  for (const arg of argv) {
    let flag = arg;
    let value = null;
    let definition = definitions[arg];
    if (!definition) {
      const equals = arg.indexOf('=');
      if (equals > 0) {
        flag = arg.slice(0, equals);
        value = arg.slice(equals + 1);
        definition = definitions[flag];
      }
    }
    if (!definition) throw new Error(`unknown governed CLI argument: ${arg}`);
    if (seen.has(flag)) throw new Error(`duplicate governed CLI argument: ${flag}`);
    seen.add(flag);
    if (definition.kind === 'flag') {
      if (arg !== flag) throw new Error(`governed CLI flag does not accept a value: ${flag}`);
      result[definition.name] = true;
    } else {
      if (arg === flag) throw new Error(`governed CLI flag requires --name=value form: ${flag}`);
      if (!value?.trim()) throw new Error(`governed CLI flag requires a nonempty value: ${flag}`);
      result[definition.name] = value;
    }
  }

  for (const group of conflicts) {
    if (!Array.isArray(group) || group.length < 2 || group.some((flag) => !definitions[flag])) {
      throw new Error(`invalid governed CLI conflict group: ${JSON.stringify(group)}`);
    }
    if (new Set(group).size !== group.length) {
      throw new Error(`governed CLI conflict group repeats a flag: ${JSON.stringify(group)}`);
    }
    const present = group.filter((flag) => seen.has(flag));
    if (present.length > 1) {
      throw new Error(`conflicting governed CLI arguments: ${present.join(', ')}`);
    }
  }
  return Object.freeze(result);
}
