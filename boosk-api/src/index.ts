import express from "express";
import { AppDataSource } from "./data-source";
import { Cable } from "./models/cable";
import { Ild } from "./models/ild";

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

app.listen(port, ()=>{
    console.log(`App listen on PORT ${port}`);
})