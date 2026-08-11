# SocialeX

A text-first social networking platform inspired by X/Twitter, built as a portfolio project.

SocialeX supports user authentication, profiles, follow relationships, text posts, a live feed, likes, user search, and real-time one-to-one messaging with MongoDB persistence.

---

## Tech Stack

**Frontend**
- React
- React Router
- Axios
- Socket.IO Client
- CSS

**Backend**
- Node.js
- Express
- Socket.IO
- JWT
- Mongoose

**Database**
- MongoDB Atlas

**Authentication**
- JWT

**Realtime**
- Socket.IO

---

## Current Features

- User registration and login
- JWT authentication
- Protected REST API routes
- User search (partial, case-insensitive)
- User profiles
- Follow / unfollow
- Text post creation (with optional location)
- Feed
- Like / unlike
- Real-time one-to-one text messaging
- MongoDB message persistence
- Chat membership authorization
- Post ownership authorization
- X/Twitter-inspired interface with light/dark mode

---

## Deferred Features

These are planned for future work, not part of the current release:

- Image and video posts
- Media uploads
- Stories

---

## Security

- JWT authentication on protected REST routes
- Server-derived user identity (client cannot spoof `userId`, `senderId`, or `ownId`)
- Socket.IO handshake authentication via JWT
- Post ownership checks before deletion
- Chat membership validation before read/write
- Restricted CORS (no wildcard origins)
- Secrets stored in environment variables only

Never commit real credentials.

---

## Project Structure

```
SocialeX/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── api/            # Axios configuration
│       ├── components/     # UI components
│       ├── context/        # React context providers
│       ├── pages/          # Route pages
│       ├── styles/         # CSS
│       └── utils/          # Shared helpers
├── server/                 # Express + Socket.IO backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
└── README.md
```

---

## Local Setup

**Prerequisite:** Node.js 20.x

### Backend

```bash
cd server
npm install
npm start
```

Runs at `http://localhost:6001`

### Frontend

```bash
cd client
npm install
npm start
```

Runs at `http://localhost:3000`

---

## Environment Variables

Copy the example files and fill in your own values. Never commit `.env` files.

**client/.env**

```
REACT_APP_API_URL=http://localhost:6001
REACT_APP_WS_URL=http://localhost:6001
```

**server/.env**

```
MONGO_URL=<your MongoDB Atlas connection string>
JWT_SECRET=<your JWT secret>
PORT=6001
CLIENT_URL=http://localhost:3000
```

Use a strong JWT secret and your own MongoDB Atlas URI.

---

## Testing

```bash
cd client
npm test -- --watchAll=false
npm run build
```

```bash
cd server
node test-security.js
```

---

## Roadmap

- Media / photo / video posts
- Stories
- Notifications
- Additional social features
- Production deployment improvements

---

## License

Portfolio project — see repository for details.
