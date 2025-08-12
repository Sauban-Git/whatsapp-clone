import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

await redisClient.connect();

// Keys
const CONVERSATION_SUBSCRIBERS_PREFIX = "conversation_subscribers:";
const USER_SUBSCRIBERS_PREFIX = "user_subscribers:";

// Add WS client ID to Redis set for conversation
export async function addConversationSubscriber(conversationId: string, clientId: string) {
  await redisClient.sAdd(CONVERSATION_SUBSCRIBERS_PREFIX + conversationId, clientId);
}

// Remove WS client ID from Redis set for conversation
export async function removeConversationSubscriber(conversationId: string, clientId: string) {
  await redisClient.sRem(CONVERSATION_SUBSCRIBERS_PREFIX + conversationId, clientId);
}

// Get all client IDs subscribed to a conversation
export async function getConversationSubscribers(conversationId: string): Promise<string[]> {
  return await redisClient.sMembers(CONVERSATION_SUBSCRIBERS_PREFIX + conversationId);
}

// Add WS client ID to Redis set for user conversation list
export async function addUserSubscriber(userId: string, clientId: string) {
  await redisClient.sAdd(USER_SUBSCRIBERS_PREFIX + userId, clientId);
}

// Remove WS client ID from Redis set for user conversation list
export async function removeUserSubscriber(userId: string, clientId: string) {
  await redisClient.sRem(USER_SUBSCRIBERS_PREFIX + userId, clientId);
}

// Get all client IDs subscribed to a user's conversation list
export async function getUserSubscribers(userId: string): Promise<string[]> {
  return await redisClient.sMembers(USER_SUBSCRIBERS_PREFIX + userId);
}

export async function quit() {
  await redisClient.quit();
}

export { redisClient };
