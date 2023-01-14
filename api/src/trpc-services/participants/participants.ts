import { z } from "zod";
import { component } from "../../game/components";
import { system } from "../../game/system";
import { publicProcedure, router } from "../../trpc/trpc";
import produce from "immer";
import * as fs from "fs";
import * as path from "path";

const makeStats = (
  id: string,
  values: { hp: number; atk: number; isAlive: boolean }
) => {
  return component({
    id: id,
    effects: {
      die: [
        (s) => s.hp <= 0,
        (s) =>
          produce(s, (d) => {
            d.isAlive = false;
          }),
      ],
    },
    initState: values,
    signals: {
      "-hp": (amt: number, s) =>
        produce(s, (d) => {
          d.hp = d.hp - amt;
        }),
    },
  });
};

const initState = {
  parts: JSON.parse(
    String(
      fs.readFileSync(path.join(__dirname, "../../../assets/initState.json"))
    )
  ).parts.map((dp: { name: string; stats: any }) => {
    return { ...dp, stats: makeStats("fromFile", dp.stats) };
  }),
};

const w = system({
  components: {
    // add AI seed
    parts: component({
      id: "parts",
      effects: {},
      initState: {
        parts: initState.parts as {
          name: string;
          stats: ReturnType<typeof makeStats>;
        }[],
      },
      signals: {
        add: (p: { name: string }, state) => {
          return produce(state, (draft) => {
            draft.parts.unshift({
              stats: makeStats("std", { atk: 2, hp: 23, isAlive: true }),
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
    return w.render().parts.parts as {
      name: string;
      stats: any;
      isAlive: boolean;
    }[];
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
