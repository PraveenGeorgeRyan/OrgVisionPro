import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { Employee, OrganizationNode } from '../../shared/types';

// Simulating a database with a JSON file for this demo
// In a real application, this would use a proper SQL database
const dbFilePath = path.join(__dirname, '../data/employees.json');

// Ensure the data directory exists
const ensureDataDirExists = async () => {
  const dataDir = path.join(__dirname, '../data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    // Directory already exists or cannot be created
    console.error('Error creating data directory:', err);
  }
};

// Initialize database if not exists
const initializeDb = async (): Promise<void> => {
  await ensureDataDirExists();
  try {
    await fs.access(dbFilePath);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(dbFilePath, JSON.stringify([], null, 2));
  }
};

// Read all employees from the JSON file
const getAllEmployees = async (): Promise<Employee[]> => {
  await initializeDb();
  try {
    const data = await fs.readFile(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading employees:', error);
    return [];
  }
};

// Find an employee by ID
const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const employees = await getAllEmployees();
  return employees.find(emp => emp.id === id) || null;
};

// Add a new employee
const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const employees = await getAllEmployees();
  const newEmployee = { ...employee, id: uuidv4() };
  employees.push(newEmployee);
  await fs.writeFile(dbFilePath, JSON.stringify(employees, null, 2));
  return newEmployee;
};

// Update an existing employee
const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee | null> => {
  const employees = await getAllEmployees();
  const index = employees.findIndex(emp => emp.id === id);
  
  if (index === -1) return null;
  
  employees[index] = { ...employees[index], ...employee };
  await fs.writeFile(dbFilePath, JSON.stringify(employees, null, 2));
  return employees[index];
};

// Delete an employee
const deleteEmployee = async (id: string): Promise<boolean> => {
  const employees = await getAllEmployees();
  const filteredEmployees = employees.filter(emp => emp.id !== id);
  
  if (filteredEmployees.length === employees.length) return false;
  
  // Update any employees that had this employee as their manager
  for (const emp of filteredEmployees) {
    if (emp.reportingManagerId === id) {
      emp.reportingManagerId = null;
    }
  }
  
  await fs.writeFile(dbFilePath, JSON.stringify(filteredEmployees, null, 2));
  return true;
};

// Build the organization tree
const getOrganizationTree = async (): Promise<OrganizationNode[]> => {
  const employees = await getAllEmployees();
  
  // Find root employees (those with no reporting manager)
  const rootEmployees = employees.filter(emp => !emp.reportingManagerId);
  
  // Create a map for quick lookup
  const employeeMap = new Map<string, Employee>();
  employees.forEach(emp => employeeMap.set(emp.id, emp));
  
  // Build the tree recursively
  const buildTree = (employee: Employee): OrganizationNode => {
    const subordinates = employees
      .filter(emp => emp.reportingManagerId === employee.id)
      .map(buildTree);
    
    return {
      ...employee,
      subordinates
    };
  };
  
  return rootEmployees.map(buildTree);
};

export {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getOrganizationTree
};
