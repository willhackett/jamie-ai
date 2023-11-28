User
From: Will Hackett willhackett@me.com To: Jamie Ai jamie@willhackett.com Subject: Upcoming Meetings Message: Hey Jamie, what do I have on this week?
calendar_get(
{"from":"2023-05-01T00:00:00Z","to":"2023-05-07T23:59:59Z"})
)
[]
email_send(
{ "to": "willhackett@me.com", "subject": "Upcoming Meetings", "body": "Hi Will,\n\nYou have no meetings scheduled for this week.\n\nIf there's anything else you need, feel free to let me know!\n\nThanks,\nJamie" })
)
{success:true}
Jamie
Done
User
From: Will Hackett willhackett@me.com To: Jamie Ai jamie@willhackett.com Subject: Upcoming Meetings Message: Hey Jamie, can you please email Jarrod (jarrod@blinq.me) and schedule a time for us to catch up for a coffee. Cheers, Will
email_send(
{"to":"jarrod@blinq.me","subject":"Scheduling Coffee Catch-up","body":"Hi Jarrod,\n\nWill Hackett would like to meet you for a coffee catch-up. Could you please let us know your availability for this week or next week?\n\nLooking forward to hearing from you.\n\nThanks,\nJamie"})
)
{success:true}
Jamie
Done
User
From: Jarrod Webb jarrod@blinq.me To: Jamie Ai jamie@willhackett.com Subject: Re: Scheduling Coffee Catch-up Message: Hey Jamie, How's Tuesday at 11? Thanks
calendar_get(
{"from":"2023-05-02T00:00:00Z","to":"2023-05-02T23:59:59Z"})
)
[]
calendar_add(
{"from":"2023-05-02T11:00:00Z","to":"2023-05-02T12:00:00Z","is_all_day":false,"title":"Coffee with Jarrod","attendees":["jarrod@blinq.me"]})
)
{success:true}
email_send(
{"to":"jarrod@blinq.me","cc":"willhackett@me.com","subject":"Re: Scheduling Coffee Catch-up","body":"Hi Jarrod,\n\nTuesday at 11 AM is perfect. We have scheduled the coffee catch-up for then.\n\nBest regards,\nJamie"})
)
{success:true}
Jamie
Done
