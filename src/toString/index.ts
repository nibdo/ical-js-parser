import {
  ALARMS_KEY,
  ATTENDEE_KEY,
  CALENDAR_END,
  EXDATE_KEY,
  ORGANIZER_KEY,
} from '../constants';
import { EventJSON, ICalFromJSONData, TodoJSON } from '../index';
import {
  buildCalendarBaseString,
  buildStringFromArrayItems,
  getDelimiter,
} from './utils/helpers';
import { checkIfIsDateKeyToString } from '../common';
import {
  foldLine,
  mapGeneralObjToString,
  mapObjToString,
  parseNewLine,
  transformToICalKey,
} from './utils/formatters';
import { formatAlarmsToString } from './utils/alarms';
import { parseDateRows } from './utils/dates';

export const buildString = (
  event: EventJSON | TodoJSON,
  prevResult: string
) => {
  let result = prevResult;

  // Build event string from object props
  for (const [key, value] of Object.entries(event)) {
    const valueAny: any = value;

    const delimiter = getDelimiter(valueAny);

    const isDateKey = checkIfIsDateKeyToString(key);

    if (isDateKey && key !== EXDATE_KEY) {
      result += parseDateRows(key, valueAny, delimiter);
    } else {
      switch (key) {
        case EXDATE_KEY:
          valueAny.forEach((item: any) => {
            result += parseDateRows(key, item, delimiter);
          });
          break;
        case ATTENDEE_KEY:
          valueAny.forEach((item: any) => {
            result += foldLine('ATTENDEE;' + mapObjToString(item)) + '\n';
          });
          break;
        case ORGANIZER_KEY:
          result += foldLine('ORGANIZER;' + mapObjToString(valueAny)) + '\n';
          break;
        case ALARMS_KEY:
          result += formatAlarmsToString(valueAny);
          break;
        default:
          result +=
            typeof valueAny === 'string'
              ? foldLine(
                  `${transformToICalKey(key)}${delimiter}${parseNewLine(
                    valueAny
                  )}`
                ) + '\n'
              : `${transformToICalKey(key)};${mapGeneralObjToString(
                  valueAny
                )}` + '\n';
      }
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

  // build calendar base string
  let result: string = buildCalendarBaseString(calendar);

  // add events
  result = buildStringFromArrayItems(result, events);

  // add todos
  result = buildStringFromArrayItems(result, todos);

  result += CALENDAR_END;

  return result;
};

export default toString;
