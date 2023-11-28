class OpenAi {
  constructor(private readonly apiKey: string) {}

  async createCompletion(params: { prompt: string; max_tokens: number }) {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(params),
    });

    return response;
  }
}
