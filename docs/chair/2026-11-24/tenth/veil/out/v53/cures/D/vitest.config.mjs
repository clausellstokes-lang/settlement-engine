export default {
  server: { fs: { allow: ['/home/user/cures53', '/var/tmp/v53'] } },
  test: {
    root: '/var/tmp/v53/cures/D/probe', include: ['*.probe.test.js'], environment: 'node',
    setupFiles: ['/home/user/cures53/tests/setup/gitEnvIsolation.js', '/home/user/cures53/tests/setup/fastCheckSeed.js'],
    testTimeout: 900000, hookTimeout: 900000,
  },
};
