import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { conversationRouter } from "./routes/conversations.js";
import { messagesRouter } from "./routes/messages.js";
import { webhookRouter } from "./routes/webHook.js";
import { userRouter } from "./routes/users.js";
import cookieParser from "cookie-parser";
import { userMiddleware } from "./middleware/userMiddleware.js";
import http from "http"
import { setupWebSocket } from "./websocket.js";

dotenv.config();

const fe_urls = process.env.CLIENT_URL?.split(",") || [];

const port = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(
  cors({
    origin: fe_urls,
    credentials: true,
  })
);

app.use("/conversations", conversationRouter);
app.use("/messages", messagesRouter);
app.use("/webhook", webhookRouter);
app.use("/user", userRouter);

const server = http.createServer(app)

setupWebSocket(server)

server.listen(port, "0.0.0.0", () => {
  console.log(`Server started at port: ${port}`);
});
