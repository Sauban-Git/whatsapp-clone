import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { conversationRouter } from "./routes/conversations.js";
import { messagesRouter } from "./routes/messages.js";
import { webhookRouter } from "./routes/webHook.js";
import { userRouter } from "./routes/users.js";
import cookieParser from "cookie-parser";

dotenv.config();

const port = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.31.54:5173",
      "http://192.168.31.55:5173",
    ],
    credentials: true,
  })
);

app.use("/conversations", conversationRouter);
app.use("/messages", messagesRouter);
app.use("/webhook", webhookRouter);
app.use("/user", userRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started at port: ${port}`);
});
