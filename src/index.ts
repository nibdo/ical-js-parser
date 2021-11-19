import toString from './toString';
import toJSON from './toJSON';
import { ICalJSON } from './types';

export interface ICalParser {
  toJSON: (item: string) => ICalJSON;
  toString: (item: ICalJSON) => string;
}

const ICalParser: ICalParser = {
  toJSON,
  toString,
};

export default ICalParser;
