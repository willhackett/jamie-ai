import { Hono } from 'hono';

import { Login } from '@/controller/fetch/view/auth/login';
import { OAuthOIDC } from '@/controller/fetch/service/oauth-oidc';
import { IdCookie } from '@/controller/fetch/service/id-cookie';
import type { Env } from '@/types';

const route = new Hono<{ Bindings: Env }>();

route.get('/login', async (c) => {
  const idCookie = new IdCookie(c);

  const id = await idCookie.getId();

  if (id) {
    return c.redirect('/integration/list');
  }

  return c.html(<Login />);
});

route.get('/logout', (c) => {
  const idCookie = new IdCookie(c);

  idCookie.clearId();

  return c.redirect('/');
});

route.get('/authorize', (c) => {
  const openIdConnect = new OAuthOIDC(c);

  return openIdConnect.authorize();
});

route.get('/callback', async (c) => {
  const openIdConnect = new OAuthOIDC(c);

  return openIdConnect.callback();
});

export { route };
