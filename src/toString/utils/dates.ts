import { DATE_ONLY_LENGTH } from '../../common';
import { foldLine, transformToICalKey } from './formatters';
import Datez from 'datez';

const removeDot = (date: string): string => {
  const indexOfDot: number = date.indexOf('.');

  if (indexOfDot === -1) {
    return date;
  }

  return date.slice(0, indexOfDot);
};

const addZ = (date: string): string => {
  const indexOfZ: number = date.indexOf('Z');

  if (indexOfZ !== -1) {
    return date;
  }

  return date + 'Z';
};

export const parseUtcToTimestamp = (utcDate: string): string => {
  let result = '';

  for (let i = 0; i < utcDate.length; i += 1) {
    const letter: string = utcDate[i];

    if (i === utcDate.length - 1 && letter === 'Z') {
      return addZ(removeDot(result));
    }

    if (letter !== ':' && letter !== '-') {
      result += letter;
    }
  }

  result = removeDot(result);

  return result;
};

export const parseUtcDateObj = (utcDate: any): string =>
  addZ(parseUtcToTimestamp(utcDate.value));

export const parseDateWithTimezone = (dateObj: any): string => {
  const adjustedDateTimeRaw = Datez.fromISO(dateObj.value, {
    zone: dateObj.timezone,
  });

  if (adjustedDateTimeRaw.invalidReason === 'unsupported zone') {
    throw Error(`${adjustedDateTimeRaw?.invalidReason} ${adjustedDateTimeRaw}`);
  }

  return `TZID=${dateObj.timezone}:${adjustedDateTimeRaw.toFormat(
    "yyyyMMdd'T'HHmmss"
  )}`;
};

export const formatOnlyDate = (key: string, value: string) =>
  foldLine(`${transformToICalKey(key)};VALUE=DATE:${value}`) + '\n';

export const formatSimpleDateObj = (
  key: string,
  value: any,
  delimiter: string
) =>
  foldLine(`${transformToICalKey(key)}${delimiter}${parseUtcDateObj(value)}`) +
  '\n';

export const formatDateWithTimezone = (
  key: string,
  value: any,
  delimiter: string
) =>
  foldLine(
    `${transformToICalKey(key)}${delimiter}${parseDateWithTimezone(value)}`
  ) + '\n';

export const formatNormalDateObj = (
  key: string,
  value: any,
  delimiter: string
) =>
  foldLine(
    `${transformToICalKey(key)}${delimiter}${parseUtcToTimestamp(value)}`
  ) + '\n';

export const getParsingDateRules = (valueAny: any) => {
  const hasTimezone: boolean = valueAny?.timezone !== undefined;
  const isSimpleObj: boolean = !hasTimezone && valueAny?.value !== undefined;
  const isSimpleDate: boolean =
    !hasTimezone && isSimpleObj && valueAny?.value.length === DATE_ONLY_LENGTH;

  return {
    hasTimezone,
    isSimpleDate,
    isSimpleObj,
  };
};

/**
 * Parse date row based on different formats
 * @param key
 * @param valueAny
 * @param delimiterPrev
 */
export const parseDateRows = (
  key: string,
  valueAny: any,
  delimiterPrev?: string
) => {
  const { hasTimezone, isSimpleDate, isSimpleObj } =
    getParsingDateRules(valueAny);

  let result = '';

  let delimiter = delimiterPrev || ';';

  // Date only for all day events
  if (isSimpleDate) {
    result += formatOnlyDate(key, valueAny.value);
  } else if (isSimpleObj) {
    delimiter = ':';

    result += formatSimpleDateObj(key, valueAny, delimiter);
  } else if (hasTimezone) {
    delimiter = ';';

    // Object with timezone and value
    result += formatDateWithTimezone(key, valueAny, delimiter);
  } else {
    delimiter = ':';

    result += formatNormalDateObj(key, valueAny, delimiter);
  }

  return result;
};
