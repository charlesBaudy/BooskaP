import express from "express"
import { route } from "./ild.routes";

const router = express.Router();

const ildRoutes = require('./ild.routes');

const cableRoutes = require('./cable.routes');

router.use("/cables", cableRoutes);

router.use("/ild", ildRoutes);

export = router