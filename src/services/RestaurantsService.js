import mongoose from 'mongoose';

import Restaurants from '../models/Restaurant.js';

class RestaurantsService {
    async CreateRestaurant(name, contacts, locationLink) {
        let checkIfExists = await Restaurants.findOne({name});
        if (checkIfExists) {
            return "Restaurant already exists";
        }
        const _id = mongoose.Types.ObjectId();
        Restaurants.create({_id, name, contacts, locationLink});
        return _id;
    }

    async FindRestaurant(_id, name) {
        if (_id) {
            _id = mongoose.Types.ObjectId(_id); 
            const search = await Restaurants.find({_id});
            return search;
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

    async UpdateRestaurantInfo(_id, name, pictures, contacts, locationLink) {
        
    }

    async DeleteRestaurant(_id) {

    }
}

export default RestaurantsService;