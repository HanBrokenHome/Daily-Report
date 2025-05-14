import { Router } from "express";
import multer from "multer";

// Controller
import {convertExcelToJson, filterData, getAllData, getFilterOptions, getVendorGroupAddonCount} from "../controller/xlsx.controller.js"
import { Login } from "../controller/user.controller.js";

// Middleware
import { protectRoute } from "../middleware/Protected.middleware.js";

// Setup multer untuk handle file upload
const upload = multer({ dest: 'uploads/' });
export const Route = () => {
  const router = Router();
  // 🔐 Login endpoint
  router.post('/login', Login);

  // 📤 Upload file xlsx endpoint (wajib login)
  router.post(
    '/upload',
    protectRoute,
    upload.fields([
      { name: 'xpro', maxCount: 1 },
      { name: 'vendor', maxCount: 1 }
    ]),
    convertExcelToJson
  );  
  router.get('/GetData', protectRoute, getFilterOptions)
  router.get('/filter', protectRoute, filterData)
  router.get('/Datas', protectRoute, getAllData)
  router.get('/VendorCount', protectRoute, getVendorGroupAddonCount)
  return router;
};
