import app from "./src/app";
import { IncomingMessage, Server, ServerResponse } from "http";

type ServerType = Server<typeof IncomingMessage, typeof ServerResponse>;

const PORT: string | number = process.env.PORT || 3056;

const server: ServerType = app.listen(PORT, () => {
  console.log(`WSV eCommerce starts with port: ${PORT}`);
});

// SIGINT => on type Ctrl + C in IDE
process.on("SIGINT", () => {
  server.close(() => console.log("Exit server express"));
});
