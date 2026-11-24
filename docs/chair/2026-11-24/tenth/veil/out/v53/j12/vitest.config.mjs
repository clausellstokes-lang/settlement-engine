export default {
  server: { fs: { allow: ['/home/user/join53', '/var/tmp/v53'] } },
  test: {
    root: '/var/tmp/v53/probes-pr', include: ['*.probe.test.js'], environment: 'node',
    setupFiles: ['/home/user/join53/tests/setup/gitEnvIsolation.js', '/home/user/join53/tests/setup/fastCheckSeed.js'],
    testTimeout: 900000, hookTimeout: 900000,
  },
};
