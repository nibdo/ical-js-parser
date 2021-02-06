export const MAX_LINE_LENGTH: number = 75;

export const DATE_KEYS: string[] = [
    "dtstart",
    "dtend",
    "dtstamp",
    "created",
    "lastModified",
];
export const ATTENDEE_KEY: string = "attendee";

export const DATE_ONLY_LENGTH: number = 10;

export const checkIfIsDateKey = (keyValueString: string): boolean =>
    DATE_KEYS.indexOf(keyValueString) !== -1
