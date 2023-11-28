# Jamie AI

Jamie is my email-based personal assistant. It's a simple Cloudflare Worker application that makes use of GPT-4 & Postmark to provide a conversational interface to my email.

Jamie can be used to:

- Schedule meetings at times that work for everyone
- Add reminders to my calendar
- Check in to ensure I'm on track with my goals
- And more! (eventually)

Jamie can be shared with the whole team & includes security features to ensure that only specific requests are processed from trusted senders.

## Developing

To run the application locally, you'll need to create a `.env` file with the following variables:

```
POSTMARK_API_KEY=
POSTMARK_SENDER_SIGNATURE=
POSTMARK_SENDER_EMAIL=

OPENAI_API_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

To run the application locally, you'll need to install the dependencies & run the development server:

```
npm install
npm run dev
```

## Deploying

```
npm run deploy
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

If you'd like to become a contributor, please reach out to me at [jamie-project@willhackett.com](mailto:jamie-project@willhackett.com).

## License

[MIT](https://choosealicense.com/licenses/mit/)
