/**
 * Extract only simple string from nested nested values where we don't need
 * that other information like in location, summary, description
 * @param value
 */
export const extractAlwaysStringValue = (value: any): string => {
  if (!value) {
    return '';
  }

  if (value.indexOf(':') === value.length) {
    return '';
  }

  return value.slice(value.indexOf(':') + 1);
};

/**
 * Normalize string, remove any formats, line breakes
 * @param value
 */
export const normalizeString = (value: any): string | any => {
  if (!value || (typeof value === 'string' && value.length < 1)) {
    return '';
  }

  if (typeof value !== 'string') {
    return value;
  }

  let formattedValue: string = value.trim();

  if (formattedValue.length === 2) {
    if (formattedValue === '/r') {
      return '';
    }
    return formattedValue;
  }

  if (
    formattedValue.slice(formattedValue.length - 2, formattedValue.length) ===
    '/r'
  ) {
    return formattedValue.slice(0, formattedValue.length - 2);
  }

  return formattedValue;
};

/**
 * Lower case all keys, replace dashes with camelCase
 * @param keyOriginal
 */
export const normalizeKey = (keyOriginal: string): string => {
  let resultKey = '';
  let newKey: string = keyOriginal.toLowerCase();

  let willBeUpperCase = false;

  // Remove dashes, format to camelCase
  for (const letter of newKey) {
    const isDash: boolean = letter === '-';

    if (isDash) {
      willBeUpperCase = true;
    } else if (willBeUpperCase) {
      resultKey += letter.toUpperCase();
      willBeUpperCase = false;
    } else {
      resultKey += letter;
    }
  }

  return resultKey;
};

/**
 * Split rows to array and merge rows for same key
 * Multiple rows under same key are written with space at the line beginning
 * @param stringEvent
 */
export const splitRowsToArray = (stringEvent: string): string[] => {
  // Split key values for every new line
  const rowsArray: string[] = stringEvent.split('\n');

  // Fix formatting with multiline values
  // Multiline values starts with empty space
  const fixedRowsArray: string[] = [];

  for (const currentRow of rowsArray) {
    if (currentRow.length > 0) {
      // Join this row with previous row if starts with empty space
      if (currentRow[0] && currentRow[0] === ' ') {
        // Merge previous and current row
        const mergedRows: string =
          fixedRowsArray[fixedRowsArray.length - 1] + currentRow;

        // Replace last item with joined rows
        fixedRowsArray.pop();
        fixedRowsArray.push(mergedRows);
      } else {
        // Just add row
        fixedRowsArray.push(currentRow);
      }
    }
  }

  return fixedRowsArray;
};
