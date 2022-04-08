import { checkIfIsDateKey } from '../common';
import {
  CalendarJSON,
  DateTimeObject,
  EventJSON,
  ICalJSON,
  KeyValue,
  TodoJSON,
} from '../index';
import { parseICalDate } from './dateHelpers';
import {
  ALWAYS_STRING_VALUES,
  ATTENDEE_KEY,
  CALENDAR_END_KEY_VALUE,
  EVENT_BEGIN_KEY_VALUE,
  MAILTO_KEY,
  MAILTO_KEY_WITH_DELIMITER,
  RRULE_ICAL_KEY,
  RRULE_KEY,
  TODO_BEGIN_KEY_VALUE,
  UID_KEY,
} from '../constants';
import {
  extractAlwaysStringValue,
  normalizeKey,
  normalizeString,
  splitRowsToArray,
} from './formatHelpers';
import { validateICalString } from './validator';
import { extractProperty, removeProperty, splitDataSetsByKey } from './utils';

/**
 * Extract only calendar string part
 * @param iCalString
 */
const getVCalendarString = (iCalString: string): string => {
  let firstItemIndex = iCalString.indexOf(EVENT_BEGIN_KEY_VALUE);

  if (firstItemIndex === -1) {
    firstItemIndex = iCalString.indexOf(TODO_BEGIN_KEY_VALUE);
  }

  return iCalString.slice(0, firstItemIndex);
};

/**
 * Parse calendar string to calendar JSON
 * @param calendarString
 */
const formatVCalendarStringToObject = (
  calendarString: string
): CalendarJSON => {
  const calendarRows: string[] = splitRowsToArray(calendarString);

  const result: any = {};

  for (const row of calendarRows) {
    const keyValue: KeyValue = splitRowToKeyValueObj(row);

    const { key, value } = keyValue;

    result[key] = value;
  }

  return result;
};

/**
 * Split string events to array
 * @param iCalEvents
 * @param key
 */
const splitStringEvents = (
  iCalEvents: string,
  key: string = EVENT_BEGIN_KEY_VALUE
) => {
  // Get array of events
  let result: any = iCalEvents.split(key).slice(1);

  if (!result) {
    return '';
  }

  // Add missing delimiter from split to each record
  result = result.map((item: string) => `${key}${item}`);

  return result;
};

export const formatStringToKeyValueObj = (
  stringValue: string,
  eventObj: any
) => {
  const eventWithMergedRows: string[] = splitRowsToArray(stringValue);

  for (const stringEvent of eventWithMergedRows) {
    const keyValue: KeyValue = splitRowToKeyValueObj(stringEvent);

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

const getResult = (rawString: string) => {
  const eventObj: any = {};

  // extract VALARMS from string
  const { mainProperty, extractedProperty } = extractProperty(
    rawString,
    'VALARM'
  );
  const alarmsString = extractedProperty;

  // Format event string, merge multiline values
  formatStringToKeyValueObj(mainProperty, eventObj);

  // format alarms
  if (alarmsString && alarmsString.length > 0) {
    eventObj.alarms = [];
    const alarmStrings: string[] = splitDataSetsByKey(alarmsString, 'VALARM');

    alarmStrings.forEach((item) => {
      const alarmObj: any = {};
      formatStringToKeyValueObj(item, alarmObj);
      eventObj.alarms.push(alarmObj);
    });
  }

  return eventObj;
};
const getOneEventJSON = (rawString: string): EventJSON => {
  return getResult(rawString);
};
const getOneTodoJSON = (rawString: string): TodoJSON => {
  return getResult(rawString);
};

/**
 * Split string to separate key and value
 * @param item
 */
const splitRowToKeyValueObj = (item: string): KeyValue => {
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
  } else if (hasNestedValues && key !== RRULE_KEY) {
    value = isDateKey
      ? normalizeString(item.slice(nestedDelimiterIndex + 1))
      : parseNestedValues(item.slice(nestedDelimiterIndex + 1));
  } else {
    value = normalizeString(item.slice(basicDelimiterIndex + 1));
  }

  if (isDateKey) {
    value = parseICalDate(value) as DateTimeObject;
  }

  // UID cant have any space between chars
  if (key === UID_KEY) {
    value = value.replace(' ', '');
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
    key: normalizeKey(item.slice(0, nestedValueDelimiterIndex)),
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
      result = normalizeString(value.slice(value.indexOf('DATE')));
    } else if (value.indexOf(MAILTO_KEY_WITH_DELIMITER) !== -1) {
      result[key.toUpperCase()] = normalizeString(
        value
          .slice(0, value.indexOf(MAILTO_KEY_WITH_DELIMITER))
          .replace(' ', '')
      );
      result[MAILTO_KEY] = normalizeString(
        value.slice(
          value.indexOf(`${MAILTO_KEY_WITH_DELIMITER}:`) +
            `${MAILTO_KEY_WITH_DELIMITER}:`.length
        )
      );
    } else {
      result[key.toUpperCase()] = normalizeString(value);
    }
  }

  return result;
};

/**
 * Main function
 * Get key values from each line to build obj
 * @param iCalStringEvent
 */
const toJSON = (iCalStringEvent: string): ICalJSON => {
  const errors: string[] = [];
  const events: EventJSON[] = [];
  const todos: TodoJSON[] = [];
  let calendar: CalendarJSON;

  try {
    // Validate string
    validateICalString(iCalStringEvent);
  } catch (e: any) {
    errors.push(e.message);

    return {
      calendar: {
        begin: '',
        prodid: '',
        version: '',
        end: '',
      },
      events,
      todos,
      errors,
    };
  }

  // Get vcalendar props
  const vCalendarString: string = getVCalendarString(iCalStringEvent);

  calendar = formatVCalendarStringToObject(vCalendarString);

  // Get base content
  let baseCalendarContent: string = iCalStringEvent.slice(
    vCalendarString.length,
    iCalStringEvent.length - CALENDAR_END_KEY_VALUE.length
  );

  // Extract vtodos
  const { mainProperty, extractedProperty } = extractProperty(
    baseCalendarContent,
    'VTODO'
  );

  const eventsString = mainProperty;
  const todosString = extractedProperty;

  // Remove not supported properties
  let stringCleaned = removeProperty(eventsString, 'DAYLIGHT');
  stringCleaned = removeProperty(stringCleaned, 'VTIMEZONE');
  stringCleaned = removeProperty(stringCleaned, 'STANDARD');

  // Split string events to array
  const vEventsArray: string[] = splitStringEvents(stringCleaned);

  // Split string todos to array
  const vTodosArray: string[] = splitStringEvents(
    todosString,
    TODO_BEGIN_KEY_VALUE
  );

  // Parse each event to obj

  vEventsArray.forEach((stringEvent: string) => {
    try {
      const event = getOneEventJSON(stringEvent);

      events.push(event);
    } catch (e: any) {
      errors.push(e.message);
    }
  });

  vTodosArray.forEach((stringTodo: string) => {
    try {
      const todo = getOneTodoJSON(stringTodo);

      todos.push(todo);
    } catch (e: any) {
      errors.push(e.message);
    }
  });

  return {
    calendar,
    events,
    todos,
    errors,
  };
};

export default toJSON;
