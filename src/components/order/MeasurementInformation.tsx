"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

// Types
type StandardMeasurementKey =
  | "chest"
  | "waist"
  | "hips"
  | "shoulderWidth"
  | "sleeveLength"
  | "inseam"
  | "height"
  | "neck";

interface StandardMeasurements {
  chest: string;
  waist: string;
  hips: string;
  shoulderWidth: string;
  sleeveLength: string;
  inseam: string;
  height: string;
  neck: string;
}

interface CustomMeasurement {
  id?: number;
  name: string;
  value: string;
}

interface MeasurementData {
  measurementUnit: string;
  standardMeasurements: StandardMeasurements;
  customMeasurements: CustomMeasurement[];
  additionalFitNotes: string;
}

interface MeasurementInformationProps {
  data: MeasurementData;
  onChange: (data: Partial<MeasurementData>) => void;
  onStandardMeasurementChange: (data: Partial<StandardMeasurements>) => void;
}

const STANDARD_MEASUREMENTS = [
  { key: "chest" as StandardMeasurementKey, label: "Chest" },
  { key: "waist" as StandardMeasurementKey, label: "Waist" },
  { key: "hips" as StandardMeasurementKey, label: "Hips" },
  { key: "shoulderWidth" as StandardMeasurementKey, label: "Shoulder Width" },
  { key: "sleeveLength" as StandardMeasurementKey, label: "Sleeve Length" },
  { key: "inseam" as StandardMeasurementKey, label: "Inseam" },
  { key: "height" as StandardMeasurementKey, label: "Height" },
  { key: "neck" as StandardMeasurementKey, label: "Neck" },
];

export const MeasurementInformation: React.FC<MeasurementInformationProps> = ({
  data,
  onChange,
  onStandardMeasurementChange,
}) => {
  const [customMeasurement, setCustomMeasurement] = useState({
    name: "",
    value: "",
  });

  const addCustomMeasurement = () => {
    if (customMeasurement.name && customMeasurement.value) {
      const newCustomMeasurements = [
        ...data.customMeasurements,
        { ...customMeasurement, id: Date.now() },
      ];
      onChange({ customMeasurements: newCustomMeasurements });
      setCustomMeasurement({ name: "", value: "" });
    }
  };

  const removeCustomMeasurement = (id: number) => {
    const filteredMeasurements = data.customMeasurements.filter(
      (m) => m.id !== id
    );
    onChange({ customMeasurements: filteredMeasurements });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Measurement Information
        </h2>
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>Measurement Options</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Measurements Form */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Custom Measurements
            </h3>

            {/* Unit Selection */}
            <div className="flex items-center space-x-6 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="measurementUnit"
                  value="cm"
                  checked={data.measurementUnit === "cm"}
                  onChange={(e) =>
                    onChange({ measurementUnit: e.target.value })
                  }
                  className="w-4 h-4 text-gray-900"
                />
                <span className="ml-2 text-sm text-gray-700">cm</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="measurementUnit"
                  value="inches"
                  checked={data.measurementUnit === "inches"}
                  onChange={(e) =>
                    onChange({ measurementUnit: e.target.value })
                  }
                  className="w-4 h-4 text-gray-900"
                />
                <span className="ml-2 text-sm text-gray-700">inches</span>
              </label>
            </div>

            {/* Standard Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {STANDARD_MEASUREMENTS.map((measurement) => (
                <div key={measurement.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {measurement.label}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={data.standardMeasurements[measurement.key]}
                    onChange={(e) =>
                      onStandardMeasurementChange({
                        [measurement.key]: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Value"
                  />
                </div>
              ))}
            </div>

            {/* Add Custom Measurement Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <input
                type="text"
                value={customMeasurement.name}
                onChange={(e) =>
                  setCustomMeasurement((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Measurement Name"
              />
              <input
                type="text"
                value={customMeasurement.value}
                onChange={(e) =>
                  setCustomMeasurement((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Value"
              />
            </div>

            {/* Add Custom Measurement Button */}
            <button
              type="button"
              onClick={addCustomMeasurement}
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors mb-6"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Custom Measurement
            </button>

            {/* Custom Measurements List */}
            {data.customMeasurements.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Custom Measurements
                </h4>
                <div className="space-y-3">
                  {data.customMeasurements.map((measurement) => (
                    <div
                      key={measurement.id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="text"
                        value={measurement.name}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        placeholder="Measurement Name"
                      />
                      <input
                        type="text"
                        value={measurement.value}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        placeholder="Value"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (measurement.id !== undefined) {
                            removeCustomMeasurement(measurement.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Fit Notes */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">
              Additional Fit Notes
            </h3>
            <textarea
              value={data.additionalFitNotes}
              onChange={(e) => onChange({ additionalFitNotes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Add any specific fit preferences or concerns..."
            />
          </div>
        </div>

        {/* Measurement Guide */}
        <div className="lg:col-span-1">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Measurement Guide
          </h3>
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="w-24 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2">
                  <div className="text-xs text-gray-500">Front View</div>
                </div>
              </div>
              <div className="text-center">
                <div className="w-24 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2">
                  <div className="text-xs text-gray-500">Back View</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Please follow these guidelines for accurate measurements:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Use a fabric measuring tape</li>
                <li>• Keep the tape snug but not tight</li>
                <li>• Measure over undergarments or tight clothing</li>
                <li>
                  • Stand straight with arms at sides for most measurements
                </li>
                <li>
                  • For length measurements, measure from the highest point to
                  the lowest point
                </li>
              </ul>
              <div className="mt-3">
                <a
                  href="#"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Download detailed measurement guide
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
