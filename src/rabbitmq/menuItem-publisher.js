import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';

const env = dotenv.config();

class MenuItemPublisher{


    async AddItem(item) {
        await amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) => {
            if (connectionError) {
                throw connectionError;
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }

                channel.assertExchange(process.env.AMQP_EXCHANGE_MENUITEM, 'topic', { durable: false });
                channel.publish(process.env.AMQP_EXCHANGE_MENUITEM, 'add', Buffer.from(JSON.stringify(item)));
            });
        });
    }

    async UpdateItem(item) {
        await amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) => {
            if (connectionError) {
                throw connectionError;
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }

                channel.assertExchange(process.env.AMQP_EXCHANGE_MENUITEM, 'topic', { durable: false });
                channel.publish(process.env.AMQP_EXCHANGE_MENUITEM, 'update', Buffer.from(JSON.stringify(item)));
            });
        });
    }

    async DeleteItem(_id) {
        await amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) => {
            if (connectionError) {
                throw connectionError;
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }
                console.log()
                channel.assertExchange(process.env.AMQP_EXCHANGE_MENUITEM, 'topic', { durable: false });
                channel.publish(process.env.AMQP_EXCHANGE_MENUITEM, 'delete', Buffer.from(JSON.stringify({_id})));
            });
        });
    }
}

export default MenuItemPublisher;