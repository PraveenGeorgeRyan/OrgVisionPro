import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Employee, OrganizationNode, EmployeeFormData, ApiEndpoints } from '../../../shared/types';

// Define the state interface
interface EmployeeState {
  employees: Employee[];
  organizationTree: OrganizationNode[];
  currentEmployee: Employee | null;
  organizationName: string;
  loading: boolean;
  error: string | null;
}

// Get organization name from localStorage or use default
const getSavedOrgName = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('orgVisionProName') || "Company Organization";
  }
  return "Company Organization";
};

// Initial state
const initialState: EmployeeState = {
  employees: [],
  organizationTree: [],
  organizationName: getSavedOrgName(),
  currentEmployee: null,
  loading: false,
  error: null,
};

// API base URL - this should be in an environment variable in a real app
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Async thunks for API interactions
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}${ApiEndpoints.EMPLOYEES}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      const data = await response.json();
      return data.data as Employee[];
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchOrganizationTree = createAsyncThunk(
  'employees/fetchOrganizationTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}${ApiEndpoints.ORGANIZATION}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch organization tree');
      }
      
      const data = await response.json();
      return data.data as OrganizationNode[];
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (formData: EmployeeFormData, { rejectWithValue }) => {
    try {
      const form = new FormData();
      
      // Append text fields
      form.append('name', formData.name);
      form.append('designation', formData.designation);
      form.append('dateOfBirth', formData.dateOfBirth);
      form.append('yearsOfExperience', formData.yearsOfExperience.toString());
      
      if (formData.reportingManagerId) {
        form.append('reportingManagerId', formData.reportingManagerId);
      }
      
      // Append image if available
      if (formData.image) {
        form.append('image', formData.image);
      }
      
      const response = await fetch(`${API_BASE_URL}${ApiEndpoints.EMPLOYEES}`, {
        method: 'POST',
        body: form,
      });
      
      if (!response.ok) {
        throw new Error('Failed to add employee');
      }
      
      const data = await response.json();
      return data.data as Employee;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, formData }: { id: string; formData: EmployeeFormData }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      
      // Append text fields
      form.append('name', formData.name);
      form.append('designation', formData.designation);
      form.append('dateOfBirth', formData.dateOfBirth);
      form.append('yearsOfExperience', formData.yearsOfExperience.toString());
      
      if (formData.reportingManagerId !== undefined) {
        form.append('reportingManagerId', formData.reportingManagerId || '');
      }
      
      // Append image if available
      if (formData.image) {
        form.append('image', formData.image);
      }
      
      const response = await fetch(`${API_BASE_URL}${ApiEndpoints.EMPLOYEES}/${id}`, {
        method: 'PUT',
        body: form,
      });
      
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
      
      const data = await response.json();
      return data.data as Employee;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}${ApiEndpoints.EMPLOYEES}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Create the employee slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setCurrentEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.currentEmployee = action.payload;
    },
    setOrganizationName: (state, action: PayloadAction<string>) => {
      state.organizationName = action.payload;
      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('orgVisionProName', action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Organization Tree
      .addCase(fetchOrganizationTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationTree.fulfilled, (state, action) => {
        state.loading = false;
        state.organizationTree = action.payload;
      })
      .addCase(fetchOrganizationTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add Employee
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentEmployee, setOrganizationName, clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
