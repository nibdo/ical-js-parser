import { EXDATE_KEY, RECURSION_MAX_COUNT } from '../constants';
import { ExtractProperty } from '../interface';

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

/**
 * Split string data sets to array
 * @param iCalEvents
 */
export const splitDataSetsByKey = (stringData: string, key: string) => {
  // Get array of events
  let result: any = stringData.split(key).slice(1);

  if (!result) {
    return '';
  }

  // Add missing delimiter from split to each record
  result = result.map((item: string) => `${key}${item}`);

  return result;
};

export const removeSpaceAndNewLine = (
  value: string,
  counter: number = 0
): string => {
  const hasSpace = value.indexOf(' ') !== -1;
  const hasNewLine = value.indexOf('\n') !== -1;

  if (counter > 1000) {
    return value;
  }

  if (!hasSpace && !hasNewLine) {
    return value;
  }

  let result = value;

  if (hasSpace) {
    result = result.replace(' ', '');
  }
  if (hasNewLine) {
    result = result.replace('\n', '');
  }

  return removeSpaceAndNewLine(result, counter + 1);
};

export const isExDateArray = (key: string, value: string) => {
  if (key === EXDATE_KEY && value.indexOf(',') !== -1) {
    return true;
  }

  return false;
};
