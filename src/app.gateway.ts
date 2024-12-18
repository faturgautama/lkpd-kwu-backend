import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Server } from "http";

@WebSocketGateway({
    cors: { origin: "*" }
})
export class AppGateway {

    @WebSocketServer() server: Server

    @SubscribeMessage('sendNotif')
    handleSendNotif(@MessageBody() payload: number[]): void {
        this.server.emit('getNotif', payload);
    }
}