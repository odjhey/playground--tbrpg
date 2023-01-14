import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

type TProps = { onSuccess: () => void };
export default ({ onSuccess }: TProps) => {
  const formMethods = useForm();
  const atk = trpc.participants.act.useMutation();

  return (
    <form
      onSubmit={formMethods.handleSubmit(async (data) => {
        await atk.mutateAsync({ name: data.name });
        onSuccess();
      })}
    >
      <div className="flex gap-1 items-center">
        <input
          {...formMethods.register("name", { required: false, value: "atk" })}
          className="input input-secondary input-sm"
        ></input>
        <button type="submit" className="btn btn-sm">
          Atk
        </button>

        {atk.isLoading ? <p>Loading</p> : null}
        {atk.isError ? <p>Error</p> : null}
        {atk.isSuccess ? <pre>{JSON.stringify(atk.data)}</pre> : null}
      </div>
    </form>
  );
};
