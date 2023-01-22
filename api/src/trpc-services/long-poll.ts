import { publicProcedure, router } from "../trpc/trpc";

const list: string[] = [];

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
});
