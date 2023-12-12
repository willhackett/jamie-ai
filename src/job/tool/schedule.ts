import type { AssistantCreateParams } from 'openai/resources/beta/assistants';

export const functionConfiguration: AssistantCreateParams.AssistantToolsFunction =
  {
    type: 'function',
    function: {
      name: 'schedule',
      description: "Schedule a reminder to awake the user's assistant",
      parameters: {
        type: 'object',
        properties: {
          datetime: {
            type: 'string',
            description: 'The datetime in ISO 8601 format',
          },
        },
        required: [],
      },
    },
  };

class ScheduleTool {
  public static name = 'schedule';

  public static config = functionConfiguration;

  constructor() {}

  public async run(args: any[]) {}
}

export { ScheduleTool };
