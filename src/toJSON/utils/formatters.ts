import {
  ALWAYS_STRING_VALUES,
  ATTENDEE_KEY,
  EXDATE_KEY,
  MAILTO_KEY,
  MAILTO_KEY_WITH_DELIMITER,
  RRULE_ICAL_KEY,
  RRULE_KEY,
  UID_KEY,
} from '../../constants';
import { CalendarJSON, DateTimeObject, KeyValue } from '../../index';
import { MAX_LINE_LENGTH, checkIfIsDateKey } from '../../common';
import { isExDateArray } from './helpers';
import { parseICalDate, removeArtifacts } from './dates';

/**
 * Extract only simple string from nested values where we don't need
 * that other information like in location, summary, description
 * @param value
 */
export const extractAlwaysStringValue = (value: any): string => {
  if (!value) {
    return '';
  }

  if (value.indexOf(':') === value.length) {
    return '';
  }

  return value.slice(value.indexOf(':') + 1);
};

const joinWords = (text: string) => {
  let result = '';

  for (let i = 0; i < text.length; i++) {
    if (i > 0 && i % (MAX_LINE_LENGTH + 1) === 0) {
      if (text[i] !== ' ') {
        result += text[i];
      }
    } else {
      result += text[i];
    }
  }

  return result;
};

/**
 * Normalize string, remove any formats, line breaks
 * @param value
 */
export const normalizeString = (value: any): string | any => {
  if (!value || (typeof value === 'string' && value.length < 1)) {
    return '';
  }

  if (typeof value !== 'string') {
    return value;
  }

  const formattedValue: string = value.trim();

  if (formattedValue.length === 2) {
    if (formattedValue === '/r') {
      return '';
    }
    return formattedValue;
  }

  if (
    formattedValue.slice(formattedValue.length - 2, formattedValue.length) ===
    '/r'
  ) {
    return formattedValue.slice(0, formattedValue.length - 2);
  }

  return formattedValue;
};

/**
 * Lower case all keys, replace dashes with camelCase
 * @param keyOriginal
 */
export const normalizeKey = (keyOriginal: string): string => {
  let resultKey = '';
  const newKey: string = keyOriginal.toLowerCase();

  let willBeUpperCase = false;

  // Remove dashes, format to camelCase
  for (const letter of newKey) {
    const isDash: boolean = letter === '-';

    if (isDash) {
      willBeUpperCase = true;
    } else if (willBeUpperCase) {
      resultKey += letter.toUpperCase();
      willBeUpperCase = false;
    } else {
      resultKey += letter;
    }
  }

  return resultKey;
};

/**
 * Split rows to array and merge rows for same key
 * Multiple rows under same key are written with space at the line beginning
 * @param stringEvent
 */
export const splitRowsToArray = (stringEvent: string): string[] => {
  // Split key values for every new line
  const rowsArray: string[] = stringEvent.split('\n');

  // Fix formatting with multiline values starting with empty space
  const fixedRowsArray: string[] = [];

  // check if prev last character was space
  let wasSpaceBefore = false;

  for (const currentRow of rowsArray) {
    if (currentRow.length > 0) {
      // Join this row with previous row if starts with empty space
      if (currentRow[0] && currentRow[0] === ' ') {
        wasSpaceBefore = true;
        // Merge previous and current row
        const mergedRows: string =
          fixedRowsArray[fixedRowsArray.length - 1] +
          (wasSpaceBefore ? currentRow.slice(1) : currentRow);

        // Replace last item with joined rows
        fixedRowsArray.pop();
        fixedRowsArray.push(mergedRows);
      } else {
        wasSpaceBefore = false;
        // Just add row
        fixedRowsArray.push(currentRow);
      }
    }
  }

  return fixedRowsArray;
};

/**
 * Split string data sets to array
 * @param stringData
 * @param key
 */
export const splitDataSetsByKey = (stringData: string, key: string) => {
  // Get array of events
  let result: any = stringData.split(key).slice(1);

  if (!result) {
    return '';
  }

  // Add missing delimiter from split to each record
  result = result.map((item: string) => `${key}${item}`);

  return result;
};

export const removeSpaceAndNewLine = (value: string, counter = 0): string => {
  const hasSpace = value.indexOf(' ') !== -1;
  const hasNewLine = value.indexOf('\n') !== -1;

  if (counter > 1000) {
    return value;
  }

  if (!hasSpace && !hasNewLine) {
    return value;
  }

  let result = value;

  if (hasSpace) {
    result = result.replace(' ', '');
  }
  if (hasNewLine) {
    result = result.replace('\n', '');
  }

  return removeSpaceAndNewLine(result, counter + 1);
};

/**
 * Split item to key and nested values
 * @param item
 */
const splitNestedValues = (item: string): KeyValue => {
  const nestedValueDelimiterIndex: number = item.indexOf('=');

  return {
    key: normalizeKey(item.slice(0, nestedValueDelimiterIndex)),
    value: item.slice(nestedValueDelimiterIndex + 1),
  };
};

/**
 * Split values to nested obj, except date key
 * @param values
 */
