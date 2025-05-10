import { Request, Response } from 'express';
import * as employeeModel from '../models/employeeModel';
import { Employee } from '../../shared/types';
import path from 'path';
import fs from 'fs/promises';

// Create upload directory if it doesn't exist
const ensureUploadDirExists = async () => {
  const uploadDir = path.join(__dirname, '../uploads');
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Error creating upload directory:', err);
  }
};

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await employeeModel.getAllEmployees();
    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees'
    });
  }
};

// Get employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await employeeModel.getEmployeeById(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee'
    });
  }
};

// Add a new employee
export const addEmployee = async (req: Request, res: Response) => {
  try {
    const { name, designation, dateOfBirth, yearsOfExperience, reportingManagerId } = req.body;
    
    // Validate required fields
    if (!name || !designation) {
      return res.status(400).json({
        success: false,
        error: 'Name and designation are required'
      });
    }
    
    // Handle file upload
    let imagePath = null;
    if (req.file) {
      await ensureUploadDirExists();
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    // Create employee record
    const newEmployee: Omit<Employee, 'id'> = {
      name,
      designation,
      dateOfBirth,
      yearsOfExperience: parseInt(yearsOfExperience) || 0,
      reportingManagerId: reportingManagerId || null,
      imagePath
    };
    
    const employee = await employeeModel.addEmployee(newEmployee);
    
    res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee added successfully'
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add employee'
    });
  }
};

// Update an employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, designation, dateOfBirth, yearsOfExperience, reportingManagerId } = req.body;
    
    // Check if employee exists
    const existingEmployee = await employeeModel.getEmployeeById(id);
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    // Handle file upload if provided
    let imagePath = existingEmployee.imagePath;
    if (req.file) {
      await ensureUploadDirExists();
      imagePath = `/uploads/${req.file.filename}`;
      
      // Delete old image if exists
      if (existingEmployee.imagePath) {
        const oldImagePath = path.join(__dirname, '..', existingEmployee.imagePath);
        try {
          await fs.access(oldImagePath);
          await fs.unlink(oldImagePath);
        } catch (err) {
          // File doesn't exist or cannot be deleted, continue anyway
          console.error('Error deleting old image:', err);
        }
      }
    }
    
    // Update employee data
    const updatedEmployee: Partial<Employee> = {
      name: name || existingEmployee.name,
      designation: designation || existingEmployee.designation,
      dateOfBirth: dateOfBirth || existingEmployee.dateOfBirth,
      yearsOfExperience: yearsOfExperience !== undefined ? parseInt(yearsOfExperience) : existingEmployee.yearsOfExperience,
      reportingManagerId: reportingManagerId !== undefined ? reportingManagerId : existingEmployee.reportingManagerId,
      imagePath
    };
    
    const employee = await employeeModel.updateEmployee(id, updatedEmployee);
    
    res.status(200).json({
      success: true,
      data: employee,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update employee'
    });
  }
};

// Delete an employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if employee exists
    const existingEmployee = await employeeModel.getEmployeeById(id);
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    // Delete employee image if exists
    if (existingEmployee.imagePath) {
      const imagePath = path.join(__dirname, '..', existingEmployee.imagePath);
      try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
      } catch (err) {
        // File doesn't exist or cannot be deleted, continue anyway
        console.error('Error deleting employee image:', err);
      }
    }
    
    const result = await employeeModel.deleteEmployee(id);
    
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete employee'
    });
  }
};
