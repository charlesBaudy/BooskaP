import express from "express"

const router = express.Router();

const cableCtrl = require('../controllers/cable.controller')

router.get("/getAll", cableCtrl.getAllCables);

router.get("/getById", cableCtrl.getCableById);

router.get("/", (req, res)=> {
    res.send("bienvenu sur cable")
});

export = router;