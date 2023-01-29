import vue from 'rollup-plugin-vue2';
import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import terser from '@rollup/plugin-terser';
import strip from '@rollup/plugin-strip';
import filesize from 'rollup-plugin-filesize';

import { name, version, author } from '../package.json';

const banner =
  '/*!\n' +
  ` * ${name} v${version}\n` +
  ` * (c) 2022-${new Date().getFullYear()} ${author}\n` +
  ' * Released under the MIT License.\n' +
  ' */';

export default {
  input: 'src/index.js',
  output: [
    {
      file: `dist/${name}.umd.js`,
      format: 'umd',
      name,
      banner,
      exports: 'named',
    },
    {
      file: `dist/${name}.umd.min.js`,
      format: 'umd',
      name,
      banner,
      exports: 'named',
      plugins: [terser()],
    },
    {
      file: `dist/${name}.esm.js`,
      format: 'es',
      exports: 'named',
      banner,
    },
  ],
  plugins: [
    vue({
      template: {
        isProduction: false,
      },
    }),
    nodePolyfills(),
    nodeResolve({
      browser: true,
      external: (id) => id.startsWith('dayjs'),
    }),
    commonjs(),
    babel({
      exclude: '**/node_modules/**',
      babelHelpers: 'bundled',
    }),
    postcss({
      extensions: ['.css', '.less'],
      plugins: [
        autoprefixer(), // 自动添加浏览器前缀
      ],
      minimize: true,
    }),
    alias({
      entries: {
        '@': './src',
      },
    }),
    strip({
      labels: ['unittest'],
    }),
    filesize(),
  ],
  external: ['vue'],
};
