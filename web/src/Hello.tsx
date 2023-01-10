import { trpc } from "./utils/trpc";

export function Hello() {
  const greeting = trpc.api.hello.useQuery();

  return <div>{greeting.data?.text}</div>;
}
