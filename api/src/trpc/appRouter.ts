import { router } from "./trpc";
import { apiRouter } from "../trpc-services/api";
import { messagesRouter } from "../trpc-services/messages";
import { participantsRouter } from "../trpc-services/participants/participants";
import { longPollRouter } from "../trpc-services/long-poll";

export const appRouter = router({
  api: apiRouter,
  messages: messagesRouter,
  participants: participantsRouter,
  longPoll: longPollRouter,
});

export type AppRouter = typeof appRouter;
