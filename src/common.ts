import { DateTime } from 'luxon';

export const MAX_LINE_LENGTH: number = 75;

export const DATE_KEYS: string[] = [
  'dtstart',
  'dtend',
  'dtstamp',
  'created',
  'lastModified',
  'exdate',
  'recurrenceId',
];

export const DATE_ONLY_LENGTH: number = 8;

export const checkIfIsDateKey = (keyValueString: string): boolean =>
  DATE_KEYS.indexOf(keyValueString) !== -1;
