import express from "express";

import RestaurantController from "./controllers/RestaurantsController.js";
import KeycloakInit from "./helpers/InitKeycloak.js";

const router = express.Router();

const restaurantController = new RestaurantController();

const keycloak = KeycloakInit();

router.get('/find', async (req, res) => restaurantController.FindRestaurant(req, res));

router.use(keycloak.middleware());

router.post('/create', keycloak.protect(), async (req, res) => restaurantController.CreateRestaurant(req, res));

export default router;