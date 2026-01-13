
export const userConnections = new Map();

export function userConnected(userId) {
	const count = userConnections.get(userId) || 0;
	userConnections.set(userId, count + 1);
}

export function userDisconnected(userId) {
	const count = (userConnections.get(userId) || 1) - 1;

	if (count <= 0) {
		userConnections.delete(userId);
		return true; // vraiment offline
	}

	userConnections.set(userId, count);
	return false;
}

export function isUserOnline(userId) {
	return userConnections.has(userId);
}
