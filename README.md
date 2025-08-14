# 📱 WhatsApp Clone – Full Stack Chat App

A real-time chat application inspired by WhatsApp, built with:

- 🟦 **Express.js** (Backend)
- ⚡ **WebSockets** (`ws`)
- 🟢 **MongoDB** (via Prisma)
- 🧠 **Redis** (for subscription tracking)
- 🍪 Auth with cookies
- 🔐 CORS-secured cross-origin setup
- ⚛️ **React/Vite** (Frontend)

---

## 🌐 Live Demo

- **Frontend**: https://whatsapp-clone-6fxm.onrender.com
- **Backend**: https://clone-server-emlm.onrender.com
- **WebSocket URL**: `wss://clone-server-emlm.onrender.com`

---

## 🛠️ Features

- One-on-one real-time messaging
- Message delivery statuses (Sent, Delivered, Read)
- Cookie-based authentication
- MongoDB Change Streams for real-time sync
- WebSocket connections managed via Redis
- REST APIs for messages, conversations, and users
- Cross-origin secure setup
- Modern responsive UI

---

## 🧩 Tech Stack

| Layer         | Technology           |
|---------------|----------------------|
| **Frontend**  | React + Vite         |
| **Backend**   | Node.js + Express    |
| **WebSocket** | `ws`                 |
| **Database**  | MongoDB (via Prisma) |
| **Redis**     | Pub/Sub subscriptions|
| **ORM**       | Prisma               |
| **Hosting**   | Render               |

---

# ⚙️ Setup Instructions

## 1️⃣ Backend Setup

### 1. Clone the Backend Repo
```bash
git clone https://github.com/your-username/whatsapp-clone-server.git
cd whatsapp-clone-server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env`
```dotenv
PORT=3000
DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/whatsapp?retryWrites=true&w=majority
REDIS_URL=redis://default:<password>@<host>:<port>
CLIENT_URL=http://localhost:5173,https://whatsapp-clone-6fxm.onrender.com
SECURE=true
SAME_SITE=none
HTTP_ONLY=true
```
> ⚠️ `CLIENT_URL` should be comma-separated without quotes.

### 4. Prisma Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Start Backend
```bash
npm run dev
```
Server will run at **http://localhost:3000**

---

## 2️⃣ Frontend Setup

### 1. Clone the Frontend Repo
```bash
git clone https://github.com/your-username/whatsapp-clone-client.git
cd whatsapp-clone-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env`
```dotenv
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```
> Update these values for production deployment.

### 4. Start Frontend
```bash
npm run dev
```
App will be available at **http://localhost:5173**

---

## 🧪 WebSocket Example

```js
const ws = new WebSocket("wss://clone-server-emlm.onrender.com");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/
│   ├── middleware/
│   ├── websocket.ts
│   ├── db/
│   │   ├── db.ts (Prisma)
│   │   └── redis.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── .env
└── package.json

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── App.jsx
├── .env
└── package.json
```

---

## 📬 API Routes

```
POST /webhook         – Import WhatsApp messages from a zip
GET  /user            – Get current user
GET  /conversations   – Fetch all conversations
POST /messages        – Send message
```
> Requires `userId` cookie for authentication.

---

## ✅ Todo

- Group chats  
- Media support  
- Typing indicators  
- Push notifications

---

## 🧠 Credits

- Prisma MongoDB & Change Stream setup
- Render free-tier hosting
- WebSocket scaling with Redis

---

## 📄 License

MIT License


---

## 📦 Webhook Payload Zip Format

When calling:

```
POST /webhook
```

The request body should be a **`multipart/form-data`** upload containing a `.zip` file.  
Inside the `.zip`, the folder and file structure should look like this:

```
payload/
├── conversation_1_message_1.json
├── conversation_1_message_2.json
├── conversation_1_status_1.json
├── conversation_1_status_2.json
├── conversation_2_message_1.json
├── conversation_2_message_2.json
├── conversation_2_status_1.json
└── conversation_2_status_2.json
```

### File Naming Rules
- `conversation_<number>_message_<number>.json` → Contains message event payloads.  
- `conversation_<number>_status_<number>.json` → Contains message status update payloads.  
- Each `conversation_X` group represents one unique conversation.
- The `<number>` suffix increments for each message or status in that conversation.

### File Content Example
Example `conversation_1_message_1.json`:
```json
{
  "payload_type": "whatsapp_webhook",
  "_id": "conv1-msg1-user",
  "metaData": {
    "entry": [
      {
        "changes": [
          {
            "field": "messages",
            "value": {
              "contacts": [
                {
                  "profile": { "name": "Ravi Kumar" },
                  "wa_id": "919937320320"
                }
              ],
              "messages": [
                {
                  "from": "919937320320",
                  "id": "wamid.HBgMOTE5OTY3NTc4NzIwFQIAEhggMTIzQURFRjEyMzQ1Njc4OTA=",
                  "timestamp": "1754400000",
                  "text": { "body": "Hi, I’d like to know more about your services." },
                  "type": "text"
                }
              ],
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "918329446654",
                "phone_number_id": "629305560276479"
              }
            }
          }
        ],
        "id": "30164062719905277"
      }
    ],
    "gs_app_id": "conv1-app",
    "object": "whatsapp_business_account"
  },
  "createdAt": "2025-08-06 12:00:00",
  "startedAt": "2025-08-06 12:00:00",
  "completedAt": "2025-08-06 12:00:01",
  "executed": true
}
```

> **Tip:**  
> - All files in the `.zip` must be valid JSON.  
> - Ensure timestamps and IDs are unique per message.  
> - Keep `payload_type` as `"whatsapp_webhook"` so the backend can parse it correctly.

