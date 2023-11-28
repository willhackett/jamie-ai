interface HomePageProps {
  email: string;
}

const HomePage = ({ email }: HomePageProps) => (
  <div>
    <h1>Jamie AI</h1>
    <p>Please login to proceed.</p>
    <p>
      <a href="/authorize">Login with OIDC</a>
    </p>
  </div>
);

export { HomePage };
