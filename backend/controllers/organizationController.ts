import { Request, Response } from 'express';
import * as employeeModel from '../models/employeeModel';

// Get the organization tree structure
export const getOrganizationTree = async (req: Request, res: Response) => {
  try {
    const organizationTree = await employeeModel.getOrganizationTree();
    
    res.status(200).json({
      success: true,
      data: organizationTree
    });
  } catch (error) {
    console.error('Error fetching organization tree:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch organization tree'
    });
  }
};
