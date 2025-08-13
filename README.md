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
