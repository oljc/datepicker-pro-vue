/**
 * 判断工具
 * @author LIjiANgChen8 李江辰
 * @vervison v0.1.1
 * @date 2022/12/05
 */

const opt = Object.prototype.toString;

/**
 * 判断是否函数
 * @param obj 任意参数
 * @return {boolean} 是函数返回true，否则false
 */
export function isFunction(obj) {
  return typeof obj === 'function';
}

/**
 * 判断是否为数字
 * @param {any} obj - 任意参数
 * @returns {boolean} 是数字返回true，否则false
 */
export function isNumber(obj) {
  return opt.call(obj) === '[object Number]' && !Number.isNaN(obj);
}

/**
 * 判断是否布尔值
 * @param {any} obj 任意参数
 * @return {boolean} 布尔结果
 */
export function isBoolean(obj) {
  return opt.call(obj) === '[object Boolean]';
}

/**
 * 判断是否对象
 * @param obj 任意参数
 * @return {boolean} 是对象返回true，否则false
 */
export function isObject(obj) {
  return opt.call(obj) === '[object Object]';
}

/**
 * 判断是否数组
 * @param obj 任意参数
 * @return {boolean} 是数组返回true，否则false
 */
export function isArray(obj) {
  return opt.call(obj) === '[object Array]';
}

/**
 * 判断undefined
 * @param obj 任意参数
 * @return {boolean} undefined返回true，否则false
 */
export function isUndefined(obj) {
  return obj === undefined;
}

/**
 * 检查传入的参数是否为day.js对象
 * @param {any} time 时间
 * @returns {boolean} 如果是day.js对象返回true，否则返回false
 */
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
