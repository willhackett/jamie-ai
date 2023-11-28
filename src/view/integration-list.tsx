import type { FC } from 'hono/jsx';

import { integrationList } from '@/integration/list';

interface IntegrationListProps {
  integrations: IntegrationListItemProps[];
}

const IntegrationList: FC<IntegrationListProps> = ({ integrations }) => {
  return (
    <div>
      <h1>Integration List</h1>

      <ul>
        {Array.from(integrationList).map(([integrationId, integration]) => (
          <IntegrationListItem
            id={integrationId}
            name={integration.name}
            description={integration.description}
            connected={false}
          />
        ))}
      </ul>
    </div>
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
