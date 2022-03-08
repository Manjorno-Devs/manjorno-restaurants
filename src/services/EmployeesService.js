import Employees from "../models/Employees.js";
import Restaurants from "../models/Restaurant.js";
import Users from "../models/Users.js";

class EmployeesService{

    async HireEmployee(employeeHiringId, userId, restaurantId, position){
        const restaurant = await Restaurants.findById(restaurantId);
        if (!restaurant) {
            return "Restaurant does not exist!";
        }
        const EmployeeHiring = await Employees.findOne({
            "userId":employeeHiringId, 
            restaurantId
        });
        if (!EmployeeHiring || (EmployeeHiring.position !== "owner" & EmployeeHiring.position !== "manager")) {
            return "User does not have any relation with the given restaurant or does not have permitions!";
        }
        const checkIFEmployeeExists = await Employees.findOne({userId, restaurantId});
        if (checkIFEmployeeExists) {
            return "Employee already hired!";
        }
        const user = await Users.findOne({userId});
        await Employees.create({
            "userId": user.userId, 
            restaurantId, 
            position, 
            "HiredBy":EmployeeHiring._id
        });
        return "Employee hired successfully!";
    }

    async SearchEmployee(employeeChecking, {id, userId, restaurantId, username, firstName, lastName, position}){
        const checkIFEmployeeSearchingExists = await Employees.findOne({"userId":employeeChecking, restaurantId});
        if (!checkIFEmployeeSearchingExists) {
            return "User does not have any relation with the given restaurant!";
        }
        if (id) {
            const searchResult = await Employees.findById(id);
            return searchResult;
        }
        const searchResult = await Employees.find({
            $or: [
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

    async UpdateEmployee(EmployeeUpdatingId, restaurantId, employeeId, position, workingHere) {
        const restaurant = await Restaurants.findById(restaurantId);
        if (!restaurant) {
            return "Restaurant does not exist!";
        }
        const EmployeeUpdating = await Employees.findOne({
            "userId":EmployeeUpdatingId, 
            restaurantId
        });
        if (!EmployeeUpdating || (EmployeeUpdating.position !== "owner" & EmployeeUpdating.position !== "manager")) {
            return "User does not have any relation with the given restaurant or does not have permitions!";
        }
        const employee = await Employees.findOne({
            "userId": employeeId,
            restaurantId
        });
        if (!employee || !employee.workingHere) {
            return "The employee is not working here!";
        }
        if (employee.position === 'owner' && EmployeeUpdating.position === 'manager') {
            return "Managers can't update owners!";
        }
        await Employees.updateOne(
            {"userId": employeeId} ,{
                position,
                workingHere
        });
        return "Employee updated successfully!"
    }

    async DeleteEmployee(EmployeeDeletingId, restaurantId, employeeId){
        const restaurant = await Restaurants.findById(restaurantId);
        if (!restaurant) {
            return "Restaurant does not exist!";
        }
        const EmployeeDeleting = await Employees.findOne({
            "userId":EmployeeDeletingId, 
            restaurantId
        });
        if (!EmployeeDeleting || (EmployeeDeleting.position !== "owner" & EmployeeDeleting.position !== "manager")) {
            return "User does not have any relation with the given restaurant or does not have permitions!";
        }
        const employee = await Employees.findOne({
            "userId": employeeId,
            restaurantId
        });
        if (employee.workingHere) {
            return "Can't delete employee that's currently working!";
        }
        if (employee.position === 'owner' && EmployeeDeleting.position === 'manager') {
            return "Managers can't delete owners!";
        }
        await Employees.deleteOne(employee);
        return "Employee deleted successfully!";
    }
}

export default EmployeesService;