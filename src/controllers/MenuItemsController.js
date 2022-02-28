import MenuItemsService from "../services/MenuItemsService.js";

const menuItemsService = new MenuItemsService();

class MenuItemsController{

    async AddItem(req, res){
        try {
            const {restaurantId} = req.query;
            const {name, description, price, pictures} = req.body;

            const tokenPayload = req.headers.authorization.split(' ')[1];
            const userId = tokenPayload.sub;
            
            const message = menuItemsService.AddMenuItem(userId, restaurantId, name, description, price, pictures);
            
            if (message === "Restaurant does not exist!") {
                res.status(404).json({message});
                return;            
            }
        
            if (message === "User does not have any relation with the given restaurant!") {
                res.status(403).json({message});
                return;
            }
        
            res.status(200).json({message});
        } catch (error) {
            error = error.message;
            res.status(500).json({error});
        }
    }

    async FindItem(req, res){

    }

    async UpdateItem(req, res){

    }

    async DeleteItem(req, res){

    }

}

export default MenuItemsController;