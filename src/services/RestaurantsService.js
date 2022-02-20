import mongoose from 'mongoose';

import Restaurants from '../models/Restaurant.js';

class RestaurantsService {
    async CreateRestaurant(name, contacts, locationLink) {
        const checkIfExists = await Restaurants.findOne({name});
        let response = { "code": 200, "message":"Restaurant registered successfully!" };
        if (checkIfExists) {
            response.code = 409;
            response.message = "Restaurant already exists!"
            return response;
        }
        Restaurants.create({name, contacts, locationLink});
        return response;
    }

    async FindRestaurant(_id, name) {
        let response = { "code": 200, "result":"" };
        if (_id) {
            _id = mongoose.Types.ObjectId(_id); 
        }
        const parameters = _id || name;
        const search = await Restaurants.find({parameters});
        console.log(parameters);
        // if (search.length === 0) {
        //     response.code = 404;
        //     response.result = "Restaurant not found!";
        //     return response;
        // }
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