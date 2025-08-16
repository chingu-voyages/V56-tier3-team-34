'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import AddPatient from '../../components/patients/AddPatient';

export default function AddPatientPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Link */}
      <div className="mb-4">
        <button
          onClick={() => router.push('/patients')}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </button>
      </div>

      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
      <p className="text-gray-600 mb-6">
        Enter patient information and surgery details
      </p>

      {/* Form Box */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <AddPatient />
      </div>
    </div>
  );
}
