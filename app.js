import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import amqp from 'amqplib/callback_api.js';

import restaurantRouter from './src/restaurantRoutes.js';
import itemsRouter from './src/itemsRouter.js';

const app = express();
const env = dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/api/restaurants', restaurantRouter);
app.use('/api/restaurants/menu', itemsRouter);

const port = process.env.PORT || 3200

amqp.connect(process.env.AMQP_CONNECTION_URL , (connectionError, connection) => {
    if (connectionError) {
        throw connectionError;
    }

    connection.createChannel((channelCreationError, channel) => {
        if (channelCreationError) {
            throw channelCreationError;
        }

        console.log("RabbitMQ connected");

        const queues = ['create_restaurant', 'update_restaurant', 'delete_restaurant', 'create_order', 'update_order'];

        queues.forEach(queueName => {
            channel.assertQueue(queueName, { durable: false });
        });

        mongoose.connect(process.env.MONGODB_CONNECTION_URL, () => {
            console.log("Connected to DB");
            app.listen(port, () => {
                console.log(`Microservice is up at port ${port}`);
            });
        });

    });
    
});