import { QueueController } from '@/controller';
import { RunModel } from '@/model';
import { D1 } from '@/service/d1';
import type { OpenAiClient } from '@/service/openai';
import { OpenAiThread } from '@/service/openai/thread';
import { InvokeFunction } from '../tool';

class CheckRun {
  constructor(
    protected d1: D1,
    protected client: OpenAiClient,
    protected queue: Queue
  ) {}

  public async run() {
    const runModel = new RunModel(this.d1);
    const assistant = await this.client.getDefaultAssistant();

    const runs = await runModel.getIncompleteRuns();

    for (const run of runs) {
      const threadId = run.user.threadId;

      // Skip if the threadId is missing for whatever reason
      if (!threadId) {
        continue;
      }

      const thread = new OpenAiThread(this.client, threadId, assistant.id);

      const threadRun = await thread.getRun(run.id);

      // Skip if the run status is the same
      if (threadRun.status === run.status) {
        continue;
      }

      await runModel.updateRunStatus(run.id, threadRun.status);

      if (threadRun.status === 'requires_action') {
        const queueController = new QueueController(this.queue);

        const functionCalls =
          threadRun.required_action?.submit_tool_outputs.tool_calls.map(
            (toolCall) => ({
              name: toolCall.function.name,
              args: JSON.parse(toolCall.function.arguments),
            })
          );

        if (!functionCalls) {
          continue;
        }

        const message = InvokeFunction.parcel({
          runId: run.id,
          threadId,
          userId: run.userId,
          functionCalls,
        });

        await queueController.dispatch(message);
      }
    }
  }
}

export { CheckRun };
