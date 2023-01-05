import filesize from 'rollup-plugin-filesize';
import baseConfig from './rollup.config.base';

export default {
  ...baseConfig,
  plugins: [...baseConfig.plugins, filesize()],
};
