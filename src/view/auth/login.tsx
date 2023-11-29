import type { FC } from 'hono/jsx';
import { Layout } from '../layout';

const Login: FC = () => {
  return (
    <Layout>
      <div>
        <h1>Login</h1>
        <a href="/auth/authorize">Login with OIDC</a>
      </div>
    </Layout>
  );
};

export { Login };
