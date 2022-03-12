import mongoose from 'mongoose';

import Restaurants from '../models/Restaurant.js';
import Employees from '../models/Employees.js';
import Users from '../models/Users.js';
import MenuItem from '../models/MenuItem.js';

import RestaurantPublisher from '../rabbitmq/publisher-restaurants.js';
import EmployeePublisher from '../rabbitmq/publisher-employees.js';
import MenuItemPublisher from '../rabbitmq/menuItem-publisher.js';

class RestaurantsService {

    constructor() {
        this.restaurantPublisher = new RestaurantPublisher();
        this.employeePublisher = new EmployeePublisher();
        this.menuItemPublisher = new MenuItemPublisher();
    }


    async CreateRestaurant(userId, username, restaurantName, contacts, locationLink) {

        const checkIFExists = await Restaurants.findOne({"name":restaurantName});

        if (checkIFExists) {
            return "Restaurant already exists";
        }

        const _id = mongoose.Types.ObjectId();
        const employee_id = mongoose.Types.ObjectId();

        Restaurants.create({_id, "name":restaurantName, contacts, locationLink});
        Employees.create({userId, username, "restaurantId":_id, "position":"owner"});


        await this.restaurantPublisher.AddURestaurant({_id, "name":restaurantName, contacts, locationLink});
        await this.employeePublisher.AddEmployee({"_id":employee_id, userId, "restaurantId":_id, "position":"owner"});

        return "Restaurant Created successfully";
    }

    async FindRestaurant(_id, name, employeeId) {
        if (employeeId && _id) {
            const employees = await Employees.find({"userId":employeeId, "restaurantId":_id, "position": {$in: ['owner', 'manager']}});
            if (!employees) {
                return "Can't find by the given parameteres!";
            }
            const restaurants = new Array();
            for (let index = 0; index < employees.length; index++) {
                const restaurant = await Restaurants.findById(employees[index].restaurantId);
                await restaurants.push(restaurant);
            }
            return restaurants;
        }
        if (_id) {
            return await Restaurants.findById(_id);
        }
        if (!_id && !name && !employeeId) {
            return await Restaurants.find();
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
        const restaurantUserRelation = await Employees.findOne({userId});
        if (!restaurantUserRelation || restaurantUserRelation === 'worker') {
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

        await this.restaurantPublisher.UpdateRestaurant({_id, toBeUpdated});

        return "Restaurant updated successfully!";
    }

    async DeleteRestaurant(_id, userId) {
        const restaurantUserRelation = await Employees.findOne({userId, "restaurantId":_id});
        if (!restaurantUserRelation || restaurantUserRelation !== 'owner') {
            return "You do not possess the rights for this action!";
        }
        const restaurant = await Restaurants.findById(_id);
        if (!restaurant) {
            return "The Restaurant does not exist";
        }
        await MenuItem.deleteMany({"restaurantId":_id});
        await Restaurants.findByIdAndDelete(_id);
        await Employees.deleteMany({"restaurantId": _id});

        await this.restaurantPublisher.DeleteRestaurant({_id});
        return "Restaurant Deleted successfully";
    }
}

export default RestaurantsService;