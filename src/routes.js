import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    const message = "test123";
    res.status(200).json({message});
});

export default router;