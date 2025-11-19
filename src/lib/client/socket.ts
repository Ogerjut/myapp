import { browser } from "$app/environment";
import { io, Socket } from "socket.io-client";
import dotenv from "dotenv"
dotenv.config()

let socket: Socket | null = null;

if (browser) {
    console.log("🔌 Tentative de connexion Socket.io...");
    socket = io(process.env.PUBLIC_SOCKET_URL, {
    path: '/socket.io',
    withCredentials: true,
    transports: ['websocket', 'polling'], 
    reconnection: true,
});

    socket.on('connect', () => {
        console.log('✅ Socket.io connecté !', socket?.id);
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Erreur connexion Socket.io:', error);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Socket.io déconnecté');
    });
}

export { socket };