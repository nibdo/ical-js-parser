import ICalParser from '../../src';

const assert = require('assert');

import mocks from '../mocksToString';

describe('Parse to String from JSON', function () {
  it('should return string iCal event with date with timezone', function () {
    const parsedEvent = ICalParser.toString(mocks.dateNestedTestData);

    const lines = parsedEvent.split('\n');

    assert.equal(lines[0], 'BEGIN:VCALENDAR');
    assert.equal(lines[1], 'PRODID:abc');
    assert.equal(lines[2], 'VERSION:1');
    assert.equal(lines[3], 'BEGIN:VEVENT');
    assert.equal(lines[4], 'DESCRIPTION:ada');
    assert.equal(
      lines[5],
      'UID:040000008200E00074C5B7101A82E00800000000DF9560970228D701000000000000000'
    );
    assert.equal(lines[6], 'SUMMARY:cv');
    assert.equal(lines[7], 'DTSTART;TZID=Europe/Berlin:20210329T090000');
    assert.equal(lines[8], 'DTEND;TZID=Europe/Berlin:20210329T093000');
    assert.equal(lines[9], 'CLASS:PUBLIC');
    assert.equal(lines[10], 'PRIORITY:5');
    assert.equal(lines[11], 'DTSTAMP:20210402T205600Z');
    assert.equal(lines[12], 'TRANSP:OPAQUE');
    assert.equal(lines[13], 'STATUS:CONFIRMED');
    assert.equal(lines[14], 'SEQUENCE:0');
    assert.equal(
      lines[15],
      'LOCATION:basdjij ifjisaj ifjisjf ijiasj fisjifjsiajfijasi jfas jsai fjiasj '
    );
    assert.equal(
      lines[16],
      ' fioajsij foiasj fijasi jfiasj ifjasi jfais jfija ijfi ajsifji asj fi jasij '
    );
    assert.equal(
      lines[17],
      ' i jsifj iasjfijas ijfi ajsif jiasj fijas fja fjioasj ojasfj'
    );
    assert.equal(lines[18], 'END:VEVENT');
    assert.equal(lines[19], 'END:VCALENDAR');
  });
  it('should return string iCal event with attendees', function () {
    const parsedEvent = ICalParser.toString(mocks.attendeesTestData);

    const lines = parsedEvent.split('\n');

    assert.equal(lines[0], 'BEGIN:VCALENDAR');
    assert.equal(lines[1], 'PRODID:abc');
    assert.equal(lines[2], 'VERSION:1');
    assert.equal(lines[3], 'BEGIN:VEVENT');
    assert.equal(lines[4], 'LAST-MODIFIED:20210330T193200Z');
    assert.equal(lines[5], 'DTSTAMP:20210330T193200Z');
    assert.equal(lines[6], 'UID:CaqugAe----1165932647582@test.com');
    assert.equal(lines[7], 'SUMMARY:saf');
    assert.equal(
      lines[8],
      'ORGANIZER;EMAIL=buia@test.com:mailto:buia@test.com'
    );
    assert.equal(
      lines[9],
      'ATTENDEE;PARTSTAT=ACCEPTED;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;EMAIL=bat'
    );
    assert.equal(lines[10], ' a123@test2.org:mailto:bata123@test2.org');
    assert.equal(
      lines[11],
      'ATTENDEE;PARTSTAT=DECLINED;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;EMAIL=aba'
    );
    assert.equal(lines[12], ' da@test2.org:mailto:abada@test2.org');
    assert.equal(lines[13], 'DTSTART:20210401T100000Z');
    assert.equal(lines[14], 'DTEND:20210401T103000Z');
    assert.equal(lines[15], 'SEQUENCE:1');
    assert.equal(lines[16], 'END:VEVENT');
    assert.equal(lines[17], 'END:VCALENDAR');
  });
});
