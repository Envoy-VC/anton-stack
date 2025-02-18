import { defineConfig, loadEnv } from 'vite';
import wasm from 'vite-plugin-wasm';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  plugins: [tsconfigPaths(), wasm()],
  test: {
    testTimeout: 0,
    retry: 10,
    env: loadEnv(mode, process.cwd(), ''),
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      provider: 'v8',
    },
  },
}));
