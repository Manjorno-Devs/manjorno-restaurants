import mongoose from 'mongoose';

import Restaurants from '../models/Restaurant.js';

class RestaurantsService {
    async CreateRestaurant(name, contacts, locationLink) {
        const checkIFExists = await Restaurants.findOne({name});
        if (checkIFExists) {
            return "Restaurant already exists";
        }
        const _id = mongoose.Types.ObjectId();
        Restaurants.create({_id, name, contacts, locationLink});
        return _id;
    }

    async FindRestaurant(_id, name) {
        if (_id) {
            try {
                _id = mongoose.Types.ObjectId(_id); 
                const search = await Restaurants.find({_id});
                return search;
            } catch (err) {
                const error = "The given id is not valid!"  
            }
        }
        const query = {
            "name": {
                "$regex": name, 
                "$options": "i"
            }
        };
        const search = await Restaurants.find(query);
        return search;
    }

    async UpdateRestaurantInfo(_id, name, contacts, locationLink) {
        const restaurant = await Restaurants.findOne({_id});
        if (restaurant.length === 0) {
            return "Restaurant does not exist!";
        }
        let toBeUpdated = {name, locationLink};
        if (contacts !== restaurant.contacts) {
            toBeUpdated.contacts = contacts;
        }
        await Restaurants.updateOne({_id}, toBeUpdated);
        return "Restaurant updated successfully!";
    }

    async DeleteRestaurant(_id) {
        const searchRestaurant = await Restaurants.findById(_id);
        if (!searchRestaurant) {
            return "The Restaurant does not exist";
        }
        await Restaurants.deleteOne({_id});
        return "Restaurant Deleted successfully";
    }
}

export default RestaurantsService;