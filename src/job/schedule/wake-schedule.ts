import { QueueControllerEvent } from '@/controller/queue';
import { RunModel } from '@/model';
import { D1 } from '@/service/d1';
import { OpenAiClient, OpenAiThread } from '@/service/openai';

export interface WakeScheduleEventBody {
  threadId: string;
  userId: string;
}

export interface WakeScheduleEvent {
  type: 'wake-schedule';
  body: WakeScheduleEventBody;
}
class WakeSchedule {
  public static type = 'wake-schedule';

  protected openAiThread: OpenAiThread;
  protected runModel: RunModel;

  public static parcel(threadId: string, userId: string): QueueControllerEvent {
    return {
      type: 'wake-schedule',
      body: {
        threadId,
        userId,
      },
    };
  }

  constructor(
    protected d1: D1,
    protected openAiClient: OpenAiClient,
    protected threadId: string,
    protected assistantId: string,
    protected userId: string
  ) {
    this.openAiThread = new OpenAiThread(
      this.openAiClient,
      this.threadId,
      this.assistantId
    );
    this.runModel = new RunModel(this.d1);
  }

  public async run() {
    const message = await this.openAiThread.createMessage(
      `It is now ${new Date().toISOString()}`
    );

    if (!message.run_id) {
      return;
    }

    await this.runModel.createRun(this.userId, message.run_id);
  }
}

export { WakeSchedule };
