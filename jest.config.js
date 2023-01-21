module.exports = {
  clearMocks: true, // 清除Mock
  collectCoverage: true, // 开启覆盖率分析
  testMatch: ['<rootDir>/test/**/*.test.js'],
  transform: {
    '^.+.js$': 'babel-jest',
    '^.+.vue$': '@vue/vue2-jest',
  },
  moduleFileExtensions: ['js', 'vue'],
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(lodash-es|other-es-lib))"]
};
