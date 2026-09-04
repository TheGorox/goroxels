import { emitter } from './events.js';

function mapUserObject(serverUser){
    return {
            username: serverUser?.nick,
            userId: serverUser?.userId,
            registered: serverUser.registered,
            role: serverUser.role,
            connections: [serverUser.id],
            badges: serverUser.badges ?? [],
            lastCoords: [0, 0],
            lastColor: null
        }
}

class OnlineManager {
    users = $state([]);

    init() {
        emitter.on('sock.userJoin', (userData) => this.addUser(userData));
        emitter.on('sock.userLeave', (socketId) => this.removeUser(socketId));
        emitter.on('sock.userUpdate', (data) => this.updateUser(data));
    }

    addUser(user) {
        const existing = this.users.find(u => u.connections.includes(user.id));
        if (existing) {
            existing.connections.push(user.id);
        }else{
            const newUsr = mapUserObject(user);
            this.users.push(newUsr);
        }
    }

    removeUser(socketId) {
        // each user's connections are de-duplicated into u.connections
        const existing = this.users.find(u => u.connections.includes(socketId));
        if(!existing) return;

        // we're removing only the leaved connection
        const existingIdx = existing.connections.indexOf(socketId);
        existing.connections.splice(existingIdx, 1);
        
        // and if there's no connections left - remove the whole user
        if(existing.connections.length === 0){
            this.users.splice(this.users.indexOf(existing), 1);
        }
    }

    updateUser(data) {
        const user = this.users.find(u => u.socketId === data.socketId);
        if (user) {
            if (data.lastCoords) user.lastCoords = data.lastCoords;
            if (data.lastColor) user.lastColor = data.lastColor;
        }
    }
}

export const online = new OnlineManager();