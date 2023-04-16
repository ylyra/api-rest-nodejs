import type { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { z } from "zod";
import { knex } from "../database";
import { checkSessionIdExists } from "../middleware/check-session-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    console.log("preHandler", request.raw.url);
  });

  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const session_id = request.cookies.sessionId;

      const transactions = await knex("transactions")
        .where({
          session_id,
        })
        .select();

      return {
        transactions,
      };
    }
  );

  app.get(
    "/:id/details",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const session_id = request.cookies.sessionId;

      const { id } = z
        .object({
          id: z.string().uuid(),
        })
        .parse(request.params);

      const transaction = await knex("transactions")
        .where({ id, session_id })
        .first();

      return {
        transaction,
      };
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const session_id = request.cookies.sessionId;

      const summary = await knex("transactions")
        .sum("amount", {
          as: "amount",
        })
        .where({
          session_id,
        })
        .first();

      return {
        summary,
      };
    }
  );

  app.post("/", async (request, reply) => {
    const { amount, title, type } = z
      .object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(["credit", "debit"]),
      })
      .parse(request.body);

    let session_id = request.cookies.sessionId;

    if (!session_id) {
      session_id = crypto.randomUUID();

      reply.cookie("sessionId", session_id, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id,
    });

    return reply.status(201).send();
  });
}
