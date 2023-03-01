import express from "express"

const router = express.Router();

router.get("/getAll", (req, res) => {
    console.log("get all ild");
    
});

router.get("/getById", (req, res) => {
    console.log("get one ild");
    
});

router.post("/setOk", (req, res) => {
    console.log("set ok ild");
});

export = router;