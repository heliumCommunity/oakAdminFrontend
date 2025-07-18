// CustomerSelection.tsx
import React, { useState, useEffect } from "react";
import { Search, User, ChevronDown, X } from "lucide-react";

interface Customer {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  clientType: string;
  address: string;
  // Add measurement data if stored
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

interface CustomerSelectionProps {
  onCustomerSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
}

const CustomerSelection: React.FC<CustomerSelectionProps> = ({
  onCustomerSelect,
  selectedCustomer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch customers from API
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        "https://oakadmin-im5t.onrender.com/api/v1/oakcollectionsadmin/admin/customers", // Adjust endpoint as needed
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data.customers || data || []); // Adjust based on API response structure
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch customers"
      );
      // Fallback to mock data for development
      setCustomers([
        {
          id: "1",
          fullName: "John Doe",
          emailAddress: "john.doe@example.com",
          phoneNumber: "+1234567890",
          clientType: "Premium",
          address: "123 Main St, City, State 12345",
          measurements: {
            chest: "42",
            waist: "34",
            hips: "40",
            shoulderWidth: "18",
            sleeveLength: "24",
            inseam: "32",
            height: "180",
            neck: "16",
          },
          additionalFitNotes: "Prefers slim fit",
        },
        {
          id: "2",
          fullName: "Jane Smith",
          emailAddress: "jane.smith@example.com",
          phoneNumber: "+1987654321",
          clientType: "Regular",
          address: "456 Oak Ave, City, State 12345",
          measurements: {
            chest: "38",
            waist: "28",
            hips: "36",
            shoulderWidth: "16",
            sleeveLength: "22",
            inseam: "30",
            height: "165",
            neck: "14",
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && customers.length === 0) {
      fetchCustomers();
    }
  }, [isOpen]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber.includes(searchQuery)
  );

  const handleCustomerSelect = (customer: Customer) => {
    onCustomerSelect(customer);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClearSelection = () => {
    onCustomerSelect(null);
    setSearchQuery("");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Customer Selection
        </h2>
        {selectedCustomer && (
          <button
            onClick={handleClearSelection}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Selection
          </button>
        )}
      </div>

      {selectedCustomer ? (
        // Selected customer display
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">
                  {selectedCustomer.fullName}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedCustomer.emailAddress}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Change Customer
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {selectedCustomer.phoneNumber}
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              {selectedCustomer.clientType}
            </p>
            {selectedCustomer.measurements && (
              <p className="text-green-600 mt-1">
                ✓ Measurements available and will be auto-populated
              </p>
            )}
          </div>
        </div>
      ) : (
        // Customer selection dropdown
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-600">
                Select existing customer or create new
              </span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
              {/* Search input */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Customer list */}
              <div className="max-h-48 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading customers...
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">
                    <p>{error}</p>
                    <button
                      onClick={fetchCustomers}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Try Again
                    </button>
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery
                      ? "No customers found matching your search"
                      : "No customers available"}
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.fullName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {customer.emailAddress}
                          </p>
                          <p className="text-xs text-gray-500">
                            {customer.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerSelection;
