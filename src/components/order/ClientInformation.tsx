// components/order/ClientInformation.tsx
import { CustomInput } from "../ui/CustomInput";
import { CustomSelect } from "../ui/CustomSelect";
import { Textarea } from "../ui/TextArea";
import { Checkbox } from "../ui/Checkbox";
// import { clientsApi, Client } from "../../lib/api/clients";

interface ClientInfoData {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  clientType: string;
  address: string;
  saveClientInfo: boolean;
}

interface ClientInformationProps {
  data: ClientInfoData;
  onChange: (data: Partial<ClientInfoData>) => void;
  errors?: Partial<Record<keyof ClientInfoData, string>>;
}

const clientTypeOptions = [
  { value: "individual", label: "Individual" },
  { value: "corporate", label: "Corporate" },
  { value: "wedding", label: "Wedding Party" },
  { value: "event", label: "Event Group" },
];

export const ClientInformation: React.FC<ClientInformationProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  //   const [isSearching, setIsSearching] = useState(false);
  //   const [searchResults, setSearchResults] = useState<Client[]>([]);
  //   const [showSearchResults, setShowSearchResults] = useState(false);

  //   const handleEmailSearch = async (email: string) => {
  //     if (email.length < 3) {
  //       setSearchResults([]);
  //       setShowSearchResults(false);
  //       return;
  //     }

  //     setIsSearching(true);
  //     try {
  //       const response = await clientsApi.searchClients(email);
  //       if (response.success && response.data) {
  //         setSearchResults(response.data);
  //         setShowSearchResults(response.data.length > 0);
  //       }
  //     } catch (error) {
  //       console.error("Search failed:", error);
  //     } finally {
  //       setIsSearching(false);
  //     }
  //   };

  //   const handleClientSelect = (client: Client) => {
  //     onChange({
  //       fullName: client.fullName,
  //       emailAddress: client.emailAddress,
  //       phoneNumber: client.phoneNumber,
  //       clientType: client.clientType,
  //       address: client.address,
  //     });
  //     setShowSearchResults(false);
  //   };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Client Information
      </h2>

      <div className="flex items-center justify-end mb-4">
        <span className="text-sm text-gray-500">
          * Required fields are marked with *
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomInput
          label="Full Name"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="Enter client's full name"
          required
          error={errors.fullName}
        />

        <div className="relative">
          <CustomInput
            label="Email Address"
            type="email"
            value={data.emailAddress}
            onChange={(e) => {
              onChange({ emailAddress: e.target.value });
              //   handleEmailSearch(e.target.value);
            }}
            placeholder="client@oakcollection.com"
            required
            error={errors.emailAddress}
          />

          {/* Search Results Dropdown */}
          {/* {showSearchResults && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {isSearching ? (
                <div className="p-3 text-sm text-gray-500">Searching...</div>
              ) : (
                searchResults.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    // onClick={() => handleClientSelect(client)}
                  >
                    <div className="font-medium text-gray-900">
                      {client.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {client.emailAddress}
                    </div>
                  </button>
                ))
              )}
            </div>
          )} */}
        </div>

        <CustomInput
          label="Phone Number"
          type="tel"
          value={data.phoneNumber}
          onChange={(e) => onChange({ phoneNumber: e.target.value })}
          placeholder="+234 (905) 354 6453"
          required
          error={errors.phoneNumber}
        />

        <CustomSelect
          label="Client Type"
          value={data.clientType}
          onChange={(e) => onChange({ clientType: e.target.value })}
          options={clientTypeOptions}
          placeholder="Select Item"
          error={errors.clientType}
        />

        <div className="md:col-span-2">
          <Textarea
            label="Address"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            rows={3}
            placeholder="Enter client's delivery address"
            error={errors.address}
          />
        </div>

        <div className="md:col-span-2">
          <Checkbox
            label="Save client information for future orders"
            description="This will add the client to your customer database."
            checked={data.saveClientInfo}
            onChange={(e) => onChange({ saveClientInfo: e.target.checked })}
          />
        </div>
      </div>
    </div>
  );
};
