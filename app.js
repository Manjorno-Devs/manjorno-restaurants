import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const env = dotenv.config();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    const message = "test123";
    res.status(200).json({message});
});

const port = process.env.PORT || 3200

app.listen(port, () => {
    console.log(`Microservice is up at port ${port}`);
});