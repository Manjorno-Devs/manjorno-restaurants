import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';

const env = dotenv.config();

class EmployeePublisher{

    async AddEmployee(employee) {
        await amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) => {
            if (connectionError) {
                throw connectionError;
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }

                channel.assertExchange(process.env.AMQP_EXCHANGE_EMPLOYEES, 'topic', { durable: false });
                channel.publish(process.env.AMQP_EXCHANGE_EMPLOYEES, 'add', Buffer.from(JSON.stringify(employee)));
            });
        });
    }

    async UpdateEmployee(employee) {
        await amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) => {
            if (connectionError) {
                throw connectionError;
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }

                channel.assertExchange(process.env.AMQP_EXCHANGE_EMPLOYEES, 'topic', { durable: false });
                channel.publish(process.env.AMQP_EXCHANGE_EMPLOYEES, 'update', Buffer.from(JSON.stringify(employee)));
            });
        });
    }

    async DeleteEmployee(employee){
        await amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) => {
            if (connectionError) {
                throw connectionError;
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError;
                }

                channel.assertExchange(process.env.AMQP_EXCHANGE_EMPLOYEES, 'topic', { durable: false });
                channel.publish(process.env.AMQP_EXCHANGE_EMPLOYEES, 'delete', Buffer.from(JSON.stringify(employee)));
            });
        });
    }
}

export default EmployeePublisher;