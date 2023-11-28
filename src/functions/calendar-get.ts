export const functionConfiguration = {
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
};
