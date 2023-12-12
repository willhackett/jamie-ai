import { Layout } from './layout';

interface HomePageProps {
  email: string;
}

const HomePage = ({ email }: HomePageProps) => (
  <Layout>
    <div>
      <h1>Jamie AI</h1>
      <p>Please login to proceed.</p>
      <p>
        <a href="/authorize">Login with OIDC</a>
      </p>
    </div>
  </Layout>
);

export { HomePage };
