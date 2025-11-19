import { browser } from "$app/environment";
import { io, Socket } from "socket.io-client";
// export const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000');

let socket: Socket | null = null;

if (browser) {
    console.log("🔌 Tentative de connexion Socket.io...");
    
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://127.0.0.1:3000', {
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