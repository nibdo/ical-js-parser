import ICalParser from '../../../index';
import mocks from '../../mocksToJSON';

const assert = require('assert');

describe('Parse to JSON from string with exceptions', function () {
  it('should format with exceptions', function () {
    const parsedEvent = ICalParser.toJSON(mocks.withExceptions);

    const events = parsedEvent?.events;

    const eventOriginal = events[0];
    const eventException = events[1];

    assert.equal(events?.length, 2);
    assert.equal(eventOriginal.exdate?.length, 5);
    assert.equal(eventOriginal?.exdate?.[0].value, '20220402T100000Z');
    assert.equal(eventOriginal?.exdate?.[1].value, '20220403T100000Z');
    assert.equal(eventOriginal?.exdate?.[2].value, '20220404T100000Z');
    assert.equal(eventOriginal?.exdate?.[3].value, '20220405T100000Z');
    assert.equal(eventOriginal?.exdate?.[4].value, '20220406T100000Z');
    assert.equal(eventException?.recurrenceId?.value, '20220403T100000Z');
    assert.equal(eventException?.dtstart?.value, '20220403T130000Z');
  });
});
