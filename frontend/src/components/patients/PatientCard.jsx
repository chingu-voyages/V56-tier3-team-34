import React from "react";
import { Phone, Home, ClipboardList, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PatientCard({ patient }) {
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      "Checked In": "bg-green-100 text-green-700",
      "Pre-Procedure": "bg-yellow-100 text-yellow-700",
      "In-progress": "bg-red-100 text-red-700",
      "Closing": "bg-orange-100 text-orange-700",
      "Recovery": "bg-purple-100 text-purple-700",
      "Complete": "bg-green-100 text-green-700", 
      "Dismissal": "bg-gray-100 text-gray-700", 
      "Scheduled": "bg-blue-100 text-blue-700", 
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const router = useRouter();
  const handleViewDetails = () => {
        router.push(`/patients/${patient.patient_number}`);
    };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4 flex flex-col justify-between h-full">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">
            {patient.first_name} {patient.last_name}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
              patient.status
            )}`}
          >
            {patient.status}
          </span>
          <span className="text-sm text-gray-400 mt-1">#{patient.patient_number}</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-3 text-sm text-gray-600 mb-6">
        <div className="flex items-center">
          <Phone className="w-4 h-4 text-gray-400 mr-2" />
          {patient.phone}
        </div>
        <div className="flex items-center">
          <Home className="w-4 h-4 text-gray-400 mr-2" />
          Room {patient.room_no || "N/A"}
        </div>
        <div className="flex items-center">
          <ClipboardList className="w-4 h-4 text-gray-400 mr-2" />
          <span className="truncate">{patient.procedure}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <span>
            {patient.surgeon_name || "No Surgeon"} • {formatDate(patient.scheduled_time)},{" "}
            {formatTime(patient.scheduled_time)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button 
      onClick={handleViewDetails}
      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition-colors">
        View Details
      </button>
    </div>
  );
}