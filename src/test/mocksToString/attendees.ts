import {ICalJSON} from "../../index";

export const attendeesTestData: ICalJSON = {
  calendar: {
    begin: 'VCALENDAR',
    prodid: 'abc',
    version: '1',
    end: 'VCALENDAR',
  },
  events: [
    {
      begin: 'VEVENT',
      lastModified: { value: '2021-03-30T19:32:00Z' },
      dtstamp: { value: '2021-03-30T19:32:00Z' },
      uid: 'CaqugAe----1165932647582@test.com',
      summary: 'saf',
      organizer: { EMAIL: 'buia@test.com', mailto: 'buia@test.com' },
      attendee: [
        {
          PARTSTAT: 'ACCEPTED',
          CUTYPE: 'INDIVIDUAL',
          ROLE: 'REQ-PARTICIPANT',
          EMAIL: 'bata123@test2.org',
          mailto: 'bata123@test2.org',
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
      end: 'VEVENT',
    },
  ],
};
