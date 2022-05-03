import { Alarm, DateTimeObject } from '../index';
import {
  foldLine,
  parseDateWithTimezone,
  parseUtcDateObj,
  parseUtcToTimestamp,
  transformToICalKey,
} from './index';
import { DATE_ONLY_LENGTH } from '../common';

export const mapObjToString = (obj: any) => {
  let result: string = '';
  for (const [key, value] of Object.entries(obj)) {
    result = result + key.toUpperCase() + '=' + value + '\n';
  }

  return result;
};

export const mapAlarmObjToString = (obj: any) => {
  let result: string = '';
  for (const [key, value] of Object.entries(obj)) {
    result = result + transformToICalKey(key) + ':' + value + '\n';
  }

  return result;
};

export const formatAlarmsToString = (alarms: Alarm[]): string => {
  let result: string = '';

  alarms.forEach((item) => {
    result += 'BEGIN:VALARM\n';
    result += foldLine(mapAlarmObjToString(item));
    result += 'END:VALARM\n';
  });

  return result;
};

export const formatExDatesToString = (exDates: any): string => {
  let result: string = '';

  exDates.forEach((item: any) => {
    const hasTimezone: boolean = item?.timezone !== undefined;
    const isSimpleObj: boolean = !hasTimezone && item?.value !== undefined;
    const isSimpleDate: boolean =
      !hasTimezone && isSimpleObj && item.value?.length === DATE_ONLY_LENGTH;

    let delimiter = ';';
    if (isSimpleDate) {
      // Date only for all day events
      result +=
        foldLine(`${transformToICalKey('exdate')};VALUE=DATE:${item.value}`) +
        '\n';
    } else if (isSimpleObj) {
      result +=
        foldLine(
          `${transformToICalKey('exdate')}${delimiter}${parseUtcDateObj(item)}`
        ) + '\n';
    } else if (hasTimezone) {
      delimiter = ';';
      // Object with timezone and value
      result +=
        foldLine(
          `${transformToICalKey('exdate')}${delimiter}${parseDateWithTimezone(
            item
          )}`
        ) + '\n';
    } else {
      result +=
        foldLine(
          `${transformToICalKey('exdate')}${delimiter}${parseUtcToTimestamp(
            item
          )}`
        ) + '\n';
    }
  });

  return result;
};

export const cleanAlarmObj = (alarm: any) => {
  delete alarm.valar;
  delete alarm.begin;
  delete alarm.end;

  // not supported
  if (alarm.trigger?.RELATED) {
    return null;
  }

  if (alarm.trigger?.VALUE) {
    let parsedValue = alarm.trigger.VALUE;

    if (parsedValue.indexOf('DURATION:') !== -1) {
      parsedValue = parsedValue.slice('DURATION:'.length);
    }

    alarm.trigger = parsedValue;
  }

  // not supported
  if (alarm.trigger?.indexOf('DATE-TIME') !== -1) {
    return null;
  }

  if (alarm.trigger?.indexOf('DT') !== -1) {
    return null;
  }

  return alarm;
};
