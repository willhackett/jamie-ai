export interface EventParams {
  summary: string;
  location: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurrence: string[];
  attendees: { email: string }[];
  reminders: {
    useDefault: boolean;
    overrides: { method: string; minutes: number }[];
  };
}
