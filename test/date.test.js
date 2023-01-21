import {
  methods,
  getSortedDayjsArray,
  isValueChange,
  getDayjsValue,
  getDateValue,
  padStart,
  getNow,
  padEnd,
  getFormattedValue,
  getReturnValue,
  initializeDateLocale,
  getReturnRangeValue,
  isValidInputValue,
  overwriteIsDayjs,
} from '../src/utils/date';
import dayjs from 'dayjs';

describe('methods', () => {
  const time = dayjs('2022-01-01');

  it('添加时间', () => {
    expect(methods.add(time, 2, 'day').format('YYYY-MM-DD')).toBe('2022-01-03');
  });

  it('减去时间', () => {
    expect(methods.subtract(time, 2, 'day').format('YYYY-MM-DD')).toBe(
      '2021-12-30'
    );
  });

  it('获取开始时间', () => {
    expect(methods.startOf(time, 'month').format('YYYY-MM-DD')).toBe(
      '2022-01-01'
    );
  });

  it('获取结束时间', () => {
    expect(methods.endOf(time, 'month').format('YYYY-MM-DD')).toBe(
      '2022-01-31'
    );
  });

  it('更新时间', () => {
    expect(methods.set(time, 'year', 2021).format('YYYY-MM-DD')).toBe(
      '2021-01-01'
    );
  });

  it('检查两个日期是否在同一周', () => {
    expect(methods.isSameWeek(time, dayjs('2022-01-03'), 0, 'zh-CN')).toBe(
      false
    );
    expect(methods.isSameWeek(time, dayjs('2022-01-08'), 0, 'zh-CN')).toBe(
      false
    );
  });
});

describe('getSortedDayjsArray', () => {
  it('时间排序测试', () => {
    const values = [
      dayjs('2023-01-02'),
      dayjs('2023-01-01'),
      dayjs('2023-01-03'),
    ];
    const expected = [
      dayjs('2023-01-01'),
      dayjs('2023-01-02'),
      dayjs('2023-01-03'),
    ];
    const result = getSortedDayjsArray(values);
    expect(result).toEqual(expected);
  });
});

describe('isValueChange', () => {
  it('当两个值不同时应该返回true', () => {
    const prevValue = dayjs('2023-01-01');
    const currentValue = dayjs('2023-02-01');
    expect(isValueChange(prevValue, currentValue)).toBe(true);
  });

  it('当两个值相同时应该返回false', () => {
    const prevValue = dayjs('2023-01-01');
    const currentValue = dayjs('2023-01-01');
    expect(isValueChange(prevValue, currentValue)).toBe(false);
  });

  it('当prevValue未定义且currentValue已定义时返回true', () => {
    const prevValue = undefined;
    const currentValue = dayjs('2023-01-01');
    expect(isValueChange(prevValue, currentValue)).toBe(true);
  });

  it('当prevValue已定义，currentValue未定义时返回true', () => {
    const prevValue = dayjs('2023-01-01');
    const currentValue = undefined;
    expect(isValueChange(prevValue, currentValue)).toBe(true);
  });

  it('当两个值是不同的数组时应该返回true', () => {
    const prevValue = [dayjs('2023-01-01'), dayjs('2023-01-02')];
    const currentValue = [dayjs('2023-02-01'), dayjs('2023-01-02')];
    expect(isValueChange(prevValue, currentValue)).toBe(true);
  });

  it('当两个值是相同的数组时应该返回false', () => {
    const prevValue = [dayjs('2023-01-01'), dayjs('2023-01-02')];
    const currentValue = [dayjs('2023-01-01'), dayjs('2023-01-02')];
    expect(isValueChange(prevValue, currentValue)).toBe(false);
  });

  it('当两个值都是undefined时应该返回false', () => {
    expect(isValueChange(undefined, undefined)).toBe(false);
    expect(isValueChange([1, undefined], [1, undefined])).toBe(false);
  });

  it('return true', () => {
    expect(isValueChange([1], 2)).toBe(true);
  });
});

describe('getNow', () => {
  it('当前时间是否相同', () => {
    const now = getNow();
    expect(now).toBeInstanceOf(dayjs);
    expect(now.format()).toBe(dayjs().format());
  });
});

describe('getDayjsValue', () => {
  test('测试getDayjsValue', () => {
    const timeString = '2020-01-01';
    const timeObject = new Date();
    const timeArray = [timeString, timeObject];
    const timestamp = 1609459200000;
    const input = undefined;

    const resultString = getDayjsValue(timeString);
    const resultObject = getDayjsValue(timeObject);
    const resultArray = getDayjsValue(timeArray);
    const expected = dayjs(timestamp);

    // use .isValid() method to check if the result is a valid dayjs object
    expect(resultString.isValid()).toBeTruthy();
    expect(resultObject.isValid()).toBeTruthy();
    expect(resultArray[0].isValid()).toBeTruthy();
    expect(resultArray[1].isValid()).toBeTruthy();
    expect(getDayjsValue(timestamp)).toEqual(expected);
    expect(getDayjsValue(input)).toBe(undefined);
  });
});

