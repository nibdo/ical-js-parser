import { ATTENDEE_KEY, checkIfIsDateKey } from './common';
import { EventJSON, ICalJSON, KeyValue } from './types';

const EVENT_BEGIN_KEY_VALUE = 'BEGIN:VEVENT';
const CALENDAR_END_KEY_VALUE = 'END:VCALENDAR';

const VALARM_RECURSION_MAX_COUNT = 50;

const ALWAYS_STRING_VALUES: string[] = ['summary', 'description', 'location'];

const extractAlwaysStringValue = (value: any): string => {
  if (!value) {
    return '';
  }

  if (value.indexOf(':') === value.length) {
    return '';
  }

  return value.slice(value.indexOf(':') + 1);
};

/**
 * Split string events to array
 * @param iCalEvents
 */
const splitStringEvents = (iCalEvents: string) => {
  // Get array of events
  let result: any = iCalEvents.split(EVENT_BEGIN_KEY_VALUE).slice(1);

  if (!result) {
    return '';
  }

  // Add missing delimiter from split to each record
  result = result.map((item: string) => `${EVENT_BEGIN_KEY_VALUE}${item}`);

  return result;
};

const getVCalendarProps = (iCalString: string): string => {
  return iCalString.slice(0, iCalString.indexOf(EVENT_BEGIN_KEY_VALUE));
};

/**
 * Temporary solution to remove valarms in recursion
 * @param vEventsString
 * @param count
 */
const removeVAlarm = (
  vEventsString: string,
  count: number = VALARM_RECURSION_MAX_COUNT
): string => {
  let eventStringResult: string = vEventsString;

  const indexOfBeginVAlarm: number = eventStringResult.indexOf('BEGIN:VALARM');
  const indexOfEndVAlarm: number = eventStringResult.indexOf('END:VALARM');

  if (indexOfBeginVAlarm !== -1 && count > 0) {
    eventStringResult =
      eventStringResult.slice(0, indexOfBeginVAlarm) +
      eventStringResult.slice(indexOfEndVAlarm + 'END:VALARM'.length);

    removeVAlarm(eventStringResult, count - 1);
  }

  return eventStringResult;
};

const parseEventFromString = (rawString: string): EventJSON => {
  const eventObj: any = {};

  // Format event string, merge multiline values
  const eventWithMergedRows: string[] = mergeRows(rawString);

  for (const stringEvent of eventWithMergedRows) {
    const keyValue: KeyValue = splitToKeyValueObj(stringEvent);

    const { key, value } = keyValue;

    // Handle nested array value so it does not override with same key like ATTENDEE
    if (key === ATTENDEE_KEY) {
      eventObj[ATTENDEE_KEY] = Array.isArray(eventObj[ATTENDEE_KEY])
        ? [...eventObj[ATTENDEE_KEY], value]
        : [value];
    } else {
      eventObj[key] = value;
    }
  }

  return eventObj;
};

