import {
  dateTimeDate,
  simpleDateWithZ,
  simpleDateWithZWithArtifacts,
} from './simpleDateWithZ';
import { dateWithTimezoneToISO } from './dateWithTimezoneToISO';
import { invalidDate1, wrongDateWithTime } from './wrongDateWithTime';
import { nestedPropsSummary } from './nestedPropsSummary';
import { notSupportedProperties } from './notSupportedProperties';
import { oneAttendee } from './oneAttendee';
import { simpleDateWithoutTime } from './simpleDateWithoutTime';
import { simpleDateWithoutZ } from './simpleDateWithoutZ';
import { timeFormats } from './timeFormats';
import { twoAttendees, twoAttendeesWithSpacesInEmail } from './twoAttendees';
import { tzidDateCETWrongFormat } from './tzidDateCETWrongFormat';
import {
  withAlarms,
  withAlarmsNested,
  withNotSupportedAlarm,
} from './withAlarms';
import { withExceptions, withMultipleExceptions } from './withExceptions';
import { withTodos } from './withTodos';
import { wrongDateWithoutTime } from './wrongDateWithoutTime';
import { wrongFormatCalendar } from './wrongFormatCalendar';
import { wrongFormatEvent } from './wrongFormatEvent';

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
  simpleDateWithZWithArtifacts,
  twoAttendeesWithSpacesInEmail,
  dateTimeDate,
};
