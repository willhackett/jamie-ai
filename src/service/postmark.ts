class Postmark {
  constructor(private readonly apiKey: string) {}

  async sendEmail(to: string, from: string, subject: string, html: string) {
    const response = await fetch(`https://api.postmarkapp.com/email`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': this.apiKey,
      },
      body: JSON.stringify({
        From: from,
        To: to,
        Subject: subject,
        HtmlBody: html,
      }),
    });

    return response;
  }
}
