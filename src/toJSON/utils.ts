import { VALARM_RECURSION_MAX_COUNT } from '../constants';
import { ExtractProperty } from '../interface';

/**
 * Temporary solution to remove valarms in recursion
 * @param vEventsString
 * @param property
 * @param count
 */
export const removeProperty = (
  vEventsString: string,
  property: string,
  count: number = VALARM_RECURSION_MAX_COUNT
): string => {
  let eventStringResult: string = vEventsString;

  const indexOfBeginVAlarm: number = eventStringResult.indexOf(
    `BEGIN:${property}`
  );
  const indexOfEndVAlarm: number = eventStringResult.indexOf(`END:${property}`);

  if (indexOfBeginVAlarm !== -1 && count > 0) {
    eventStringResult =
      eventStringResult.slice(0, indexOfBeginVAlarm) +
      eventStringResult.slice(indexOfEndVAlarm + `END:${property}`.length);

    return removeProperty(eventStringResult, property, count - 1);
  } else {
    return eventStringResult;
  }
};

export const extractProperty = (
  vEventsString: string,
  property: string,
  count: number = VALARM_RECURSION_MAX_COUNT,
  result?: ExtractProperty
): ExtractProperty => {
  const resultValue: ExtractProperty = {
    extractedProperty: result?.extractedProperty || '',
    mainProperty: vEventsString,
  };
  let eventStringResult: string = result?.mainProperty || vEventsString;

  const indexOfBeginVAlarm: number = eventStringResult.indexOf(
    `BEGIN:${property}`
  );
  const indexOfEndVAlarm: number = eventStringResult.indexOf(`END:${property}`);

  if (indexOfBeginVAlarm !== -1 && count > 0) {
    resultValue.extractedProperty =
      resultValue?.extractedProperty +
      eventStringResult.slice(indexOfBeginVAlarm, indexOfEndVAlarm);

    eventStringResult =
      eventStringResult.slice(0, indexOfBeginVAlarm) +
      eventStringResult.slice(indexOfEndVAlarm + `END:${property}`.length);

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
