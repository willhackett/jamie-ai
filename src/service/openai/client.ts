import { OpenAI } from 'openai';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { Env } from '@/types';
import { getPrompt } from './prompt';
import { tools } from '../../job/tool';

class OpenAiClient {
  static MODEL = 'gpt-4-1106-preview';
  static ASSISTANT_NAME = 'Jamie';
  public api: OpenAI;

  constructor(protected env: Env) {
    this.api = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      httpAgent: {
        fetchAdapter,
      },
    });
  }

  public async createThread() {
    const response = await this.api.beta.threads.create();

    return response.id;
  }

  public async createRun(threadId: string) {
    const assistant = await this.getDefaultAssistant();

    const response = await this.api.beta.threads.runs.create(threadId, {
      assistant_id: assistant.id,
    });

    return response;
  }

  public async getRun(threadId: string, runId: string) {
    const response = await this.api.beta.threads.runs.retrieve(threadId, runId);

    return response;
  }

  public async createMessage(threadId: string, message: string) {
    const response = await this.api.beta.threads.messages.create(threadId, {
      content: message,
      role: 'user',
    });

    return response;
  }

  public async getDefaultAssistant() {
    const assistants = await this.api.beta.assistants.list();

    const assistant = assistants.data.find(
      (a) => a.name === OpenAiClient.ASSISTANT_NAME
    );

    if (!assistant) {
      return this.createAssistant();
    }

    return assistant;
  }

  private async createAssistant() {
    const assistant = await this.api.beta.assistants.create({
      name: OpenAiClient.ASSISTANT_NAME,
      model: OpenAiClient.MODEL,
      instructions: getPrompt(),
      tools,
    });

    return assistant;
  }
}

export { OpenAiClient };
