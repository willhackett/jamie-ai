import { SelectEmailMessage } from '@/model';
import { D1, eq, schema } from '@/service/d1';
import { Env, PostmarkWebHook } from '@/types';
import { EmailUtil } from '@/util/email';

class EmailMessageController {
  d1: D1;

  constructor(protected env: Env) {
    this.d1 = new D1(env.DB);
  }

  public async process(message: PostmarkWebHook) {
    const inReplyToHeader = message.Headers.find((header) => {
      return header.Name === 'In-Reply-To';
    });
    const from = message.FromFull.Email;

    if (inReplyToHeader) {
      const formerMessage = await this.checkForReply(inReplyToHeader.Value);

      if (formerMessage) {
        return this.handleReply(formerMessage, message);
      }
    }

    const user = await this.checkIfFromUser(from);

    if (user) {
      return this.handleNewMessage({ ...message, userId: user.id });
    }

    // If the message is not from a user, we can't do anything with it
  }

  private async saveNewMessage(payload: PostmarkWebHook) {
    const user = await this.checkIfFromUser(payload.from);

    if (!user) {
      return;
    }

    await this.d1.db
      .insert(schema.emailMessage)
      .values({
        to: payload.to,
        inReplyTo: payload.inReplyTo,
        subject: payload.subject,
        messageId: payload.messageId,
        text: payload.text,
        html: payload.html,
        from: payload.from,
        userId: user.id,
      })
      .returning({ id: schema.emailMessage.id })
      .get();
  }

  private async handleReply(
    formerMessage: SelectEmailMessage,
    message: PostmarkWebHook
  ) {
    await this.saveNewMessage(message);

    // extract the reply portion only

    // send to OpenAI
  }

  private async handleNewMessage(payload: PostmarkWebHook) {
    await this.saveNewMessage(payload);

    // extract the reply portion only

    // send to OpenAI
  }

  private async checkForReply(
    messageId: string
  ): Promise<SelectEmailMessage | undefined> {
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

export { EmailMessageController };
