import MenuItemsService from "../services/MenuItemsService.js";
import jwt from "jsonwebtoken";

const menuItemsService = new MenuItemsService();

class MenuItemsController{

    async AddItem(req, res){
        try {
            const {restaurantId} = req.query;
            const {name, description, price, pictures} = req.body;

            const tokenPayload = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userId = tokenPayload.sub;
            
            const response = await menuItemsService.AddMenuItem(userId, restaurantId, name, description, price, pictures);
            
            if (response === "User does not have any relation with the given restaurant!") {
                res.status(403).json({response});
                return;
            }

            if (response === "Restaurant does not exist!") {
                res.status(404).json({response});
                return;            
            }
        
            res.status(200).json({response});
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async FindItem(req, res){
        try {
            const {id, restaurantId, itemName} = req.query;

            const response = await menuItemsService.FindMenuItem(id, restaurantId, itemName);
            
            if (response.length === 0 || !response) {
                res.status(404).json({"error":"Item not found!"});
            }

            res.status(200).json(response);
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async UpdateItem(req, res){
        try {
            const {id} = req.query;
            const {name, description, price} = req.body;
            
            const tokenPayload = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userId = tokenPayload.sub;

            const response = await menuItemsService.UpdateMenuItems(id, userId, name, description, price);

            if (response === "User does not have any relation with the given restaurant!") {
                res.status(403).json({response});
                return;
            }

            if (response === "Restaurant does not exist!") {
                res.status(404).json({response});
                return;            
            }

        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async DeleteItem(req, res){
        try {
            const {id} = req.query;

            const tokenPayload = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userId = tokenPayload.sub;

            const response = await menuItemsService.DeleteMenuItems(id, userId);

            if (response === "User does not have any relation with the given restaurant!") {
                res.status(403).json({response});
                return;
            }

            if (response === "Restaurant does not exist!") {
                res.status(404).json({response});
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