import express from "express";

import MenuItemsController from "./controllers/MenuItemsController.js";
// import KeycloakInit from "./helpers/InitKeycloak.js";

const router = express.Router();

const menuItem = new MenuItemsController();


router.get('test', (req, res) => res.status(200).json("Ok"));

// const keycloak = KeycloakInit();
// router.use(keycloak.middleware());

// router.post('/add', keycloak.protect(), (req, res) => menuItem.AddItem(req, res));

export default router;