/**
 * 判断工具
 * @author LIjiANgChen8 李江辰
 * @vervison v0.1.0
 * @date 2022/12/05
 */

const opt = Object.prototype.toString;

/**
 * 判断是否函数
 * @param obj 任意对象
 * @return {boolean} 布尔结果
 */
export function isFunction(obj) {
  return typeof obj === 'function';
}

export function isNumber(obj) {
  return opt.call(obj) === '[object Number]' && !Number.isNaN(obj);
}

export function isBoolean(obj) {
  return opt.call(obj) === '[object Boolean]';
}

export function isObject(obj) {
  return opt.call(obj) === '[object Object]';
}
export function isArray(obj) {
  return opt.call(obj) === '[object Array]';
}
export function isUndefined(obj) {
  return obj === undefined;
}
export function isDayjs(time) {
  return (
    isObject(time) &&
    '$y' in time &&
    '$M' in time &&
    '$D' in time &&
    '$d' in time &&
    '$H' in time &&
    '$m' in time &&
    '$s' in time
  );
}
