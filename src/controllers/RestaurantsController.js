import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import RestaurantsService from '../services/RestaurantsService.js';
import UserRestaurantService from '../services/UserRestaurantsService.js';

const env = dotenv.config();

const restaurant = new RestaurantsService();
const userRestaurant = new UserRestaurantService();

class RestaurantController{

    async CreateRestaurant(req, res) {
        try {

            const tokenPayload = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userId = tokenPayload.sub;
            const username = tokenPayload.preferred_username;

            const {name, contacts, locationLink} = req.body;

            const restaurantCreation = await restaurant.CreateRestaurant(name, contacts, locationLink);

            if (restaurantCreation === "Restaurant already exists") {
                const error = restaurantCreation;
                res.status(409).json({error});
                return;
            }

            const restaurantId = restaurantCreation;

            await userRestaurant.CreateRelation(userId, restaurantId, username, "manager");

            const message = restaurantCreation;
            res.status(200).json({message});
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async FindRestaurant(req, res) {
        const {id, name} = req.query;

        const searchResult = await restaurant.FindRestaurant(id, name);

        const result = searchResult.result;
        res.status(searchResult.code).json({result});
    }

}

export default RestaurantController;