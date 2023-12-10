import { Env } from '@/types';

export interface QueueMessage {
  id: string;
  type: string;
  runAtMs: number;
  message: QueueMessageCron | QueueMessageOpenAiFunction;
  context: string;
  userId: string;
  runAt: Date;
}

interface QueueMessageCron {
  context: string;
}

interface QueueMessageOpenAiFunction {
  function: string;
  args: NodeJS.Dict<string>;
}

class MessageQueue {
  constructor(protected queue: Queue) {}

  public dispatch(message: QueueMessage) {
    return this.queue.send(message);
  }

  public async process(batch: MessageBatch<QueueMessage>) {
    for (const message of batch.messages) {
      switch (message.body.type) {
        case 'cron':
          await this.processCron(message.body);
          break;
        case 'openai':
          await this.processOpenAi(message.body);
          break;
        default:
          throw new Error(`Unknown message type: ${message.body.type}`);
      }
    }
  }

  private async processCron(message: QueueMessage) {}

  private async processOpenAi(message: QueueMessage) {}
}

export { MessageQueue };
