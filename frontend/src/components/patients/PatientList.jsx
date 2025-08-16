import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import PatientCard from "./PatientCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const DEBOUNCE_DELAY_MS = 500; 

const statusOptions = [
  "All",
  "Checked In",
  "Pre-Procedure",
  "In-progress",
  "Closing",
  "Recovery",
  "Complete",
  "Dismissal",
];

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      let url;
      if (debouncedSearchTerm || statusFilter !== "All") {
        url = new URL(`${API_BASE_URL}/patients/search/`);
        if (debouncedSearchTerm) {
          url.searchParams.append("name", debouncedSearchTerm);
        }
        if (statusFilter !== "All") {
          url.searchParams.append("status", statusFilter);
        }
      } else {
        url = new URL(`${API_BASE_URL}/patients/`);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("API response data:", data);

        if (data && data.items && Array.isArray(data.items)) {
          setPatients(data.items);
        } else if (Array.isArray(data)) {
          setPatients(data);
        } else {
          setPatients(data ? [data] : []);
        }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patients. Please try again later.");
      setPatients([]); 
    } finally {
      setLoading(false);
    }
  };

  fetchPatients();
}, [debouncedSearchTerm, statusFilter]);

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

  return (
    <div>
      {/* Filters and Add Patient Button */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex-1 mr-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search patients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient List Container */}
      {patients.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          {searchTerm || statusFilter !== "All"
            ? "No patients match your search criteria."
            : "No patients found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <PatientCard key={patient.patient_number} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
}
