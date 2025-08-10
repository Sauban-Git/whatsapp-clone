import express from "express";
import dotenv from "dotenv";
import { conversationRouter } from "./routes/conversations.js";
import { messagesRouter } from "./routes/messages.js";
import { webhookRouter } from "./routes/webHook.js";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use("/conversations", conversationRouter);
app.use("/messages", messagesRouter);
app.use("/webhook", webhookRouter)

app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
