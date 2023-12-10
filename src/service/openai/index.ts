import { Configuration, OpenAIApi } from 'openai';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { Env } from '@/types';

class OpenAI {
  private api: OpenAIApi;

  constructor(protected env: Env) {
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
