import { Hono } from 'hono';

import { IntegrationList } from '../view/integration-list';
import { GoogleCalendarView } from '../view/integration/google-calendar';
import { ICloudCalendarView } from '../view/integration/icloud-calendar';

const route = new Hono();

route.get('/list', async (c) => {
  const integrations = [];

  return c.html(<IntegrationList integrations={integrations} />);
});

route.get('/:integrationId/authorize', (c) => {
  return c.text('not implemented');
});

route.get('/:integrationId/callback', (c) => {
  return c.text('not implemented');
});

route.post('/:integrationId', async (c) => {
  const integrationId = c.req.param('integrationId');
  const formData = await c.req.formData();

  const action = formData.get('action');

  if (!action) {
    return c.text('No action specified', {
      status: 400,
    });
  }

  switch (action) {
    case 'connect':
      break;
    case 'disconnect':
      break;
    case 'update':
      break;
  }

  return c.text('not implemented');
});

route.get('/:integrationId', async (c) => {
  const integrationId = c.req.param('integrationId');

  switch (integrationId) {
    case 'google-calendar':
      return c.html(
        <GoogleCalendarView
          connected={false}
          calendarList={[]}
          email=""
          selectedCalendarId=""
        />
      );
    case 'icloud-calendar':
      return c.html(
        <ICloudCalendarView
          connected={false}
          calendarList={[]}
          email=""
          selectedCalendarId=""
        />
      );
  }
});

export { route };
