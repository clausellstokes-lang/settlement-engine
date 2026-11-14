import react from '/tmp/rp5/tip/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '/tmp/rp5/tip', plugins: [react()], test: { environment: 'node', include: ['/tmp/rp5/probes/pdf5.test.jsx'], testTimeout: 1200000, pool: 'forks' } };
