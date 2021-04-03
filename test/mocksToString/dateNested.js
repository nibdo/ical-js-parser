const dateNested = {
  calendar: {
    begin: 'VCALENDAR',
    prodid: 'abc',
    version: '1',
    end: 'VCALENDAR',
  },
  events: [
    {
      description: 'ada',
      uid:
        '040000008200E00074C5B7101A82E00800000000DF9560970228D701000000000000000',
      summary: 'cv',
      dtstart: {
        value: '2021-03-29T07:00:00.668Z',
        timezone: 'Europe/Berlin',
      },
      dtend: {
        value: '2021-03-29T07:30:00.668Z',
        timezone: 'Europe/Berlin',
      },
      class: 'PUBLIC',
      priority: '5',
      dtstamp: '2021-04-02T20:56:00Z',
      transp: 'OPAQUE',
      status: 'CONFIRMED',
      sequence: '0',
      location: '',
    },
  ],
};

module.exports = dateNested;
