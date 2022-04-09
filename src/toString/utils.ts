import { Alarm } from '../index';
import { foldLine } from './index';

export const mapObjToString = (obj: any) => {
  let result: string = '';
  for (const [key, value] of Object.entries(obj)) {
    result = result + key.toUpperCase() + '=' + value + '\n';
  }

  return result;
};

export const formatAlarmsToString = (alarms: Alarm[]): string => {
  let result: string = '';

  alarms.forEach((item) => {
    result += 'BEGIN:VALARM\n';
    result += foldLine(mapObjToString(item));
    result += 'END:VALARM\n';
  });

  return result;
};

export const cleanAlarmObj = (alarm: any) => {
  const result: Alarm = { trigger: alarm.trigger };

  if (alarm.action) {
    result.action = alarm.action;
  }
  if (alarm.description) {
    result.description = alarm.description;
  }

  return result;
};
