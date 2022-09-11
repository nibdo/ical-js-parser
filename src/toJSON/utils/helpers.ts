import {
  EVENT_BEGIN_KEY_VALUE,
  EXDATE_KEY,
  RECURSION_MAX_COUNT,
  TODO_BEGIN_KEY_VALUE,
} from '../../constants';
import { ExtractProperty } from '../../interface';

/**
 * Remove unwanted properties in recursion
 * @param vEventsString
 * @param property
 * @param count
 */
export const removeProperty = (
  vEventsString: string,
  property: string,
  count: number = RECURSION_MAX_COUNT
): string => {
  let eventStringResult: string = vEventsString;

  const indexOfBeginProperty: number = eventStringResult.indexOf(
    `BEGIN:${property}`
  );
  const indexOfEndProperty: number = eventStringResult.indexOf(
    `END:${property}`
  );

  if (indexOfBeginProperty !== -1 && count > 0) {
    eventStringResult =
      eventStringResult.slice(0, indexOfBeginProperty) +
      eventStringResult.slice(indexOfEndProperty + `END:${property}`.length);

    return removeProperty(eventStringResult, property, count - 1);
  } else {
    return eventStringResult;
  }
};

export const extractProperty = (
  vEventsString: string,
  property: string,
  count: number = RECURSION_MAX_COUNT,
  result?: ExtractProperty
): ExtractProperty => {
  const resultValue: ExtractProperty = {
    extractedProperty: result?.extractedProperty || '',
    mainProperty: vEventsString,
  };
  let eventStringResult: string = result?.mainProperty || vEventsString;

  const indexOfBeginProperty: number = eventStringResult.indexOf(
    `BEGIN:${property}`
  );
  const indexOfEndProperty: number = eventStringResult.indexOf(
    `END:${property}`
  );

  if (indexOfBeginProperty !== -1 && count > 0) {
    resultValue.extractedProperty =
      resultValue?.extractedProperty +
      eventStringResult.slice(indexOfBeginProperty, indexOfEndProperty);

    eventStringResult =
      eventStringResult.slice(0, indexOfBeginProperty) +
      eventStringResult.slice(indexOfEndProperty + `END:${property}`.length);

    resultValue.mainProperty = eventStringResult;

    return extractProperty(eventStringResult, property, count - 1, resultValue);
  } else {
    return resultValue;
  }
};

export const isExDateArray = (key: string, value: string) => {
  if (key === EXDATE_KEY && value.indexOf(',') !== -1) {
    return true;
  }

  return false;
};

/**
 * Extract only calendar string part
 * @param iCalString
 */
export const getVCalendarString = (iCalString: string): string => {
  let firstItemIndex = iCalString.indexOf(EVENT_BEGIN_KEY_VALUE);

  if (firstItemIndex === -1) {
    firstItemIndex = iCalString.indexOf(TODO_BEGIN_KEY_VALUE);
  }

  return iCalString.slice(0, firstItemIndex);
};
