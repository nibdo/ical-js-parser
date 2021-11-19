export interface DateTimeObject {
  value: string;
  timezone?: string;
  isAllDay?: boolean;
}

export interface KeyValue {
  key: string;
  value: any;
}

export interface EventJSON {
  begin: string;
  end: string;
  dtstart: any;
  dtend: any;
  dtstamp?: string;
  organizer?: any;
  uid?: string;
  attendee?: any;
  created?: string;
  description?: string;
  lastModified?: string;
  location?: string;
  sequence?: string;
  summary?: string;
  transp?: string;
  rrule?: string;
  unknown?: string;
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
