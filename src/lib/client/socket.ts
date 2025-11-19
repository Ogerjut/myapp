import { browser } from "$app/environment";
import { io, Socket } from "socket.io-client";
import { PUBLIC_SOCKET_URL } from "$env/static/public";


let socket: Socket | null = null;

if (browser) {
    console.log("🔌 Tentative de connexion Socket.io...");
    console.log("socket url : ", PUBLIC_SOCKET_URL)
    socket = io(PUBLIC_SOCKET_URL, {
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