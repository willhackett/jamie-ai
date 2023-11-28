class GoogleCalendarAuth {
  constructor(
    protected clientId: string,
    protected clientSecret: string,
    protected redirectUri: string
  ) {}

  /**
   * Create redirect URL for authenticating with Google Calendar
   *
   * @returns URL to redirect to for authentication
   */
  public getAuthUrl() {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.redirectUri);
    url.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('prompt', 'consent');

    return url.toString();
  }

  /**
   * Exchange code for access token
   *
   * @param code
   * @returns token response
   */
  public async getAccessToken(code: string) {
    const url = new URL('https://oauth2.googleapis.com/token');
    url.searchParams.set('code', code);
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('client_secret', this.clientSecret);
    url.searchParams.set('redirect_uri', this.redirectUri);
    url.searchParams.set('grant_type', 'authorization_code');

    const response = await fetch(url.toString(), {
      method: 'POST',
    });

    return response.json();
  }

  /**
   * Refresh access token
   *
   * @param refreshToken The user's refresh token
   * @returns token response
   */
  public async refreshAccessToken(refreshToken: string) {
    const url = new URL('https://oauth2.googleapis.com/token');
    url.searchParams.set('refresh_token', refreshToken);
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('client_secret', this.clientSecret);
    url.searchParams.set('grant_type', 'refresh_token');

    const response = await fetch(url.toString(), {
      method: 'POST',
    });

    return response.json();
  }
}
