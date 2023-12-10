import { D1, eq, schema } from '@/service/d1';
import { OpenAI } from '@/service/openai';
import { Env } from '@/types';

class UserContext {
  private d1: D1;
  private openai: OpenAI;

  constructor(protected env: Env) {
    this.d1 = new D1(env.DB);
    this.openai = new OpenAI(env);
  }

  public async getFromEmailAddress(email: string) {
    const user = await this.d1.db.query.user.findFirst({
      where: eq(schema.user.email, email),
    });

    return user;
  }

  public async getFromUserId(id: string) {
    const user = await this.d1.db.query.user.findFirst({
      where: eq(schema.user.id, id),
    });

    return user;
  }

  public async getFromInReplyToId(id: string) {
    const message = await this.d1.db.query.emailMessage.findFirst({
      where: eq(schema.emailMessage.messageId, id),
    });

    if (!message) {
      return null;
    }

    const user = this.d1.db.query.user.findFirst({
      where: eq(schema.user.id, message.userId),
    });

    return user;
  }

  private async generateUserPrompt(user: schema.User | null) {
    if (!user) {
      return null;
    }
  }
}

export { UserContext };
