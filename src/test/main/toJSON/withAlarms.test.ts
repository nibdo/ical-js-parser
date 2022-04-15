import ICalParser from '../../../index';
import mocks from '../../mocksToJSON';

const assert = require('assert');

describe('Parse to JSON from string with alarms', function () {
  it('should format simple alarm trigger', function () {
    const parsedEvent = ICalParser.toJSON(mocks.withAlarms);

    const { alarms } = parsedEvent?.events?.[0];

    assert.equal(alarms?.length, 2);
    assert.equal(alarms?.[0]?.trigger, '-PT10M');
    assert.equal(alarms?.[0]?.action, 'DISPLAY');
  });

  it('should format nested alarm trigger', function () {
    const parsedEvent = ICalParser.toJSON(mocks.withAlarmsNested);

    const { alarms } = parsedEvent?.events?.[0];

    assert.equal(alarms?.length, 1);
    assert.equal(alarms?.[0]?.trigger, '-PT10M');
    assert.equal(alarms?.[0]?.action, 'DISPLAY');
  });

  it('should handle not supported alarm triggers', function () {
    const parsedEvent = ICalParser.toJSON(mocks.withNotSupportedAlarm);

    const { alarms } = parsedEvent?.events?.[0];

    assert.equal(alarms?.length, 0);
  });
});
