import { DataSource } from "typeorm";
import { Cable } from "./models/cable";
import { Ild } from "./models/ild";

export const AppDataSource = new DataSource({
    type:"postgres",
    host: "booskap-db.co6n3mjmriny.us-east-2.rds.amazonaws.com",
    port: 5432,
    username: "postgres",
    password: "booska-p",
    database: "booskadb",
    synchronize: true,
    logging: true,
    entities: [Ild, Cable],
    subscribers: [],
    migrations: []
});