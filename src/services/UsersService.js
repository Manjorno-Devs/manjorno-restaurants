import Employees from '../models/Employees.js';
import Users from '../models/Users.js';

class UserService {

    async AddUser(userId, username, email, firstName, lastName){
        await Users.create({userId, username, email, firstName, lastName});
        return "User added successfully!";
    }

    async FindUser(userId) {
        if (userId) {
            const search = await Users.find({userId});
            return search;
        } else {
            const search = await Users.find();
            return search;
        }
    }

    async UpdateUser(userId, username, email, firstName, lastName){
        await Users.updateOne({userId}, {username, firstName, lastName});
        return "User updated successfully!"
    }

    async DeleteUser(userId) {
        await Users.findOneAndDelete({userId});
        await Employees.deleteMany({userId});
        return "User deleted successfully!"
    }

}

export default UserService;