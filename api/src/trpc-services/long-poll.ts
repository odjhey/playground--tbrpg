import { z } from "zod";
import { publicProcedure, router } from "../trpc/trpc";

// move this to some redis or sumthing
// todo: change to {[match: string]: {values}} for easier indexing
const list: {
  req: string;
  nakatoka: { taken: true; by: string } | { taken: false };
}[] = [];

export const longPollRouter = router({
  ping: publicProcedure.query(() => {
    return new Promise((res) => {
      setTimeout(() => {
        res({ values: list, message: "donzos" });
      }, 1000);
    });
  }),
  ping2: publicProcedure.query(() => {
    return new Promise(async (res) => {
      let ctr = 0;

      while (true) {
        await new Promise((res2) => {
          setTimeout(() => {
            if (ctr > 10) {
              res({ values: list, message: "donzos" });
            }
            ctr++;
            res2({});
          }, 1000);
        });
      }
    });
  }),

  // NOTE: make sure to add a timeout
  ping3: publicProcedure
    .input(z.object({ match: z.string() }))

    // TODO: change to Mutation
    .query(({ input }) => {
      // TODO: make sure that input.match is unique
      list.push({ req: input.match, nakatoka: { taken: false } });

      return new Promise(async (res) => {
        let ctr = 0;

        // poll every 1 min
        while (true) {
          await new Promise((res2) => {
            setTimeout(() => {
              if (ctr > 30) {
                // 30seconds for now
                // TODO: close(delete) request on failure
                res({
                  result: `naaddaaa`,
                  values: list,
                  message: "donzos",
                });
              }
              ctr++;

              const match = list.find((l) => l.req === input.match);
              if (match && match.nakatoka.taken === true) {
                res({
                  result: `yahoo match! ${match.nakatoka.by}`,
                  values: list,
                  message: "donzos",
                });
              }

              res2({});
            }, 1000);
          });
        }
      });
    }),

  // NOTE: make sure to add a timeout
  pong3: publicProcedure
    .input(z.object({ match: z.string() }))

    // TODO: change to Mutation
    .mutation(({ input }) => {
      return new Promise(async (res) => {
        let ctr = 0;

        // poll every 1 min
        while (true) {
          await new Promise((res2) => {
            setTimeout(() => {
              if (ctr > 30) {
                // 30seconds for now
                res({
                  result: `naaddaaa`,
                  values: list,
                  message: "donzos",
                });
              }
              ctr++;

              const matchIdx = list.findIndex((l) => l.req === input.match);
              if (
                matchIdx !== -1 &&
                list[matchIdx] &&
                list[matchIdx].nakatoka.taken === false
              ) {
                // TODO: implement own datastructure
                // TODO: add a cleanup function
                list[matchIdx].nakatoka = { taken: true, by: input.match };

                res({
                  result: `yahoo match! ${list[matchIdx].req}`,
                  values: list,
                  message: "donzos",
                });
              }

              res2({});
            }, 1000);
          });
        }
      });
    }),
});
