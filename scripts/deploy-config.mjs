/**
 * JSON boundary helpers for scripts/deploy.sh.
 *
 * Shell owns HTTP, ordering, and operator prompts. This helper owns structured
 * JSON validation and merging so those trust decisions stay readable and do
 * not become multiline JavaScript programs embedded inside shell functions.
 *
 * Inputs arrive through operation-specific environment variables; successful
 * read/merge operations write only their machine-consumed value to stdout.
 */

function parseJsonEnv(name) {
  const source = process.env[name];
  if (!source) throw new Error(`${name} is required`);
  return JSON.parse(source);
}

function dispatcherRows() {
  const rows = parseJsonEnv('DEPLOY_DISPATCHER_ROWS');
  if (!Array.isArray(rows)) {
    throw new Error('dispatcher response must be an array');
  }
  return rows;
}

function readDispatcherSecret() {
  const rows = dispatcherRows();
  if (rows.length > 1) {
    throw new Error('dispatcher response contained more than one row');
  }
  const secret = rows[0]?.value?.secret;
  if (typeof secret === 'string') process.stdout.write(secret);
}

function mergeDispatcher() {
  const rows = dispatcherRows();
  if (rows.length !== 1) {
    throw new Error('migration must seed exactly one dispatcher row');
  }
  const prior = rows[0]?.value;
  if (!prior || typeof prior !== 'object' || Array.isArray(prior)) {
    throw new Error('dispatcher value must be a JSON object');
  }

  process.stdout.write(JSON.stringify({
    value: {
      ...prior,
      enabled: true,
      url: process.env.DEPLOY_WORKER_URL,
      secret: process.env.DEPLOY_WORKER_SECRET,
    },
  }));
}

function verifyDispatcher() {
  const rows = dispatcherRows();
  const value = rows[0]?.value;
  const matches = rows.length === 1
    && value?.enabled === true
    && value?.url === process.env.DEPLOY_WORKER_URL
    && value?.secret === process.env.DEPLOY_WORKER_SECRET;
  if (!matches) throw new Error('persisted dispatcher does not match deployment');
}

function verifyLeaseProbe() {
  const result = parseJsonEnv('DEPLOY_RPC_PROBE_BODY');
  if (
    result?.code !== 'P0001'
    || result?.message !== 'event id is required'
  ) {
    throw new Error('Stripe lease RPC returned an unexpected probe result');
  }
}

const operations = {
  'read-dispatcher-secret': readDispatcherSecret,
  'merge-dispatcher': mergeDispatcher,
  'verify-dispatcher': verifyDispatcher,
  'verify-lease-probe': verifyLeaseProbe,
};

const operation = operations[process.argv[2]];
if (!operation) {
  throw new Error(`unknown deploy-config operation: ${process.argv[2] || '(missing)'}`);
}
operation();
