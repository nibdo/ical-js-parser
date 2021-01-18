import {
  IEventParsedFromICal,
  IKeyValue, IResultFromICal,
} from "./types";

const EVENT_BEGIN_KEY_VALUE: string = "BEGIN:VEVENT";
const CALENDAR_END_KEY_VALUE: string = "END:VCALENDAR";

const ATTENDEE_KEY: string = "attendee";

const VALARM_RECURSION_MAX_COUNT: number = 50;

const DATE_KEYS: string[] = [
  "dtstart",
  "dtend",
  "dtstamp",
  "created",
  "lastModified",
];

const ICalParser: any = {
  /**
   * Split string events to array
   * @param iCalEvents
   */
  splitStringEvents: (iCalEvents: string) => {
    // Get array of events
    let result: any = iCalEvents.split(EVENT_BEGIN_KEY_VALUE).slice(1);

    if (!result) {
      return "";
    }

    // Add missing delimiter from split to each record
    result = result.map((item: string) => `${EVENT_BEGIN_KEY_VALUE}${item}`);

    return result;
  },

  getVCalendarProps: (iCalString: string): string => {
    return iCalString.slice(0, iCalString.indexOf(EVENT_BEGIN_KEY_VALUE));
  },

  /**
   * Temporary solution to remove valarms in recursion
   * @param vEventsString
   * @param count
   */
  removeVAlarm: (
    vEventsString: string,
    count: number = VALARM_RECURSION_MAX_COUNT
  ): string => {
    let eventStringResult: string = vEventsString;

    const indexOfBeginVAlarm: number = eventStringResult.indexOf(
      "BEGIN:VALARM"
    );
    const indexOfEndVAlarm: number = eventStringResult.indexOf("END:VALARM");

    if (indexOfBeginVAlarm !== -1 && count > 0) {
      eventStringResult =
        eventStringResult.slice(0, indexOfBeginVAlarm) +
        eventStringResult.slice(indexOfEndVAlarm + "END:VALARM".length);

      ICalParser.removeVAlarm(eventStringResult, count - 1);
    }

    return eventStringResult;
  },

  /**
   * Get key values from each line to build obj
   * @param iCalStringEvent
   */
  parseFromICal: (iCalStringEvent: string): IResultFromICal => {
    // Get vcalendar props
    const vCalendarString: string = ICalParser.getVCalendarProps(iCalStringEvent);

    // Get events
    let vEventsString: string = iCalStringEvent.slice(
      vCalendarString.length,
        iCalStringEvent.length - CALENDAR_END_KEY_VALUE.length
    );

    // Remove valarms //TODO add in future?
    vEventsString = ICalParser.removeVAlarm(vEventsString);

    // Split string events to array
    const vEventsArray: string[] = ICalParser.splitStringEvents(vEventsString);

    // Parse each event to obj
    const events: IEventParsedFromICal[] = vEventsArray.map(
      (stringEvent: string) => ICalParser.parseEventFromString(stringEvent)
    );

    console.log("OBJ EVENT", events);

    return {
      events,
    };
  },

  parseEventFromString: (stringEvent: string): IEventParsedFromICal => {
    const eventObj: any = {};

    // Format event string, merge multiline values
    const eventWithMergedRows: string[] = ICalParser.mergeRows(stringEvent);

    for (const stringEvent of eventWithMergedRows) {
      const keyValue: IKeyValue = ICalParser.splitToKeyValueObj(stringEvent);

      const { key, value } = keyValue;

      // Handle nested array value so it does not override with same key like ATTENDEE
      if (key === ATTENDEE_KEY) {
        eventObj[ATTENDEE_KEY] = Array.isArray(eventObj[ATTENDEE_KEY])
          ? [...eventObj[ATTENDEE_KEY], value]
          : [value];
      } else {
        eventObj[key] = value;
      }
    }

    return eventObj;
  },

  /**
   * Merge rows for same key
   * @param stringEvent
   */
  mergeRows: (stringEvent: string): string[] => {
    // Split key values for every new line
    const rowsArray: string[] = stringEvent.split("\n");

    // Fix formatting with multiline values
    // Multiline values starts with empty space
    const fixedRowsArray: string[] = [];

    for (const currentRow of rowsArray) {
      if (currentRow.length > 0) {
        // Join this row with previous row if starts with empty space
        if (currentRow[0] && currentRow[0] === " ") {
          // Merge previous and current row
          const mergedRows: string =
            fixedRowsArray[fixedRowsArray.length - 1] + currentRow;

          // Replace last item with joined rows
          fixedRowsArray.pop();
          fixedRowsArray.push(mergedRows);
        } else {
          // Just add row
          fixedRowsArray.push(currentRow);
        }
      }
    }

    return fixedRowsArray;
  },
  /**
   * Split string to separate key and value
   * @param item
   */
  splitToKeyValueObj: (item: string): IKeyValue => {
    // Get basic delimiter indexes
    const basicDelimiterIndex: number = item.indexOf(":");
    const nestedDelimiterIndex: number = item.indexOf(";");

    // Check if item has nested values
    const hasNestedValues: boolean =
      nestedDelimiterIndex !== -1 && nestedDelimiterIndex < basicDelimiterIndex;

    let key: string;
    let value: any;

    // Set keys first
    if (hasNestedValues && item.slice(0, nestedDelimiterIndex) !== "RRULE") {
      key = ICalParser.transformKey(item.slice(0, nestedDelimiterIndex));
    } else {
      key = ICalParser.transformKey(item.slice(0, basicDelimiterIndex));
    }

    // Check if key is date parameter
    const isDateKey: boolean = ICalParser.checkIfIsDateKey(key);

    // Set values
    if (hasNestedValues && key !== "rrule") {
      value = isDateKey
        ? item.slice(nestedDelimiterIndex + 1)
        : ICalParser.parseNestedValues(item.slice(nestedDelimiterIndex + 1));
    } else {
      value = item.slice(basicDelimiterIndex + 1);
    }

    if (isDateKey) {
      value = ICalParser.parseICalDate(key, value);
    }

    return {
      key,
      value,
    };
  },

  /**
   * Split item to key and nested values
   * @param item
   */
  splitNestedValues: (item: string): IKeyValue => {
    const nestedValueDelimiterIndex: number = item.indexOf("=");

    return {
      key: ICalParser.transformKey(item.slice(0, nestedValueDelimiterIndex)),
      value: item.slice(nestedValueDelimiterIndex + 1),
    };
  },

  /**
   * Split values to nested obj, except date key
   * @param values
   */
  parseNestedValues: (values: string): IKeyValue | string => {
    let result: any = {};

    // Separate key values with ; delimiter
    const valuesArray: string[] = values.split(";");

    for (const item of valuesArray) {
      const keyValue: IKeyValue = ICalParser.splitNestedValues(item);

      const { key, value } = keyValue;

      // ** Handle exception with date in nested value ** //
      // f.e. date without time
      if (key === "value" && value.indexOf("DATE") !== -1) {
        result = value.slice(value.indexOf("DATE"));
      } else {
        result[key] = value;
      }
    }

    return result;
  },
  /**
   * Lower case all keys, replace dashes with camelCase
   * @param keyOriginal
   */
  transformKey: (keyOriginal: string): string => {
    let resultKey: string = "";
    let newKey: string = keyOriginal.toLowerCase();

    let willBeUpperCase: boolean = false;

    // Remove dashes, format to camelCase
    for (const letter of newKey) {
      const isDash: boolean = letter === "-";

      if (isDash) {
        willBeUpperCase = true;
      } else if (willBeUpperCase) {
        resultKey += letter.toUpperCase();
        willBeUpperCase = false;
      } else {
        resultKey += letter;
      }
    }

    return resultKey;
  },

  /**
   * Better formatting for dates
   * // TODO refactor
   * @param key
   * @param iCalDate
   */
  parseICalDate: (key: string, iCalDate: string): any => {
    // No special handling for other dates
    const isSimpleDate: boolean = key !== "dtstart" && key !== "dtend";

    if (isSimpleDate) {
      return ICalParser.getBaseDate(iCalDate);
    }

    const isTzidDate: boolean = iCalDate.indexOf("TZID") !== -1;
    const isAllDayEvent: boolean = iCalDate.indexOf("DATE:") !== -1;

    if (isAllDayEvent) {
      const baseDate: string = iCalDate.slice(
          iCalDate.indexOf("DATE:") + "DATE:".length
      );
      const year: string = baseDate.slice(0, 4);
      const month: string = baseDate.slice(4, 6);
      const day: string = baseDate.slice(6, 8);

      return { value: `${year}-${month}-${day}`, isAllDay: true };
    }

    if (isTzidDate) {
      const timezone: string = iCalDate.split(":")[0];
      const baseDate: string = iCalDate.split(":")[1];

      return {
        value: ICalParser.getBaseDate(baseDate),
        timezone: timezone.slice(timezone.indexOf("TZID=") + "TZID=".length),
      };
    }

    return { value: ICalParser.getBaseDate(iCalDate) };
  },
  getBaseDate: (date: string): string => {
    const baseDate: string = date;

    const year: string = baseDate.slice(0, 4);
    const month: string = baseDate.slice(4, 6);
    const day: string = baseDate.slice(6, 8);
    const hour: string = baseDate.slice(9, 11);
    const minute: string = baseDate.slice(11, 13);

    return `${year}-${month}-${day}T${hour}:${minute}:00Z`;
  },
  checkIfIsDateKey: (keyValueString: string): boolean =>
    DATE_KEYS.indexOf(keyValueString) !== -1,
};

export default ICalParser;
