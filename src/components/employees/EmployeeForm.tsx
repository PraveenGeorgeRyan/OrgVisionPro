'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Employee, EmployeeFormData } from '../../../shared/types';
import { addEmployee, updateEmployee, fetchEmployees, fetchOrganizationTree, deleteEmployee } from '../../redux/slices/employeeSlice';
import { AppDispatch, RootState } from '../../redux/store';

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading } = useSelector((state: RootState) => state.employees as { employees: Employee[], loading: boolean });
  
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    designation: '',
    dateOfBirth: '',
    yearsOfExperience: 0,
    reportingManagerId: '',
    image: undefined,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Initialize form with employee data if editing
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        designation: employee.designation,
        dateOfBirth: employee.dateOfBirth,
        yearsOfExperience: employee.yearsOfExperience,
        reportingManagerId: employee.reportingManagerId,
        image: undefined,
      });
      
      if (employee.imagePath) {
        // Only set preview URL on client side
        if (typeof window !== 'undefined') {
          setPreviewUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${employee.imagePath}`);
        }
      }
    }
  }, [employee]);
  
  // Load employees for the reporting manager dropdown
  useEffect(() => {
    if (employees.length === 0) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employees.length]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value,
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (1MB limit)
      if (file.size > 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 1MB',
        }));
        return;
      }
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Only JPG, JPEG, and PNG images are allowed',
        }));
        return;
      }
      
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: '',
        }));
      }
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const submitData: EmployeeFormData = {
        ...formData,
        image: selectedImage || undefined,
      };
      
      if (employee) {
        // Update existing employee
        await dispatch(updateEmployee({ id: employee.id, formData: submitData }));
      } else {
        // Add new employee
        const result = await dispatch(addEmployee(submitData));
        console.log('Employee added result:', result);
      }
      
      // Refresh organization tree and close the form
      await dispatch(fetchEmployees());
      await dispatch(fetchOrganizationTree());
      onClose();
    } catch (error) {
      console.error('Error submitting employee data:', error);
      // Display error to user
      setErrors(prev => ({
        ...prev,
        form: 'Failed to save employee data. Please try again.'
      }));
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
        
        {errors.form && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{errors.form}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                {previewUrl ? (
                  // Use regular img for preview to avoid Next.js image issues
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-gray-400">Image</span>
                )}
              </div>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>
          
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          {/* Designation */}
          <div className="mb-4">
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
              Designation *
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.designation ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
          </div>
          
          {/* Date of Birth */}
          <div className="mb-4">
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>
          
          {/* Years of Experience */}
          <div className="mb-4">
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              id="yearsOfExperience"
              name="yearsOfExperience"
              min="0"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Reporting Manager */}
          <div className="mb-4">
            <label htmlFor="reportingManagerId" className="block text-sm font-medium text-gray-700 mb-1">
              Reporting Manager
            </label>
            <select
              id="reportingManagerId"
              name="reportingManagerId"
              value={formData.reportingManagerId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">None (Top Level)</option>
              {employees
                .filter((emp: Employee) => employee ? emp.id !== employee.id : true)
                .map((emp: Employee) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.designation})
                  </option>
                ))}
            </select>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-between mt-6">
            {employee && (
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this employee?')) {
                    setIsDeleting(true); // Show deleting state
                    try {
                      // Wait for delete operation to complete
                      await dispatch(deleteEmployee(employee.id)).unwrap();
                      
                      // After successful deletion, update the UI by fetching latest data
                      await Promise.all([
                        dispatch(fetchEmployees()).unwrap(),
                        dispatch(fetchOrganizationTree()).unwrap()
                      ]);
                      
                      // Only close the form after all operations complete
                      onClose();
                    } catch (error) {
                      console.error('Failed to delete employee:', error);
                      alert('Failed to delete employee. Please try again.');
                    } finally {
                      setIsDeleting(false);
                    }
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Saving...' : employee ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
