import type { FC } from 'hono/jsx';

interface GoogleCalendarViewProps {
  connected: boolean;
  calendarList: { id: string; name: string }[];
  selectedCalendarId?: string;
  email: string;
}

const GoogleCalendarView: FC<GoogleCalendarViewProps> = ({
  connected,
  calendarList,
  selectedCalendarId,
  email,
}) => {
  return (
    <div>
      <h1>Google Calendar</h1>
      {connected ? (
        <>
          <p>Connected to: {email}</p>
          <form method="POST">
            <select name="calendarId" value={selectedCalendarId}>
              {calendarList.map((calendar) => (
                <option value={calendar.id}>{calendar.name}</option>
              ))}
            </select>
            <button name="action" value="update" type="submit">
              Update
            </button>
          </form>
          <form method="POST">
            <button name="action" value="disconnect" type="submit">
              Disconnect
            </button>
          </form>
        </>
      ) : (
        <form method="POST">
          <button name="action" value="connect" type="submit">
            Connect
          </button>
        </form>
      )}
    </div>
  );
};

export { GoogleCalendarView };
