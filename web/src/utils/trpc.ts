import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../api/src/trpc/appRouter";

export const trpc = createTRPCReact<AppRouter>();
