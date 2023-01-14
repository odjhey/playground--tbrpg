import { trpc } from "../../utils/trpc";
import ParticipantsForm from "../../components/ParticipantsForm";
import AtkForm from "../../components/AtkForm";
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
      <AtkForm
        onSuccess={() => {
          participants.refetch();
        }}
      ></AtkForm>
      <ParticipantsList
        participants={(participants.data as any) || []}
      ></ParticipantsList>
    </div>
  );
};

export default ParticipantsPage;
