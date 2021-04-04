const chai = require('chai');
const assert = chai.assert;

const mocks = require('./mocksToJSON');
const ICalParser = require('../dist');

describe('Parse to JSON from string', function () {
  it(
    'should return only string value for nested props Summary,' +
      ' Location and Description',
    function () {
      const parsedEvent = ICalParser.default.toJSON(mocks.nestedPropsSummary);

      const { summary, location, description } = parsedEvent.events[0];
      assert.equal(summary, 'cv');
      assert.equal(location, '');
      assert.equal(description, 'ada');
    }
  );

  it('should format date with timezone to ISO string date in UTC', function () {
    const parsedEvent = ICalParser.default.toJSON(mocks.dateWithTimezoneToISO);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.property(dtstart, 'value');
    assert.property(dtstart, 'timezone');
    assert.property(dtend, 'value');
    assert.property(dtend, 'timezone');
    assert.equal(dtstart.value, '2021-04-02T03:00:00Z');
    assert.equal(dtstart.timezone, 'Europe/Berlin');
    assert.equal(dtend.value, '2021-04-02T03:30:00Z');
    assert.equal(dtend.timezone, 'Europe/Berlin');
  });

  it('should format simple date with Z', function () {
    const parsedEvent = ICalParser.default.toJSON(mocks.simpleDateWithZ);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.typeOf(dtstart, 'string');
    assert.typeOf(dtend, 'string');
    assert.equal(dtstart, '2021-04-01T11:00:00Z');
    assert.equal(dtend, '2021-04-01T11:30:00Z');
  });

  it('should merge uid from two lines simple date with Z', function () {
    const parsedEvent = ICalParser.default.toJSON(mocks.simpleDateWithZ);

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

  it('should format simple date without Z', function () {
    const parsedEvent = ICalParser.default.toJSON(mocks.simpleDateWithoutZ);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.typeOf(dtstart, 'string');
    assert.typeOf(dtend, 'string');
    assert.equal(dtstart, '2021-04-01T11:00:00Z');
    assert.equal(dtend, '2021-04-01T11:30:00Z');
  });

  it('should format simple date without time', function () {
    const parsedEvent = ICalParser.default.toJSON(mocks.simpleDateWithoutTime);

    const { dtstart, dtend } = parsedEvent.events[0];

    assert.property(dtstart, 'isAllDay');
    assert.equal(dtstart.value, '2021-04-09');
    assert.property(dtend, 'isAllDay');
    assert.equal(dtend.value, '2021-04-09');
  });

  it('should throw error with wrong date with time', function () {
    assert.throws(
      () => ICalParser.default.toJSON(mocks.wrongDateWithTime),
      'Date is not valid'
    );
  });

  it('should throw error with wrong date without time', function () {
    assert.throws(
      () => ICalParser.default.toJSON(mocks.wrongDateWithoutTime),
      'Date is not valid'
    );
  });

  it('should throw error with wrong calendar format', function () {
    assert.throws(
      () => ICalParser.default.toJSON(mocks.wrongFormatCalendar),
      'Wrong format'
    );
  });

  it('should throw error with wrong event format', function () {
    assert.throws(
      () => ICalParser.default.toJSON(mocks.wrongFormatEvent),
      'Wrong format'
    );
  });

  it('should format one attendee to JSON', function () {
    const parsedEvent = ICalParser.default.toJSON(mocks.oneAttendee);

    const { organizer, attendee } = parsedEvent.events[0];

    const firstAttendee = attendee[0];

    assert.property(organizer, 'mailto');
    assert.equal(organizer.mailto, 'buia@test.com');
    assert.lengthOf(attendee, 1);
    assert.equal(firstAttendee.mailto, 'bata123@test2.org');
    assert.equal(firstAttendee.PARTSTAT, 'ACCEPTED');
    assert.equal(firstAttendee.CUTYPE, 'INDIVIDUAL');
    assert.equal(firstAttendee.ROLE, 'REQ-PARTICIPANT');
  });

  it('should format two attendees to JSON', function () {
    const parsedEvent = ICalParser.default.toJSON(mocks.twoAttendees);

    const { organizer, attendee } = parsedEvent.events[0];

    const firstAttendee = attendee[0];
    const secondAttendee = attendee[1];

    assert.property(organizer, 'mailto');
    assert.lengthOf(attendee, 2);
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
