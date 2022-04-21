import ICalParser from '../../../index';
import mocks from '../../mocksToJSON';
import { invalidDate1 } from '../../mocksToJSON/wrongDateWithTime';

const assert = require('assert');

describe('Parse to JSON and handle errors', function () {
  it('should get 1 event and 1 error', function () {
    const parsedEvent = ICalParser.toJSON(mocks.invalidDate1);

    const { events, errors } = parsedEvent;

    assert.equal(events?.length, 1);
    assert.equal(errors?.length, 2);
  });
});
