import dotenv from 'dotenv';

import RestaurantsService from '../services/RestaurantsService.js';

const env = dotenv.config();

const restaurant = new RestaurantsService();

class RestaurantController{

    async CreateRestaurant(req, res) {
        try {
            const {name, contacts, locationLink} = req.body;

            const restraurantCreation = await restaurant.CreateRestaurant(name, contacts, locationLink);
            
            const message = restraurantCreation.message;
            res.status(restraurantCreation.code).json({message});
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