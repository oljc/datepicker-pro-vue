import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import baseConfig from './rollup.config.base';

export default {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    serve({
      port: 8088,
      contentBase: ['dist', 'example'],
      openPage: 'dev.html',
    }),
    livereload({
      watch: 'example',
    }),
  ],
};
