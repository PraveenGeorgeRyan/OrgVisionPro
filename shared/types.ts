/**
 * Shared type definitions for both frontend and backend
 */

export interface Employee {
  id: string;
  name: string;
  designation: string;
  dateOfBirth: string;
  yearsOfExperience: number;
  reportingManagerId: string | null;
  imagePath: string | null;
}

export interface OrganizationNode extends Employee {
  subordinates: OrganizationNode[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EmployeeFormData {
  name: string;
  designation: string;
  dateOfBirth: string;
  yearsOfExperience: number;
  reportingManagerId: string | null;
  image?: File;
}

export enum ApiEndpoints {
  EMPLOYEES = '/api/employees',
  ORGANIZATION = '/api/organization',
}
