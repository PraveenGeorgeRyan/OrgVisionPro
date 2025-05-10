'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchOrganizationTree, setOrganizationName } from '../../redux/slices/employeeSlice';
import CustomOrgChart from '../ui/CustomOrgChart';

const OrganizationTree: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { organizationTree, organizationName, loading, error } = useSelector((state: RootState) => state.employees);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    dispatch(fetchOrganizationTree());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (organizationTree.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">No Data!</strong>
        <span className="block sm:inline"> No employees found. Add employees to see the organization structure.</span>
      </div>
    );
  }



  const handleNameEdit = () => {
    setIsEditingName(true);
    setNameInput(organizationName);
  };

  const handleNameSave = () => {
    if (nameInput.trim()) {
      dispatch(setOrganizationName(nameInput.trim()));
    }
    setIsEditingName(false);
  };

  return (
    <div className="p-4">
      <div id="organization-tree-container" className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-center items-center mb-8">
          {isEditingName ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="px-3 py-2 border rounded-md text-2xl font-bold text-center"
                autoFocus
              />
              <button 
                onClick={handleNameSave}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button 
                onClick={() => setIsEditingName(false)}
                className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-center">{organizationName}</h2>
              <button 
                onClick={handleNameEdit}
                className="ml-2 text-gray-500 hover:text-gray-700"
                title="Edit organization name"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        <CustomOrgChart data={organizationTree} />
      </div>
    </div>
  );
};

export default OrganizationTree;
