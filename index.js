import "dotenv/config";
import express from "express";
import bootstrap from "./src/app.controller.js";
import { Server } from "socket.io";
import { runSocketIO } from "./src/socketio/index.js";
const app = express();
const port = 3000;

await bootstrap(app, express);
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

runSocketIO(server);
