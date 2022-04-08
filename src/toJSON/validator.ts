import { DateTime } from 'luxon';

import {
  CALENDAR_BEGIN_KEY_VALUE,
  CALENDAR_END_KEY_VALUE,
  EVENT_BEGIN_KEY_VALUE,
  EVENT_END_KEY_VALUE,
  INVALID_DATE_ERROR,
  TODO_BEGIN_KEY_VALUE,
  TODO_END_KEY_VALUE,
  WRONG_FORMAT_ERROR,
} from '../constants';
import { ERROR_MSG } from '../enums';

export const validateISOStringDate = (stringDate: string): void => {
  if (!DateTime.fromISO(stringDate).isValid) {
    throw new Error(`${ERROR_MSG.INVALID_DATE}: ${stringDate}`);
  }
};

export const validateStringDateWithoutTime = (stringDate: string): void => {
  if (!DateTime.fromFormat(stringDate, 'yyyyMMdd').isValid) {
    throw new Error(`${ERROR_MSG.INVALID_DATE}: ${stringDate}`);
  }
};

/**
 * Check some basic properties of string Ical
 * @param iCalString
 */
export const validateICalString = (iCalString: string): void => {
  if (
    (iCalString.indexOf(EVENT_BEGIN_KEY_VALUE) === -1 ||
      iCalString.indexOf(EVENT_END_KEY_VALUE) === -1) &&
    (iCalString.indexOf(TODO_BEGIN_KEY_VALUE) === -1 ||
      iCalString.indexOf(TODO_END_KEY_VALUE) === -1)
  ) {
    throw new Error(ERROR_MSG.WRONG_FORMAT);
  }

  if (
    iCalString.indexOf(CALENDAR_BEGIN_KEY_VALUE) === -1 ||
    iCalString.indexOf(CALENDAR_END_KEY_VALUE) === -1
  ) {
    throw new Error(ERROR_MSG.WRONG_FORMAT);
  }
};
