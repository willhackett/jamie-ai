import { RunSubmitToolOutputsParams } from 'openai/resources/beta/threads/runs/runs';
import type { OpenAiClient } from './client';

class OpenAiThread {
  constructor(
    protected client: OpenAiClient,
    protected threadId: string,
    protected assistantId: string
  ) {}

  public async createRun() {
    const response = await this.client.api.beta.threads.runs.create(
      this.threadId,
      {
        assistant_id: this.assistantId,
      }
    );

    return response;
  }

  public async getRun(runId: string) {
    const response = await this.client.api.beta.threads.runs.retrieve(
      this.threadId,
      runId
    );

    return response;
  }

  public async createMessage(message: string) {
    const response = await this.client.api.beta.threads.messages.create(
      this.threadId,
      {
        content: message,
        role: 'user',
      }
    );

    return response;
  }

  public async submitToolOutputs(
    runId: string,
    outputs: RunSubmitToolOutputsParams
  ) {
    const response = await this.client.api.beta.threads.runs.submitToolOutputs(
      this.threadId,
      runId,
      outputs
    );

    return response;
  }
}

export { OpenAiThread };
