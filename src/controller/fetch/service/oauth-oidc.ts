import { Context } from 'hono';
import { Env } from '@/types';
import { createId } from '@paralleldrive/cuid2';
import { getSignedCookie, setSignedCookie } from 'hono/cookie';
import { IdCookie } from '@/controller/fetch/service/id-cookie';
import { JSONWebKeySet, createLocalJWKSet, jwtVerify } from 'jose';
import { UserModel } from '@/model';
import { D1 } from '@/service/d1';

class OAuthOIDC {
  protected clientId: string;
  protected clientSecret: string;
  protected issuerHostname: string;
  protected redirectUri: string;
  protected userModel: UserModel;

  constructor(protected c: Context<{ Bindings: Env }>) {
    this.clientId = c.env.OAUTH_CLIENT_ID;
    this.clientSecret = c.env.OAUTH_CLIENT_SECRET;
    this.issuerHostname = c.env.OAUTH_ISSUER_HOSTNAME;
    this.redirectUri = c.env.OAUTH_REDIRECT_URI;

    const d1 = new D1(c.env.DB);
    this.userModel = new UserModel(d1);
  }

  public async authorize() {
    const state = createId();
    const metadata = await this.getIdPMetadata();

    if (!metadata) {
      return this.c.redirect('/auth/login?error=invalid_metadata');
    }

    await setSignedCookie(this.c, 'state', state, this.c.env.COOKIE_SECRET);

    const url = new URL(metadata.authorization_endpoint);

    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid email');
    url.searchParams.set('redirect_uri', this.redirectUri);
    url.searchParams.set('state', state);

    return this.c.redirect(url.toString());
  }

  public async callback() {
    const error = this.c.req.query('error');

    if (error) {
      return this.c.text(`Error: ${error}`);
    }

    const state = await getSignedCookie(
      this.c,
      this.c.env.COOKIE_SECRET,
      'state'
    );

    if (!state) {
      return this.c.text('invalid_state');
    }

    const code = this.c.req.query('code');

    if (!code) {
      return this.c.redirect('/auth/login?error=missing_code');
    }

    const idToken = await this.getToken(code);

    if (!idToken) {
      return this.c.redirect('/auth/login?error=missing_id_token');
    }

    const user = await this.getUser(idToken);

    if (!user) {
      return this.c.redirect('/auth/login?error=invalid_user');
    }

    const idCookie = new IdCookie(this.c);

    await idCookie.setId(user.id);

    return this.c.redirect('/integration/list');
  }

  public async getToken(code: string) {
    const metadata = await this.getIdPMetadata();

    if (!metadata) {
      return null;
    }

    const formData = new URLSearchParams();

    formData.set('grant_type', 'authorization_code');
    formData.set('redirect_uri', this.redirectUri);
    formData.set('code', code);

    const headers = new Headers();

    headers.set(
      'Authorization',
      `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
    );
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers.set('Accept', 'application/json');

    const response = await fetch(metadata.token_endpoint, {
      method: 'POST',
      body: formData.toString(),
      headers,
    });

    if (!response.ok) {
      const json = await response.json();
      this.c.json(
        {
          error: 'invalid_token_response',
          json,
        },
        { status: 500 }
      );
      return null;
    }

    const json = (await response.json()) as {
      id_token: string;
    };

    if (!json.id_token) {
      this.c.json(
        {
          error: 'invalid_token_response',
          json,
        },
        { status: 500 }
      );
    }

    return json.id_token;
  }

  public async getUser(token: string) {
    const metadata = await this.getIdPMetadata();

    if (!metadata) {
      return null;
    }

    try {
      const jwksResponse = await fetch(metadata.jwks_uri);
      const jwks = (await jwksResponse.json()) as JSONWebKeySet;
      const JWKS = createLocalJWKSet(jwks);

      const result = await jwtVerify<{ email: string; sub: string }>(
        token,
        JWKS,
        {
          requiredClaims: ['sub', 'email'],
        }
      );

      if (!result.payload.sub) {
        return null;
      }

      const existingUser = await this.userModel.getUserById(result.payload.sub);

      if (existingUser) {
        return {
          id: existingUser.id,
          email: result.payload.email,
        };
      }

      await this.userModel.createUser(result.payload.sub, result.payload.email);

      return {
        id: result.payload.sub,
        email: result.payload.email,
      };
    } catch (err) {
      console.error({ err: (err as Error).message });
      return null;
    }
  }

  private async getIdPMetadata() {
    const response = await fetch(
      `https://${this.issuerHostname}/.well-known/openid-configuration`
    );

    if (!response.ok) {
      console.error({ err: response.statusText });
      return null;
    }

    const json = (await response.json()) as {
      authorization_endpoint: string;
      token_endpoint: string;
      issuer: string;
      jwks_uri: string;
    };

    return json;
  }
}

export { OAuthOIDC };
