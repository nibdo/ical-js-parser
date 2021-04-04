import toString from './toString';
import toJSON from './toJSON';

export interface ICalParser {
  toJSON: Function;
  toString: Function;
}

const ICalParser: ICalParser = {
  toJSON,
  toString,
};

export default ICalParser;
