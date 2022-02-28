import mongoose from 'mongoose';

import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';
import RestaurantUsers from '../models/RestaurantUsersRelation.js';

class MenuItemsService {

    async AddMenuItem(userId, restaurantId, name, description, price, pictures) {
        const restaurant = Restaurant.findById(restaurantId);
        const userRelation = RestaurantUsers.find({userId, "position": {$or: ["owner", "manager"]}});
        if (!restaurant) {
            return "Restaurant does not exist!";
        }
        if (!userRelation || (userRelation.position !== "owner" & userRelation.position !== "manager")) {
            return "User does not have any relation with the given restaurant!";
        }
        MenuItem.create({restaurantId, name, description, price, pictures});
        return "Item added successfully";
    }

    async FindMenuItem(_id, restaurantId, name) {

    }

    async UpdateMenuItems(_id, restaurantId, name, description, price) {

    }

    async DeleteMenuItems(_id) {

    }

}

export default MenuItemsService;