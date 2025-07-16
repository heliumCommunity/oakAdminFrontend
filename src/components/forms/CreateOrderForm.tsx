"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, X } from "lucide-react";
import { ProgressSteps } from "../order/ProgressSteps";
import { ClientInformation } from "../order/ClientInformation";
import { MeasurementInformation } from "../order/MeasurementInformation";
import { ProductionTimeline } from "../order/ProductionTimeline";
import { InstructionsAndDesignRefs } from "../order/InstructionsAndDesignRefs";

const CreateOrderForm = () => {
  const [currentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    // Client Info
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    clientType: "",
    address: "",
    saveClientInfo: true,

    // Measurements
    measurementUnit: "cm",
    standardMeasurements: {
      chest: "",
      waist: "",
      hips: "",
      shoulderWidth: "",
      sleeveLength: "",
      inseam: "",
      height: "",
      neck: "",
    },
    customMeasurements: [],
    additionalFitNotes: "",
  });

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

  interface FormData {
    // Client Info
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    clientType: string;
    address: string;
    saveClientInfo: boolean;

    // Measurements
    measurementUnit: string;
    standardMeasurements: StandardMeasurements;
    customMeasurements: CustomMeasurement[];
    additionalFitNotes: string;
  }

  type UpdateSection = "client" | "measurements" | "standardMeasurements";

  type UpdateData =
    | Partial<
        Pick<
          FormData,
          | "fullName"
          | "emailAddress"
          | "phoneNumber"
          | "clientType"
          | "address"
          | "saveClientInfo"
        >
      >
    | Partial<Pick<FormData, "measurementUnit" | "additionalFitNotes">>
    | Partial<StandardMeasurements>;

  const updateFormData = (section: UpdateSection, data: UpdateData) => {
    if (section === "standardMeasurements") {
      setFormData((prev) => ({
        ...prev,
        standardMeasurements: { ...prev.standardMeasurements, ...data },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    }
  };

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: HandleSubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication token not found.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      dueDate: timelineData.deadlineDate,
      startDate: timelineData.startDate,
      endDate: timelineData.deadlineDate,
      customerFirstName: formData.fullName.split(" ")[0] || "",
      customerLastName: formData.fullName.split(" ")[1] || "",
      customerName: formData.fullName,
      customerEmail: formData.emailAddress,
      customerPhoneNumber: formData.phoneNumber,
      customerAddress: formData.address,
      clientType: formData.clientType,
      orderFulfillmentMethod: "Carryout",
      status: "Ongoing",
      neck: parseFloat(formData.standardMeasurements.neck),
      shoulderWidth: parseFloat(formData.standardMeasurements.shoulderWidth),
      chest: parseFloat(formData.standardMeasurements.chest),
      waist: parseFloat(formData.standardMeasurements.waist),
      hip: parseFloat(formData.standardMeasurements.hips),
      sleeveLength: parseFloat(formData.standardMeasurements.sleeveLength),
      inseam: parseFloat(formData.standardMeasurements.inseam),
      outSeam: 40.0, // Placeholder
      thigh: 22.0, // Placeholder
      wrist: 9.5, // Placeholder
      customMeasurement: true,
      fittingRequired: timelineData.fittingRequired === "Yes",
      priorityLevel: timelineData.priorityLevel.toUpperCase(),
      additionalFitNotes: formData.additionalFitNotes,
      additionalNotes: timelineData.additionalNotes,
      riderName: "Alex Smith", // Placeholder
      riderNumber: "+1987654321", // Placeholder
    };

    try {
      const response = await fetch(
        "https://oakadmin-im5t.onrender.com/api/v1/oakcollectionsadmin/admin/populate-orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to submit");

      // Show success modal instead of alert
      setShowSuccessModal(true);
      console.log("API result:", result);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit order");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step navigation
  const steps = [
    { number: 1, title: "Client Info", description: "Basic client details" },
    {
      number: 2,
      title: "Order Details",
      description: "Garment specifications",
    },
    { number: 3, title: "Measurements", description: "Body measurements" },
    { number: 4, title: "Timeline", description: "Production schedule" },
    { number: 5, title: "Instructions", description: "Special notes" },
    { number: 6, title: "Review", description: "Final review" },
  ];

  const [timelineData, setTimelineData] = useState({
    startDate: "31/05/2025",
    deadlineDate: "14/06/2025",
    priorityLevel: "",
    fittingRequired: "",
    notifyClient: true,
    additionalNotes: "",
    milestones: [
      {
        id: 1,
        name: "Measurement & Pattern",
        icon: "ruler",
        date: "",
        color: "bg-blue-100 text-blue-600",
      },
      {
        id: 2,
        name: "Cutting",
        icon: "scissors",
        date: "",
        color: "bg-orange-100 text-orange-600",
      },
      {
        id: 3,
        name: "Quality Control Inspection 1",
        icon: "shield",
        date: "",
        color: "bg-red-100 text-red-600",
      },
      {
        id: 4,
        name: "Stitching",
        icon: "needle",
        date: "",
        color: "bg-purple-100 text-purple-600",
      },
      {
        id: 5,
        name: "Quality Control Inspection 2",
        icon: "shield",
        date: "",
        color: "bg-red-100 text-red-600",
      },
      {
        id: 6,
        name: "Fitting",
        icon: "user",
        date: "",
        color: "bg-gray-100 text-gray-600",
      },
      {
        id: 7,
        name: "Final Delivery",
        icon: "package",
        date: "",
        color: "bg-green-100 text-green-600",
      },
    ],
  });

  interface Milestone {
    id: number;
    name: string;
    icon: string;
    date: string;
    color: string;
  }

  interface UpdateMilestoneDate {
    (id: number, date: string): void;
  }

  const updateMilestoneDate: UpdateMilestoneDate = (id, date) => {
    setTimelineData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone: Milestone) =>
        milestone.id === id ? { ...milestone, date } : milestone
      ),
    }));
  };

  interface TimelineData {
    startDate: string;
    deadlineDate: string;
    priorityLevel: string;
    fittingRequired: string;
    notifyClient: boolean;
    additionalNotes: string;
    milestones: Milestone[];
  }

  type TimelineField =
    | "startDate"
    | "deadlineDate"
    | "priorityLevel"
    | "fittingRequired"
    | "notifyClient"
    | "additionalNotes";

  const handleInputChange = (field: TimelineField, value: string | boolean) => {
    setTimelineData((prev: TimelineData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Optionally reset form or redirect
    // window.location.href = '/dashboard'; // Redirect to dashboard
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    // Reset form to initial state
    setFormData({
      fullName: "",
      emailAddress: "",
      phoneNumber: "",
      clientType: "",
      address: "",
      saveClientInfo: true,
      measurementUnit: "cm",
      standardMeasurements: {
        chest: "",
        waist: "",
        hips: "",
        shoulderWidth: "",
        sleeveLength: "",
        inseam: "",
        height: "",
        neck: "",
      },
      customMeasurements: [],
      additionalFitNotes: "",
    });
    setTimelineData({
      startDate: "31/05/2025",
      deadlineDate: "14/06/2025",
      priorityLevel: "",
      fittingRequired: "",
      notifyClient: true,
      additionalNotes: "",
      milestones: [
        {
          id: 1,
          name: "Measurement & Pattern",
          icon: "ruler",
          date: "",
          color: "bg-blue-100 text-blue-600",
        },
        {
          id: 2,
          name: "Cutting",
          icon: "scissors",
          date: "",
          color: "bg-orange-100 text-orange-600",
        },
        {
          id: 3,
          name: "Quality Control Inspection 1",
          icon: "shield",
          date: "",
          color: "bg-red-100 text-red-600",
        },
        {
          id: 4,
          name: "Stitching",
          icon: "needle",
          date: "",
          color: "bg-purple-100 text-purple-600",
        },
        {
          id: 5,
          name: "Quality Control Inspection 2",
          icon: "shield",
          date: "",
          color: "bg-red-100 text-red-600",
        },
        {
          id: 6,
          name: "Fitting",
          icon: "user",
          date: "",
          color: "bg-gray-100 text-gray-600",
        },
        {
          id: 7,
          name: "Final Delivery",
          icon: "package",
          date: "",
          color: "bg-green-100 text-green-600",
        },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Create New Order
          </h1>
          <p className="text-gray-600">
            Fill in the details below to create a new custom garment order
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={currentStep} steps={steps} />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Information */}
          <ClientInformation
            data={{
              fullName: formData.fullName,
              emailAddress: formData.emailAddress,
              phoneNumber: formData.phoneNumber,
              clientType: formData.clientType,
              address: formData.address,
              saveClientInfo: formData.saveClientInfo,
            }}
            onChange={(data) => updateFormData("client", data)}
          />
          {/* Measurements */}

          <MeasurementInformation
            data={{
              measurementUnit: formData.measurementUnit,
              standardMeasurements: formData.standardMeasurements,
              customMeasurements: formData.customMeasurements,
              additionalFitNotes: formData.additionalFitNotes,
            }}
            onChange={(data) => updateFormData("measurements", data)}
            onStandardMeasurementChange={(data) =>
              updateFormData("standardMeasurements", data)
            }
          />

          {/* Production Timeline */}
          <ProductionTimeline
            data={timelineData}
            onChange={handleInputChange}
            onMilestoneUpdate={updateMilestoneDate}
          />

          {/* Instructions & Design References */}
          <InstructionsAndDesignRefs
            data={{
              additionalNotes: formData.additionalFitNotes,
              uploadedFiles: [],
              clientMaterials: false,
            }}
            onChange={(field: "additionalNotes" | string, value: unknown) => {
              if (field === "additionalNotes") {
                updateFormData("measurements", {
                  additionalFitNotes: value as string,
                });
              }
            }}
          />
          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create & Assign Order"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Order Created Successfully!
                    </h3>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Your order for <strong>{formData.fullName}</strong> has been
                  successfully created and assigned. The client will be notified
                  via email at <strong>{formData.emailAddress}</strong>.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Order Details:
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Client:</span>{" "}
                    {formData.fullName}
                  </p>
                  <p>
                    <span className="font-medium">Deadline:</span>{" "}
                    {timelineData.deadlineDate}
                  </p>
                  <p>
                    <span className="font-medium">Priority:</span>{" "}
                    {timelineData.priorityLevel || "Standard"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/dashboard"
                  className="flex-1 bg-gray-900 text-white text-center py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Back to Dashboard
                </Link>
                <button
                  onClick={handleCreateAnother}
                  className="flex-1 bg-white text-gray-900 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Create Another Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderForm;
