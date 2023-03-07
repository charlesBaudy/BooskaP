import express from "express"

const router = express.Router();

const IldCtrl = require('../controllers/ild.controller');

router.get("/getAll", IldCtrl.getAll);

router.get("/getById", IldCtrl.getById);

router.get("/setOk", IldCtrl.setOk);

router.get("/setOneKO", IldCtrl.setOneKOAndOthersOK);

router.get("/", (req, res)=> {
    res.send("bienvenu sur ild")
});

export = router;