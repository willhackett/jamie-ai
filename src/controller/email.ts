import { D1, eq, schema } from '@/service/d1';
import { Env } from '@/types';

interface EmailMessageBody {
  to: string;
  from: string;
  headers: Headers;
  raw: ReadableStream;
}

class Email {
  d1: D1;

  constructor(protected env: Env) {
    this.d1 = new D1(env.DB);
  }

  public async process(body: EmailMessageBody) {
    const inReplyTo = body.headers.get('In-Reply-To');
    const references = body.headers.get('References');
    const subject = body.headers.get('Subject');
    const messageId = body.headers.get('Message-ID');

    if (inReplyTo) {
      const formerMessage = await this.checkForReply(inReplyTo);

      if (formerMessage) {
        return this.handleReply();
      }
    }

    return this.handleNewMessage();
  }

  private async handleReply() {}

  private async handleNewMessage() {}

  private async checkForReply(messageId: string) {
    const message = await this.d1.db.query.emailMessage.findFirst({
      where: eq(schema.emailMessage.messageId, messageId),
    });

    return message;
  }

  private async checkIfFromUser(from: string) {
    const email = from.split('<')[1].split('>')[0];

    const user = await this.d1.db.query.user.findFirst({
      where: eq(schema.user.email, email),
    });

    return user;
  }
}

export { Email };
