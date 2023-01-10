import { z } from "zod";
import { publicProcedure, router } from "../trpc/trpc";

const list: string[] = [];

export const messagesRouter = router({
  list: publicProcedure.query(() => {
    return {
      list,
    };
  }),
  new: publicProcedure
    .input(z.object({ name: z.string().nullish() }).nullish())

    .mutation(({ input }) => {
      if (input?.name) {
        list.unshift(input?.name);
      }

      return {
        text: `howdy ${input?.name}`,
      };
    }),
});
