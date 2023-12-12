import { SelectEmailMessage } from '@/model';
import { D1, eq, schema } from '@/service/d1';
import { Env } from '@/types';
import { EmailUtil } from '@/util/email';

interface HandleEmailMessagePayload {
  to: string[];
  from: string;
  cc?: string[];
  bcc?: string[];
  inReplyTo?: string;
  references?: string;
  subject: string;
  messageId: string;
  text?: string;
  html?: string;
  formerMessage?: SelectEmailMessage;
  userId: string;
}

class EmailMessageController {
  static init(message: ForwardableEmailMessage, env: Env) {
    const emailMessage = new EmailMessageController(env);

    return emailMessage.process(message);
  }

  d1: D1;

  constructor(protected env: Env) {
    this.d1 = new D1(env.DB);
  }

  public async process(body: ForwardableEmailMessage) {
    const to = body.headers.get('To');
    const from = body.headers.get('From');
    const cc = body.headers.get('Cc');
    const inReplyTo = body.headers.get('In-Reply-To') ?? undefined;
    const references = body.headers.get('References') ?? undefined;
    const subject = body.headers.get('Subject');
    const messageId = body.headers.get('Message-ID');

    if (!subject || !messageId || !from || !to) {
      return;
    }

    const bodyArrBuff = await body.raw.getReader().read();
    const html = new TextDecoder().decode(bodyArrBuff.value);

    const dom = EmailUtil.getBody(html);
    const text = EmailUtil.getPlainTextFromBody(dom);

    const message = {
      to: EmailUtil.recipientListToArray(to),
      from,
      cc: cc ? EmailUtil.recipientListToArray(cc) : undefined,
      inReplyTo,
      references,
      subject,
      messageId,
      text,
      html,
    };

    if (inReplyTo) {
      const formerMessage = await this.checkForReply(inReplyTo);

      if (formerMessage) {
        return this.handleReply({
          ...message,
          formerMessage,
          userId: formerMessage.userId,
        });
      }
    }

    const user = await this.checkIfFromUser(from);

    if (user) {
      return this.handleNewMessage({ ...message, userId: user.id });
    }

    // Do nothing
  }

  private async saveNewMessage(payload: HandleEmailMessagePayload) {
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

  private async handleReply(payload: HandleEmailMessagePayload) {}

  private async handleNewMessage(payload: HandleEmailMessagePayload) {
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
        userId: '',
      })
      .returning({ id: schema.emailMessage.id })
      .get();
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
