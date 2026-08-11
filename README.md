# SocialeX — Text-First Social Network

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000)

**SocialeX** is a full-stack X/Twitter-inspired social networking platform combining **React**, **Express**, **MongoDB**, **JWT authentication**, and **Socket.IO real-time messaging** with server-side authorization.

Built as a **MERN stack portfolio project** — focused on authenticated social interactions, text-based posting, user discovery, and one-to-one chat rather than a static UI demo.

> **Current release:** Intentionally **text-first**. Posts, profiles, likes, search, and messaging are fully implemented. Media uploads and Stories are planned for future work.

---

## 🚀 Local Development

| | |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:6001 |
| **WebSocket** | http://localhost:6001 (Socket.IO) |

> **Tip:** Start the **backend first**, then the frontend. Both must share the correct `CLIENT_URL` / API URLs in `.env` for CORS and Socket.IO to connect.

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- Password hashing with **bcrypt**
- **JWT** issued on successful auth
- Protected REST APIs with `Authorization: Bearer <token>`
- Frontend route guards (`AuthProtector`, `LoginProtector`)

### 👥 Social

| Capability | Details |
|---|---|
| **Profiles** | Username, avatar, bio |
| **Relationships** | Follow / unfollow |
| **Posts** | Text posts with optional location |
| **Feed** | Home timeline of posts |
| **Engagement** | Likes, comments (Socket.IO) |
| **Ownership** | Delete own posts — validated server-side |
| **Search** | Partial, case-insensitive user search (Explore) |

### 💬 Real-Time Messaging

- One-to-one text chat via **Socket.IO**
- Message any user by username
- Messages persisted in **MongoDB** (`Chats` collection)
- Conversation list from existing chats
- **Chat membership authorization** before read/write access
- Sender identity derived on the server — not from the client

### 🎨 Interface

- X/Twitter-inspired responsive layout
- **Home**, **Explore**, **Messages**, and **Profile** pages
- Light / dark mode toggle
- Sidebar navigation

---

## 🏗️ Architecture

```
React Frontend
    │
    ├── Axios
    │
    └── Socket.IO Client
             │
             ↓
      Node.js + Express
             │
       ┌─────┴─────┐
       ↓           ↓
   JWT Auth    Socket.IO
       │           │
       └─────┬─────┘
             ↓
         Mongoose
             ↓
       MongoDB Atlas
```

SocialeX uses a split communication model:

- **REST (Axios)** — registration, login, post creation, user search, protected resources
- **Socket.IO** — likes, follows, comments, profile updates, and messaging where immediate updates matter

**Local stack:**
- Frontend: React 18 + React Router
- Backend: Node.js + Express on port `6001`
- Database: MongoDB Atlas via Mongoose
- Auth: JWT + bcrypt; Socket.IO handshake validates `auth.token`

---

## 🛡️ Engineering & Security

Security boundaries are enforced on the server — not assumed from client input.

| Control | Implementation |
|---|---|
| **JWT authentication** | Protected REST routes require a valid Bearer token (`401` otherwise) |
| **Server-derived identity** | `req.user` / `socket.user.id` from verified JWT — client cannot spoof `userId`, `senderId`, or `ownId` |
| **Socket handshake auth** | Connections rejected without valid `auth.token` |
| **Post ownership** | Delete allowed only when `post.userId` matches authenticated user |
| **Chat membership** | Read/write blocked unless user is a chat participant |
| **Restricted CORS** | Express + Socket.IO allow only `CLIENT_URL` |
| **Secrets** | `JWT_SECRET` and `MONGO_URL` in `.env` — never committed |

---

## ⚙️ Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React 18, React Router, Axios, Socket.IO Client |
| Backend | Node.js, Express, Socket.IO |
| Authentication | JWT, bcrypt |
| Database | MongoDB Atlas, Mongoose |
| Styling | CSS, Bootstrap |
| Runtime | Node.js 20.x |

---

## 📂 Project Structure

```text
SocialeX/
├── client/
│   └── src/
│       ├── api/                 # Axios instance + JWT interceptor
│       ├── components/          # Posts, chat, sidebar
│       ├── context/             # Authentication, socket, and theme state
│       ├── pages/               # Home, Explore, Profile, Chat, Landing
│       ├── RouteProtectors/     # Auth route guards
│       ├── styles/
│       └── utils/
├── server/
│   ├── controllers/             # Auth, posts, search
│   ├── middleware/              # JWT verification
│   ├── models/                  # Users, Post, Chats
│   ├── routes/
│   ├── SocketHandler.js         # Socket.IO event handlers
│   ├── index.js                 # Express + Socket.IO entry
│   └── test-security.js         # Auth & authorization checks
├── docs/
├── .gitignore
└── README.md
```

---

## 🛠️ Local Setup

### Prerequisites

- Node.js 20.x
- npm
- MongoDB Atlas cluster or local MongoDB
- JWT secret

### Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env with MONGO_URL and JWT_SECRET
npm start
```

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm start
```

---

## 🔧 Environment Variables

Real `.env` files must **never** be committed.

**`client/.env`**

```env
REACT_APP_API_URL=http://localhost:6001
REACT_APP_WS_URL=http://localhost:6001
```

**`server/.env`**

```env
MONGO_URL=<your MongoDB Atlas connection string>
JWT_SECRET=<your JWT secret>
PORT=6001
CLIENT_URL=http://localhost:3000
```

---

## 🧪 Testing

**Client**

```bash
cd client
npm test -- --watchAll=false
npm run build
```

**Server security checks**

```bash
cd server
node test-security.js
```

Verifies JWT middleware and Socket.IO authorization for post ownership and chat membership.

---

## 📌 Current Scope

The current release is **intentionally text-first**.

| ✅ Current | 🔜 Deferred |
|---|---|
| Authentication & JWT | Image / photo posts |
| Profiles & follow/unfollow | Video posts |
| Text posts, feed, likes, comments | Media uploads |
| User search | Stories |
| Real-time one-to-one messaging | Notifications |
| MongoDB persistence | Richer messaging (typing, read receipts) |
| Server-side authorization | Production deployment |
| Light / dark mode | |

---

## 🗺️ Roadmap

- Media posts and uploads
- Stories
- Notifications
- Richer messaging (typing indicators, read receipts)
- Production deployment and CI/CD

---

## 🎓 What This Project Demonstrates

- Full-stack **React + Node.js** development
- **REST API** design with protected routes
- **JWT** authentication and authorization
- **MongoDB / Mongoose** data modeling
- **Socket.IO** real-time communication
- Client/server state synchronization
- **CORS** and environment-based configuration
- Server-side authorization boundaries
- Responsive UI architecture

---

## 🔗 Links

- [Repository](https://github.com/HariN999/SocialeX)

---

## 📄 License

Portfolio project — free to review and reference. No formal open-source license file is included.
