export const dateNestedTestData = {
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
        value: '2021-03-29T07:00:00.668Z',
        timezone: 'Europe/Berlin',
      },
      dtend: {
        value: '2021-03-29T07:30:00.668Z',
        timezone: 'Europe/Berlin',
      },
      class: 'PUBLIC',
      priority: '5',
      dtstamp: { value: '2021-04-02T20:56:00Z' },
      lastModified: { value: '2021-04-02T20:56:00Z' },
      created: { value: '2021-04-02T20:56:00Z' },
      transp: 'OPAQUE',
      status: 'CONFIRMED',
      sequence: '0',
      location:
        'basdjij ifjisaj ifjisjf ijiasj fisjifjsiajfijasi jfas jsai' +
        ' fjiasj fioajsij foiasj fijasi jfiasj ifjasi jfais jfija ijfi' +
        ' ajsifji asj fi jasij fiajf ijaij sij jf ajoif jajsifj a jsij' +
        ' fiajs ifjas jfiojas fjas jfjas ijf i jsifj iasjfijas ijfi ajsif' +
        ' jiasj fijas fja fjioasj ojasfj',
      end: 'VEVENT',
    },
  ],
};
