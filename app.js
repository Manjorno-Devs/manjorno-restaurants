import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import router from './src/routes.js';

const app = express();
const env = dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/api/restaurants', router);

const port = process.env.PORT || 3200

app.listen(port, () => {
    console.log(`Microservice is up at port ${port}`);
});