import { ERROR_MSG } from '../../enums';
import ICalParser from '../../index';
import mocks from '../mocksToJSON';

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

      const event = parsedEvent?.events?.[0];

      assert.equal(event?.summary, 'cv');
      assert.equal(event?.location, '');
      assert.equal(event?.description, 'ada');
    }
  );

  it('should format date with timezone to ISO string date in UTC', function () {
    const parsedEvent = ICalParser.toJSON(mocks.dateWithTimezoneToISO);

    const event = parsedEvent?.events?.[0];

    assert.equal(event?.dtstart?.value, '20210402T030000');
    assert.equal(event?.dtstart?.timezone, 'Europe/Berlin');
    assert.equal(event?.dtend?.value, '20210402T033000');
    assert.equal(event?.dtend?.timezone, 'Europe/Berlin');
  });

  it('should format simple date with Z', function () {
    const parsedEvent = ICalParser.toJSON(mocks.simpleDateWithZ);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.equal(dtstart.value, '20210401T110000Z');
    assert.equal(dtend.value, '20210401T113000Z');
  });

  it('should merge uid from two lines simple date with Z', function () {
    const parsedEvent = ICalParser.toJSON(mocks.simpleDateWithZ);

    const { uid } = parsedEvent.events[0];

    assert.equal(
      uid,
      '040000008200E00174C5B7301A82E0080000000089FCDD3B6C29D7010000000000000000100000000843E9436BC801248C955E340249C503'
    );
  });

  it('should merge overflowing description without spaces', function () {
    const parsedEvent = ICalParser.toJSON(mocks.simpleDateWithZ);

    const { description } = parsedEvent.events[0];

    assert.equal(
      description,
      'This meeting will take place at our office. You should bring your notebook and all notes. Do not hesitate to contact us before. Transportation is provided by company',
      'should format description with space'
    );
  });

  it('should format date with timezone in long CET format to short CET format', function () {
    const parsedEvent = ICalParser.toJSON(mocks.tzidDateCETWrongFormat);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.equal(dtstart.value, '20210510T150000');
    assert.equal(dtstart.timezone, 'CET');
    assert.equal(dtend.value, '20210510T154000');
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
    const result = ICalParser.toJSON(mocks.wrongDateWithTime);

    assert.equal(result.errors[0], 'Invalid date: 20210401T990000Z');
    assert.equal(result?.events?.length, 1);
  });

  it('should throw error with wrong date without time', function () {
    const result = ICalParser.toJSON(mocks.wrongDateWithoutTime);

    assert.equal(result?.events?.length, 1);
    assert.equal(result?.errors?.length, 1);
    assert.equal(result.errors[0], 'Invalid date: 20219409');
  });

  it('should throw error with wrong calendar format', function () {
    const result = ICalParser.toJSON(mocks.wrongFormatCalendar);

    assert.equal(result.errors[0], 'Wrong format');
  });

  it('should throw error with wrong event format', function () {
    const result = ICalParser.toJSON(mocks.wrongFormatEvent);

    assert.equal(result.errors[0], 'Wrong format');
  });

  it('should format one attendee to JSON', function () {
    const parsedEvent = ICalParser.toJSON(mocks.oneAttendee);

    const { organizer, attendee } = parsedEvent.events[0];
    const firstAttendee = attendee?.[0];

    assert.equal(organizer?.mailto, 'buia@test.com');
    assert.equal(attendee?.length, 1);
    assert.equal(firstAttendee?.mailto, 'bata123@test2.org');
    assert.equal(firstAttendee?.PARTSTAT, 'ACCEPTED');
    assert.equal(firstAttendee?.CUTYPE, 'INDIVIDUAL');
    assert.equal(firstAttendee?.ROLE, 'REQ-PARTICIPANT');
  });

  it('should format two attendees to JSON', function () {
    const parsedEvent = ICalParser.toJSON(mocks.twoAttendees);

    const { organizer, attendee } = parsedEvent.events[0];

    const firstAttendee = attendee?.[0];
    const secondAttendee = attendee?.[1];

    assert.equal(attendee?.length, 2);
    assert.equal(organizer?.mailto, 'buia@test.com');
    assert.equal(firstAttendee?.mailto, 'bata123@test2.org');
    assert.equal(firstAttendee?.PARTSTAT, 'ACCEPTED');
    assert.equal(firstAttendee?.CUTYPE, 'INDIVIDUAL');
    assert.equal(firstAttendee?.ROLE, 'REQ-PARTICIPANT');
    assert.equal(secondAttendee?.mailto, 'abada@test2.org');
    assert.equal(secondAttendee?.PARTSTAT, 'DECLINED');
    assert.equal(secondAttendee?.CUTYPE, 'INDIVIDUAL');
    assert.equal(secondAttendee?.ROLE, 'REQ-PARTICIPANT');
  });

  it('should remove not supported properties', function () {
    const parsedEvent = ICalParser.toJSON(mocks.notSupportedProperties);

    const { dtstart, dtend, rrule } = parsedEvent.events[0];

    assert.equal(dtstart.value, '20211227T160000');
    assert.equal(dtend.value, '20211227T170000');
    assert.equal(rrule, undefined);
  });

  it('Format various date times', function () {
    const parsedEvent = ICalParser.toJSON(mocks.timeFormats);

    assert.equal(parsedEvent.errors.length, 1);
    assert.equal(parsedEvent.events.length, 3);

    assert.equal(parsedEvent.errors[0], 'unsupported zone US-Eastern');

    assert.equal(parsedEvent.events[0].dtstart.value, '20200616T060000');
    assert.equal(parsedEvent.events[0].dtend.value, '20200616T060000');
    assert.equal(parsedEvent.events[1].dtstart.value, '20210218T110000Z');
    assert.equal(parsedEvent.events[1].dtend.value, '20210218T120000Z');
    assert.equal(parsedEvent.events[2].dtstart.value, '20210201T080000Z');
    assert.equal(parsedEvent.events[2].dtend.value, '20210201T100000Z');
  });

  it('Format dates with artifacts', function () {
    const parsedEvent = ICalParser.toJSON(mocks.simpleDateWithZWithArtifacts);

    assert.equal(parsedEvent.errors.length, 0);
    assert.equal(parsedEvent.events.length, 2);

    assert.equal(parsedEvent.events[0].dtend.value, '20210401T113000Z');
    assert.equal(
      JSON.stringify(parsedEvent.events[0].exdate).indexOf('\r'),
      -1
    );
    assert.equal(
      JSON.stringify(parsedEvent.events[0].exdate).indexOf('\n'),
      -1
    );
    assert.equal(parsedEvent.events[1].dtstart.value, '20210401T110000Z');
    assert.equal(parsedEvent.events[1].dtend.value, '20210401T113000Z');
    assert.equal(
      JSON.stringify(parsedEvent.events[1].exdate).indexOf('\r'),
      -1
    );
    assert.equal(
      JSON.stringify(parsedEvent.events[1].exdate).indexOf('\n'),
      -1
    );
    assert.equal(
      parsedEvent.events[1].rrule,
      'FREQ=WEEKLY;INTERVAL=1;BYDAY=MO'
    );
  });

  it('Format attendees emails without spaces', function () {
    const parsedEvent = ICalParser.toJSON(mocks.twoAttendeesWithSpacesInEmail);

    assert.equal(parsedEvent.errors.length, 0);
    assert.equal(parsedEvent.events.length, 1);

    const event = parsedEvent.events[0];
    const attendee1 = event.attendee?.[0];
    const attendee2 = event.attendee?.[1];

    assert.equal(attendee1?.mailto, 'bata123@test2.org');
    assert.equal(attendee1?.EMAIL, 'bata123@test2.org');
    assert.equal(attendee2?.mailto, 'abada@test2.org');
    assert.equal(attendee2?.CN, 'abada@test2.org');
  });
});
