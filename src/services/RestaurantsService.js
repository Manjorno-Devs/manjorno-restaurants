import mongoose from 'mongoose';

import Restaurants from '../models/Restaurants.js';

class RestaurantsService {

    constructor(){}

    async CreateRestaurant(name, pictures, contacts, locationLink) {
        Restaurants.create({name, pictures, contacts, locationLink});
    }

    async AddMenuItems(restaurantId, name, description, price, pictures) {
        
    }

    async FindRestaurant(name, description, price, pictures) {



    }

    async FindMenuItem() {



    }

    async UpdateRestaurantInfo(name, pictures, contacts, locationLink) {
        


    }

    async UpdateMenuItems() {



    }

    async DeleteRestaurant() {



    }

    async DeleteMenuItems() {



    }

}