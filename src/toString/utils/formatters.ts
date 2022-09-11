import { MAX_LINE_LENGTH } from '../../common';

export const parseNewLine = (value: string) => value.replaceAll('\n', '\\n');

const parseWithEmptySpace = (text: string, index: number) => {
  if (index === 0) {
    return text;
  }

  if (text.slice(0, 1) !== ' ') {
    return ` ${text}`;
  }

  return text;
};

const splitByMaxLength = (text: string) => {
  const result = [];

  let reminder = text;

  let index = 0;

  while (reminder.length > 0) {
    if (reminder.length + 1 < MAX_LINE_LENGTH) {
      result.push(`${parseWithEmptySpace(reminder, index)}`);
      reminder = '';
    } else {
      result.push(
        `${parseWithEmptySpace(reminder, index).slice(0, MAX_LINE_LENGTH - 1)}`
      );

      reminder = reminder.slice(MAX_LINE_LENGTH - 1);
    }

    index++;
  }

  return result;
};

const splitToRows = (text: string) => {
  let result = '';

  const textArray = text.split('\n');

  let index = 0;
  let reminder = '';
  for (const item of textArray) {
    const parsedItem = index === 0 ? item : ` ${item}`;

    if (parsedItem.length === MAX_LINE_LENGTH) {
      result += parsedItem + (index + 1 < textArray.length ? '\n' : '');

      reminder = '';
    } else if (parsedItem.length > MAX_LINE_LENGTH) {
      const subArray = splitByMaxLength(parsedItem);

      let subIndex = 0;
      for (const subItem of subArray) {
        result +=
          subItem +
          (index + 1 < textArray.length || subIndex + 1 < subArray.length
            ? '\n'
            : '');

        subIndex++;
      }

      reminder = '';
    } else {
      result += parsedItem + (index + 1 < textArray.length ? '\n' : '');

      reminder = '';
    }

    index += 1;
  }

  if (reminder) {
    result += reminder;
  }

  return result;
};

export const foldLine = (row: string, oldWay?: boolean): string => {
  let result = '';
  const foldCount: number = row.length / MAX_LINE_LENGTH;

  let tempRow: string = row;

  if (!oldWay) {
    return splitToRows(row);
  }

  if (row.length < MAX_LINE_LENGTH) {
    return row;
  }

  for (let i = 1; i <= foldCount + 1; i += 1) {
    if (tempRow.length <= MAX_LINE_LENGTH) {
      result = result + tempRow;

      return result;
    } else {
      result = result + tempRow.slice(0, MAX_LINE_LENGTH) + '\n ';

      const newTempRow: string = tempRow.slice(i * MAX_LINE_LENGTH);

      if (!newTempRow) {
        tempRow = tempRow.slice(MAX_LINE_LENGTH);
      } else {
        tempRow = tempRow.slice(i * MAX_LINE_LENGTH);
      }
    }
  }

  return result;
};

export const transformToICalKey = (key: string): string => {
  let result = '';

  for (let i = 0; i < key.length; i += 1) {
    const letter: string = key[i];

    // Transform camel case to dash
    if (letter.toUpperCase() === letter) {
      result += `-${letter}`;
    } else {
      result += letter.toUpperCase();
    }
  }

  return result;
};

export const mapObjToString = (obj: any): string => {
  let result = '';

  let mailtoValue = ':mailto:';
  for (const [key, value] of Object.entries(obj)) {
    if (key !== 'mailto') {
      result = result + key.toUpperCase() + '=' + value + ';';
    } else {
      mailtoValue = mailtoValue + value;
    }
  }

  const endingNeedsSlice =
    result.slice(result.length - 1, result.length) === ';';

  return (
    (endingNeedsSlice ? result.slice(0, result.length - 1) : result) +
    mailtoValue
  );
};

export const addKeyValue = (
  iCalString: string,
  key: string,
  value: string
): string => `${iCalString}${key}${value}\n`;
