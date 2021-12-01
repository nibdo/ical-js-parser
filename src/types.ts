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
  [key: string]: any;
}

export interface ICalJSON {
  calendar: CalendarJSON;
  events: EventJSON[];
}

export interface CalendarJSON {
  begin: string;
  prodid: string;
  method?: string;
  calscale?: string;
  version: string;
  end: string;
}
