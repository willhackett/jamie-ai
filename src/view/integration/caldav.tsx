import type { FC } from 'hono/jsx';
import { Layout } from '../layout';
import { CalDavIntegration } from '@/integration';

interface CalDavViewProps {
  integration: CalDavIntegration;
}

const CalDavView: FC<CalDavViewProps> = async ({ integration }) => {
  return (
    <Layout>
      <div>
        <h1>CalDav</h1>
        <p>
          <a href="/integration/list">Back</a>
        </p>
        {connected ? (
          <>
            <p>Connected to: {email}</p>
            <form method="POST">
              <select name="calendarId" value={selectedCalendarId}>
                {calendarList.map((calendar) => (
                  <option value={calendar.id}>{calendar.name}</option>
                ))}
              </select>

              <label htmlFor="email">Email</label>
              <input name="email" type="email" value={email} />
              <label htmlFor="password">App-specific Password</label>
              <input name="password" type="password" />
              <small>Only provide the password if you wish to update it.</small>

              <button name="action" value="update" type="submit">
                Update
              </button>
            </form>
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
              />
            </div>
            <div className="mb-3">
              <label for="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                class="form-control"
                autocomplete="off"
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
                value="connect"
                type="submit"
                class="btn btn-primary"
              >
                Connect
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export { ICloudCalendarView };
