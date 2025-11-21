import { Router } from "express";
import * as roleCtrl from "../../controllers/users/role.controller";
import {
  validateRoleId,
  validateCreateRole,
  validateUpdateRole,
} from "../../validators/users/role.validator";

const router = Router();

router.get("/", roleCtrl.getAllRoles);
router.get("/:id", validateRoleId, roleCtrl.getRoleById);

router.post("/", validateCreateRole, roleCtrl.createRole);
router.put("/:id", validateUpdateRole, roleCtrl.updateRole);
router.delete("/:id", validateRoleId, roleCtrl.deleteRole);

export default router;
