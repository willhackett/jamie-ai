import type { AssistantCreateParams } from 'openai/resources/beta/assistants';

export const functionConfiguration: AssistantCreateParams.AssistantToolsFunction =
  {
    type: 'function',
    function: {
      name: 'email_send',
      description: 'Send an email to the supplied recipients',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            description: 'The recipients of the email',
          },
          cc: {
            type: 'string',
            description: 'The cc of the email',
          },
          subject: {
            type: 'string',
            description: 'The subject of the email',
          },
          include_reply: {
            type: 'boolean',
            description:
              'Whether to include the previous messages in the email',
          },
          body: {
            type: 'string',
            description: 'The body of the email (supports HTML)',
          },
        },
        required: ['to', 'subject', 'body'],
      },
    },
  };

class EmailSendTool {
  public static name = 'email_send';

  public static config = functionConfiguration;

  constructor() {}

  public async run(args: any[]) {}
}

export { EmailSendTool };
