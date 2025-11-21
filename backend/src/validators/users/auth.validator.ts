import { createValidator } from "../../middlewares/validator.middleware";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "../../schemas/auth.schema";

export const validateRegister = createValidator(registerSchema);
export const validateLogin    = createValidator(loginSchema);
export const validateRefresh  = createValidator(refreshSchema);
export const validateLogout   = createValidator(logoutSchema);
