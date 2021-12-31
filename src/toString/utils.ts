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
