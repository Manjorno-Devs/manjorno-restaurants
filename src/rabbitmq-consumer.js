import UserService from './services/UsersService.js';

const userService = new UserService();

class RabbitMQConsumer {

    constructor(channel, queues) {
        this.channel = channel;
        this.queues = queues;
    }
    
    async AddUser() {
        this.channel.consume(this.queues[0], async (msg) => {
            const {userId, details, representation, resourcePath} = JSON.parse(msg.content.toString());
            let response;
            if (!details) {
                const userId = resourcePath.split('/')[1];
                const {username, firstName, lastName, email} = JSON.parse(representation);
                response = await userService.AddUser(userId, username, email, firstName, lastName);
            } else {
                const {username, first_name, last_name, email} = details;
                response = await userService.AddUser(userId, username, email, first_name, last_name);
            }
            if (response === "User added successfully!") {
                this.channel.ack(msg);
            }
        }, {noAck: false});
    }

    async UpdateUser() {
        this.channel.consume('update-user', msg => {
            const {resourcePath, representation} = JSON.parse(msg.content.toString());
            const userId = resourcePath.split('/')[1];
            const {username, email, firstName, lastName} = JSON.parse(representation);
            const response = userService.UpdateUser(userId, username, email, firstName, lastName);
            if (response === "User updated successfully!") {
                this.channel.ack(msg);
            }
        }, {noAck: false});
    }

    async DeleteUser() {
        this.channel.consume('delete-user', msg => {
            const {resourcePath} = JSON.parse(msg.content.toString());
            const userId = resourcePath.split('/')[1];
            const response = userService.DeleteUser(userId);
            if (response === "User deleted successfully!") {
                this.channel.ack(msg);
            }
        }, {noAck: false});
    }

}

export default RabbitMQConsumer;