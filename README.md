# ical-js-parser [ALPHA]

Simple parser from iCal string

For complicated use cases use https://github.com/mozilla-comm/ical.js/

## Install

    npm i ical-js-parser

## How to use

    import ICalParser from 'ical-js-parser';

    // Parse from iCal string to JSON
    const resultJSON = ICalParser.toJSON(iCalString);

    // Parse from JSON to iCal string
    const resultString = ICalParser.toString(someJSONevent);

## Example result from iCal string

Same format is used to parse from JSON to iCal string

    {
        calendar: 
            { 
                begin: 'VCALENDAR', 
                prodid: 'abc', 
                version: '1', 
                end: 'VCALENDAR' 
            },
        events: 
            [
                {
                    begin: 'VEVENT',
                    lastModified: '2021-03-30T19:32:00Z',
                    dtstamp: '2021-03-30T19:32:00Z',
                    uid: 'CaqugAe----1165932647582@test.com',
                    summary: 'Meeting',
                    dtstart: '2021-04-01T10:00:00Z',
                    dtend: '2021-04-01T10:30:00Z',
                    sequence: '1',
                    end: 'VEVENT',
                }
            ]
    }


## TODO

- more tests
- alarms
- calendar timezones
