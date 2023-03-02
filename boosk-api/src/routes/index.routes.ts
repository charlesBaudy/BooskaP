import express from "express"

const router = express.Router();

const ildRoutes = require('./ild.routes');

const cableRoutes = require('./cable.routes');

router.use("/cables", cableRoutes);

router.use("/ild", ildRoutes);

router.get("/", (req, res)=> {
    res.send("bienvenu")
});

export = router