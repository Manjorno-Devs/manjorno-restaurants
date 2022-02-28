import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

import Restaurants from '../models/Restaurant.js';
import RestaurantUsers from '../models/RestaurantUsersRelation.js';

class RestaurantsService {
    async CreateRestaurant(userId, username, restaurantName, contacts, locationLink) {
        const checkIFExists = await Restaurants.findOne({"name":restaurantName});

        if (checkIFExists) {
            return "Restaurant already exists";
        }

        const _id = mongoose.Types.ObjectId();

        Restaurants.create({_id, "name":restaurantName, contacts, locationLink});

        const restaurantId = _id;
        RestaurantUsers.create({userId, username, restaurantId, "position":"owner"});

        return "Restaurant Created successfully";
    }

    async FindRestaurant(_id, name) {
        if (_id) {
            return await Restaurants.findById(_id);
        }
        const query = {
            "name": {
                "$regex": name, 
                "$options": "i"
            }
        };
        return await Restaurants.find(query);
    }

    async UpdateRestaurantInfo(_id, userId, name, contacts, locationLink) {
        const restaurantUserRelation = await RestaurantUsers.findOne({userId});
        if (!restaurantUserRelation || (restaurantUserRelation.position !== 'manager' && restaurantUserRelation.position !== 'owner')) {
            return "You do not possess the rights for this action!";
        }
        const restaurant = await Restaurants.findById(_id);
        if (!restaurant) {
            return "Restaurant does not exist!";
        }
        let toBeUpdated = {name, locationLink};
        if (contacts !== restaurant.contacts) {
            toBeUpdated.contacts = contacts;
        }
        await Restaurants.updateOne({_id}, toBeUpdated);
        return "Restaurant updated successfully!";
    }

    async DeleteRestaurant(_id, userId) {
        const restaurantUserRelation = await RestaurantUsers.findOne({userId, "restaurantId":_id});
        if (!restaurantUserRelation || (restaurantUserRelation.position !== 'manager' && restaurantUserRelation.position !== 'owner')) {
            return "You do not possess the rights for this action!";
        }
        const restaurant = await Restaurants.findById(_id);
        if (!restaurant) {
            return "The Restaurant does not exist";
        }
        await MenuItem.deleteMany({"restaurantId":_id});
        await Restaurant.findByIdAndDelete(_id);
        await RestaurantUsers.deleteMany({"restaurantId": _id});
        return "Restaurant Deleted successfully";
    }
}

export default RestaurantsService;