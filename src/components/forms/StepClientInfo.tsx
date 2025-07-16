type StepClientInfoProps = {
  data: {
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    [key: string]: string | undefined;
  };
  onUpdate: (updatedFields: { [key: string]: string | undefined }) => void;
};

const StepClientInfo: React.FC<StepClientInfoProps> = ({ data, onUpdate }) => {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client Name *
        </label>
        <input
          type="text"
          value={data.clientName || ""}
          onChange={(e) => handleInputChange("clientName", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter client's full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          value={data.clientEmail || ""}
          onChange={(e) => handleInputChange("clientEmail", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="client@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          value={data.clientPhone || ""}
          onChange={(e) => handleInputChange("clientPhone", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+1 (555) 123-4567"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          type="text"
          value={data.clientAddress || ""}
          onChange={(e) => handleInputChange("clientAddress", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Street address, City, State, ZIP"
        />
      </div>

      <div className="md:col-span-2">
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Client contact information will be used for
            order updates and appointment scheduling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepClientInfo;
