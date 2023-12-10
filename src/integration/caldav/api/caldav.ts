import { xml } from '@/util/xml';
import { XMLParser } from 'fast-xml-parser';
import iCal, { CalendarComponent } from 'ical';

interface CalendarEvent {
  uid: string;
  summary: string;
  from: Date;
  to: Date;
  attendees: { name: string; email: string }[];
}

interface CalendarDetail {
  href: string;
  summary: string;
}

class CalDavApi {
  parser: XMLParser;
  userPrincipal?: string;

  constructor(
    protected hostname: string,
    protected username: string,
    protected password: string
  ) {
    this.parser = new XMLParser({
      ignoreAttributes: true,
    });
  }

  public async getUserPrincipal(): Promise<string> {
    const url = `https://${this.hostname}/`;

    const requestBody = xml`
      <propfind xmlns="DAV:">
        <prop>
          <current-user-principal/>	
        </prop>
      </propfind>
    `;

    const response = await fetch(url, {
      method: 'PROPFIND',
      headers: this.getHeaders(),
      body: requestBody,
    });

    const responseBody = await response.text();
    const parsed = this.parser.parse(responseBody);

    try {
      console.log('Parsed', parsed);
      const currentUserHref =
        parsed.multistatus.response.propstat.prop['current-user-principal']
          .href;

      return currentUserHref;
    } catch {
      throw new Error('Could not find current user principal');
    }
  }

  public async getCalendarHomeSet(): Promise<string> {
    if (!this.userPrincipal) {
      this.userPrincipal = await this.getUserPrincipal();
    }

    const url = `https://${this.hostname}${this.userPrincipal}`;

    const requestBody = xml`
      <propfind xmlns="DAV:" xmlns:cd='urn:ietf:params:xml:ns:caldav'>
        <prop>
          <cd:calendar-home-set />
        </prop>
      </propfind>
    `;

    const response = await fetch(url, {
      method: 'PROPFIND',
      headers: this.getHeaders(),
      body: requestBody,
    });

    const responseBody = await response.text();
    const parsed = this.parser.parse(responseBody);

    try {
      const calendarHomeSet =
        parsed.multistatus.response.propstat.prop['calendar-home-set'].href;

      return calendarHomeSet;
    } catch {
      console.error('could not get calendar set');
      throw new Error('Could not find calendar home set');
    }
  }

  public async getCalendarList(): Promise<CalendarDetail[]> {
    const calendarHomeSet = await this.getCalendarHomeSet();

    const requestBody = xml`
      <propfind xmlns="DAV:">
        <prop>
          <displayname/>
          <resourcetype/>
        </prop>
      </propfind>
    `;

    const response = await fetch(calendarHomeSet, {
      method: 'PROPFIND',
      headers: this.getHeaders({ depth: 1 }),
      body: requestBody,
    });

    const responseBody = await response.text();
    const parsed = this.parser.parse(responseBody);

    console.log(JSON.stringify(parsed));

    try {
      const calendars: CalendarDetail[] = [];

      for (const response of parsed.multistatus.response) {
        const href = response.href;
        const displayName = response?.propstat?.prop?.displayname;
        const resourceType = response?.propstat?.prop?.resourcetype;

        if (resourceType?.calendar) {
          calendars.push({
            href,
            summary: displayName,
          });
        }
      }

      return calendars;
    } catch {
      throw new Error('Could not get calendar list');
    }
  }

  public async getEventsInRange(
    calendarHomeSet: string,
    from: Date,
    to: Date
  ): Promise<any> {
    const url = `https://${this.hostname}${calendarHomeSet}`;

    const requestBody = xml`
      <c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
        <d:prop>
          <c:calendar-data />
        </d:prop>
        <c:filter>
          <c:comp-filter name="VCALENDAR">
            <c:comp-filter name="VEVENT">
              <c:time-range start="${this.formatDate(
                from
              )}" end="${this.formatDate(to)}" />
            </c:comp-filter>
          </c:comp-filter>
        </c:filter>
      </c:calendar-query>
    `;

    const response = await fetch(url, {
      method: 'REPORT',
      headers: this.getHeaders({ depth: 1 }),
      body: requestBody,
    });

    const responseBody = await response.text();
    const parsed = this.parser.parse(responseBody);

    try {
      const calendarData =
        parsed.multistatus.response.propstat.prop['calendar-data'];
    } catch {
      throw new Error('Could not find events');
    }
  }

  public async getCalendars(): Promise<any> {
    if (!this.userPrincipal) {
      this.userPrincipal = await this.getUserPrincipal();
    }
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
        'Content-Type': 'text/xml',
      },
      body: event,
    });
    return response.json();
  }

  protected getHeaders({ depth = 0 } = {}) {
    const headers = new Headers();

    headers.append(
      'Authorization',
      `Basic ${btoa(`${this.username}:${this.password}`)}`
    );
    headers.append('Content-Type', 'text/plain; charset=utf-8');

    if (depth) {
      headers.append('Depth', `${depth}`);
    }

    return headers;
  }

  protected formatDate(date: Date): string {
    return date.toISOString().replace(/[-:.]+/g, '');
  }

  protected parseCalendarData(calendarData: string): CalendarEvent[] {
    const parsed = iCal.parseICS(calendarData);
    const events = Object.entries(parsed) as [string, CalendarComponent][];
    return events.map(([uid, event]) => {
      return {
        uid: uid,
        summary: event.summary,
        from: event.start,
        to: event.end,
      } as CalendarEvent;
    });
  }
}

export { CalDavApi };
