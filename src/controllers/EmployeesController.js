import EmployeeService from "../services/EmployeesService.js";
import jwt from "jsonwebtoken";

const employees = new EmployeeService();

class MenuItemsController{

    async Add(req, res){
        try {
            const {restaurantId} = req.query;
            const {userId, position} = req.body;

            const tokenPayload = jwt.decode(req.headers.authorization.split(' ')[1]);
            const employeeHiringId = tokenPayload.sub;

            const respnse = await employees.HireEmployee(employeeHiringId, userId, restaurantId, position);

            if (response === "Restaurant does not exist!") {
                res.status(404).json({response});
                return;
            }

            if (response === "Employee already hired!") {
                res.status(409).json({response});
                return;
            }

            res.status(200).json({respnse});
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async Find(req, res){
        try {
            const {id, userId, restaurantId, username, firstName, lastName, position} = req.body;


            const tokenPayload = jwt.decode(req.headers.authorization.split(' ')[1]);
            const employeeHiringId = tokenPayload.sub;

            const search = await employees.SearchRelations(id, userId, restaurantId, username, firstName, lastName, position); 


            res.status(200).json(search);

        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async Update(req, res){
        try {
            
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async Delete(req, res){
        try {
            
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

}

export default MenuItemsController;