import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();

app.register(fastifyCookie);
app.register(transactionsRoutes, {
  prefix: "/transactions",
});

app.listen(
  {
    port: env.PORT,
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Server listening on ${address}`);
  }
);
