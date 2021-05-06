import {
  validateISOStringDate,
  validateStringDateWithoutTime,
} from './validator';
import { timezoneParser } from './timezoneParser';
import { DateTime } from 'luxon';

/**
 * Format to ISO date
 * @param date
 */
export const formatToIsoDate = (date: string): string => {
  const baseDate: string = date;

  const year: string = baseDate.slice(0, 4);
  const month: string = baseDate.slice(4, 6);
  const day: string = baseDate.slice(6, 8);
  const hour: string = baseDate.slice(9, 11);
  const minute: string = baseDate.slice(11, 13);

  const result: string = `${year}-${month}-${day}T${hour}:${minute}:00Z`;

  validateISOStringDate(result);

  return result;
};
export const removeTString = (date: string): string => {
  return date.replace('T', '');
};
/**
 * Better formatting for dates
 * @param iCalDate
 */
export const parseICalDate = (iCalDate: string): any => {
  // No special handling for other dates
  const isTzidDate: boolean = iCalDate.indexOf('TZID') !== -1;
  const isAllDayEvent: boolean = iCalDate.indexOf('DATE:') !== -1;
  const isSimpleDate: boolean = !isTzidDate && !isAllDayEvent;

  if (isSimpleDate) {
    return formatToIsoDate(iCalDate);
  }

  if (isAllDayEvent) {
    const baseDate: string = iCalDate.slice(
      iCalDate.indexOf('DATE:') + 'DATE:'.length
    );
    const year: string = baseDate.slice(0, 4);
    const month: string = baseDate.slice(4, 6);
    const day: string = baseDate.slice(6, 8);

    const dateString: string = `${year}-${month}-${day}`;

    validateStringDateWithoutTime(dateString);

    return { value: dateString, isAllDay: true };
  }

  // Need to format tzid date value to UTC
  if (isTzidDate) {
    const timezone: string = iCalDate.split(':')[0];
    const baseDate: string = removeTString(iCalDate.split(':')[1]);

    const timezoneParsed: string = timezoneParser(
      timezone.slice(timezone.indexOf('TZID=') + 'TZID='.length)
    );

    const zuluDate: DateTime = DateTime.fromFormat(baseDate, 'yyyyLLddHHmmss', {
      zone: timezoneParsed,
    });

    // Cut milliseconds
    const zuluDateFinal: string = zuluDate.toUTC().toISO().slice(0, 19) + 'Z';

    return {
      value: zuluDateFinal,
      timezone: timezoneParsed,
    };
  }

  return { value: formatToIsoDate(iCalDate) };
};
