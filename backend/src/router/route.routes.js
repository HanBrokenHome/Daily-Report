import { Router } from "express";
import multer from "multer";

import { UploadXlsx } from "../controller/xlsx.controller.js";
import { Login } from "../controller/user.controller.js";
import { protectRoute } from "../middleware/Protected.middleware.js";

const upload = multer({ dest: 'uploads/' });

export const Route = () => {
  const router = Router();

  // Login route
  router.post('/login', Login);

  // Upload route (protected)
  router.post('/upload', protectRoute, upload.single('file'), UploadXlsx);

  return router;
};
