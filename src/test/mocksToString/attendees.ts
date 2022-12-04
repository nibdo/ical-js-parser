import { ICalJSON } from '../../index';

export const attendeesTestData: ICalJSON = {
  calendar: {
    begin: 'VCALENDAR',
    prodid: 'abc',
    version: '1',
    end: 'VCALENDAR',
  },
  todos: [],
  errors: [],
  events: [
    {
      begin: 'VEVENT',
      lastModified: { value: '2021-03-30T19:32:00Z' },
      dtstamp: { value: '2021-03-30T19:32:00Z' },
      uid: 'CaqugAe----1165932647582@test.com',
      summary: 'saf',
      organizer: { CN: 'buia', mailto: 'buia@test.com' },
      attendee: [
        {
          CN: 'abcde@abcdefghijkl.co',
          ROLE: 'REQ-PARTICIPANT',
          PARTSTAT: 'NEEDS-ACTION',
          ABCTOKEN: '12345673d89123cABCDcbe611234b7a1a123a1b2c311',
          mailto: 'abcde@abcdefghijkl.co',
        },
        {
          PARTSTAT: 'DECLINED',
          CUTYPE: 'INDIVIDUAL',
          ROLE: 'REQ-PARTICIPANT',
          EMAIL: 'abada@test2.org',
          mailto: 'abada@test2.org',
        },
      ],
      dtstart: { value: '2021-04-01T10:00:00Z' },
      dtend: { value: '2021-04-01T10:30:00Z' },
      sequence: '1',
      xTestSample: 'test',
      end: 'VEVENT',
    },
  ],
};
