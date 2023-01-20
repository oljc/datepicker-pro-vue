import {
  isFunction,
  isNumber,
  isDayjs,
  isBoolean,
  isObject,
  isArray,
  isUndefined,
} from '../src/utils/is';

describe('检查is', () => {
  it('isFunction', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(1)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction('string')).toBe(false);
  });

  it('isNumber', () => {
    expect(isNumber(1)).toBe(true);
    expect(isNumber('1')).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
  });

  it('isBoolean', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean('false')).toBe(false);
    expect(isBoolean({})).toBe(false);
  });

  it('isObject', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(new Object())).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject('')).toBe(false);
    expect(isObject(1)).toBe(false);
  });

  test('isArray', () => {
    expect(isArray([])).toBe(true);
    expect(isArray(new Array())).toBe(true);
    expect(isArray({})).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray('')).toBe(false);
    expect(isArray(1)).toBe(false);
  });

  test('isUndefined', () => {
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined({})).toBe(false);
  });

  it('isDayjs', () => {
    const dayjsObj = require('dayjs')();
    expect(isDayjs(dayjsObj)).toBe(true);
    expect(isDayjs(new Date())).toBe(false);
    expect(isDayjs('2022-01-01')).toBe(false);
    expect(isDayjs({})).toBe(false);
    expect(isDayjs([])).toBe(false);
  });
});
