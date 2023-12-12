import type { AssistantCreateParams } from 'openai/resources/beta/assistants';

export const functionConfiguration: AssistantCreateParams.AssistantToolsFunction =
  {
    type: 'function',
    function: {
      name: 'calendar_get',
      description: "Retrieve upcoming appointments from the user's calendar",
      parameters: {
        type: 'object',
        properties: {
          from: {
            type: 'string',
            description: 'From date and time',
          },
          to: {
            type: 'string',
            description: 'To date and time',
          },
        },
        required: ['from', 'to'],
      },
    },
  };

class CalendarGetTool {
  public static name = 'calendar_get';

  public static config = functionConfiguration;

  constructor() {}

  public async run(args: any[]) {}
}

export { CalendarGetTool };
