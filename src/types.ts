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
}

export interface Attendee {
  CUTYPE?: string;
  ROLE: string;
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
  dtstamp?: string;
  organizer?: Organizer;
  uid?: string;
  attendee?: Attendee[];
  created?: string;
  description?: string;
  lastModified?: string;
  location?: string;
  sequence?: string;
  summary?: string;
  transp?: string;
  rrule?: string;
  unknown?: string;
  status?: string;
  recurrenceId?: { TZID: string };
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
