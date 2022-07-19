import { ICalJSON } from '../../index';

export const longDescription: ICalJSON = {
  calendar: {
    begin: 'VCALENDAR',
    prodid: 'abc',
    version: '1',
    end: 'VCALENDAR',
  },
  events: [
    {
      begin: 'VEVENT',
      description:
        'START TEST TEST TEST TEST TEST TEST TEST\n' +
        '\n' +
        'ABCDEREAFSAF\n' +
        '\n' +
        'TEST TEST TEST TEST TEST TEST\n' +
        '\n' +
        'ABCDE TEST TEST TEST ATATESTTESTTEST TEST TESTTEST. TEST TEST TEST' +
        ' DEFAAA, TEST TEST TESTTEST VRATESTTESTTESTTESTTEST TESTTESTTEST' +
        ' TEST' +
        ' TEST TEST' +
        ' GBTAS 1TEST 2TEST 3TEST 4TEST 5TEST 6TEST 7TEST. Test test 4 Teset' +
        ' test-Tetsetset 1test 2test 3tsets 4tsets 5test 6tset 7tset' +
        ' TEST-TEST testet.\n' +
        '\n' +
        'TEST TESTTEST TEST.TEST.TEST TEST TESTTESTTEST END',
      uid: '040000008200E00074C5B7101A82E00800000000DF9560970228D701000000000000000',
      summary: 'cv',
      dtstart: {
        value: '20210329',
      },
      dtend: {
        value: '20210329',
      },
      class: 'PUBLIC',
      priority: '5',
      dtstamp: { value: '2021-04-02T20:56:00Z' },
      lastModified: { value: '2021-04-02T20:56:00Z' },
      created: { value: '2021-04-02T20:56:00Z' },
      transp: 'OPAQUE',
      status: 'CONFIRMED',
      sequence: '0',
      end: 'VEVENT',
    },
  ],
};

export const longDescription2: ICalJSON = {
  calendar: {
    begin: 'VCALENDAR',
    prodid: 'abc',
    version: '1',
    end: 'VCALENDAR',
  },
  events: [
    {
      begin: 'VEVENT',
      description: `afasf\n\nasfaf\n\nnavxcvxcv`,
      uid: '040000008200E00074C5B7101A82E00800000000DF9560970228D701000000000000000',
      summary: 'cv',
      dtstart: {
        value: '20210329',
      },
      dtend: {
        value: '20210329',
      },
      class: 'PUBLIC',
      priority: '5',
      dtstamp: { value: '2021-04-02T20:56:00Z' },
      lastModified: { value: '2021-04-02T20:56:00Z' },
      created: { value: '2021-04-02T20:56:00Z' },
      transp: 'OPAQUE',
      status: 'CONFIRMED',
      sequence: '0',
      end: 'VEVENT',
    },
  ],
};
