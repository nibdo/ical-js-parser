import ICalParser from '../../../index';

const assert = require('assert');

import mocks from '../../mocksToString';

describe('Parse to String from JSON with alarms', function () {
  it('should return string iCal event with date with timezone', function () {
    const parsedEvent = ICalParser.toString(mocks.alarmsData);

    const lines = parsedEvent.split('\n');

    assert.equal(
      lines[8],
      'ORGANIZER;EMAIL=buia@test.com:mailto:buia@test.com'
    );
    assert.equal(lines[9], 'BEGIN:VALARM');
    assert.equal(lines[10], 'TRIGGER:10M');
    assert.equal(lines[11], 'ACTION:DISPLAY');
    assert.equal(lines[12], 'END:VALARM');
    assert.equal(lines[13], 'BEGIN:VALARM');
    assert.equal(lines[14], 'TRIGGER:20M');
    assert.equal(lines[15], 'ACTION:DISPLAY');
    assert.equal(lines[16], 'X-SAMPLE-TEST:test');
    assert.equal(lines[17], 'END:VALARM');
    assert.equal(lines[18], 'DTSTART:20210401T100000Z');
  });
});
