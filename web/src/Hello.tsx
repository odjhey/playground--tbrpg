import { trpc } from "./utils/trpc";

export function Hello() {
  const greeting = trpc.api.hello.useQuery();
  return (
    <div>
      <p>{greeting.data?.text}</p>
    </div>
  );
}

export default Hello;
