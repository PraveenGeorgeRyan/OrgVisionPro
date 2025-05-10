import express from 'express';
import multer from 'multer';
import path from 'path';
import * as employeeController from '../controllers/employeeController';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filter only image files
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};

// Configure upload settings
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1 // 1MB limit as specified in requirements
  },
  fileFilter: fileFilter
});

// Routes
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', upload.single('image'), employeeController.addEmployee);
router.put('/:id', upload.single('image'), employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export default router;
