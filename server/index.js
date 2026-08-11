import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/Route.js';
import SocketHandler from './SocketHandler.js';

dotenv.config();


// config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));


app.use('', authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

// Middleware to authenticate socket connections
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Authentication required"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = {
            id: decoded.id
        };
        next();
    } catch (err) {
        return next(new Error("Invalid or expired token"));
    }
});

io.on("connection", (socket) =>{
    console.log("User connected");

    SocketHandler(socket);
})


// mongoose setup

const PORT = process.env.PORT || 6001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/socialeX';

mongoose.connect(MONGO_URL, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(()=>{

        server.listen(PORT, ()=>{
            console.log(`Running @ ${PORT}`);
        });
    }
).catch((e)=> console.log(`Error in db connection ${e}`));
