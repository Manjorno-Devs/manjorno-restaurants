import mongoose from 'mongoose';

import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';
import RestaurantUsers from '../models/RestaurantUsersRelation.js';

class MenuItemsService {

    async AddMenuItem(userId, restaurantId, name, description, price, pictures) {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return "Restaurant does not exist!";
        }
        const userRelation = await RestaurantUsers.findOne({userId, restaurantId});
        if (!userRelation || (userRelation.position !== "owner" & userRelation.position !== "manager")) {
            return "User does not have any relation with the given restaurant!";
        }
        MenuItem.create({restaurantId, name, description, price, pictures});
        return "Item added successfully";
    }

    async FindMenuItem(_id, restaurantId, itemName) {
        if (_id) {
            const searchResult = await MenuItem.findById(_id);
            return searchResult;
        }
        if (!itemName) {
            const searchResult = await MenuItem.find({restaurantId});
            return searchResult;
        }
        const searchResult = await MenuItem.find({
            restaurantId,
            name: {
                "$regex": itemName
            }
        });
        return searchResult;
    }

    async UpdateMenuItems(_id, name, description, price) {

    }

    async DeleteMenuItems(_id) {

    }

}

export default MenuItemsService;