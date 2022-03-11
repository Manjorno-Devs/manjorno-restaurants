import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';

const env = dotenv.config();

class RestaurantPublisher{

    async AddURestaurant(restaurant) {
        await amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) => {
            if (connectionError) {
                throw connectionError;
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }

                channel.assertExchange(process.env.AMQP_EXCHANGE_RESTAURANTS, 'topic', { durable: false });
                channel.publish(process.env.AMQP_EXCHANGE_RESTAURANTS, 'add', Buffer.from(JSON.stringify(restaurant)));
            });
        });
    }

    async UpdateRestaurant(restaurant) {
        await amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) => {
            if (connectionError) {
                throw connectionError;
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }

                channel.assertExchange(process.env.AMQP_EXCHANGE_RESTAURANTS, 'topic', { durable: false });
                channel.publish(process.env.AMQP_EXCHANGE_RESTAURANTS, 'update', Buffer.from(JSON.stringify(restaurant)));
            });
        });
    }

    async DeleteRestaurant(restaurant) {
        await amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) => {
            if (connectionError) {
                throw connectionError;
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }

                channel.assertExchange(process.env.AMQP_EXCHANGE_RESTAURANTS, 'topic', { durable: false });
                channel.publish(process.env.AMQP_EXCHANGE_RESTAURANTS, 'delete', Buffer.from(JSON.stringify(restaurant)));
            });
        });
    }
}

export default RestaurantPublisher;