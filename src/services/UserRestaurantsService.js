import RestaurantUsersRelation from "../models/RestaurantUsersRelation.js";

class UserRestaurantService{

    async CreateRelation(userId, restaurantId, username, position){
        RestaurantUsersRelation.create({userId, restaurantId, username, position});
    }

}

export default UserRestaurantService;