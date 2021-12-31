import ICalParser from '../../../index';
import mocks from '../../mocksToJSON';

const assert = require('assert');

describe('Parse to JSON from string with alarms', function () {
  it('should format date with timezone in long CET format to short CET format', function () {
    const parsedEvent = ICalParser.toJSON(mocks.withAlarms);

    const { alarms } = parsedEvent.events[0];

    assert.equal(alarms.length, 2);
    assert.equal(alarms[0].trigger, '-PT10M');
    assert.equal(alarms[0].action, 'DISPLAY');
  });
});
