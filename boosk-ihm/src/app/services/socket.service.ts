import { Injectable } from "@angular/core"
import { Observable } from "rxjs";
import * as socketIo from "socket.io-client";
import { Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private clientSocket: Socket

  constructor() {
    this.clientSocket = socketIo.connect("http://ec2-18-117-154-6.us-east-2.compute.amazonaws.com:3000");
  }

  listenToServer(connection: any): Observable<any> {
    return new Observable((subscribe)=>{
      this.clientSocket.on(connection, (data: any)=>{
        subscribe.next(data);
      })
    })
  }

  emitToServer(connection: any, data: any): void {
    this.clientSocket.emit(connection, data)
  }
}
