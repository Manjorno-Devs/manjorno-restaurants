import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import amqp from 'amqplib/callback_api.js';

import restaurantRouter from './src/restaurantRoutes.js';
import RabbitMQConsumer from './src/rabbitmq-consumer.js';

const app = express();
const env = dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/api/restaurants', restaurantRouter);

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

        const queues = ['add-user', 'update-user', 'delete-user'];

        queues.forEach(queueName => {
            channel.assertQueue(queueName, { durable: false });
        });

        const rabbitmMQConsumer = new RabbitMQConsumer(channel, queues);
        rabbitmMQConsumer.AddUser();
        rabbitmMQConsumer.UpdateUser();
        rabbitmMQConsumer.DeleteUser();

        mongoose.connect(process.env.MONGODB_CONNECTION_URL, () => {
            console.log("Connected to DB");
            app.listen(port, () => {
                console.log(`Microservice is up at port ${port}`);
            });
        });

    });
    
});