import { ICalJSON } from '../../index';

export const todosData: ICalJSON = {
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
      dtstart: { value: '2021-04-01T10:00:00Z' },
      dtend: { value: '2021-04-01T10:30:00Z' },
      sequence: '1',
      end: 'VEVENT',
    },
    {
      begin: 'VEVENT',
      lastModified: { value: '2021-03-30T19:32:00Z' },
      dtstamp: { value: '2021-03-30T19:32:00Z' },
      uid: 'CaqugAe----1165932647582@test.com',
      summary: 'saf',
      dtstart: { value: '2021-04-01T10:00:00Z' },
      dtend: { value: '2021-04-01T10:30:00Z' },
      sequence: '1',
      end: 'VEVENT',
    },
  ],
  todos: [
    {
      begin: 'VTODO',
      lastModified: { value: '2021-03-30T19:32:00Z' },
      dtstamp: { value: '2021-03-30T19:32:00Z' },
      uid: 'CaqugAe----1165932647582@test.com',
      summary: 'saf',
      sequence: '1',
      end: 'VTODO',
    },
    {
      begin: 'VTODO',
      lastModified: { value: '2021-03-30T19:32:00Z' },
      dtstamp: { value: '2021-03-30T19:32:00Z' },
      uid: 'CaqugAe----1165932647582@test.com',
      summary: 'saf',
      sequence: '1',
      end: 'VTODO',
    },
  ],
};
