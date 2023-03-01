import express from "express";
import { AppDataSource } from "./data-source";

const app = express();

AppDataSource.initialize()
    .then(()=>{
        console.log("connected to booska-db");
    })
    .catch(err=> console.error(err));

const indexRoutes = require('./routes/index.routes')

app.use('/api', indexRoutes);

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`App listen on PORT ${port}`);
})