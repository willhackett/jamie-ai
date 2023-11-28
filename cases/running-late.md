User
From: Will Hackett Subject: Running late Message: Please let john know i'm running late

contacts_get(
{"query":"john"})
)
{ "results": 2, "message": "You should make your query more specific", "data": [ { "id": 123, "email": "john.smith@me.com", "name": "John Smith" }, { "id": 456, "email": "john.curry@me.com", "name": "John Curry" } ] }
Jamie
I need more details to identify which John you're referring to. Could you please provide the last name or any other specific information about John?

User
Will cannot see your output. Please send an email if you require additional information, otherwise reply with Done.

email_send(
{"to":"willhackett@me.com","subject":"Re: Running late","body":"Hi Will,\n\nCould you please specify which John should be informed that you're running late? We have multiple contacts with that name.\n\nThanks,\nJamie"})
)
success
Jamie
Done

User
From: Will Hackett Subject: Re: Running late Message: Sorry i meant john curry

email_send(
{"to":"john.curry@me.com","subject":"Re: Running late","body":"Hi John,\n\nJust letting you know that Will is running late today.\n\nThanks,\nJamie"})
)
success
Jamie
Done
