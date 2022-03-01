import toString from './toString';
import toJSON from './toJSON';

export interface ICalParser {
  toJSON: (item: string) => ICalJSON;
  toString: (item: ICalJSON) => string;
}

export interface DateTimeObject {
  value: string;
  timezone?: string;
  isAllDay?: boolean;
}

export interface KeyValue {
  key: string;
  value: any;
}

export interface Organizer {
  mailto: string;
  CN?: string;
  EMAIL?: string;
}

export interface Attendee {
  CUTYPE?: string;
  ROLE: string;
  EMAIL?: string;
  PARTSTAT?: string;
  CN?: string;
  mailto: string;
  XNUMGUESTS?: string;
}

export interface Alarm {
  trigger: string;
  action?: string;
  [key: string]: any;
}

export interface EventJSON {
  begin: string;
  end: string;
  dtstart: DateTimeObject;
  dtend: DateTimeObject;
  dtstamp?: DateTimeObject;
  organizer?: Organizer;
  uid?: string;
  attendee?: Attendee[];
  created?: DateTimeObject;
  description?: string;
  lastModified?: DateTimeObject;
  location?: string;
  sequence?: string;
  summary?: string;
  transp?: string;
  rrule?: string;
  status?: string;
  recurrenceId?: { TZID: string } | string;
  alarms?: Alarm[];
  [key: string]: any;
}

export enum TODO_STATUS {
  COMPLETED = 'COMPLETED',
  NEED_ACTION = 'NEEDS-ACTION',
}

export interface TodoJSON {
  begin?: string;
  dtstamp?: DateTimeObject;
  lastModified?: DateTimeObject;
  uid?: string;
  sequence?: string;
  summary?: string;
  description?: string;
  status?: TODO_STATUS;
  created?: DateTimeObject;
  alarms?: Alarm[];
  [key: string]: any;
}

export interface ICalJSON {
  calendar: CalendarJSON;
  events?: EventJSON[];
  todos?: TodoJSON[];
}

export interface CalendarJSON {
  begin: string;
  prodid: string;
  method?: string;
  calscale?: string;
  version: string;
  end: string;
}

const ICalParser: ICalParser = {
  toJSON,
  toString,
};

export default ICalParser;
