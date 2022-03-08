import UserService from '../services/UsersService.js';


const userService = new UserService();

class UserController {

    async FindUser(req, res) {
        const {userId} = req.query; 

        const search = await userService.FindUser(userId);
        res.status(200).json({search});
    }

}

export default UserController;