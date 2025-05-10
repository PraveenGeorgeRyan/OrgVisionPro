'use client';

import React from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { Employee } from '../../../shared/types';
import { setCurrentEmployee } from '../../redux/slices/employeeSlice';

interface EmployeeCardProps {
  employee: Employee;
  forPdfExport?: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, forPdfExport = false }) => {
  const dispatch = useDispatch();
  
  const handleClick = () => {
    dispatch(setCurrentEmployee(employee));
  };
  
  return (
    <div 
      className="flex flex-row items-center p-2 bg-teal-500 rounded-lg shadow-lg text-white cursor-pointer hover:bg-teal-600 transition-colors w-64 gap-3"
      onClick={handleClick}
      data-component-name="EmployeeCard"
    >
      <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-white flex-shrink-0">
        {employee.imagePath ? (
          <Image 
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${employee.imagePath}`}
            alt={employee.name}
            width={56}
            height={56}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-teal-300 text-teal-700 text-xl font-bold">
            {employee.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-col overflow-hidden">
        <h3 className={`font-bold text-base ${forPdfExport ? '' : 'truncate'}`} data-component-name="EmployeeCard">{employee.name}</h3>
        <p className={`text-xs ${forPdfExport ? '' : 'truncate'}`} data-component-name="EmployeeCard">{employee.designation}</p>
      </div>
    </div>
  );
};

export default EmployeeCard;
