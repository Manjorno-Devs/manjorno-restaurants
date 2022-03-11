import mongoose from 'mongoose';

import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';
import Employees from '../models/Employees.js';

import MenuItemPublisher from '../rabbitmq/menuItem-publisher.js';

class MenuItemsService {

    constructor() {
        this.menuItemPublisher = new MenuItemPublisher();
    }

    async AddMenuItem(userId, restaurantId, name, description, price, pictures) {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return "Restaurant does not exist!";
        }
        const userRelation = await Employees.findOne({userId, restaurantId});
        if (!userRelation || userRelation.position === 'worker') {
            return "User does not have any relation with the given restaurant!";
        }

        const _id = mongoose.Types.ObjectId();

        await MenuItem.create({_id, restaurantId, name, description, price, pictures, "AddedBy":userRelation._id});

        await this.menuItemPublisher.AddItem({_id, name, price, restaurantId});
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

    async UpdateMenuItems(_id, userId, name, description, price) {
        const item = await MenuItem.findById(_id);
        const userRelation = await Employees.findOne({userId, "restaurantId":item.restaurantId});
        if (!userRelation || userRelation.position === 'worker') {
            return "User does not have any relation with the given restaurant!";
        }
        if (!item) {
            return "Item not found!"
        }
        await MenuItem.updateOne({_id}, {name, description, price});

        await this.menuItemPublisher.UpdateItem({_id, name, price});
        return "Item updated successfully!";
    }

    async DeleteMenuItems(_id, userId) {
        const item = await MenuItem.findById(_id);
        const userRelation = await Employees.findOne({userId, "restaurantId":item.restaurantId});
        if (!userRelation || userRelation.position === 'worker') {
            return "User does not have any relation with the given restaurant!";
        }
        if (!item) {
            return "Item not found!"
        }
        await MenuItem.findByIdAndDelete(_id);

        await this.menuItemPublisher.DeleteItem(_id);
        return "Item deleted successfully!";
    }

}

export default MenuItemsService;