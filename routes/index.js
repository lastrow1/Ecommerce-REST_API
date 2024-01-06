import express from "express";
import registerController from "../controller/auth/registerController.js";
import loginController from "../controller/auth/loginController.js";
import userController from "../controller/userController.js";
import refreshController from "../controller/refreshController.js";
const router = express.Router();
import auth from "../middlewares/auth.js";
import productController from "../controller/productController.js";
import admin from "../middlewares/admin.js";
router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/refresh", refreshController.refresh);
router.post("/logout", auth, loginController.logout);


router.post("/products", [auth, admin], productController.store);
router.put("/products/:id", [auth, admin], productController.update);
router.delete("/products/:id", [auth, admin], productController.delete);
router.get("/products", productController.index);
router.get("/products/:id", productController.show);

export default router;
