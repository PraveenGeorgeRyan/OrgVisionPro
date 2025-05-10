import express from 'express';
import * as organizationController from '../controllers/organizationController';

const router = express.Router();

// Get organization tree structure
router.get('/', organizationController.getOrganizationTree);

export default router;
