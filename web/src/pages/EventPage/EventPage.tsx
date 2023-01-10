import { trpc } from "../../utils/trpc";
import EventForm from "../../components/EventForm";
import EventList from "../../components/EventList";

export const EventPage = () => {
  const messages = trpc.messages.list.useQuery();

  return (
    <div className="flex flex-col gap-1">
      <EventForm
        onSuccess={() => {
          messages.refetch();
        }}
      ></EventForm>
      <EventList messages={messages.data?.list || ([] as string[])}></EventList>
    </div>
  );
};

export default EventPage;
