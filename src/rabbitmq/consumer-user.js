import UserService from '../services/UsersService.js';

const userService = new UserService();

class UserConsumer {

    constructor(channel, queues) {
        this.channel = channel;
        this.queues = queues;
    }
    
    async AddUser() {
        this.channel.consume('add-user-restaurant', async msg => {
            const {representation} = JSON.parse(msg.content.toString());
            const {id, username, first_name, last_name, email} = representation;
            await userService.AddUser(id, username, email, first_name, last_name);
        }, {noAck: true});
    }

    async UpdateUser() {
        this.channel.consume('update-user-restaurant', async msg => {
            const {resourcePath, representation} = JSON.parse(msg.content.toString());
            console.log(msg.content.toString());
            const userId = resourcePath.split('/')[1];
            const {username, email, firstName, lastName} = JSON.parse(representation);
            console.log(email);
            await userService.UpdateUser(userId, username, email, firstName, lastName);
        }, {noAck: true});
    }

    async DeleteUser() {
        this.channel.consume('delete-user-restaurant', async msg => {
            const {resourcePath} = JSON.parse(msg.content.toString());
            const userId = resourcePath.split('/')[1];
            await userService.DeleteUser(userId);
        }, {noAck: true});
    }

}

export default UserConsumer;