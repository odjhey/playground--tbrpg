import { z } from "zod";
import { component } from "../../game/components";
import { system } from "../../game/system";
import { publicProcedure, router } from "../../trpc/trpc";
import produce from "immer";

const makeStats = (id: string, values: { hp: number; atk: number }) => {
  return component({
    id: id,
    effects: {},
    initState: values,
    signals: {
      "-hp": (amt: number, s) =>
        produce(s, (d) => {
          d.hp = d.hp - amt;
        }),
    },
  });
};

const w = system({
  components: {
    parts: component({
      id: "parts",
      effects: {},
      initState: {
        parts: [] as { name: string; stats: ReturnType<typeof makeStats> }[],
      },
      signals: {
        add: (p: { name: string }, state) => {
          return produce(state, (draft) => {
            draft.parts.unshift({
              stats: makeStats("std", { atk: 2, hp: 23 }),
              ...p,
            });
          });
        },
        atk: (p: { srcIdx: number; targetIdx: number; dmg: number }, state) => {
          // TODO: add validation that the `p` values is valid, like not outofbounds etc
          state.parts[p.targetIdx].stats.receive("-hp", p.dmg);
          return state;
          // return produce(state, (draft) => {
          //   draft.parts[p.srcIdx].stats.receive("-hp", p.dmg);
          // });
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
    atk: {
      toSignals: (e: { props: { name: string; target: number } }) => {
        return [
          {
            signal: [
              "atk",
              {
                dmg: 2,
                srcIdx: 0,
                targetIdx: e.props.target,
                name: e.props.name,
              },
            ],
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
    return w.render().parts.parts as { name: string; stats: any }[];
  }),

  act: publicProcedure
    .input(
      z.object({
        name: z.enum(["atk"]),
        target: z.number(),
        source: z.string().nullish().nullish(),
      })
    )
    .mutation(({ input }) => {
      if (input?.name) {
        w.send(
          { event: "atk" },
          { props: { name: input.name, target: input.target } }
        );
      }

      return "sent";
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
