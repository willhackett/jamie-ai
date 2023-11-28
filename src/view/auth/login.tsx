import type { FC } from 'hono/jsx';

const Login: FC = () => {
  return (
    <div>
      <h1>Login</h1>
      <a href="/auth/authorize">Login with OIDC</a>
    </div>
  );
};

export { Login };
