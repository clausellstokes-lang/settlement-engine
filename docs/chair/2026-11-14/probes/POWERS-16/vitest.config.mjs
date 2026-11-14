import react from '/home/user/p16/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '/home/user/p16', plugins: [react()], test: { include: ['/home/user/probes/v/*.test.jsx'], testTimeout: 600000, pool: 'forks' } };
