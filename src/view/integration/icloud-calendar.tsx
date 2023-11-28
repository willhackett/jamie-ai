import type { FC } from 'hono/jsx';

interface ICloudCalendarViewProps {
  connected: boolean;
  calendarList: { id: string; name: string }[];
  selectedCalendarId?: string;
  email: string;
}

const ICloudCalendarView: FC<ICloudCalendarViewProps> = ({
  connected,
  calendarList,
  selectedCalendarId,
  email,
}) => {
  return (
    <div>
      <h1>iCloud Calendar</h1>
      {connected ? (
        <>
          <p>Connected to: {email}</p>
          <form method="POST">
            <select name="calendarId" value={selectedCalendarId}>
              {calendarList.map((calendar) => (
                <option value={calendar.id}>{calendar.name}</option>
              ))}
            </select>

            <label for="email">Email</label>
            <input name="email" type="email" value={email} />
            <label for="password">App-specific Password</label>
            <input name="password" type="password" />
            <small>Only provide the password if you wish to update it.</small>

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
          <label for="email">Email</label>
          <input name="email" type="email" />
          <label for="password">App-specific Password</label>
          <input name="password" type="password" />
          <button name="action" value="connect" type="submit">
            Connect
          </button>
        </form>
      )}
    </div>
  );
};

export { ICloudCalendarView };
