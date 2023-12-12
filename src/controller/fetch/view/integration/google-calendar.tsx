import type { FC } from 'hono/jsx';
import { Layout } from '../layout';
import { GoogleCalendarIntegration } from '@/integration';

interface GoogleCalendarViewProps {
  integration: GoogleCalendarIntegration;
}

const GoogleCalendarView: FC<GoogleCalendarViewProps> = async ({
  integration,
}) => {
  const calendarDetails = await integration.getCalendarDetails();
  const calendarList = await integration.getCalendarList();
  const connected = !!calendarDetails;

  return (
    <Layout>
      <div>
        <h1>Google Calendar</h1>
        <p>
          <a href="/integration/list">Back</a>
        </p>
        {connected ? (
          <>
            <p>Calendar is connected!</p>
            <form method="POST">
              <select name="calendarId">
                {calendarList?.map((calendar) => (
                  <option
                    value={calendar.id}
                    selected={calendarDetails.id === calendar.id}
                  >
                    {calendar.summary}
                  </option>
                ))}
              </select>
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
            <button
              name="action"
              value="connect"
              type="submit"
              class="btn btn-primary"
            >
              Connect
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export { GoogleCalendarView };
