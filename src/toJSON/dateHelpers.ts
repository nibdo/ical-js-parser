import { timezoneParser } from './timezoneParser';
import { DateTime } from 'luxon';
import { DateTimeObject } from '../index';

/**
 * Format to ISO date
 * @param date
 */
export const formatToIsoDate = (date: string): string => {
  const baseDate: string = getBaseDate(date);

  const year: string = baseDate.slice(0, 4);
  const month: string = baseDate.slice(4, 6);
  const day: string = baseDate.slice(6, 8);
  const hour: string = baseDate.slice(8, 10);
  const minute: string = baseDate.slice(10, 12);

  const result: string = `${year}${month}${day}T${hour}${minute}00Z`;

  // validateISOStringDate(result);

  return result;
};

export const formatTzidDate = (date: string, baseString?: string): string => {
  const baseDate: string = baseString ? baseString : getBaseDate(date);

  const year: string = baseDate.slice(0, 4);
  const month: string = baseDate.slice(4, 6);
  const day: string = baseDate.slice(6, 8);
  const hour: string = baseDate.slice(8, 10);
  const minute: string = baseDate.slice(10, 12);
  const seconds: string = baseDate.slice(12, 14);

  const result: string = `${year}${month}${day}T${hour}${minute}${seconds}`;

  return result;
};

export const getBaseDate = (date: string): string => {
  if (!date) {
    throw Error(`No date: ${date}`);
  }

  let result = date.replace('T', '');

  result = result.replace('Z', '');

  if (Number.isNaN(result)) {
    throw Error(`Invalid date: ${date}`);
  }

  if (result.length !== '20210401130000'.length) {
    if (result.length < '20210401130000'.length) {
      throw Error(`Invalid date: ${date}`);
    }
    if (result.length !== '2021040113000000'.length) {
      throw Error(`Invalid date: ${date}`);
    } else {
      return result.slice(0, -2);
    }
  }

  return result;
};

export const removeArtifacts = (value: string, counter: number = 0): string => {
  if (counter > 30) {
    return value;
  }

  let newValue = value;

  const hasSlashN = value.indexOf('\n') !== -1;
  const hasSlashR = value.indexOf('\r') !== -1;

  if (hasSlashN) {
    newValue = newValue.replace('\n', '');
  }

  if (hasSlashR) {
    newValue = newValue.replace('\r', '');
  }

  return removeArtifacts(newValue, counter + 1);
};

/**
 * Better formatting for dates
 * @param iCalDate
 */
export const parseICalDate = (iCalDate: string): DateTimeObject => {
  // No special handling for other dates
  const isTzidDate: boolean = iCalDate.indexOf('TZID') !== -1;
  const isAllDayEvent: boolean = iCalDate.indexOf('DATE:') !== -1;
  const isSimpleDate: boolean = !isTzidDate && !isAllDayEvent;

  if (isSimpleDate) {
    const value = formatToIsoDate(iCalDate);

    if (!DateTime.fromISO(value).isValid) {
      throw Error(`Invalid date: ${value}`);
    }

    return { value: formatToIsoDate(iCalDate) };
  }

  if (isAllDayEvent) {
    const baseDate: string = iCalDate.slice(
      iCalDate.indexOf('DATE:') + 'DATE:'.length
    );
    const year: string = baseDate.slice(0, 4);
    const month: string = baseDate.slice(4, 6);
    const day: string = baseDate.slice(6, 8);

    const dateString: string = `${year}${month}${day}`;

    if (
      !dateString ||
      dateString === '' ||
      dateString.indexOf('Invalid') !== -1
    ) {
      throw Error(`Cannot parse date: ${baseDate}`);
    }

    if (!DateTime.fromFormat(dateString, 'yyyyLLdd').isValid) {
      throw Error(`Invalid date: ${dateString}`);
    }

    return { value: dateString, isAllDay: true };
  }

  // Need to format tzid date value to UTC
  if (isTzidDate) {
    const timezone: string = iCalDate?.split(':')?.[0];

    const timezoneParsed: string = timezoneParser(
      timezone?.slice(timezone?.indexOf('TZID=') + 'TZID='.length)
    );

    const dateExtracted = iCalDate?.split(':')?.[1];
    const baseDate: string = getBaseDate(dateExtracted);
    let resultDate: string = formatTzidDate(dateExtracted, baseDate);

    const zuluDate = DateTime.fromFormat(baseDate, 'yyyyLLddHHmmss', {
      zone: timezoneParsed,
    }).toUTC();

    if (zuluDate.invalidReason === 'unsupported zone') {
      throw Error(`${zuluDate?.invalidReason} ${timezoneParsed}`);
    }
    if (
      !zuluDate ||
      !zuluDate.isValid ||
      zuluDate.toString().indexOf('Invalid') !== -1
    ) {
      throw Error(`Cannot parse date: ${dateExtracted}`);
    }

    return {
      value: resultDate,
      timezone: timezoneParsed,
    };
  }

  return { value: formatToIsoDate(iCalDate) };
};
