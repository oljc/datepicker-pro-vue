import originDayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import AdvancedFormat from 'dayjs/plugin/advancedFormat';
import weekYear from 'dayjs/plugin/weekYear';
import QuarterOfYear from 'dayjs/plugin/quarterOfYear';
import { isDayjs, isArray, isUndefined } from './is';
import 'dayjs/locale/zh-cn';

const overwriteIsDayjs = (_, Dayjs, dayjs) => {
  dayjs = (date, c) => {
    if (isDayjs(date)) {
      return date.clone();
    }
    const cfg = typeof c === 'object' ? c : {};
    cfg.date = date;
    // eslint-disable-next-line no-undef
    cfg.args = arguments;
    return new Dayjs(cfg);
  };

  const proto = Dayjs.prototype;
  const old$Utils = proto.$utils;
  proto.$utils = () => {
    const newUtils = old$Utils();
    newUtils.i = isDayjs;
    return newUtils;
  };

  dayjs.isDayjs = isDayjs;
};

originDayjs.extend(overwriteIsDayjs);
originDayjs.extend(customParseFormat);
originDayjs.extend(isBetween);
originDayjs.extend(weekOfYear);
originDayjs.extend(AdvancedFormat);
originDayjs.extend(weekYear);
originDayjs.extend(QuarterOfYear);

export const dayjs = originDayjs;

export const methods = {
  add(time, value, unit) {
    return time.add(value, unit);
  },
  subtract(time, value, unit) {
    return time.subtract(value, unit);
  },
  startOf(time, unit) {
    return time.startOf(unit);
  },
  endOf(time, unit) {
    return time.endOf(unit);
  },
  set(time, unit, value) {
    return time.set(unit, value);
  },
  isSameWeek(date1, date2, weekStart, localeName) {
    return date1
      .locale({ ...dayjs.Ls[localeName.toLocaleLowerCase()], weekStart })
      .isSame(date2, 'week');
  },
};

export function getNow() {
  return dayjs();
}

export function getSortedDayjsArray(values) {
  return [...values].sort((a, b) => a.valueOf() - b.valueOf());
}

export function isValueChange(prevValue, currentValue) {
  const isDifference = (value1, value2) => {
    if (value1 === undefined && value2 === undefined) {
      return false;
    }

    if ((value1 && !value2) || (!value1 && value2)) {
      return true;
    }

    return value1?.valueOf() !== value2?.valueOf();
  };

  if (currentValue === undefined && prevValue === undefined) {
    return false;
  }

  if (isArray(currentValue) && isArray(prevValue)) {
    return (
      isDifference(currentValue[0], prevValue[0]) ||
      isDifference(currentValue[1], prevValue[1])
    );
  }

  if (!isArray(currentValue) && !isArray(prevValue)) {
    return isDifference(currentValue, prevValue);
  }

  return true;
}

export function getDayjsValue(time, format) {
  const formatValue = (value) => {
    if (!value) return undefined;

    if (typeof value === 'string') {
      return dayjs(value, format);
    }

    return dayjs(value);
  };

  if (isArray(time)) {
    return time.map(formatValue);
  }

  return formatValue(time);
}

export function getDateValue(value) {
  const formatValue = (t) => (t ? t.toDate() : undefined);

  if (isArray(value)) {
    return value.map(formatValue);
  }

  return formatValue(value);
}

export function initializeDateLocale(localeName, weekStart) {
  dayjs.locale({ ...dayjs.Ls[localeName.toLocaleLowerCase()], weekStart });
}

export function padStart(string, length, char = ' ') {
  const s = String(string);
  if (!length) {
    return s;
  }
  const newString = s.length < length ? `${char}${s}` : s;
  return newString.length < length
    ? padStart(newString, length, char)
    : newString;
}

export function padEnd(string, length, char = ' ') {
  const s = String(string);
  if (!length) {
    return s;
  }
  const newString = s.length < length ? `${s}${char}` : s;
  return newString.length < length
    ? padEnd(newString, length, char)
    : newString;
}

export function getFormattedValue(time, format) {
  const formatValue = (time) => {
    if (isArray(time)) {
      return time.map((t) => formatValue(t));
    }

    if (isUndefined(time)) return undefined;

    return time.format(format);
  };

  return formatValue(time);
}

export function getReturnValue(date, format) {
  if (format === 'timestamp') {
    return date.toDate().getTime();
  }
  if (format === 'Date') {
    return date.toDate();
  }
  return date.format(format);
}
export function getReturnRangeValue(dates, format) {
  return dates.map((date) => (date ? getReturnValue(date, format) : undefined));
}

export function isValidInputValue(time, format) {
  if (!time) return false;
  return (
    typeof time === 'string' && dayjs(time, format).format(format) === time
  );
}
