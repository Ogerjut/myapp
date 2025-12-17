import { socket } from "$lib/client/socket";

export class TimerController {
    constructor(duration : number) {
        this.socket = socket;
        this.duration = duration
    }

    getEndTime() {
        return new Promise((resolve) => {
            socket?.emit("getEndTime", this.duration, (endTime) => {
                resolve(endTime);
            });
        });
    }

    
}
