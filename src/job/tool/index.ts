import type { QueueControllerEvent } from '@/controller/queue';
import { UserModel } from '@/model';
import { D1 } from '@/service/d1';
import { OpenAiClient, OpenAiThread } from '@/service/openai';
import { CalendarAddTool } from './calendar-add';
import { CalendarGetTool } from './calendar-get';
import { EmailSendTool } from './email-send';
import { ScheduleTool } from './schedule';

export const tools = [
  CalendarAddTool.config,
  CalendarGetTool.config,
  EmailSendTool.config,
  ScheduleTool.config,
];

export interface InvokeToolEventBody {
  runId: string;
  threadId: string;
  userId: string;
  functionCalls: {
    name: string;
    args: any[];
  }[];
}

export interface InvokeToolEvent {
  type: 'invoke_tool';
  body: InvokeToolEventBody;
}

export interface InvokeToolEventResult {
  name: string;
}

class InvokeTool {
  public static type = 'invoke_tool';

  protected userModel: UserModel;

  public static parcel(body: InvokeToolEventBody): QueueControllerEvent {
    return {
      type: 'invoke_tool',
      body,
    };
  }

  constructor(
    protected event: InvokeToolEvent,
    protected openAiClient: OpenAiClient,
    protected d1: D1
  ) {
    this.userModel = new UserModel(this.d1);
  }

  public async run() {
    const { runId, threadId, userId } = this.event.body;

    const user = await this.userModel.getUserById(userId);

    if (!user) {
      return;
    }

    const assistant = await this.openAiClient.getDefaultAssistant();

    const thread = new OpenAiThread(this.openAiClient, threadId, assistant.id);

    const results: InvokeToolEventResult[] = [];

    for (const { name, args } of this.event.body.functionCalls) {
      await this.invoke(userId, name, args);

      results.push({ name });
    }

    // Loop over functions here

    // Dispatch functions that need to be called

    // Update the run status by submitting back to the OpenAi endpoint
  }

  private async invoke(userId: string, name: string, args: any[]) {
    switch (tool) {
      case CalendarAddTool.name: {
        const calendarAdd = new CalendarAddTool(this.d1);

        calendarAdd.run(args);
        break;
      }
      case CalendarGetTool.name: {
        const calendarGet = new CalendarGetTool(this.d1);

        calendarGet.run(args);
        break;
      }
      case EmailSendTool.name: {
        const emailSend = new EmailSendTool(this.d1);

        emailSend.run(args);
        break;
      }
      case ScheduleTool.name: {
        const remind = new ScheduleTool(this.d1);

        remind.run(args);
        break;
      }
    }
  }
}

export { InvokeTool };
