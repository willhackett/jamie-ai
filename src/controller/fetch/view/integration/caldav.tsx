import type { FC } from 'hono/jsx';
import { Layout } from '../layout';
import { CalDavIntegration } from '@/integration';

interface CalDavViewProps {
  integration: CalDavIntegration;
}

const CalDavView: FC<CalDavViewProps> = async ({ integration }) => {
  const calendarList = await integration.getCalendarList();
  const config = await integration.getPublicConfig();

  const connected = !!config;

  console.log(config);

  return (
    <Layout>
      <div>
        <h1>CalDav</h1>
        <p>
          <a href="/integration/list">Back</a>
        </p>
        {connected ? (
          <>
            <CalDavDetailForm action="connect" {...config} />
            <form method="POST">
              <button
                name="action"
                value="disconnect"
                type="submit"
                class="btn btn-danger"
              >
                Disconnect
              </button>
            </form>
          </>
        ) : (
          <CalDavDetailForm action="connect" />
        )}
      </div>
    </Layout>
  );
};

interface CalDavDetailFormProps {
  username?: string;
  hostname?: string;
  action: 'connect' | 'update';
}

const CalDavDetailForm: FC<CalDavDetailFormProps> = ({
  username,
  hostname,
  action,
}) => (
  <form method="POST">
    <div class="mb-3">
      <label for="hostname" className="form-label">
        Hostname
      </label>
      <input
        id="hostname"
        name="hostname"
        type="text"
        class="form-control"
        value={hostname}
      />
    </div>
    <div className="mb-3">
      <label for="username" className="form-label">
        Email
      </label>
      <input
        id="username"
        name="username"
        type="text"
        class="form-control"
        autocomplete="off"
        value={username}
      />
    </div>
    <div className="mb-3">
      <label for="password" className="form-label">
        App-specific Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autocomplete="off"
        class="form-control"
      />
      <div id="emailHelp" class="form-text">
        This will be stored encrypted.
      </div>
    </div>
    <div>
      <button
        name="action"
        value={action}
        type="submit"
        class="btn btn-primary"
      >
        {action === 'connect' ? 'Connect' : 'Update'}
      </button>
    </div>
  </form>
);

export { CalDavView };
