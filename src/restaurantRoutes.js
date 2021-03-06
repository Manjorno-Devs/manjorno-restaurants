import express from "express";

import RestaurantController from "./controllers/RestaurantsController.js";
import MenuItemsController from "./controllers/MenuItemsController.js";
import EmployeesController from "./controllers/EmployeesController.js";
import KeycloakInit from "./helpers/InitKeycloak.js";
import UserController from "./controllers/UsersController.js";

const router = express.Router();

const restaurantController = new RestaurantController();
const menuItemsController = new MenuItemsController();
const employeesController = new EmployeesController();
const userController = new UserController();

const keycloak = KeycloakInit();

router.get('/find', async (req, res) => restaurantController.FindRestaurant(req, res));
router.get('/menu/find', async (req, res) => menuItemsController.FindItem(req, res));

router.use(keycloak.middleware());

router.post('/create', keycloak.protect(), async (req, res) => restaurantController.CreateRestaurant(req, res));
router.put('/update', keycloak.protect(), async (req, res) => restaurantController.UpdateRestaurant(req, res));
router.delete('/delete', keycloak.protect(), async (req, res) => restaurantController.DeleteRestaurant(req, res));

router.post('/menu/add', keycloak.protect(), async (req, res) => menuItemsController.AddItem(req, res));
router.put('/menu/update', keycloak.protect(), async (req, res) => menuItemsController.UpdateItem(req, res));
router.delete('/menu/delete', keycloak.protect(), async(req, res) => menuItemsController.DeleteItem(req, res));

router.post('/employees/hire', keycloak.protect(), async (req, res) => employeesController.HireEmployee(req, res));
router.get('/employees/find', keycloak.protect(), async(req, res) => employeesController.FindEmployee(req, res));
router.put('/employees/update', keycloak.protect(), async (req, res) => employeesController.UpdateEmployee(req, res));
router.delete('/employees/delete', keycloak.protect(), async (req, res) => employeesController.DeleteEmployee(req, res));

router.get('/users/find', keycloak.protect(), async (req, res) => userController.FindUser(req, res));
export default router;