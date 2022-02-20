import express from "express";

import RestaurantController from "./controllers/RestaurantsController.js";

const router = express.Router();

const restaurantController = new RestaurantController();

router.get('/', (req, res) => {
    const message = "test123";
    res.status(200).json({message});
});

router.post('/create', (req, res) => restaurantController.CreateRestaurant(req, res));
router.get('/find', (req, res) => restaurantController.FindRestaurant(req, res));

export default router;