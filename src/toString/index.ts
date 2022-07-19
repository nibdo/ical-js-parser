import { DateTime } from 'luxon';

import {
  checkIfIsDateKey,
  checkIfIsDateKeyToString,
  DATE_ONLY_LENGTH,
  MAX_LINE_LENGTH,
} from '../common';
import {
  ALARMS_KEY,
  ATTENDEE_KEY,
  EXDATE_KEY,
  ORGANIZER_KEY,
} from '../constants';
import {
  DateTimeObject,
  EventJSON,
  ICalFromJSONData,
  TodoJSON,
} from '../index';
import { formatAlarmsToString, formatExDatesToString } from './utils';

const CALENDAR_BEGIN: string = 'BEGIN:VCALENDAR\n';
const CALENDAR_END: string = 'END:VCALENDAR';

export const parseNewLine = (value: string) => value.replaceAll('\n', '\\n');

const parseWithEmptySpace = (text: string, index: number) => {
  if (index === 0) {
    return text;
  }

  if (text.slice(0, 1) !== ' ') {
    return ` ${text}`;
  }

  return text;
};

const splitByMaxLength = (text: string) => {
  const result = [];

  let reminder = text;

  let index = 0;

  while (reminder.length > 0) {
    if (reminder.length + 1 < MAX_LINE_LENGTH) {
      result.push(`${parseWithEmptySpace(reminder, index)}`);
      reminder = '';
    } else {
      result.push(
        `${parseWithEmptySpace(reminder, index).slice(0, MAX_LINE_LENGTH - 1)}`
      );

      reminder = reminder.slice(MAX_LINE_LENGTH - 1);
    }

    index++;
  }

  return result;
};

const splitToRows = (text: string) => {
  let result = '';

  const textArray = text.split('\n');

  let index = 0;
  let reminder = '';
  for (const item of textArray) {
    let parsedItem = index === 0 ? item : ` ${item}`;

    if (parsedItem.length === MAX_LINE_LENGTH) {
      result += parsedItem + (index + 1 < textArray.length ? '\n' : '');

      reminder = '';
    } else if (parsedItem.length > MAX_LINE_LENGTH) {
      const subArray = splitByMaxLength(parsedItem);

      let subIndex = 0;
      for (const subItem of subArray) {
        result +=
          subItem +
          (index + 1 < textArray.length || subIndex + 1 < subArray.length
            ? '\n'
            : '');

        subIndex++;
      }

      reminder = '';
    } else {
      result += parsedItem + (index + 1 < textArray.length ? '\n' : '');

      reminder = '';
    }

    index += 1;
  }

  if (reminder) {
    result += reminder;
  }

  return result;
};

export const foldLine = (row: string, oldWay?: boolean): string => {
  let result: string = '';
  const foldCount: number = row.length / MAX_LINE_LENGTH;

  let tempRow: string = row;

  if (!oldWay) {
    return splitToRows(row);
  }

  if (row.length < MAX_LINE_LENGTH) {
    return row;
  }

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

export const transformToICalKey = (key: string): string => {
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

  let mailtoValue = ':mailto:';
  for (const [key, value] of Object.entries(obj)) {
    if (key !== 'mailto') {
      result = result + key.toUpperCase() + '=' + value + ';';
    } else {
      mailtoValue = mailtoValue + value;
    }
  }

  const endingNeedsSlice =
    result.slice(result.length - 1, result.length) === ';';

  return (
    (endingNeedsSlice ? result.slice(0, result.length - 1) : result) +
    mailtoValue
  );
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

export const parseUtcToTimestamp = (utcDate: string): string => {
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

export const parseUtcDateObj = (utcDate: any): string =>
  addZ(parseUtcToTimestamp(utcDate.value));

export const parseDateWithTimezone = (dateObj: any): string => {
  const adjustedDateTimeRaw = DateTime.fromISO(dateObj.value, {
    zone: dateObj.timezone,
  });

  if (adjustedDateTimeRaw.invalidReason === 'unsupported zone') {
    throw Error(`${adjustedDateTimeRaw?.invalidReason} ${adjustedDateTimeRaw}`);
  }

  const adjustedDateTime = adjustedDateTimeRaw.toString();

  const formatFromUtc: string = removeZ(parseUtcToTimestamp(adjustedDateTime));

  return `TZID=${dateObj.timezone}:${adjustedDateTimeRaw.toFormat(
    "yyyyMMdd'T'HHmmss"
  )}`;
};

const buildString = (event: EventJSON | TodoJSON, prevResult: string) => {
  let result: string = prevResult;

  // Build event string from object props
  for (const [key, value] of Object.entries(event)) {
    const keyString: string = key;
    const valueAny: any = value;

    // Rules
    const isValueArray: boolean = Array.isArray(valueAny);
    let delimiter: string = isValueArray ? ';' : ':';
    const isDateKey: boolean = checkIfIsDateKeyToString(key);
    const isAttendeeKey: boolean = key === ATTENDEE_KEY;
    const isOrganizerKey: boolean = key === ORGANIZER_KEY;
    const isAlarmsKey: boolean = key === ALARMS_KEY;
    const isExDateKey: boolean = key === EXDATE_KEY;

    // Different rules for dates
    if (isExDateKey) {
      result += formatExDatesToString(valueAny);
    } else if (isDateKey) {
      const hasTimezone: boolean = valueAny.timezone;
      const isSimpleObj: boolean = !hasTimezone && valueAny.value;
      const isSimpleDate: boolean =
        !hasTimezone &&
        isSimpleObj &&
        valueAny.value.length === DATE_ONLY_LENGTH;

      if (isSimpleDate) {
        // Date only for all day events
        result +=
          foldLine(`${transformToICalKey(key)};VALUE=DATE:${valueAny.value}`) +
          '\n';
      } else if (isSimpleObj) {
        result +=
          foldLine(
            `${transformToICalKey(key)}${delimiter}${parseUtcDateObj(valueAny)}`
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
    } else if (isAlarmsKey) {
      result += formatAlarmsToString(valueAny);
    } else {
      result +=
        foldLine(
          `${transformToICalKey(key)}${delimiter}${parseNewLine(valueAny)}`
        ) + '\n';
    }
  }

  return result;
};

/**
 * Build iCal string
 * @param iCalObj
 */
const toString = (iCalObj: ICalFromJSONData): string => {
  const { calendar, events, todos } = iCalObj;

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
  if (events && events.length > 0) {
    for (const event of events) {
      result = buildString(event, result);
    }
  }

  if (todos && todos.length > 0) {
    for (const todo of todos) {
      result = buildString(todo, result);
    }
  }

  result += CALENDAR_END;

  return result;
};

export default toString;
