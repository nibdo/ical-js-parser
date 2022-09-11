import { CALENDAR_BEGIN } from '../../constants';
import { CalendarJSON, EventJSON, TodoJSON } from '../../index';
import { addKeyValue } from './formatters';
import { buildString } from '../index';

export const buildCalendarBaseString = (calendar: CalendarJSON) => {
  const { prodid, version, calscale, method } = calendar;

  let result = '';

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

  return result;
};

export const buildStringFromArrayItems = (
  iCalString: string,
  items?: EventJSON[] | TodoJSON[]
) => {
  let result = iCalString;

  // Loop over all events
  if (items && items.length > 0) {
    for (const item of items) {
      result = buildString(item, result);
    }
  }

  return result;
};

export const getDelimiter = (value: any) => {
  const isValueArray: boolean = Array.isArray(value);

  return isValueArray ? ';' : ':';
};
