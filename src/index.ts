import toJSON from './toJSON';
import toString from './toString';

export interface ICalParser {
  toJSON: Function;
  toString: Function;
}

const ICalParser: ICalParser = {
  toJSON,
  toString,
};

export default ICalParser;
