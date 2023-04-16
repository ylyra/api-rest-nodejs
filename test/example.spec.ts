import request from "supertest";
import { afterAll, beforeAll, test } from "vitest";

import { app } from "../src/app";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test("example", async () => {
  await request(app.server)
    .post("/transactions")
    .send({
      title: "new transaction",
      amount: 10000,
      type: "credit",
    })
    .expect(201);
});
