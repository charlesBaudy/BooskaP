import express from "express";
import { Server } from "socket.io";
import { AppDataSource } from "./data-source";
import { createServer } from "http";

const app = express();

var cors = require('cors');

app.use(cors());

AppDataSource.initialize()
    .then(async ()=>{
        console.log("connected to booska-db");
    })
    .catch(err=> console.error(err));

const indexRoutes = require('./routes/index.routes')

app.use('/api', indexRoutes);

const port = process.env.PORT || 3000;

const http = createServer(app);

export const io = new Server(http, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket: any) => {
    console.log(`connection on ${socket.id}`);
    socket.on('Change', (change:any)=>{
        io.sockets.emit('Change', change);
    });
});

http.listen(port);

