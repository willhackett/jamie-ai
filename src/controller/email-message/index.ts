import { SelectEmailMessage } from '@/model';
import { D1, eq, schema } from '@/service/d1';
import { Env, PostmarkWebHook } from '@/types';
import { EmailUtil } from '@/util/email';
import { QueueController } from '../queue';

class EmailMessageController {
  d1: D1;
  queueController: QueueController;

  constructor(protected env: Env) {
    this.d1 = new D1(env.DB);
    this.queueController = new QueueController(env.QUEUE, env);
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
      return this.handleNewMessage(user.id, message);
    }

    // If the message is not from a user, we can't do anything with it
  }

  private async saveNewMessage(userId: string, payload: PostmarkWebHook) {
    const inReplyTo = payload.Headers.find((header) => {
      return header.Name === 'In-Reply-To';
    });

    await this.d1.db
      .insert(schema.emailMessage)
      .values({
        to: payload.To,
        inReplyTo: inReplyTo?.Value,
        subject: payload.Subject,
        messageId: payload.MessageID,
        text: payload.StrippedTextReply,
        from: payload.From,
        userId,
      })
      .returning({ id: schema.emailMessage.id })
      .get();
  }

  private async handleReply(
    formerMessage: SelectEmailMessage,
    message: PostmarkWebHook
  ) {
    await this.saveNewMessage(formerMessage.userId, message);

    // send to OpenAI
  }

  private async handleNewMessage(userId: string, payload: PostmarkWebHook) {
    await this.saveNewMessage(userId, payload);

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
