export const EVENT_BEGIN_KEY_VALUE = 'BEGIN:VEVENT';
export const EVENT_END_KEY_VALUE = 'END:VEVENT';
export const CALENDAR_BEGIN_KEY_VALUE = 'BEGIN:VCALENDAR';
export const CALENDAR_END_KEY_VALUE = 'END:VCALENDAR';
export const TODO_BEGIN_KEY_VALUE = 'BEGIN:VTODO';
export const TODO_END_KEY_VALUE = 'END:VTODO';

export const RECURSION_MAX_COUNT = 5000;

export const ALWAYS_STRING_VALUES: string[] = [
  'summary',
  'description',
  'location',
  '"summary',
  '"description',
  '"location',
];

export const MAILTO_KEY_WITH_DELIMITER = ':mailto';
export const MAILTO_KEY = 'mailto';

export const RRULE_KEY = 'rrule';
export const RRULE_ICAL_KEY = 'RRULE';

export const EXDATE_KEY = 'exdate';
export const ATTENDEE_KEY = 'attendee';
export const ORGANIZER_KEY = 'organizer';
export const ALARMS_KEY = 'alarms';

export const UID_KEY = 'uid';

export const INVALID_DATE_ERROR = 'Date is not valid';
export const WRONG_FORMAT_ERROR = 'Wrong format';

export const CALENDAR_BEGIN = 'BEGIN:VCALENDAR\n';
export const CALENDAR_END = 'END:VCALENDAR';
