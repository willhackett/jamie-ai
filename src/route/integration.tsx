import { Hono } from 'hono';

import { IntegrationList } from '../view/integration-list';
import { GoogleCalendarView } from '../view/integration/google-calendar';
import { ICloudCalendarView } from '../view/integration/caldav';

import * as integrations from '@/integration';

const route = new Hono();

const integrationEntries = Object.entries(integrations);

route.get('/list', async (c) => {
  const integrationList = integrationEntries.map(
    ([, Integration]) => new Integration(c)
  );

  return c.html(<IntegrationList integrations={integrationList} />);
});

route.get('/:integrationId/authorize', (c) => {
  return c.text('not implemented');
});

route.get('/:integrationId/callback', (c) => {
  const integrationId = c.req.param('integrationId');

  const integrationList = integrationEntries.map(
    ([, Integration]) => new Integration(c)
  );

  const integration = integrationList.find(
    (integration) => integration.id === integrationId
  );

  if (!integration) {
    return c.text('Not Found', { status: 404 });
  }

  const url = new URL(c.req.url);

  return integration.callback(url.searchParams);
});

route.post('/:integrationId', async (c) => {
  const integrationId = c.req.param('integrationId');

  const integrationList = integrationEntries.map(
    ([, Integration]) => new Integration(c)
  );

  const integration = integrationList.find(
    (integration) => integration.id === integrationId
  );

  if (!integration) {
    return c.text('Not Found', { status: 404 });
  }

  const formData = await c.req.formData();

  const action = formData.get('action');

  switch (action) {
    case 'connect':
      return integration.connect(formData);
    case 'disconnect':
      return integration.disconnect();
    default:
      return c.text('Not Found', { status: 404 });
  }
});

route.get('/:integrationId', async (c) => {
  const integrationId = c.req.param('integrationId');

  const integrationList = integrationEntries.map(
    ([, Integration]) => new Integration(c)
  );

  const integration = integrationList.find(
    (integration) => integration.id === integrationId
  );

  if (!integration) {
    return c.text('Not Found', { status: 404 });
  }

  switch (integration.id) {
    case 'google-calendar':
      return c.html(
        <GoogleCalendarView
          integration={integration as integrations.GoogleCalendarIntegration}
        />
      );
    case 'caldav':
      return c.html(
        <ICloudCalendarView
          integration={integration as integrations.CalDavIntegration}
        />
      );
    default:
      return c.text('Not Found', { status: 404 });
  }
});

export { route };
