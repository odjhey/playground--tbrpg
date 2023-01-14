import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

type TProps = { onSuccess: () => void };
export default ({ onSuccess }: TProps) => {
  const formMethods = useForm();
  const newMessage = trpc.participants.new.useMutation();

  return (
    <form
      onSubmit={formMethods.handleSubmit(async (data) => {
        await newMessage.mutateAsync({ name: data.name });
        onSuccess();
        formMethods.reset();
      })}
    >
      <div className="flex gap-1 items-center">
        <input
          {...formMethods.register("name", { required: true })}
          className="input input-secondary input-sm"
        ></input>
        <button type="submit" className="btn btn-sm">
          Save
        </button>

        {newMessage.isLoading ? <p>Loading</p> : null}
        {newMessage.isError ? <p>Error</p> : null}
        {newMessage.isSuccess ? (
          <pre>{JSON.stringify(newMessage.data)}</pre>
        ) : null}
      </div>
    </form>
  );
};
