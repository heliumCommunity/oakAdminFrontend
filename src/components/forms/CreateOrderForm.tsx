"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, X } from "lucide-react";
import { ClientInformation } from "../order/ClientInformation";
import OrderInformation from "../order/OrderInformation";
import { MeasurementInformation } from "../order/MeasurementInformation";
import { ProductionTimeline } from "../order/ProductionTimeline";
import { InstructionsAndDesignRefs } from "../order/InstructionsAndDesignRefs";
import CustomerSelection from "../order/CustomerSelection";
import StickyFormNavigator, {
  useFormSections,
} from "../order/StickyFormNavigator";

const CreateOrderForm = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<CreateOrderFormData>({
    // Client Info
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    clientType: "",
    address: "",
    saveClientInfo: true,
    orderItems: [
      {
        productType: "",
        specificItem: "",
        color: "",
        quantity: 1,
        size: "",
        material: "",
        specialInstructions: "",
      },
    ],

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

  // NEW - Memoized to prevent unnecessary re-renders
  const memoizedFormData = useMemo(() => {
    return {
      ...formData,
      standardMeasurements: {
        chest: parseFloat(formData.standardMeasurements.chest) || 0,
        waist: parseFloat(formData.standardMeasurements.waist) || 0,
        hips: parseFloat(formData.standardMeasurements.hips) || 0,
        shoulderWidth:
          parseFloat(formData.standardMeasurements.shoulderWidth) || 0,
        sleeveLength:
          parseFloat(formData.standardMeasurements.sleeveLength) || 0,
        inseam: parseFloat(formData.standardMeasurements.inseam) || 0,
        height: parseFloat(formData.standardMeasurements.height) || 0,
        neck: parseFloat(formData.standardMeasurements.neck) || 0,
      },
    };
  }, [formData]);

  const { sections, completedSections } = useFormSections(memoizedFormData);

  interface Customer {
    id: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    clientType: string;
    address: string;
    measurements?: {
      chest: string;
      waist: string;
      hips: string;
      shoulderWidth: string;
      sleeveLength: string;
      inseam: string;
      height: string;
      neck: string;
    };
    additionalFitNotes?: string;
  }
  interface OrderItem {
    productType: string;
    specificItem: string;
    color: string;
    quantity: number;
    size?: string;
    material?: string;
    specialInstructions?: string;
  }

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const handleSectionNavigation = (sectionId: string) => {
    // Optional: You can add any additional logic here when a section is clicked
    console.log(`Navigating to section: ${sectionId}`);
  };

  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);

    if (customer) {
      // Auto-populate form with customer data
      setFormData((prev) => ({
        ...prev,
        fullName: customer.fullName,
        emailAddress: customer.emailAddress,
        phoneNumber: customer.phoneNumber,
        clientType: customer.clientType,
        address: customer.address,
        standardMeasurements: customer.measurements || {
          chest: "",
          waist: "",
          hips: "",
          shoulderWidth: "",
          sleeveLength: "",
          inseam: "",
          height: "",
          neck: "",
        },
        additionalFitNotes: customer.additionalFitNotes || "",
      }));
    } else {
      // Clear form when no customer is selected
      setFormData({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        clientType: "",
        address: "",
        saveClientInfo: true,
        orderItems: [
          {
            productType: "",
            specificItem: "",
            color: "",
            quantity: 1,
            size: "",
            material: "",
            specialInstructions: "",
          },
        ],
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
    }
  };

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

  interface CreateOrderFormData {
    // Client Info
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    clientType: string;
    address: string;
    saveClientInfo: boolean;

    // Measurements
    measurementUnit: string;
    standardMeasurements: {
      chest: string;
      waist: string;
      hips: string;
      shoulderWidth: string;
      sleeveLength: string;
      inseam: string;
      height: string;
      neck: string;
    };
    customMeasurements: CustomMeasurement[];
    additionalFitNotes: string;

    orderItems: OrderItem[];
  }

  type UpdateSection =
    | "client"
    | "measurements"
    | "standardMeasurements"
    | "orderItems";

  type UpdateData =
    | Partial<
        Pick<
          CreateOrderFormData,
          | "fullName"
          | "emailAddress"
          | "phoneNumber"
          | "clientType"
          | "address"
          | "saveClientInfo"
        >
      >
    | Partial<
        Pick<CreateOrderFormData, "measurementUnit" | "additionalFitNotes">
      >
    | Partial<StandardMeasurements>
    | OrderItem[];

  const updateFormData = (section: UpdateSection, data: UpdateData) => {
    if (section === "standardMeasurements") {
      setFormData((prev) => ({
        ...prev,
        standardMeasurements: { ...prev.standardMeasurements, ...data },
      }));
    } else if (section === "orderItems") {
      setFormData((prev) => ({
        ...prev,
        orderItems: data as OrderItem[],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      orderItems: [
        {
          productType: "",
          specificItem: "",
          color: "",
          quantity: 1,
          size: "",
          material: "",
          specialInstructions: "",
        },
      ],
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

      {/* Add the Sticky Navigator */}
      <StickyFormNavigator
        sections={sections}
        completedSections={completedSections}
        onSectionClick={handleSectionNavigation}
      />

      {/* Main Content */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 
  py-8 pt-16 pb-20
  md:pt-8 md:pb-8 md:pr-6
  xl:pr-80"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Create New Order
          </h1>
          <p className="text-gray-600">
            Fill in the details below to create a new custom garment order
          </p>
        </div>

        <div id="customer-selection">
          <CustomerSelection
            onCustomerSelect={handleCustomerSelect}
            selectedCustomer={selectedCustomer}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Information */}
          <div id="client-information">
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
          </div>
          {/* Order Information */}
          <div id="order-information">
            <OrderInformation
              data={formData.orderItems}
              onChange={(data: OrderItem[]) =>
                updateFormData("orderItems", data)
              }
            />
          </div>
          {/* Measurements */}
          <div id="measurements">
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
          </div>
          <div id="timeline">
            {/* Production Timeline */}
            <ProductionTimeline
              data={timelineData}
              onChange={handleInputChange}
              onMilestoneUpdate={updateMilestoneDate}
            />
          </div>

          {/* Instructions & Design References */}
          <div id="instructions">
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
          </div>
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
