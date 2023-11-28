import { Configuration, OpenAIApi } from 'openai';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { Context } from 'hono';
import { Env } from '@/index';

class OpenAI {
  private api: OpenAIApi;

  constructor(protected context: Context<{ Bindings: Env }>) {
    const configuration = new Configuration({
      apiKey: context.env.OPENAI_API_KEY,
      baseOptions: {
        adapter: fetchAdapter,
      },
    });

    this.api = new OpenAIApi(configuration);
  }

  public createCompletion(input: string[]) {}
}

export { OpenAI };
