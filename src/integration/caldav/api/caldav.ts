interface CalendarList {
  _links: {
    self: {
      href: string;
    };
    'dav:home': {
      href: string;
    };
    'dav:calendar': {
      href: string;
    };
  };
  _embedded: {
    'dav:calendar': Calendar[];
  };
}

class CalDavApi {
  constructor(
    protected hostname: string,
    protected username: string,
    protected password: string
  ) {}

  public async getUserPrincipal(): Promise<string> {
    const url = `https://${this.hostname}/`;

    const response = await fetch(url, {
      method: 'PROPFIND',
      headers: {
        Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
        'Content-Type': 'text/xml',
      },
    });
  }

  public async getCalendars(): Promise<any> {
    const { hostname, username, password } = this;
    const url = `https://${hostname}/calendars/${username}/`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });
    return response.json();
  }

  public async getEvents(calendarId: string): Promise<any> {
    const { hostname, username, password } = this;
    const url = `https://${hostname}/calendars/${username}/${calendarId}/`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });
    return response.json();
  }

  public async createEvent(calendarId: string, event: any): Promise<any> {
    const { hostname, username, password } = this;
    const url = `https://${hostname}/calendars/${username}/${calendarId}/`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        'Content-Type': 'text/calendar',
      },
      body: event,
    });
    return response.json();
  }

  protected getHeaders() {
    const headers = new Headers();

    headers.append(
      'Authorization',
      `Basic ${btoa(`${this.username}:${this.password}`)}`
    );
    headers.append('Content-Type', 'text/calendar');

    return headers;
  }
}
