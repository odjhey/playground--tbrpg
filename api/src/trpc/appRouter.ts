import { router } from "./trpc";
import { apiRouter } from "../trpc-services/api";
import { messagesRouter } from "../trpc-services/messages";
import { participantsRouter } from "../trpc-services/participants/participants";

export const appRouter = router({
  api: apiRouter,
  messages: messagesRouter,
  participants: participantsRouter,
});

export type AppRouter = typeof appRouter;
