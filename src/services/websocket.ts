import * as socket_io from 'socket.io-client';

export default class Websocket {
    private socket: any
    private url: any
    private state: string

    constructor(url){
        this.url = url
    }

    public connected(): boolean {
        return this.socket.connected;
    }

    public connect(){
        this.socket = socket_io(this.url)
    }

    public send(message: string): void {
        this.socket.emit('message', message);
    }
}