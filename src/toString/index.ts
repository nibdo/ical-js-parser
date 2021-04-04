import { DateTime } from 'luxon';

import { ICalJSON } from '../types';
import { checkIfIsDateKey, DATE_ONLY_LENGTH, MAX_LINE_LENGTH } from '../common';
import { ATTENDEE_KEY, ORGANIZER_KEY } from '../constants';

const CALENDAR_BEGIN: string = 'BEGIN:VCALENDAR\n';
const CALENDAR_END: string = 'END:VCALENDAR';

const foldLine = (row: string): string => {
  let result: string = '';
  const foldCount: number = row.length / MAX_LINE_LENGTH;

  if (row.length < MAX_LINE_LENGTH) {
    return row;
  }

  let tempRow: string = row;

  for (let i: number = 1; i <= foldCount + 1; i += 1) {
    if (tempRow.length <= MAX_LINE_LENGTH) {
      result = result + tempRow;

      return result;
    } else {
      result = result + tempRow.slice(0, MAX_LINE_LENGTH) + '\n ';

      const newTempRow: string = tempRow.slice(i * MAX_LINE_LENGTH);

      if (!newTempRow) {
        tempRow = tempRow.slice(MAX_LINE_LENGTH);
      } else {
        tempRow = tempRow.slice(i * MAX_LINE_LENGTH);
      }
    }
  }

  return result;
};

const addKeyValue = (prevData: string, key: string, value: string): string =>
  `${prevData}${key}${value}\n`;

const transformToICalKey = (key: string): string => {
  let result: string = '';

  for (let i: number = 0; i < key.length; i += 1) {
    const letter: string = key[i];

    // Transform camel case to dash
    if (letter.toUpperCase() === letter) {
      result += `-${letter}`;
    } else {
      result += letter.toUpperCase();
    }
  }

  return result;
};

const mapObjToString = (obj: any): string => {
  let result: string = '';

  for (const [key, value] of Object.entries(obj)) {
    if (key !== 'mailto') {
      result = result + key.toUpperCase() + '=' + value + ';';
    } else {
      result = result.slice(0, -1) + ':mailto:' + value;
    }
  }

  return result;
};

const removeDot = (date: string): string => {
  const indexOfDot: number = date.indexOf('.');
  const indexOfZ: number = date.indexOf('Z');

  if (indexOfDot === -1) {
    return date;
  }

  return date.slice(0, indexOfDot);
};

const removeZ = (date: string): string => {
  const indexOfZ: number = date.indexOf('Z');

  if (indexOfZ === -1) {
    return date;
  }

  return date.slice(0, indexOfZ);
};

const addZ = (date: string): string => {
  const indexOfZ: number = date.indexOf('Z');

  if (indexOfZ !== -1) {
    return date;
  }

  return date + 'Z';
};

const parseSimpleDate = (date: string): string => {
  let result: string = removeDot(date.replace('-', ''));

  return addZ(result);
};

const parseUtcToTimestamp = (utcDate: string): string => {
  let result: string = '';

  for (let i: number = 0; i < utcDate.length; i += 1) {
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

const parseUtcDateObj = (utcDate: any): string =>
  addZ(parseUtcToTimestamp(utcDate.value));

const parseDateWithTimezone = (dateObj: any): string => {
  const adjustedDateTime: string = DateTime.fromISO(dateObj.value)
    .setZone(dateObj.timezone)
    .toString();

  const formatFromUtc: string = removeZ(parseUtcToTimestamp(adjustedDateTime));

  return `TZID=${dateObj.timezone}:${formatFromUtc}`;
};

/**
 * Build iCal string
 * @param iCalObj
 */
const toString = (iCalObj: ICalJSON): string => {
  const { calendar, events } = iCalObj;

  const { prodid, version, calscale, method } = calendar;

  let result: string = '';

  // Add calendar info
  result += CALENDAR_BEGIN;

  // Add prodid
  result = addKeyValue(result, 'PRODID:', prodid);

  // Add version
  result = addKeyValue(result, 'VERSION:', version);

  if (method) {
    result = addKeyValue(result, 'METHOD:', method);
  }

  if (calscale) {
    result = addKeyValue(result, 'CALSCALE:', calscale);
  }

  // Loop over all events
  for (const event of events) {
    // Build event string from object props
    for (const [key, value] of Object.entries(event)) {
      const keyString: string = key;
      const valueAny: any = value;

      // Rules
      const isValueArray: boolean = Array.isArray(valueAny);
      let delimiter: string = isValueArray ? ';' : ':';
      const isDateKey: boolean = checkIfIsDateKey(key);
      const isAttendeeKey: boolean = key === ATTENDEE_KEY;
      const isOrganizerKey: boolean = key === ORGANIZER_KEY;

      // Different rules for dates
      if (isDateKey) {
        const hasTimezone: boolean = valueAny.timezone;
        const isSimpleObj: boolean = !hasTimezone && valueAny.value;
        const isSimpleDate: boolean =
          !hasTimezone && !isSimpleObj && valueAny.length === DATE_ONLY_LENGTH;

        if (isSimpleDate) {
          // Date only for all day events
          result +=
            foldLine(
              `${transformToICalKey(key)}${delimiter}${parseSimpleDate(
                valueAny
              )}`
            ) + '\n';
        } else if (isSimpleObj) {
          result +=
            foldLine(
              `${transformToICalKey(key)}${delimiter}${parseUtcDateObj(
                valueAny
              )}`
            ) + '\n';
        } else if (hasTimezone) {
          delimiter = ';';
          // Object with timezone and value
          result +=
            foldLine(
              `${transformToICalKey(key)}${delimiter}${parseDateWithTimezone(
                valueAny
              )}`
            ) + '\n';
        } else {
          result +=
            foldLine(
              `${transformToICalKey(key)}${delimiter}${parseUtcToTimestamp(
                valueAny
              )}`
            ) + '\n';
        }
      } else if (isAttendeeKey) {
        for (const item of valueAny) {
          result += foldLine('ATTENDEE;' + mapObjToString(item)) + '\n';
        }
      } else if (isOrganizerKey) {
        result += foldLine('ORGANIZER;' + mapObjToString(valueAny)) + '\n';
      } else {
        result +=
          foldLine(`${transformToICalKey(key)}${delimiter}${valueAny}`) + '\n';
      }
    }
  }

  result += CALENDAR_END;

  return result;
};

export default toString;
