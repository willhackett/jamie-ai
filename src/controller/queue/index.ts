import { InvokeFunction, InvokeFunctionEvent } from '@/job/tool';
import { D1 } from '@/service/d1';
import { OpenAiClient } from '@/service/openai';
import { Env } from '@/types';

export type QueueControllerEvent = InvokeFunctionEvent;

class QueueController {
  protected openAiClient: OpenAiClient;
  protected d1: D1;

  public static init(batch: MessageBatch<QueueControllerEvent>, env: Env) {
    const queue = new QueueController(env.QUEUE, env);

    return queue.process(batch);
  }

  constructor(protected queue: Queue, protected env: Env) {
    this.openAiClient = new OpenAiClient(env);
    this.d1 = new D1(env.DB);
  }

  public dispatch(message: QueueControllerEvent) {
    return this.queue.send(message);
  }

  public async process(batch: MessageBatch<QueueControllerEvent>) {
    for (const message of batch.messages) {
      switch (message.body.type) {
        case InvokeFunction.type: {
          const invokeFunction = new InvokeFunction(
            message.body,
            this.openAiClient,
            this.d1
          );

          await invokeFunction.run();
          break;
        }
      }
    }
  }
}

export { QueueController };
