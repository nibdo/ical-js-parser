import { DateTime } from 'luxon';
import { DateTimeObject } from '../../index';
import { timezoneParser } from './timezoneParser';
import Datez from 'datez';

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

  return `${year}${month}${day}T${hour}${minute}00Z`;
};

export const formatTzidDate = (date: string, baseString?: string): string => {
  const baseDate: string = baseString ? baseString : getBaseDate(date);

  const year: string = baseDate.slice(0, 4);
  const month: string = baseDate.slice(4, 6);
  const day: string = baseDate.slice(6, 8);
  const hour: string = baseDate.slice(8, 10);
  const minute: string = baseDate.slice(10, 12);
  const seconds: string = baseDate.slice(12, 14);

  const result = `${year}${month}${day}T${hour}${minute}${seconds}`;

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

export const removeArtifacts = (value: string, counter = 0): string => {
  if (counter > 150) {
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

export const removeSpaces = (value: string, counter = 0): string => {
  if (counter > 30) {
    return value;
  }

  let newValue = value;

  if (newValue.indexOf(' ') !== -1) {
    newValue = newValue.replace(' ', '');
  } else {
    return newValue;
  }

  return removeSpaces(newValue, counter + 1);
};

/**
 * Better formatting for dates
 * @param iCalDate
 * @param warnings
 * @param fallbackTimezone
 */
export const parseICalDate = (
  iCalDate: string,
  warnings: string[],
  fallbackTimezone?: string
): DateTimeObject => {
  // No special handling for other dates
  const isTzidDate: boolean = iCalDate.indexOf('TZID') !== -1;
  const isAllDayEvent: boolean = iCalDate.indexOf('DATE:') !== -1;
  const isSimpleDate: boolean = !isTzidDate && !isAllDayEvent;

  if (isSimpleDate) {
    let baseDate = iCalDate;

    if (iCalDate.includes('DATE-TIME:')) {
      baseDate = iCalDate.slice(
        iCalDate.indexOf('DATE-TIME:') + 'DATE-TIME:'.length
      );
    } else if (iCalDate.includes('DATE:')) {
      baseDate = iCalDate.slice(iCalDate.indexOf('DATE:') + 'DATE:'.length);
    }

    const value = formatToIsoDate(baseDate);

    if (!DateTime.fromISO(value).isValid) {
      throw Error(`Invalid date: ${value}`);
    }

    return { value: formatToIsoDate(baseDate) };
  }

  if (isAllDayEvent) {
    const baseDate: string = iCalDate.slice(
      iCalDate.indexOf('DATE:') + 'DATE:'.length
    );
    const year: string = baseDate.slice(0, 4);
    const month: string = baseDate.slice(4, 6);
    const day: string = baseDate.slice(6, 8);

    const dateString = `${year}${month}${day}`;

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

    let timezoneParsed: string = timezoneParser(
      timezone?.slice(timezone?.indexOf('TZID=') + 'TZID='.length)
    );

    const dateExtracted = iCalDate?.split(':')?.[1];
    const baseDate: string = getBaseDate(dateExtracted);
    const resultDate: string = formatTzidDate(dateExtracted, baseDate);

    let zuluDate = Datez.fromFormat(baseDate, 'yyyyLLddHHmmss', {
      zone: timezoneParsed,
    }).toUTC();

    if (zuluDate.invalidReason === 'unsupported zone') {
      // replace invalid timezone with optional fallbackTimezone
      // caution as this might render event in incorrect time, but is
      // mitigation for cases when named timezones like Central European
      // Time
      if (fallbackTimezone) {
        zuluDate = DateTime.fromFormat(baseDate, 'yyyyLLddHHmmss', {
          zone: fallbackTimezone,
        }).toUTC();

        warnings.push(
          `Invalid timezone ${timezoneParsed} replaced with fallback timezone ${fallbackTimezone}`
        );

        timezoneParsed = fallbackTimezone;
      } else {
        throw Error(`${zuluDate?.invalidReason} ${timezoneParsed}`);
      }
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
