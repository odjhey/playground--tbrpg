import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { FastifyInstance } from "fastify";
import ws from "@fastify/websocket";

import { appRouter } from "./router";
import { createContext } from "./router/context";

export default async (fastify: FastifyInstance) => {
  const prefix = "/trpc";

  fastify.register(ws);
  fastify.register(fastifyTRPCPlugin, {
    prefix,
    useWSS: true,
    trpcOptions: { router: appRouter, createContext },
  });
};
