import { z } from "zod";
import { component } from "../../game/components";
import { system } from "../../game/system";
import { publicProcedure, router } from "../../trpc/trpc";
import produce from "immer";

const w = system({
  components: {
    parts: component({
      id: "parts",
      effects: {},
      initState: { parts: [] as { name: string }[] },
      signals: {
        add: (p: { name: string }, state) => {
          return produce(state, (draft) => {
            draft.parts.unshift(p);
          });
        },
      },
    }),
  },
  eventsDefinition: {
    add: {
      toSignals: (e: { props: { name: string } }) => {
        return [
          {
            signal: ["add", { name: e.props.name }],
            selector: () => ["parts"],
          },
        ];
      },
    },
  },
});

export const participantsRouter = router({
  list: publicProcedure.query(() => {
    // TODO: have to fix so that render is typed
    console.log("-------", w.render());
    return w.render().parts.parts as { name: string }[];
  }),
  new: publicProcedure
    .input(z.object({ name: z.string().nullish() }).nullish())
    .mutation(({ input }) => {
      if (input?.name) {
        w.send({ event: "add" }, { props: { name: input.name } });
      }

      return "sent";
    }),
});
