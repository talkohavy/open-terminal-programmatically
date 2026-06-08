import typescript from '@rollup/plugin-typescript';
import { minify } from 'terser';
import type { NormalizedOutputOptions, RollupOptions, OutputPluginOption } from 'rollup';

/**
 * Inline terser minification — avoids the worker-thread lifecycle bug in
 * @rollup/plugin-terser@1.0.0 when used with rollup@4.x.
 */
function terserPlugin(outputOptions: NormalizedOutputOptions) {
  return {
    name: 'terser-inline',
    async renderChunk(code: string) {
      const result = await minify(code, {
        sourceMap: outputOptions.sourcemap === true || typeof outputOptions.sourcemap === 'string',
        module: outputOptions.format === 'es',
        toplevel: outputOptions.format === 'cjs',
      });
      return { code: result.code ?? code, map: result.map };
    },
  };
}

const config: RollupOptions = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.cjs',
      format: 'cjs',
      sourcemap: true,
      plugins: [terserPlugin({ format: 'cjs', sourcemap: true })],
    },
    {
      file: 'dist/index.esm.mjs',
      format: 'esm',
      sourcemap: true,
      plugins: [terserPlugin({ format: 'es', sourcemap: true })],
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      outDir: 'dist',
    }),
  ],
  external: ['child_process'],
};

export default config;
