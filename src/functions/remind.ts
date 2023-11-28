export const functionConfiguration = {
  type: 'function',
  function: {
    name: 'remind',
    description: "Creates a reminder in the user's calendar",
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
