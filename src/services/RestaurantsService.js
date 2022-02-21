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
        let response = { "code": 200, "result":"" };
        if (_id) {
            _id = mongoose.Types.ObjectId(_id); 
        }
        const parameters = _id || name;
        const search = await Restaurants.find({parameters});
        console.log(parameters);
        response.code = 200;
        response.result = search;
        return response;
    }

    async UpdateRestaurantInfo(_id, name, pictures, contacts, locationLink) {
        
    }

    async DeleteRestaurant(_id) {

    }
}

export default RestaurantsService;