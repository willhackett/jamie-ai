import type { FC } from 'hono/jsx';

import { type CoreIntegration } from '@/interface/integration';
import { Layout } from './layout';

interface IntegrationListProps {
  integrations: CoreIntegration[];
}

const IntegrationList: FC<IntegrationListProps> = async ({ integrations }) => {
  const integrationsPromise = await Promise.all(
    integrations.map(async (integration) => {
      return {
        id: integration.id,
        name: integration.name,
        description: integration.description,
        connected: await integration.isConnected(),
      };
    })
  );

  return (
    <Layout>
      <div>
        <h1>Integration List</h1>

        <ul>
          {integrationsPromise.map((integration) => (
            <IntegrationListItem
              id={integration.id}
              name={integration.name}
              description={integration.description}
              connected={integration.connected}
            />
          ))}
        </ul>
      </div>
    </Layout>
  );
};

interface IntegrationListItemProps {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}

const IntegrationListItem: FC<IntegrationListItemProps> = ({
  id,
  name,
  description,
  connected,
}) => {
  return (
    <li>
      <h2>{name}</h2>
      <p>{description}</p>
      <p>{connected ? 'Connected' : 'Not Connected'}</p>
      <p>
        <a href={`/integration/${id}`}>Configure</a>
      </p>
    </li>
  );
};

export { IntegrationList };
