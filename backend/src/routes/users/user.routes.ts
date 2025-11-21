import { Router } from "express";
import * as userController from "../../controllers/users/user.controller";
import { validateRegister } from "../../validators/users/user.validator";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.post("/register", validateRegister, userController.register);
router.post("/invite", authMiddleware, userController.inviteUser);
router.get("/", authMiddleware, userController.getUsers);

export default router;
