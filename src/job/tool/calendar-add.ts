import { D1 } from '@/service/d1';
import type { AssistantCreateParams } from 'openai/resources/beta/assistants';

const functionConfiguration: AssistantCreateParams.AssistantToolsFunction = {
  type: 'function',
  function: {
    name: 'calendar_add',
    description: "Creates a meeting in the user's calendar",
    parameters: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
          description: 'The datetime in ISO 8601 format',
        },
        to: {
          type: 'string',
          description: 'The datetime in ISO 8601 format',
        },
        is_all_day: {
          type: 'boolean',
          description: 'Whether the meeting is all day',
        },
        location: {
          type: 'string',
          description: 'The location of the meeting',
        },
        description: {
          type: 'string',
          description: 'The description of the meeting',
        },
        title: {
          type: 'string',
          description: 'The title of the meeting',
        },
        attendees: {
          type: 'array',
          items: {
            type: 'string',
            description: 'The attendees of the meeting',
          },
        },
      },
      required: ['from', 'to', 'is_all_day', 'title'],
    },
  },
};

export class CalendarAddTool {
  public static name = 'calendar_add';

  public static config = functionConfiguration;

  constructor(protected d1: D1, protected userId: string) {}

  public async run(args: any[]) {}
}