export const parseNestedValues = (values: string): KeyValue | string => {
  let result: any = {};

  // Separate key values with ; delimiter
  const valuesArray: string[] = values.split(';');

  for (const item of valuesArray) {
    const keyValue: KeyValue = splitNestedValues(item);

    const { key, value } = keyValue;

    let newValue = value;

    if (key === 'email' || key === 'cn' || key === 'mailto') {
      newValue = removeArtifacts(newValue);
    }

    // ** Handle exception with date in nested value ** //
    // f.e. date without time
    if (key === 'value' && newValue.indexOf('DATE') !== -1) {
      result = normalizeString(value.slice(newValue.indexOf('DATE')));
    } else if (newValue.indexOf(MAILTO_KEY_WITH_DELIMITER) !== -1) {
      result[key.toUpperCase()] = normalizeString(
        newValue
          .slice(0, newValue.indexOf(MAILTO_KEY_WITH_DELIMITER))
          .replace(' ', '')
      );
      result[MAILTO_KEY] = normalizeString(
        newValue.slice(
          newValue.indexOf(`${MAILTO_KEY_WITH_DELIMITER}:`) +
            `${MAILTO_KEY_WITH_DELIMITER}:`.length
        )
      );
    } else {
      result[key.toUpperCase()] = normalizeString(newValue);
    }
  }

  return result;
};

/**
 * Split string to separate key and value
 * @param item
 */
export const splitRowToKeyValueObj = (item: string): KeyValue => {
  // Get basic delimiter indexes
  const basicDelimiterIndex: number = item.indexOf(':');
  const nestedDelimiterIndex: number = item.indexOf(';');

  // Check if item has nested values
  const hasNestedValues: boolean =
    nestedDelimiterIndex !== -1 && nestedDelimiterIndex < basicDelimiterIndex;

  let key: string;
  let value: any;

  // Set keys first
  if (
    hasNestedValues &&
    item.slice(0, nestedDelimiterIndex) !== RRULE_ICAL_KEY
  ) {
    key = normalizeKey(item.slice(0, nestedDelimiterIndex));
  } else {
    key = normalizeKey(item.slice(0, basicDelimiterIndex));
  }

  // Check if key is date parameter
  const isDateKey: boolean = checkIfIsDateKey(key);

  // Set values
  if (hasNestedValues && ALWAYS_STRING_VALUES.indexOf(key) !== -1) {
    // Should format nested values summary, location and description to simple
    // string
    value = extractAlwaysStringValue(item);
    value = normalizeString(value);
  } else if (hasNestedValues && key !== RRULE_KEY) {
    value = isDateKey
      ? normalizeString(item.slice(nestedDelimiterIndex + 1))
      : parseNestedValues(item.slice(nestedDelimiterIndex + 1));
  } else {
    value = normalizeString(item.slice(basicDelimiterIndex + 1));
  }

  if (isDateKey) {
    if (isExDateArray(key, value)) {
      const arrayValues = removeSpaceAndNewLine(value).split(',');
      value = arrayValues.map(
        (value) => parseICalDate(removeArtifacts(value)) as DateTimeObject
      );
    } else {
      value = parseICalDate(removeArtifacts(value)) as DateTimeObject;
    }
  }

  // UID cant have any space between chars
  if (key === UID_KEY) {
    value = value.replace(' ', '');
  }

  if (key === RRULE_KEY) {
    value = removeArtifacts(value);
  }

  return {
    key,
    value,
  };
};

export const formatStringToKeyValueObj = (
  stringValue: string,
  eventObj: any
) => {
  const eventWithMergedRows: string[] = splitRowsToArray(stringValue);

  for (const stringEvent of eventWithMergedRows) {
    const joinedWords = removeArtifacts(joinWords(stringEvent));
    const keyValue: KeyValue = splitRowToKeyValueObj(joinedWords);

    const { key, value } = keyValue;

    // Handle nested array value, so it does not override with same key like
    // ATTENDEE
    if (key === ATTENDEE_KEY) {
      eventObj[ATTENDEE_KEY] = Array.isArray(eventObj[ATTENDEE_KEY])
        ? [...eventObj[ATTENDEE_KEY], value]
        : [value];
    } else if (key === EXDATE_KEY) {
      if (Array.isArray(value)) {
        eventObj[EXDATE_KEY] = [...value];
      } else {
        eventObj[EXDATE_KEY] = Array.isArray(eventObj[EXDATE_KEY])
          ? [...eventObj[EXDATE_KEY], value]
          : [value];
      }
    } else {
      eventObj[key] = value;
    }
  }

  return eventObj;
};

/**
 * Parse calendar string to calendar JSON
 * @param calendarString
 */
export const formatVCalendarStringToObject = (
  calendarString: string
): CalendarJSON => {
  const calendarRows: string[] = splitRowsToArray(calendarString);

  const result: any = {};

  for (const row of calendarRows) {
    const keyValue: KeyValue = splitRowToKeyValueObj(row);

    const { key, value } = keyValue;

    if (key !== '' && value !== '') {
      result[key] = value;
    }
  }

  return result;
};
