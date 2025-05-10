'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchEmployees, setCurrentEmployee } from '../redux/slices/employeeSlice';
import { Employee } from '../../shared/types';
import Logo from '../components/ui/Logo';
import { exportToPdf } from '../utils/pdfExport';

// Use dynamic imports with ssr: false to prevent hydration errors
const OrganizationTree = dynamic(
  () => import('../components/organization/OrganizationTree'),
  { ssr: false }
);

const EmployeeForm = dynamic(
  () => import('../components/employees/EmployeeForm'),
  { ssr: false }
);

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentEmployee } = useSelector((state: RootState) => state.employees as { currentEmployee: Employee | null });
  const [showAddForm, setShowAddForm] = useState(false);
  
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);
  
  const handleAddEmployee = () => {
    setShowAddForm(true);
  };
  
  const handleCloseForm = () => {
    setShowAddForm(false);
    dispatch(setCurrentEmployee(null));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-3">
          <button
              onClick={handleAddEmployee}
              className="bg-white text-teal-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Add Employee
            </button>
            <button
              onClick={() => exportToPdf('organization-tree-container', `orgvision-${new Date().toISOString().split('T')[0]}`)}
              className="bg-gray-100 text-teal-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors flex items-center"
              title="Export organization chart as PDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <OrganizationTree />
      </main>
      
      {(showAddForm || currentEmployee) && (
        <EmployeeForm 
          employee={currentEmployee || undefined} 
          onClose={handleCloseForm} 
        />
      )}
    </div>
  );
}
