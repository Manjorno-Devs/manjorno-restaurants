import RestaurantUsersRelation from "../models/RestaurantUsersRelation.js";

class UserRestaurantService{

    async CreateRelation(userId, restaurantId, username, position){
        await RestaurantUsersRelation.create({userId, restaurantId, username, position});
    }

    async SearchRelations({_id, userId, restaurantId, username, position}){
        console.log(userId);
        console.log(restaurantId);
        const searchResult = await RestaurantUsersRelation.find({_id, userId, restaurantId, username, position});
        return searchResult;
    }

    async DeleteRelation(_id){
        await RestaurantUsersRelation.deleteOne({_id});
    }

    async DeleteRelationByRestaurantId(restaurantId){
        await RestaurantUsersRelation.deleteMany({restaurantId});
    }
}

export default UserRestaurantService;