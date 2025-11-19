// server.js
import 'dotenv/config'; 
import express from 'express';
import { handler } from './build/handler.js';
import { Server } from 'socket.io';
import http from 'http';
import socketController from './src/lib/server/game/sockets/socketController.js';

console.log("NODE_ENV =", process.env.NODE_ENV);
console.log('🌍 ORIGIN utilisée :', process.env.ORIGIN);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
        origin: process.env.ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

socketController(io);

// app.use('/socket.io', (req, res, next) => next());
app.use(handler);

const port = 3000;
server.listen(port, () => {
    console.log(`✅ Serveur HTTP en écoute sur http://localhost:${port}`);
    console.log(`🔌 Socket.io prêt sur ws://localhost:${port}`);
});