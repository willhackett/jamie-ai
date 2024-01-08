import {
  WakeSchedule,
  type WakeScheduleEvent,
} from '@/job/schedule/wake-schedule';
import { InvokeTool, type InvokeToolEvent } from '@/job/tool';
import { D1 } from '@/service/d1';
import { OpenAiClient } from '@/service/openai';
import { Env } from '@/types';

export type QueueControllerEvent = InvokeToolEvent | WakeScheduleEvent;

class QueueController {
  protected openAiClient: OpenAiClient;
  protected d1: D1;
  protected queue: Queue;

  public static init(batch: MessageBatch<QueueControllerEvent>, env: Env) {
    const queue = new QueueController(env);

    return queue.process(batch);
  }

  constructor(protected env: Env) {
    this.openAiClient = new OpenAiClient(env);
    this.d1 = new D1(env.DB);
    this.queue = env.QUEUE;
  }

  public dispatch(message: QueueControllerEvent) {
    return this.queue.send(message);
  }

  public async process(batch: MessageBatch<QueueControllerEvent>) {
    for (const message of batch.messages) {
      switch (message.body.type) {
        case InvokeTool.type: {
          const invokeFunction = new InvokeTool(
            message.body,
            this.openAiClient,
            this.d1
          );

          await invokeFunction.run();
          break;
        }
        case WakeSchedule.type: {
          const wakeSchedule = new WakeSchedule(
            this.d1,
            this.openAiClient,
            message.body.threadId,
            this.env.OPENAI_ASSISTANT_ID,
            message.body.userId
          );
        }
      }
    }
  }
}

export { QueueController };
