import { trpc } from "../../utils/trpc";
import ParticipantsForm from "../../components/ParticipantsForm";
import ParticipantsList from "../../components/ParticipantsList";

export const ParticipantsPage = () => {
  const participants = trpc.participants.list.useQuery();

  return (
    <div className="flex flex-col gap-1">
      <ParticipantsForm
        onSuccess={() => {
          participants.refetch();
        }}
      ></ParticipantsForm>
      <ParticipantsList
        participants={participants.data?.map((d) => d.name) || ([] as string[])}
      ></ParticipantsList>
    </div>
  );
};

export default ParticipantsPage;
