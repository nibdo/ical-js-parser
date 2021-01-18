# ical-js-parser [ALPHA]

Simple parser from iCal string

For complicated use cases use https://github.com/mozilla-comm/ical.js/

## Install

    npm i ical-js-parser

## How to use

    import ICalParser from 'ical-js-parser';

    // Parse from iCal string
    const result = ICalParser.parseFromICal(iCalString);

## Example result from iCal

    { events : 
        [
            {
            begin: 'VEVENT',
            created: '2020-11-21T20:54:00Z',
            lastModified: '2020-12-20T01:53:00Z',
            dtstamp: '2020-12-20T01:53:00Z',
            uid: '015c3fe5-7298-495d-be92-fc5319f8c8d4',
            summary: 'Meeting',
            status: 'CONFIRMED',
            rrule: 'FREQ=WEEKLY;BYDAY=MO',
            dtstart: { value: '2021-01-04T15:30:00Z', timezone: 'Europe/London' },
            dtend: { value: '2021-01-04T16:30:00Z', timezone: 'Europe/London' },
            sequence: '0',
            transp: 'OPAQUE',
            end: 'VEVENT'
            }   
        ]
    }


## TODO

- tests
- parsing to iCal
- alarms
- calendar timezones
