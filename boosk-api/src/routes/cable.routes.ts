import express from "express"

const router = express.Router();

router.get("/getAll", (req, res) => {
    console.log("get all cable");
});

router.get("/getById", (req, res) => {
    console.log("get one cable");
});

export = router;