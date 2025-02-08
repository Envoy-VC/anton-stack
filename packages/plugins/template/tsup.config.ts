import { type Options, defineConfig } from 'tsup';

const commonConfig: Options = {
  treeshake: true,
  sourcemap: true,
  minify: true,
  shims: true,
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  clean: true,
  target: ['es6', 'es2022'],
  tsconfig: 'tsconfig.json',
};

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    outDir: 'dist',
    ...commonConfig,
  },
  {
    entry: ['./src/cdp/index.ts'],
    outDir: 'dist/cdp',
    ...commonConfig,
  },
  {
    entry: ['./src/goat/index.ts'],
    outDir: 'dist/goat',
    ...commonConfig,
  },
]);
