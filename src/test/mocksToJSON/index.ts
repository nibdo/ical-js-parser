import { nestedPropsSummary } from './nestedPropsSummary';
import { dateWithTimezoneToISO } from './dateWithTimezoneToISO';
import { simpleDateWithZ } from './simpleDateWithZ';
import { simpleDateWithoutZ } from './simpleDateWithoutZ';
import { wrongDateWithoutTime } from './wrongDateWithoutTime';
import { invalidDate1, wrongDateWithTime } from './wrongDateWithTime';
import { oneAttendee } from './oneAttendee';
import { tzidDateCETWrongFormat } from './tzidDateCETWrongFormat';
import { wrongFormatCalendar } from './wrongFormatCalendar';
import { wrongFormatEvent } from './wrongFormatEvent';
import { twoAttendees } from './twoAttendees';
import { simpleDateWithoutTime } from './simpleDateWithoutTime';
import { notSupportedProperties } from './notSupportedProperties';
import {
  withAlarms,
  withAlarmsNested,
  withNotSupportedAlarm,
} from './withAlarms';
import { withTodos } from './withTodos';
import { timeFormats } from './timeFormats';
import { withExceptions, withMultipleExceptions } from './withExceptions';

export default {
  nestedPropsSummary,
  dateWithTimezoneToISO,
  simpleDateWithZ,
  simpleDateWithoutZ,
  simpleDateWithoutTime,
  wrongDateWithoutTime,
  wrongDateWithTime,
  oneAttendee,
  twoAttendees,
  tzidDateCETWrongFormat,
  wrongFormatCalendar,
  wrongFormatEvent,
  notSupportedProperties,
  withAlarms,
  withAlarmsNested,
  withNotSupportedAlarm,
  withTodos,
  timeFormats,
  invalidDate1,
  withExceptions,
  withMultipleExceptions,
};
