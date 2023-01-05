import BTween from 'b-tween';
import { isUndefined, isArray, isDayjs } from './is';

export function getColumnsFromFormat(format) {
  const units = ['H', 'h', 'm', 's', 'a', 'A'];
  const list = [];
  let use12Hours = false;
  units.forEach((unit) => {
    if (format.indexOf(unit) !== -1) {
      list.push(unit);
      if (unit === 'a' || unit === 'A') {
        use12Hours = true;
      }
    }
  });
  return {
    list,
    use12Hours,
  };
}

export function isDisabledTime(
  value,
  { disabledHours, disabledMinutes, disabledSeconds }
) {
  if (!value) return false;

  const hour = value.hour();
  const minute = value.minute();
  const second = value.second();

  const disabledHourList = disabledHours?.() || [];
  const disabledMinuteList = disabledMinutes?.(hour) || [];
  const disabledSecondList = disabledSeconds?.(hour, minute) || [];

  const isDisabledItem = (num, disabledList) => {
    return !isUndefined(num) && disabledList.includes(num);
  };

  return (
    isDisabledItem(hour, disabledHourList) ||
    isDisabledItem(minute, disabledMinuteList) ||
    isDisabledItem(second, disabledSecondList)
  );
}

const scrollIds = new Map();
export function scrollTo(element, to, duration) {
  const scrollId = scrollIds.get(element);
  if (!isUndefined(scrollId)) {
    cancelAnimationFrame(scrollId);
  }

  if (duration <= 0) {
    element.scrollTop = to;
  }

  scrollIds.set(
    element,
    requestAnimationFrame(() => {
      const tween = new BTween({
        from: { scrollTop: element.scrollTop },
        to: { scrollTop: to },
        duration,
        onUpdate: (keys) => {
          element.scrollTop = keys.scrollTop;
        },
      });
      tween.start();
    })
  );
}

export function omit(object, path) {
  const result = { ...object };
  for (const item of path) {
    if (item in result) {
      delete result[item];
    }
  }
  return result;
}

export function normalizeRangeValue(value) {
  if (isUndefined(value)) {
    return undefined;
  }
  return isArray(value) ? value : [value, undefined];
}

export function isCompleteRangeValue(value) {
  return !!value && isDayjs(value[0]) && isDayjs(value[1]);
}

export function isValidRangeValue(value) {
  return (
    isUndefined(value) || value.length === 0 || isCompleteRangeValue(value)
  );
}
export function mergeValueWithTime(defaultValue, dateValue, timeValue) {
  const dateVal = dateValue || defaultValue;
  const timeVal = timeValue || defaultValue;
  return timeVal
    .set('year', dateVal.year())
    .set('month', dateVal.month())
    .set('date', dateVal.date());
}

export function pick(obj, keys) {
  const clone = {};
  keys.forEach((key) => {
    const k = key;
    if (key in obj) {
      clone[k] = obj[k];
    }
  });
  return clone;
}
