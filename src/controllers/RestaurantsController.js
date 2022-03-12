import jwt from 'jsonwebtoken';

import RestaurantsService from '../services/RestaurantsService.js';
import Employees from '../services/EmployeesService.js';

const restaurant = new RestaurantsService();
const userRestaurant = new Employees();

class RestaurantController{

    async CreateRestaurant(req, res) {
        try {
            const tokenPayload = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userId = tokenPayload.sub;
            const username = tokenPayload.preferred_username;

            const {name, contacts, locationLink} = req.body;

            const response = await restaurant.CreateRestaurant(userId, username, name, contacts, locationLink);

            if (!name || !locationLink) {
                res.status(400).json({"response":"Insufficient data provided!"});
                return;
            }

            if (response === "Restaurant already exists") {
                res.status(409).json({response});
                return;
            }

            res.status(200).json({response});
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async FindRestaurant(req, res) {
        try {
            const {id, name, employeeId} = req.query;

            const response = await restaurant.FindRestaurant(id, name, employeeId);
            if (response.length === 0) {
                const error = "Restaurant Not Found"
                res.status(404).json({error});
                return;
            }

            res.status(200).json({response});
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async UpdateRestaurant(req, res){
        try {
            const {id} = req.query
            const {name, contacts, locationLink} = req.body;

            const tokenPayload = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userId = tokenPayload.sub;

            const response = await restaurant.UpdateRestaurantInfo(id, userId, name, contacts, locationLink);

            if (response === 'You do not possess the rights for this action!') {
                res.status(403).json({response});
                return;
            }

            if (response === "Restaurant does not exist!") {
                res.status(404).json({response});
                return;
            }

            res.status(200).json({response});
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async DeleteRestaurant(req, res){
        try {
            const {id} = req.query;

            const tokenPayload = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userId = tokenPayload.sub;

            const response = await restaurant.DeleteRestaurant(id, userId);

            if (response === 'You do not possess the rights for this action!') {
                res.status(403).json({response});
                return;
            }

            if (response === "Restaurant does not exist!") {
                res.status(404).json({response});
                return;
            }

            res.status(200).json({response});
        } catch (error) {
            error = error.message;
            res.status(200).json({error});
        }
    }
}

export default RestaurantController;