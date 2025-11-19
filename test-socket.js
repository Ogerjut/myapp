import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('✅ Client connecté:', socket.id);
});

server.listen(3001, () => {
    console.log('Test Socket.io sur http://localhost:3001');
});