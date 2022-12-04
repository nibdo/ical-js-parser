import {
  CALENDAR_END_KEY_VALUE,
  EVENT_BEGIN_KEY_VALUE,
  TODO_BEGIN_KEY_VALUE,
} from '../constants';
import { EventJSON, ICalJSON, TodoJSON } from '../index';
import { cleanAlarmObj } from '../toString/utils/alarms';
import {
  extractProperty,
  getVCalendarString,
  removeProperty,
} from './utils/helpers';
import {
  formatStringToKeyValueObj,
  formatVCalendarStringToObject,
  splitDataSetsByKey,
} from './utils/formatters';
import { validateICalString } from './utils/validator';

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

const getResult = (
  rawString: string,
  warnings: string[],
  fallbackTimezone?: string
) => {
  const eventObj: any = {};

  // extract VALARMS from string
  const { mainProperty, extractedProperty } = extractProperty(
    rawString,
    'VALARM'
  );
  const alarmsString = extractedProperty;

  // Format event string, merge multiline values
  formatStringToKeyValueObj(mainProperty, eventObj, warnings, fallbackTimezone);

  // format alarms
  if (alarmsString && alarmsString.length > 0) {
    eventObj.alarms = [];
    const alarmStrings: string[] = splitDataSetsByKey(alarmsString, 'VALARM');

    alarmStrings.forEach((item) => {
      const alarmObj: any = {};
      formatStringToKeyValueObj(item, alarmObj, warnings);

      const cleanedAlarm = cleanAlarmObj(alarmObj);
      if (cleanedAlarm) {
        eventObj.alarms.push(cleanedAlarm);
      }
    });
  }

  return eventObj;
};
const getOneEventJSON = (
  rawString: string,
  warnings: string[],
  fallbackTimezone?: string
): EventJSON => {
  return getResult(rawString, warnings, fallbackTimezone);
};
const getOneTodoJSON = (rawString: string, warnings: string[]): TodoJSON => {
  return getResult(rawString, warnings);
};

/**
 * Main function
 * Get key values from each line to build obj
 * @param iCalStringEvent
 * @param fallbackTimezone
 */
const toJSON = (
  iCalStringEvent: string,
  fallbackTimezone?: string
): ICalJSON => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const events: EventJSON[] = [];
  const todos: TodoJSON[] = [];

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
      warnings,
      errors,
    };
  }

  // Get vcalendar props
  const vCalendarString: string = getVCalendarString(iCalStringEvent);

  const calendar = formatVCalendarStringToObject(vCalendarString, warnings);

  // Get base content
  let baseCalendarContent: string = iCalStringEvent.slice(
    vCalendarString.length,
    iCalStringEvent.length - CALENDAR_END_KEY_VALUE.length
  );

  baseCalendarContent = baseCalendarContent.replaceAll('MAILTO:', 'mailto:');

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
      const event = getOneEventJSON(stringEvent, warnings, fallbackTimezone);

      events.push(event);
    } catch (e: any) {
      errors.push(e.message);
    }
  });

  vTodosArray.forEach((stringTodo: string) => {
    try {
      const todo = getOneTodoJSON(stringTodo, warnings);

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
    warnings,
  };
};

export default toJSON;
