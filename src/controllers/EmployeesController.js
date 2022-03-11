import EmployeeService from "../services/EmployeesService.js";
import jwt from "jsonwebtoken";

const employees = new EmployeeService();

class MenuItemsController{

    async HireEmployee(req, res){
        try {
            const {restaurantId} = req.query;
            const {userId, position} = req.body;

            const tokenPayload = await jwt.decode(req.headers.authorization.split(' ')[1]);
            const employeeHiringId = tokenPayload.sub;

            const response = await employees.HireEmployee(employeeHiringId, userId, restaurantId, position);

            if (response === "Restaurant does not exist!") {
                res.status(404).json({response});
                return;
            }

            if (response === "User does not have any relation with the given restaurant or does not have permitions!") {
                res.status(403).json({response});
                return;
            }

            if (response === "Employee already hired!") {
                res.status(409).json({response});
                return;
            }

            res.status(200).json({response});
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async FindEmployee(req, res){
        try {
            const {id, userId, restaurantId, username, firstName, lastName, position} = req.query;

            const tokenPayload = await jwt.decode(req.headers.authorization.split(' ')[1]);
            const employeeCheckingId = tokenPayload.sub;

            const response = await employees.SearchEmployee(employeeCheckingId, restaurantId, {id, userId, username, firstName, lastName, position}); 

            if (response === "User does not have any relation with the given restaurant!") {
                res.status(403).json({response});
                return;
            }

            res.status(200).json(response);

        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async UpdateEmployee(req, res){
        try {

            const {restaurantId} = req.query;
            const {employeeId, position, workingHere} = req.body;

            const tokenPayload = await jwt.decode(req.headers.authorization.split(' ')[1]);
            const employeeUpdatingId = tokenPayload.sub;

            const response = await employees.UpdateEmployee(
                employeeUpdatingId, 
                restaurantId,
                employeeId,
                position,
                workingHere 
            );
            
            if (response === "Restaurant does not exist!") {
                res.status(404).json({response});
                return;
            }

            if (response === "User does not have any relation with the given restaurant or does not have permitions!") {
                res.status(403).json({response});
                return;
            }

            if (response === 'The employee is not working here!') {
                res.status(404).json({response});
                return;
            }

            if (response === "Can't update owners!") {
                res.status(403).json({response});
                return;
            }

            res.status(200).json({response});
        } catch (error) {
            console.log(error);
            error = error.message;
            res.status(500).json({error});
        }
    }

    async DeleteEmployee(req, res){
        try {

            const {restaurantId} = req.query;
            const {employeeId} = req.body;

            const tokenPayload = await jwt.decode(req.headers.authorization.split(' ')[1]);
            const employeeDeletingId = tokenPayload.sub;

            const response = await employees.DeleteEmployee(
                employeeDeletingId,
                restaurantId,
                employeeId
            );
            
            if (response === "Restaurant does not exist!") {
                res.status(404).json({response});
                return;
            }

            if (response === "User does not have any relation with the given restaurant or does not have permitions!") {
                res.status(403).json({response});
                return;
            }

            if (response === "Can't delete employee that's currently working!") {
                res.status(403).json({response});
                return;
            }

            if (response === "Managers can't delete owners!") {
                res.status(403).json({response});
                return;
            }

            res.status(200).json({response});
            
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

}

export default MenuItemsController;