export const MAX_LINE_LENGTH = 75;

export const DATE_KEYS: string[] = [
  'dtstart',
  'dtend',
  'dtstamp',
  'created',
  'lastModified',
  'exdate',
  'recurrenceId',
];

export const DATE_KEYS_TO_STRING: string[] = [
  'dtstart',
  'dtend',
  'dtstamp',
  'created',
  'lastModified',
  'recurrenceId',
  'exdate',
];

export const DATE_ONLY_LENGTH = 8;

export const checkIfIsDateKey = (keyValueString: string): boolean =>
  DATE_KEYS.indexOf(keyValueString) !== -1;
export const checkIfIsDateKeyToString = (keyValueString: string): boolean =>
  DATE_KEYS_TO_STRING.indexOf(keyValueString) !== -1;
