import { ICalJSON } from '../../index';

export const dateWithoutTime: ICalJSON = {
  calendar: {
    begin: 'VCALENDAR',
    prodid: 'abc',
    version: '1',
    end: 'VCALENDAR',
  },
  events: [
    {
      begin: 'VEVENT',
      description: 'ada',
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
