"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  error,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function AddPatient() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "", 
    city: "", 
    state: "", 
    country: "",
    phone: "",
    email: "",
    room_no: "",
    procedure: "",
    scheduled_time: "",
    surgeon_name: "",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!formData.first_name.trim())
      newErrors.first_name = "First Name is required.";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last Name is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.procedure.trim())
      newErrors.procedure = "Procedure is required.";
    if (!formData.scheduled_time)
      newErrors.scheduled_time = "Scheduled Time is required.";
    if (!formData.surgeon_name.trim())
      newErrors.surgeon_name = "Surgeon's Name is required.";

    console.log("Validation errors:", newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const payload = {
        ...formData,
        scheduled_time: new Date(formData.scheduled_time).toISOString(),
        surgeon_name: formData.surgeon_name || null,
        room_no: formData.room_no || null,
        note: formData.note || null,
      };
      const response = await fetch(`${API_BASE_URL}/patients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add patient.");
      }
      toast.success("Patient added successfully!");
      router.push("/patients");
    } catch (error) {
      toast.error(error.message || "Error adding patient.");
    } finally {
      setIsSubmitting(false);
    }
  };

  <Field
    label="First Name"
    name="first_name"
    placeholder="John"
    required
    value={formData.first_name}
    onChange={handleInputChange}
    error={errors.first_name}
  />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Patient Information
        </h2>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field
            label="First Name"
            name="first_name"
            placeholder="John"
            required
            value={formData.first_name}
            onChange={handleInputChange}
            error={errors.first_name}
          />
          <Field
            label="Last Name"
            name="last_name"
            placeholder="Doe"
            required
            value={formData.last_name}
            onChange={handleInputChange}
            error={errors.last_name}
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="john.doe@example.com"
            required
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          <Field
            label="Phone Number"
            name="phone"
            placeholder="+15551234567"
            required
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
          />
        </div>

        {/* Address & City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Field
          label="Address"
          name="address"
          placeholder="123 Main St"
          required
          value={formData.address}
          onChange={handleInputChange}
          error={errors.address}
        />
        <Field
          label="City"
          name="city"
          placeholder="New York"
          required
          value={formData.city}
          onChange={handleInputChange}
          error={errors.city}
        />
      </div>

      {/* State & Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Field
          label="State"
          name="state"
          placeholder="NY"
          required
          value={formData.state}
          onChange={handleInputChange}
          error={errors.state}
        />
        <Field
          label="Country"
          name="country"
          placeholder="USA"
          required
          value={formData.country}
          onChange={handleInputChange}
          error={errors.country}
        />
      </div>

        {/* Room & Procedure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field
            label="Room Number"
            name="room_no"
            placeholder="203"
            value={formData.room_no}
            onChange={handleInputChange}
            error={errors.room_no}
          />
          <Field
            label="Procedure"
            name="procedure"
            placeholder="Appendectomy"
            required
            value={formData.procedure}
            onChange={handleInputChange}
            error={errors.procedure}
          />
        </div>

        {/* Surgeon & Scheduled Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field
            label="Surgeon's Name"
            name="surgeon_name"
            placeholder="e.g., Dr. Jane Doe"
            required
            value={formData.surgeon_name}
            onChange={handleInputChange}
            error={errors.surgeon_name}
          />
          <Field
            label="Scheduled Time"
            name="scheduled_time"
            type="datetime-local"
            required
            value={formData.scheduled_time}
            onChange={handleInputChange}
            error={errors.scheduled_time}
          />
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notes
          </label>
          <textarea
            id="note"
            name="note"
            rows="3"
            value={formData.note}
            onChange={handleInputChange}
            placeholder="Additional notes or special instructions..."
            className="block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Patient"}
        </button>
      </div>
    </form>
  );
}
