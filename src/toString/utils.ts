import { Alarm } from '../index';
import { foldLine, transformToICalKey } from './index';

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
