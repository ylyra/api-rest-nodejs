import { app } from "./app";
import { env } from "./env";

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
