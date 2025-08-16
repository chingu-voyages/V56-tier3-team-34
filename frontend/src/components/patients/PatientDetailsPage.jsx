"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  Phone,
  MapPin,
  Stethoscope,
  CalendarDays,
  User,
  Pill,
  CircleCheck,
  Mail,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PatientDetailsPage() {
  const { patientNumber } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!patientNumber) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `${API_BASE_URL}/patients/${patientNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPatient(data);
      } catch (err) {
        console.error("Error fetching patient details:", err);
        setError("Failed to load patient details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
  }, [patientNumber]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-3 text-red-600">{error}</div>;
  }

  const {
    patient_number,
    first_name,
    last_name,
    address,
    city,
    state,
    country,
    phone,
    email,
    procedure,
    scheduled_time,
    surgeon_name,
    room_no,
    note,
    status,
    created_at,
    updated_at,
  } = patient;

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    const datePart = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart}, ${timePart}`;
  };

  const formattedScheduledTime = formatDateTime(scheduled_time);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Checked In":
        return "bg-green-100 text-green-700";
      case "Pre-Procedure":
        return "bg-yellow-100 text-yellow-700";
      case "In-progress":
        return "bg-red-100 text-red-700";
      case "Closing":
        return "bg-orange-100 text-orange-700";
      case "Recovery":
        return "bg-purple-100 text-purple-700";
      case "Complete":
        return "bg-green-100 text-green-700";
      case "Dismissal":
        return "bg-gray-100 text-gray-700";
      case "Scheduled":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const statusStyle = getStatusStyle(status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span className="mr-1">&larr;</span> Back to Patients
        </button>
      </div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {first_name} {last_name}
          </h1>
          <p className="text-gray-500 text-lg">{patient_number}</p>
        </div>
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusStyle}`}
        >
          <CircleCheck className="w-4 h-4" />
          <span className="font-semibold">{status}</span>
        </div>
      </div>

      {/* Patient Details & Status */}
      <h4 className="text-xl font-semibold text-gray-700 mb-4">
        Patient Details
      </h4>
      <div className="space-y-6">
        {/* Patient Information Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <User className="w-5 h-5 mr-2 text-gray-500" /> Patient Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Patient Number:</span>
              <span className="font-semibold">{patient_number}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Room:</span>
              <span className="font-semibold">{room_no || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">{phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">{email || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">
                {address}, {city}, {state}, {country}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">{formattedScheduledTime}</span>
            </div>
          </div>
        </div>

        {/* Surgery Details Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <Stethoscope className="w-5 h-5 mr-2 text-gray-500" /> Surgery
            Details
          </h3>
          <div className="space-y-4">
            <div>
              <span className="text-gray-500">Procedure:</span>
              <p className="font-semibold text-lg">{procedure}</p>
            </div>
            <div>
              <span className="text-gray-500">Surgeon:</span>
              <p className="font-semibold text-lg">{surgeon_name || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <Pill className="w-5 h-5 mr-2 text-gray-500" /> Notes
          </h3>
          <p className="text-gray-700">{note || "No notes available."}</p>
        </div>

        {/* Record Info Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <Clock className="w-5 h-5 mr-2 text-gray-500" /> Record Info
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Created At:</span>{" "}
              {formatDateTime(created_at)}
            </p>
            <p>
              <span className="font-semibold">Updated At:</span>{" "}
              {formatDateTime(updated_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