describe('getDateValue', () => {
  it('传入单个时间', () => {
    const dayjsValue = dayjs('2022-01-01');
    const dateValue = getDateValue(dayjsValue);
    expect(dateValue).toEqual(new Date('2022-01-01T00:00:00+08:00'));
  });

  it('传入时间数组', () => {
    const dayjsValues = [dayjs('2022-01-01'), dayjs('2022-01-02')];
    const dateValue = getDateValue(dayjsValues);
    expect(dateValue).toEqual([
      new Date('2022-01-01T00:00:00+08:00'),
      new Date('2022-01-02T00:00:00+08:00'),
    ]);
  });

  it('传入undefined', () => {
    const dateValue = getDateValue(undefined);
    expect(dateValue).toBe(undefined);
  });
});

describe('initializeDateLocale', () => {
  it('should call dayjs.locale with correct arguments', () => {
    const localeName = 'en';
    const weekStart = 0;
    const spy = jest.spyOn(dayjs, 'locale');
    initializeDateLocale(localeName, weekStart);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      ...dayjs.Ls[localeName.toLocaleLowerCase()],
      weekStart,
    });
    spy.mockRestore();
  });
});

describe('padStart|padEnd', () => {
  test('字符串的开头添加填充', () => {
    expect(padStart('m')).toBe('m');
    expect(padStart('m', 2)).toBe(' m');
    expect(padStart('mm', 1)).toBe('mm');
    expect(padStart('hello', 8, '0')).toBe('000hello');
    expect(padStart('123', 5, '0')).toBe('00123');
    expect(padStart('', 5, 'x')).toBe('xxxxx');
  });
  test('字符串的结尾添加填充', () => {
    expect(padEnd('m')).toBe('m');
    expect(padEnd('m', 2)).toBe('m ');
    expect(padEnd('mm', 1)).toBe('mm');
    expect(padEnd('hello', 8, '0')).toBe('hello000');
    expect(padEnd('123', 5, '0')).toBe('12300');
    expect(padEnd('', 5, 'x')).toBe('xxxxx');
  });
});

describe('getFormattedValue', () => {
  test('传入单个时间', () => {
    const time = dayjs();
    const format = 'YYYY-MM-DD';
    const formattedValue = getFormattedValue(time, format);
    expect(formattedValue).toBe(time.format(format));
  });
  test('传入数组时间', () => {
    const time = [dayjs(), dayjs().add(1, 'day')];
    const format = 'YYYY-MM-DD';
    const formattedValue = getFormattedValue(time, format);
    expect(formattedValue).toEqual(time.map((t) => t.format(format)));
  });

  test('传入undefind', () => {
    const time = undefined;
    const format = 'YYYY-MM-DD';
    const formattedValue = getFormattedValue(time, format);
    expect(formattedValue).toBe(undefined);
  });
});

describe('getReturnValue', () => {
  test('getReturnValue', () => {
    const date = dayjs('2023-01-01');
    expect(getReturnValue(date, 'YYYY-MM-DD')).toEqual('2023-01-01');
    expect(getReturnValue(date, 'timestamp')).toEqual(date.toDate().getTime());
    expect(getReturnValue(date, 'Date')).toEqual(date.toDate());
  });
});

describe('getReturnRangeValue', () => {
  it('should return an array of formatted dates', () => {
    const date1 = dayjs('2023-01-01');
    const date2 = dayjs('2023-01-02');
    const date3 = dayjs('2023-01-03');
    const format = 'YYYY-MM-DD';
    expect(getReturnRangeValue([date1, date2, date3], format)).toEqual([
      '2023-01-01',
      '2023-01-02',
      '2023-01-03',
    ]);
    expect(getReturnRangeValue([undefined, date2, date3], format)).toEqual([
      undefined,
      '2023-01-02',
      '2023-01-03',
    ]);
  });
});
describe('isValidInputValue', () => {
  test('正常输入', () => {
    expect(isValidInputValue('2023-01-01', 'YYYY-MM-DD')).toBe(true);
  });

  test('错误输入', () => {
    expect(isValidInputValue('', 'YYYY-MM-DD')).toBe(false);
    expect(isValidInputValue(null, 'YYYY-MM-DD')).toBe(false);
    expect(isValidInputValue(undefined, 'YYYY-MM-DD')).toBe(false);
    expect(isValidInputValue('01-01-2023', 'YYYY-MM-DD')).toBe(false);
  });
});
