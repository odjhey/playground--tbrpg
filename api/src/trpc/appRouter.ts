import { router } from "./trpc";
import { apiRouter } from "../trpc-services/api";
import { messagesRouter } from "../trpc-services/messages";

export const appRouter = router({
  api: apiRouter,
  messages: messagesRouter,
});

export type AppRouter = typeof appRouter;
