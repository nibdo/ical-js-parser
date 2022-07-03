export const twoAttendees = `BEGIN:VCALENDAR
PRODID:Calendar V1.1
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
LAST-MODIFIED:20210330T193252Z
DTSTAMP:20210330T193252Z
UID:LlqugAe----1165932647582@test.com
SUMMARY:saf
ORGANIZER;CN=buia:mailto:buia@test.com
ATTENDEE;PARTSTAT=ACCEPTED;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;EMAIL=ba
 ta123@test2.org:mailto:bata123@test2.org
ATTENDEE;PARTSTAT=DECLINED;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;EMAIL=ab
 ada@test2.org:mailto:abada@test2.org
DTSTART:20210401T100000Z
DTEND:20210401T103000Z
SEQUENCE:1
END:VEVENT
END:VCALENDAR`;

export const twoAttendeesWithSpacesInEmail = `BEGIN:VCALENDAR
PRODID:Calendar V1.1
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
LAST-MODIFIED:20210330T193252Z
DTSTAMP:20210330T193252Z
UID:LlqugAe----1165932647582@test.com
SUMMARY:saf
ORGANIZER;CN=buia:mailto:buia@test.com
ATTENDEE;PARTSTAT=ACCEPTED;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;EMAIL=ba
 ta123@te\rst2.org:mailto:bata123@test2.org
ATTENDEE;PARTSTAT=DECLINED;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;CN=ab
 ada@t\rest2.org:mailto:abada@t\rest2.org
DTSTART:20210401T100000Z
DTEND:20210401T103000Z
SEQUENCE:1
END:VEVENT
END:VCALENDAR`;
