import jwt from 'jsonwebtoken';

import RestaurantsService from '../services/RestaurantsService.js';
import UserRestaurantService from '../services/UserRestaurantsService.js';

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

            await userRestaurant.CreateRelation(userId, restaurantId, username, "owner");

            const message = "User created successfully!";
            res.status(200).json({message});
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async FindRestaurant(req, res) {
        try {
            const {id, name} = req.query;

            const searchResult = await restaurant.FindRestaurant(id, name);
            if (searchResult.length === 0) {
                const error = "Restaurant Not Found"
                res.status(404).json({error});
                return;
            }

            res.status(200).json({searchResult});
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
            const searchRelation = (await userRestaurant.SearchRelations({restaurantId:id, userId}))[0];

            if (!searchRelation || (searchRelation.position !== 'manager' && searchRelation.position !== 'owner')) {
                const error = "You do not possess the rights for this action!";
                res.status(403).json({error});
                return;
            }

            const updateRestaurant = await restaurant.UpdateRestaurantInfo(id, name, contacts, locationLink);
            
            const message = updateRestaurant;
            res.status(200).json({message});
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

            const restaurantForDeletion = (await restaurant.FindRestaurant(id))[0];

            if (!restaurantForDeletion) {
                const error = "Restaurant not found!";
                res.status(404).json({error});
                return;
            }

            const searchRelation = (await userRestaurant.SearchRelations({restaurantId:id, userId}))[0];

            if (!searchRelation || searchRelation.position !== 'owner') {
                const error = "You do not possess the rights for this action!";
                res.status(403).json({error});
                return;
            }

            await restaurant.DeleteRestaurant(id);
            await userRestaurant.DeleteRelationByRestaurantId(id);

            const message = "Deleted successfully!";
            res.status(200).json({message});
        } catch (error) {
            error = error.message;
            res.status(200).json({error});
        }
    }
}

export default RestaurantController;