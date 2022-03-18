import mongoose from 'mongoose';

import Employees from "../models/Employees.js";
import Restaurants from "../models/Restaurant.js";
import Users from "../models/Users.js";

import EmployeePublisher from "../rabbitmq/publisher-employees.js"; 

class EmployeesService{

    constructor() {
        this.employeePublisher = new EmployeePublisher();
    }

    async HireEmployee(employeeHiringId, userId, restaurantId, position){
        const restaurant = await Restaurants.findById(restaurantId);
        if (!restaurant) {
            return "Restaurant does not exist!";
        }
        const EmployeeHiring = await Employees.findOne({
            "userId":employeeHiringId, 
            restaurantId
        });
        if (!EmployeeHiring || EmployeeHiring.position === 'worker') {
            return "User does not have any relation with the given restaurant or does not have permitions!";
        }
        const checkIFEmployeeExists = await Employees.findOne({userId, restaurantId});
        if (checkIFEmployeeExists) {
            return "Employee already hired!";
        }

        const _id = mongoose.Types.ObjectId();

        await Employees.create({
            _id,
            userId, 
            restaurantId, 
            position, 
            "HiredBy":EmployeeHiring._id
        });

        await this.employeePublisher.AddEmployee({_id, userId, restaurantId, position});

        return "Employee hired successfully!";
    }

    async SearchEmployee(employeeCheckingId, restaurantId, {id, userId, username, firstName, lastName, position}){
        if (!restaurantId) {
            const searchResult = Employees.find({"userId":employeeCheckingId});
            return searchResult;
        }
        const checkIFEmployeeSearchingExists = await Employees.findOne({"userId":employeeCheckingId, restaurantId});
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
                {restaurantId},
                {restaurantId, position}
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
        if (!EmployeeUpdating || EmployeeHiring.position === 'worker') {
            return "User does not have any relation with the given restaurant or does not have permitions!";
        }
        const employee = await Employees.findOne({
            "userId": employeeId,
            restaurantId
        });
        if (!employee || !employee.workingHere) {
            return "The employee is not working here!";
        }
        if (employee.position !== 'owner') {
            return "Can't update owners!";
        }
        await Employees.updateOne(
            {"userId": employeeId, restaurantId} ,{
                position,
                workingHere
        });

        await this.employeePublisher.UpdateEmployee({"userId": employeeId, restaurantId, position});

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
        if (!EmployeeDeleting || EmployeeDeleting.position === 'worker') {
            return "User does not have any relation with the given restaurant or does not have permitions!";
        }
        const employee = await Employees.findOne({
            "userId": employeeId,
            restaurantId
        });
        if (employee.workingHere) {
            return "Can't delete employee that's currently working!";
        }
        if (employee.position !== 'worker') {
            return "Managers can't delete owners!";
        }
        await Employees.deleteOne(employee);

        await this.employeePublisher.DeleteEmployee({"userId":employeeId, restaurantId});
        return "Employee deleted successfully!";
    }
}

export default EmployeesService;