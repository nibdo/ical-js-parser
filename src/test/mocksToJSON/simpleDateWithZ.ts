export const simpleDateWithZ = `BEGIN:VCALENDAR
METHOD:REQUEST
PRODID:Test
VERSION:2.0
BEGIN:VEVENT
DESCRIPTION:This meeting will take place at our office. You should bring yo
 ur notebook and all notes. Do not hesitate to contact us before. Transport
 ation is provided by company
UID:040000008200E00174C5B7301A82E0080000000089FCDD3B6C29D701000000000000000
 0100000000843E9436BC801248C955E340249C503
SUMMARY:tessssa
DTSTART:20210401T110000Z
DTEND:20210401T113000Z
CLASS:PUBLIC
PRIORITY:5
DTSTAMP:20210402T205602Z
TRANSP:OPAQUE
STATUS:CONFIRMED
SEQUENCE:0
LOCATION:asdsfdf
END:VEVENT
END:VCALENDAR`;

export const simpleDateWithZWithArtifacts = `BEGIN:VCALENDAR
METHOD:REQUEST
PRODID:Test
VERSION:2.0
BEGIN:VEVENT
DESCRIPTION:This meetin
 is
 something
UID:040000008200E001
SUMMARY:tessssa
DTSTART:20210401T110000Z\r
DTEND:20210401T113000Z\n
EXDATE:20220102T150000Z,20220302T150000Z,20220402T150000Z,20220502T150000Z,\r 20220602T150000Z
RRULE:FREQ=WEEKLY;INTERVAL=1
CLASS:PUBLIC
PRIORITY:5
DTSTAMP:20210402T205602Z
TRANSP:OPAQUE
STATUS:CONFIRMED
SEQUENCE:0
LOCATION:asdsfdf
END:VEVENT
BEGIN:VEVENT
DESCRIPTION:This meetin
UID:040000008200E001
SUMMARY:tessssa
DTSTART:20210401T110000Z\r
DTEND:20210401T113000Z\n
EXDATE:20220102T150000Z,20220302T150000Z,20220402T150000Z,20220502T150000Z,\n 20220602T150000Z
RRULE:FREQ=\rWEEKLY;INTERVAL=1;BYDAY=\rMO
CLASS:PUBLIC
PRIORITY:5
DTSTAMP:20210402T205602Z
TRANSP:OPAQUE
STATUS:CONFIRMED
SEQUENCE:0
LOCATION:asdsfdf
END:VEVENT
END:VCALENDAR`;

export const dateTimeDate = `BEGIN:VCALENDAR
METHOD:REQUEST
PRODID:Test
VERSION:2.0
BEGIN:VEVENT
UID:040000008200E001
SUMMARY:tessssa
DTSTART;VALUE=DATE-TIME:20221004T123000
DTEND;VALUE=DATE:20221204
END:VEVENT
END:VCALENDAR`;
