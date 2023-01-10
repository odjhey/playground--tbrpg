import { router } from "./trpc";
import { apiRouter } from "./routers/api";

export const appRouter = router({
  api: apiRouter,
});

export type AppRouter = typeof appRouter;
