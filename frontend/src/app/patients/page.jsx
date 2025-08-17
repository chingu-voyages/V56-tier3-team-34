'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PatientList from '@/components/patients/PatientList';
import { useAuth } from '@/contexts/AuthContext'; 

export default function PatientManagementPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Patient Management
        </h1>
        {/* Conditionally render the button only for admin users */}
        {isAdmin && (
          <button 
          onClick={() => router.push('/add-patient')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            + Add Patient
          </button>
        )}
      </div>
      <p className="text-gray-600 mb-6">Manage and track all patients in the system</p>
      <div className="bg-white shadow rounded-lg p-4">
        <PatientList />
      </div>
    </div>
  );
}