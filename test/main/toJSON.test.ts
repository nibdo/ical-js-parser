import ICalParser from '../../src/index';
import mocks from '../mocksToJSON';
import { ERROR_MSG } from '../../src/enums';

const assert = require('assert');

describe('Parse to JSON from string', function () {
  it('should throw error for wrong format', function () {
    try {
      ICalParser.toJSON('<html lang="en">facxzcasdv</html>');
    } catch (e: any) {
      assert.equal(e.message, ERROR_MSG.WRONG_FORMAT);
    }
  });
  it(
    'should return only string value for nested props Summary,' +
      ' Location and Description',
    function () {
      const parsedEvent = ICalParser.toJSON(mocks.nestedPropsSummary);

      const { summary, location, description } = parsedEvent.events[0];

      assert.equal(summary, 'cv');
      assert.equal(location, '');
      assert.equal(description, 'ada');
    }
  );

  it('should format date with timezone to ISO string date in UTC', function () {
    const parsedEvent = ICalParser.toJSON(mocks.dateWithTimezoneToISO);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.equal(dtstart.value, '20210402T010000Z');
    assert.equal(dtstart.timezone, 'Europe/Berlin');
    assert.equal(dtend.value, '20210402T013000Z');
    assert.equal(dtend.timezone, 'Europe/Berlin');
  });

  it('should format simple date with Z', function () {
    const parsedEvent = ICalParser.toJSON(mocks.simpleDateWithZ);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.equal(dtstart.value, '20210401T110000Z');
    assert.equal(dtend.value, '20210401T113000Z');
  });

  it('should merge uid from two lines simple date with Z', function () {
    const parsedEvent = ICalParser.toJSON(mocks.simpleDateWithZ);

    const { uid, description } = parsedEvent.events[0];

    assert.equal(
      uid,
      '040000008200E00174C5B7301A82E0080000000089FCDD3B6C29D7010000000000000000100000000843E9436BC801248C955E340249C503'
    );
    assert.equal(
      description,
      'adadasd174C5B7301A82E0080000000089FCDD3B6C29D701000000000000000 samasiioasfioasjfio ja asfmioasiof asjio fjasifj ioasjf ioasji jfsaijfio j mcXXXXXXx',
      'should format description with space'
    );
  });

  it('should format date with timezone in long CET format to short CET format', function () {
    const parsedEvent = ICalParser.toJSON(mocks.tzidDateCETWrongFormat);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.equal(dtstart.value, '20210510T130000Z');
    assert.equal(dtstart.timezone, 'CET');
    assert.equal(dtend.value, '20210510T134000Z');
    assert.equal(dtend.timezone, 'CET');
  });

  it('should format simple date without Z', function () {
    const parsedEvent = ICalParser.toJSON(mocks.simpleDateWithoutZ);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.equal(dtstart.value, '20210401T110000Z');
    assert.equal(dtend.value, '20210401T113000Z');
  });

  it('should format simple date without time', function () {
    const parsedEvent = ICalParser.toJSON(mocks.simpleDateWithoutTime);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.equal(dtend.isAllDay, true);
    assert.equal(dtstart.value, '20210409');
    assert.equal(dtend.isAllDay, true);
    assert.equal(dtend.value, '20210409');
  });

  it('should throw error with wrong date with time', function () {
    try {
      ICalParser.toJSON(mocks.wrongDateWithTime);
    } catch (e: any) {
      assert.equal(e.message, ERROR_MSG.INVALID_DATE);
    }
  });

  it('should throw error with wrong date without time', function () {
    try {
      ICalParser.toJSON(mocks.wrongDateWithoutTime);
    } catch (e: any) {
      assert.equal(e.message, ERROR_MSG.INVALID_DATE);
    }
  });

  it('should throw error with wrong calendar format', function () {
    try {
      ICalParser.toJSON(mocks.wrongFormatCalendar);
    } catch (e: any) {
      assert.equal(e.message, ERROR_MSG.WRONG_FORMAT);
    }
  });

  it('should throw error with wrong event format', function () {
    try {
      ICalParser.toJSON(mocks.wrongFormatEvent);
    } catch (e: any) {
      assert.equal(e.message, ERROR_MSG.WRONG_FORMAT);
    }
  });

  it('should format one attendee to JSON', function () {
    const parsedEvent = ICalParser.toJSON(mocks.oneAttendee);

    const { organizer, attendee } = parsedEvent.events[0];

    const firstAttendee = attendee[0];

    assert.equal(organizer.mailto, 'buia@test.com');
    assert.equal(attendee.length, 1);
    assert.equal(firstAttendee.mailto, 'bata123@test2.org');
    assert.equal(firstAttendee.PARTSTAT, 'ACCEPTED');
    assert.equal(firstAttendee.CUTYPE, 'INDIVIDUAL');
    assert.equal(firstAttendee.ROLE, 'REQ-PARTICIPANT');
  });

  it('should format two attendees to JSON', function () {
    const parsedEvent = ICalParser.toJSON(mocks.twoAttendees);

    const { organizer, attendee } = parsedEvent.events[0];

    const firstAttendee = attendee[0];
    const secondAttendee = attendee[1];

    assert.equal(attendee.length, 2);
    assert.equal(organizer.mailto, 'buia@test.com');
    assert.equal(firstAttendee.mailto, 'bata123@test2.org');
    assert.equal(firstAttendee.PARTSTAT, 'ACCEPTED');
    assert.equal(firstAttendee.CUTYPE, 'INDIVIDUAL');
    assert.equal(firstAttendee.ROLE, 'REQ-PARTICIPANT');
    assert.equal(secondAttendee.mailto, 'abada@test2.org');
    assert.equal(secondAttendee.PARTSTAT, 'DECLINED');
    assert.equal(secondAttendee.CUTYPE, 'INDIVIDUAL');
    assert.equal(secondAttendee.ROLE, 'REQ-PARTICIPANT');
  });
});
