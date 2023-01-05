/**
 * 统一前缀
 * @param {*} componentName 组件名
 * @return 带前缀的class
 */
export function getPrefixCls(componentName) {
  const prefix = 'ljc';
  if (componentName) {
    return `${prefix}-${componentName}`;
  }
  return prefix;
}
