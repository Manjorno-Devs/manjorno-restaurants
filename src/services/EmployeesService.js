import Employees from "../models/Employees.js";
import Restaurants from "../models/Restaurant.js";

class EmployeesService{

    async HireEmployee(employeeHiringId, userId, restaurantId, position){
        const checkIFRestaurantExists = await Restaurants.findById(restaurantId);
        if (!checkIFRestaurantExists) {
            return "Restaurant does not exist!";
        }
        const checkIFEmployeeHiringExists = await Employees.findOne({userId, restaurantId});
        if (!checkIFEmployeeHiringExists || (checkIFEmployeeHiringExists.position !== "owner" & checkIFEmployeeHiringExists.position !== "manager")) {
            return "User does not have any relation with the given restaurant or does not have permitions!";
        }
        const checkIFEmployeeExists = await Employees.findOne({userId, restaurantId});
        if (checkIFEmployeeExists) {
            return "Employee already hired!";
        }
        await Employees.create({userId, restaurantId, position});
        return "Employee hired successfully!";
    }

    async SearchRelations(_id, userId, restaurantId, username, firstName, lastName, position){
        console.log(_id);
        const searchResult = await Employees.find({
            $or: [
                {_id}, 
                {userId}, 
                {restaurantId, position}, 
                {restaurantId, username}, 
                {restaurantId, firstName}, 
                {restaurantId, lastName}, 
                {restaurantId, firstName, lastName}
            ]
        });
        return searchResult;
    }

    async DeleteRelation(_id){
        await Employees.deleteOne({_id});
    }

    async DeleteRelationByRestaurantId(restaurantId){
        await Employees.deleteMany({restaurantId});
    }
}

export default EmployeesService;