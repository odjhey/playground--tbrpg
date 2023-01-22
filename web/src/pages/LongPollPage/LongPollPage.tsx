import { trpc } from "../../utils/trpc";

export const AboutPage = () => {
  const q = trpc.longPoll.ping.useQuery();

  return (
    <div>
      <h1>Long poll</h1>
      <pre>{JSON.stringify(q.isLoading)}</pre>
      <pre>{JSON.stringify(q.data)}</pre>
    </div>
  );
};

export default AboutPage;
