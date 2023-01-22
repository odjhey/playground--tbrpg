import { trpc } from "../../utils/trpc";

export const AboutPage = () => {
  const q = trpc.longPoll.ping3.useQuery({ match: "ho12" });

  const match = trpc.longPoll.pong3.useMutation();

  return (
    <div>
      <div>
        <h1>Long poll</h1>
        <pre>{JSON.stringify(q.isLoading)}</pre>
        <pre>{JSON.stringify(q.data)}</pre>
      </div>

      <div>
        <h1>match</h1>
        <button
          className="btn btn-sm"
          onClick={() => {
            match.mutate({ match: "ho12" });
          }}
        >
          match
        </button>
        <pre>{JSON.stringify(match.isLoading)}</pre>
        <pre>{JSON.stringify(match.data)}</pre>
      </div>
    </div>
  );
};

export default AboutPage;
