import ICalParser from '../../index';

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
    assert.equal(lines[12], 'LAST-MODIFIED:20210402T205600Z');
    assert.equal(lines[13], 'CREATED:20210402T205600Z');
    assert.equal(lines[14], 'TRANSP:OPAQUE');
    assert.equal(lines[15], 'STATUS:CONFIRMED');
    assert.equal(lines[16], 'SEQUENCE:0');
    assert.equal(
      lines[17],
      'LOCATION:basdjij ifjisaj ifjisjf ijiasj fisjifjsiajfijasi jfas jsai fjiasj'
    );
    assert.equal(
      lines[18],
      ' fioajsij foiasj fijasi jfiasj ifjasi jfais jfija ijfi ajsifji asj fi jasi'
    );
    assert.equal(
      lines[19],
      ' j fiajf ijaij sij jf ajoif jajsifj a jsij fiajs ifjas jfiojas fjas' +
        ' jfjas '
    );
    assert.equal(
      lines[20],
      ' jf i jsifj iasjfijas ijfi ajsif jiasj fijas fja fjioasj ojasfj'
    );
    assert.equal(lines[21], 'END:VEVENT');
    assert.equal(lines[22], 'END:VCALENDAR');
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
    assert.equal(lines[8], 'ORGANIZER;CN=buia:mailto:buia@test.com');
    assert.equal(
      lines[9],
      'ATTENDEE;PARTSTAT=ACCEPTED;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;EMAIL=ba'
    );
    assert.equal(lines[10], ' ta123@test2.org:mailto:bata123@test2.org');
    assert.equal(
      lines[11],
      'ATTENDEE;PARTSTAT=DECLINED;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;EMAIL=ab'
    );
    assert.equal(lines[12], ' ada@test2.org:mailto:abada@test2.org');
    assert.equal(lines[13], 'DTSTART:20210401T100000Z');
    assert.equal(lines[14], 'DTEND:20210401T103000Z');
    assert.equal(lines[15], 'SEQUENCE:1');
    assert.equal(lines[16], 'X-TEST-SAMPLE:test');
    assert.equal(lines[17], 'END:VEVENT');
    assert.equal(lines[18], 'END:VCALENDAR');
  });
  it('should return string iCal event with dates without time', function () {
    const parsedEvent = ICalParser.toString(mocks.dateWithoutTime);

    const lines = parsedEvent.split('\n');

    assert.equal(lines[0], 'BEGIN:VCALENDAR');
    assert.equal(lines[1], 'PRODID:abc');
    assert.equal(lines[2], 'VERSION:1');
    assert.equal(lines[3], 'BEGIN:VEVENT');
    assert.equal(lines[7], 'DTSTART;VALUE=DATE:20210329');
    assert.equal(lines[8], 'DTEND;VALUE=DATE:20210329');
  });
  it('should return string iCal event with attendees', function () {
    const parsedEvent = ICalParser.toString(mocks.exdateTestData);

    const lines = parsedEvent.split('\n');

    assert.equal(lines[17], 'EXDATE:20210402T205600Z');
    assert.equal(lines[18], 'EXDATE;TZID=Europe/Berlin:20210329T090000');
  });
  it('should return string iCal event with dates without time', function () {
    const parsedEvent = ICalParser.toString(mocks.dateWithoutTime);

    const lines = parsedEvent.split('\n');

    assert.equal(lines[0], 'BEGIN:VCALENDAR');
    assert.equal(lines[1], 'PRODID:abc');
    assert.equal(lines[2], 'VERSION:1');
    assert.equal(lines[3], 'BEGIN:VEVENT');
    assert.equal(lines[7], 'DTSTART;VALUE=DATE:20210329');
    assert.equal(lines[8], 'DTEND;VALUE=DATE:20210329');
  });
  it('should return string iCal event with long description', function () {
    const parsedEvent = ICalParser.toString(mocks.longDescription);

    const lines = parsedEvent.split('\n');

    assert.equal(
      lines[4],
      'DESCRIPTION:START TEST TEST TEST TEST TEST TEST TEST\\n\\nABCDEREAFSAF\\n\\nTE'
    );
    assert.equal(
      lines[5],
      ' ST TEST TEST TEST TEST TEST\\n\\nABCDE TEST TEST TEST ATATESTTESTTEST TEST '
    );
    assert.equal(
      lines[6],
      ' ESTTEST. TEST TEST TEST DEFAAA, TEST TEST TESTTEST' +
        ' VRATESTTESTTESTTESTTES'
    );
    assert.equal(
      lines[7],
      ' TESTTESTTEST TEST TEST TEST GBTAS 1TEST 2TEST 3TEST 4TEST 5TEST 6TEST 7TE'
    );
    assert.equal(
      lines[8],
      ' ST. Test test 4 Teset test-Tetsetset 1test 2test 3tsets 4tsets 5test 6tse'
    );
    assert.equal(
      lines[9],
      ' 7tset TEST-TEST testet.\\n\\nTEST TESTTEST TEST.TEST.TEST TEST TESTTESTTEST'
    );
    assert.equal(lines[10], ' END');
    assert.equal(
      lines[11],
      'UID:040000008200E00074C5B7101A82E00800000000DF9560970228D701000000000000000'
    );
  });

  it('should return string iCal event with long description 2', function () {
    const parsedEvent = ICalParser.toString(mocks.longDescription2);

    const lines = parsedEvent.split('\n');

    assert.equal(lines[4], 'DESCRIPTION:afasf\\n\\nasfaf\\n\\nnavxcvxcv');
    assert.equal(
      lines[5],
      'UID:040000008200E00074C5B7101A82E00800000000DF9560970228D701000000000000000'
    );
    assert.equal(lines[6], 'SUMMARY:cv');
  });
});
