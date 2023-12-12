import { CalendarList, type EventParams } from './types';

export class GoogleCalendarApi {
  constructor(protected accessToken: string) {}

  /**
   * Retrieve a list of the user's calendars
   *
   * @returns
   */
  public async getCalendars() {
    const url = new URL(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList'
    );
    const headers = new Headers();

    headers.append('Authorization', `Bearer ${this.accessToken}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    return response.json() as Promise<CalendarList>;
  }

  /**
   * Create a new event in Google Calendar
   *
   * @param params
   * @returns
   */
  public async createEvent(calendarId: string, params: EventParams) {
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`
    );

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.accessToken}`);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    return response.json();
  }

  /**
   * Update an event in Google Calendar
   *
   * @param params
   * @returns
   */

  public async updateEvent(
    calendarId: string,
    eventId: string,
    params: EventParams
  ) {
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`
    );
    const headers = new Headers();

    headers.append('Authorization', `Bearer ${this.accessToken}`);

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers,
      body: JSON.stringify(params),
    });

    return response.json();
  }

  /**
   * Delete an event in Google Calendar
   *
   * @param params
   * @returns
   */

  public async deleteEvent(calendarId: string, eventId: string) {
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`
    );
    const headers = new Headers();

    headers.append('Authorization', `Bearer ${this.accessToken}`);

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers,
    });

    return response.json();
  }
}
