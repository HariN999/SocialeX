## 📱 SocialeX - Real-Time Social Media App

**SocialeX** is a modern, full-stack social media application that enables real-time chat, post sharing, story updates, and secure authentication. It’s built using the **MERN stack** (MongoDB, Express, React, Node.js) along with **Socket.io** for real-time features and **Firebase** for media storage.

---

## 🚀 Features

* 🔐 **User Authentication** (Register/Login with hashed passwords)
* 🧑‍🤝‍🧑 **Profiles** (Custom profile pic, username, about section)
* 📝 **Create & View Posts** (Text, image, or video-based posts)
* 📸 **Stories** (24-hour story feature similar to Instagram)
* 💬 **Real-Time Chat** (1-on-1 private messaging with file support)
* 🔔 **Notifications** (For new messages, followers, and story updates)
* 🔄 **Live Feed** (View all user posts in real-time)
* 🔒 **End-to-End Security** (JWT, Bcrypt, secure MongoDB storage)

---

## 🧰 Tech Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Frontend       | React.js, Axios, Bootstrap |
| Backend        | Node.js, Express.js        |
| Real-Time      | Socket.io                  |
| Database       | MongoDB (via Mongoose)     |
| Media Upload   | Firebase Storage           |
| Authentication | JWT, Bcrypt                |

---

## 📂 Project Structure

```
SocialeX/
├── client/               # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── App.js
├── server/               # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
├── .env
├── README.md
└── package.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/HariN999/SocialeX.git
cd SocialeX
```

### 2️⃣ Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```
PORT=5000
MONGO_URL=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
```

### 3️⃣ Setup the Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in `client/` for Firebase config:

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_PROJECT_ID=...
```

### 4️⃣ Run the Application

Start backend:

```bash
cd ../server
npm start
```

Start frontend:

```bash
cd ../client
npm start
```

App runs on:
🌐 `http://localhost:3000`

---

## 📸 Screenshots

# Home Page

![image](https://github.com/user-attachments/assets/6020e04b-0960-4baf-8e26-897fc535e135)

|  Posts                                                                                      |   Stories                                                                                  |
| ------------------------------------------------------------------------------------------- | -----------------------------------------------------------------------------------------  |
|  ![Posts](https://github.com/user-attachments/assets/66a1b41b-71bc-41de-86fc-d9a7fbeb9a3f)  | ![Stories](https://github.com/user-attachments/assets/f8330ac3-5a30-4a0e-94a4-2cd143a2ad9c)|




---

## 🔐 Environment Variables

Here’s what you need for the `.env` files:

### Backend (`server/.env`)

```
PORT=6001
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### Frontend (`client/.env`)

```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_URL=http://localhost:6001
REACT_APP_WS_URL=http://localhost:6001
```
## 🎥 Demo

Watch a full walkthrough of SocialeX in action:

https://drive.google.com/file/d/1xDJ8aYb451fFts_2vn38VSUtOckL1Ajr/view?usp=drive_link

## 🙋‍♂️ Support

If you found this project useful, give it a ⭐ on GitHub!
Need help? Feel free to [open an issue](https://github.com/HariN999/SocialeX/issues).

---
