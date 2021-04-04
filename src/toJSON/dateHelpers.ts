import {
  validateISOStringDate,
  validateStringDateWithoutTime,
} from './validator';

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

  if (isTzidDate) {
    const timezone: string = iCalDate.split(':')[0];
    const baseDate: string = iCalDate.split(':')[1];

    return {
      value: formatToIsoDate(baseDate),
      timezone: timezone.slice(timezone.indexOf('TZID=') + 'TZID='.length),
    };
  }

  return { value: formatToIsoDate(iCalDate) };
};
