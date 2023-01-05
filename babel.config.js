module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false, // 关闭 esm 转化，统一交由 rollup 处理，防止冲突
      },
    ],
  ],
  // plugins: ['@babel/plugin-transform-runtime']
};
