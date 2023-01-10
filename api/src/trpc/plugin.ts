import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { FastifyInstance } from "fastify";

import { appRouter } from "./router";
import { createContext } from "./router/context";

export default async (fastify: FastifyInstance) => {
  const prefix = "/trpc";

  fastify.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: { router: appRouter, createContext },
  });
};
