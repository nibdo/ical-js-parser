import parseFrom from "./parseFrom";
import parseTo from "./parseTo";

export interface IICalParser {
  parseFrom: any;
  parseTo: any;
}

const ICalParser: IICalParser = {
  parseFrom,
  parseTo
}

export default ICalParser;