const formatString = (value: any): string => {
  if (!value || (typeof value === 'string' && value.length < 1)) {
    return '';
  }

  if (typeof value !== 'string') {
    return value;
  }

  let formattedValue: string = value.trim();

  if (formattedValue.length < 3) {
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
 * Merge rows for same key
 * @param stringEvent
 */
const mergeRows = (stringEvent: string): string[] => {
  // Split key values for every new line
  const rowsArray: string[] = stringEvent.split('\n');

  // Fix formatting with multiline values
  // Multiline values starts with empty space
  const fixedRowsArray: string[] = [];

  for (const currentRow of rowsArray) {
    if (currentRow.length > 0) {
      // Join this row with previous row if starts with empty space
      if (currentRow[0] && currentRow[0] === ' ') {
        // Merge previous and current row
        const mergedRows: string =
          fixedRowsArray[fixedRowsArray.length - 1] + currentRow;

        // Replace last item with joined rows
        fixedRowsArray.pop();
        fixedRowsArray.push(mergedRows);
      } else {
        // Just add row
        fixedRowsArray.push(currentRow);
      }
    }
  }

  return fixedRowsArray;
};

/**
 * Split string to separate key and value
 * @param item
 */
const splitToKeyValueObj = (item: string): KeyValue => {
  // Get basic delimiter indexes
  const basicDelimiterIndex: number = item.indexOf(':');
  const nestedDelimiterIndex: number = item.indexOf(';');

  // Check if item has nested values
  const hasNestedValues: boolean =
    nestedDelimiterIndex !== -1 && nestedDelimiterIndex < basicDelimiterIndex;

  let key: string;
  let value: any;

  // Set keys first
  if (hasNestedValues && item.slice(0, nestedDelimiterIndex) !== 'RRULE') {
    key = transformKey(item.slice(0, nestedDelimiterIndex));
  } else {
    key = transformKey(item.slice(0, basicDelimiterIndex));
  }

  // Check if key is date parameter
  const isDateKey: boolean = checkIfIsDateKey(key);

  // Set values
  if (hasNestedValues && ALWAYS_STRING_VALUES.indexOf(key) !== -1) {
    // Should format nested values summary, location and description to simple
    // string
    value = extractAlwaysStringValue(item);
  } else if (hasNestedValues && key !== 'rrule') {
    value = isDateKey
      ? formatString(item.slice(nestedDelimiterIndex + 1))
      : parseNestedValues(item.slice(nestedDelimiterIndex + 1));
  } else {
    value = formatString(item.slice(basicDelimiterIndex + 1));
  }

  if (isDateKey) {
    value = formatString(parseICalDate(key, value));
  }

  return {
    key,
    value,
  };
};

/**
 * Split item to key and nested values
 * @param item
 */
const splitNestedValues = (item: string): KeyValue => {
  const nestedValueDelimiterIndex: number = item.indexOf('=');

  return {
    key: transformKey(item.slice(0, nestedValueDelimiterIndex)),
    value: item.slice(nestedValueDelimiterIndex + 1),
  };
};

/**
 * Split values to nested obj, except date key
 * @param values
 */
const parseNestedValues = (values: string): KeyValue | string => {
  let result: any = {};

  // Separate key values with ; delimiter
  const valuesArray: string[] = values.split(';');

  for (const item of valuesArray) {
    const keyValue: KeyValue = splitNestedValues(item);

    const { key, value } = keyValue;

    // ** Handle exception with date in nested value ** //
    // f.e. date without time
    if (key === 'value' && value.indexOf('DATE') !== -1) {
      result = formatString(value.slice(value.indexOf('DATE')));
    } else if (value.indexOf(':mailto') !== -1) {
      result[key.toUpperCase()] = formatString(
        value.slice(0, value.indexOf(':mailto')).replace(' ', '')
      );
      result['mailto'] = formatString(
        value.slice(value.indexOf(':mailto:') + ':mailto:'.length)
      );
    } else {
      result[key.toUpperCase()] = formatString(value);
    }
  }

  return result;
};
/**
 * Lower case all keys, replace dashes with camelCase
 * @param keyOriginal
 */
const transformKey = (keyOriginal: string): string => {
  let resultKey = '';
  let newKey: string = keyOriginal.toLowerCase();

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
 * Better formatting for dates
 * // TODO refactor
 * @param key
 * @param iCalDate
 */
const parseICalDate = (key: string, iCalDate: string): any => {
  // No special handling for other dates
  const isTzidDate: boolean = iCalDate.indexOf('TZID') !== -1;
  const isAllDayEvent: boolean = iCalDate.indexOf('DATE:') !== -1;

  const isSimpleDate: boolean = !isTzidDate && !isAllDayEvent;

  if (isSimpleDate) {
    return getBaseDate(iCalDate);
  }

  if (isAllDayEvent) {
    const baseDate: string = iCalDate.slice(
      iCalDate.indexOf('DATE:') + 'DATE:'.length
    );
    const year: string = baseDate.slice(0, 4);
    const month: string = baseDate.slice(4, 6);
    const day: string = baseDate.slice(6, 8);

    return { value: `${year}-${month}-${day}`, isAllDay: true };
  }

  if (isTzidDate) {
    const timezone: string = iCalDate.split(':')[0];
    const baseDate: string = iCalDate.split(':')[1];

    return {
      value: getBaseDate(baseDate),
      timezone: timezone.slice(timezone.indexOf('TZID=') + 'TZID='.length),
    };
  }

  return { value: getBaseDate(iCalDate) };
};
/**
 * Format to ISO date
 * @param date
 */
const getBaseDate = (date: string): string => {
  const baseDate: string = date;

  const year: string = baseDate.slice(0, 4);
  const month: string = baseDate.slice(4, 6);
  const day: string = baseDate.slice(6, 8);
  const hour: string = baseDate.slice(9, 11);
  const minute: string = baseDate.slice(11, 13);

  return `${year}-${month}-${day}T${hour}:${minute}:00Z`;
};

/**
 * Main function
 * Get key values from each line to build obj
 * @param iCalStringEvent
 */
const toJSON = (iCalStringEvent: string): ICalJSON => {
  // Get vcalendar props
  const vCalendarString: string = getVCalendarProps(iCalStringEvent);

  // Get events
  let vEventsString: string = iCalStringEvent.slice(
    vCalendarString.length,
    iCalStringEvent.length - CALENDAR_END_KEY_VALUE.length
  );

  // Remove valarms //TODO add in future?
  vEventsString = removeVAlarm(vEventsString);

  // Split string events to array
  const vEventsArray: string[] = splitStringEvents(vEventsString);

  // Parse each event to obj
  const events: EventJSON[] = vEventsArray.map((stringEvent: string) =>
    parseEventFromString(stringEvent)
  );

  return {
    calendar: {
      begin: 'VCALENDAR',
      prodid: 'abc',
      version: '1',
      end: 'VCALENDAR',
    },
    events,
  };
};

export default toJSON;
