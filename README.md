# ical-js-parser [BETA]

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

Note: Same format can be used to parse JSON event to iCal string

    {
        calendar: 
            { 
                begin: 'VCALENDAR', 
                prodid: 'abc', 
                version: '1', 
                end: 'VCALENDAR',
                method: 'REPLY'
            },
        events: 
            [
                {
                    begin: 'VEVENT',
                    lastModified: {
                        value: '2021-03-30T19:32:00Z'
                    }
                    dtstamp: {
                        value: "20210330T193200Z"
                    },
                    uid: 'CaqugAe----1165932647582@test.com',
                    summary: 'Meeting',
                    dtstart: {
                        value: "20210401T100000Z"
                    },
                    dtend: {
                        value: "20210401T103000Z"
                    },
                    organizer: {
                        EMAIL: "buia@test.com",
                        mailto: "buia@test.com"
                    },
                    attendee: [
                        {
                            PARTSTAT: "ACCEPTED",
                            CUTYPE: "INDIVIDUAL",
                            ROLE: "REQ-PARTICIPANT",
                            EMAIL: "bata123@test2.org",
                            mailto: "bata123@test2.org"
                        }
                    ],
                    sequence: '1',
                    end: 'VEVENT',
                    alarms: [
                                {
                                trigger: '-PT20M',
                                action: 'DISPLAY',
                                }
                    ]
                }
            ]
    }


## TODO
- calendar timezones
