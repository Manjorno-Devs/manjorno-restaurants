import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import amqp from 'amqplib/callback_api.js';

import restaurantRouter from './src/restaurantRoutes.js';
import UserConsumer from './src/rabbitmq/consumer-user.js';

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

        channel.assertExchange(process.env.AMQP_EXCHANGE_USERS, 'topic', {durable: false});
        channel.assertExchange(process.env.AMQP_EXCHANGE_RESTAURANTS, 'topic', {durable: false});
        channel.assertExchange(process.env.AMQP_EXCHANGE_EMPLOYEES, 'topic', {durable: false});
        channel.assertExchange(process.env.AMQP_EXCHANGE_MENUITEM, 'topic', {durable: false});

        const queues = ['add-user-restaurant', 'update-user-restaurant', 'delete-user-restaurant'];

        queues.forEach(queueName => {
            channel.assertQueue(queueName, { durable: false });
        });


        channel.bindQueue('add-user-restaurant', process.env.AMQP_EXCHANGE_USERS, 'KK.EVENT.ADMIN.Manjorno.SUCCESS.USER.CREATE');
        channel.bindQueue('add-user-restaurant', process.env.AMQP_EXCHANGE_USERS, 'KK.EVENT.CLIENT.Manjorno.SUCCESS.client-app.REGISTER');
        channel.bindQueue('update-user-restaurant', process.env.AMQP_EXCHANGE_USERS, 'KK.EVENT.ADMIN.Manjorno.SUCCESS.USER.UPDATE');
        channel.bindQueue('delete-user-restaurant', process.env.AMQP_EXCHANGE_USERS, 'KK.EVENT.ADMIN.Manjorno.SUCCESS.USER.DELETE');


        const userConsumer = new UserConsumer(channel, queues);
        userConsumer.AddUser();
        userConsumer.UpdateUser();
        userConsumer.DeleteUser();

        mongoose.connect(process.env.MONGODB_CONNECTION_URL, () => {
            console.log("Connected to DB");
            app.listen(port, () => {
                console.log(`Microservice is up at port ${port}`);
            });
        });

    });
    
});