
export interface IDateTimeObject {
    value: string;
    timezone?: string;
}

export interface IKeyValue {
    key: string;
    value: any;
}

export interface IEventParsedFromICal {
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

export interface IResultFromICal {
    events: IEventParsedFromICal[];
}

export interface ICalObject {
    calendar: ICalendarObj;
    events: IEventParsedFromICal[];
}

export interface ICalendarObj {
    begin: string;
    prodid: string;
    calscale?: string;
    version: string;
    end: string;
}
