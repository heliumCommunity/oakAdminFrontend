import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Edit2,
  MoreHorizontal,
  Clock,
  Loader2,
} from "lucide-react";
import DashboardLayout from "@/components/Layout/Dashboard/DashboardLayout";

const OrderManagement = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Name");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface Order {
    id: number;
    orderId: string;
    trackingId: string;
    dueDate: string;
    customerId: string;
    customerFirstName: string;
    customerLastName: string;
    customerName: string;
    customerEmail: string;
    customerPhoneNumber: string;
    customerAddress: string;
    orderFulfillmentMethod: string;
    status: string;
    progress: string | null;
    priorityLevel: string;
    fittingRequired: string;
    startDate: string;
    endDate: string;
    clientType: string;
    additionalFitNotes: string;
    additionalNotes: string;
    riderName: string;
    riderPhoneNumber: string | null;
  }

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const token = localStorage.getItem("token"); // or get from context/provider
        const response = await fetch(
          "https://oakadmin-im5t.onrender.com/api/v1/oakcollectionsadmin/admin/get-all-orders",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        // For demo purposes, using the provided JSON data
        const mockData = [
          {
            id: 1,
            orderId: "Order-9845",
            trackingId: "4381",
            dueDate: "2025-06-29T00:00:00.000+00:00",
            customerId: "JO8856",
            customerFirstName: "Tireni",
            customerLastName: "Alausa",
            customerName: "Tireni Alausa",
            customerEmail: "john.doe@example.com",
            customerPhoneNumber: "+1234567890",
            customerAddress: "123 Main Street, City, Country",
            orderFulfillmentMethod: "CARRYOUT",
            status: "ONGOING",
            progress: null,
            priorityLevel: "HIGH",
            fittingRequired: "true",
            startDate: "2025-09-20",
            endDate: "2025-10-30",
            clientType: "WALK_IN",
            additionalFitNotes: "Customer wants slim fit on sleeves.",
            additionalNotes:
              "Deliver before end of month. Include five extra buttons.",
            riderName: "Alex Smith",
            riderPhoneNumber: null,
          },
          {
            id: 2,
            orderId: "Order-8218",
            trackingId: "5679",
            dueDate: "2025-06-29T00:00:00.000+00:00",
            customerId: "JO4106",
            customerFirstName: "Tireni",
            customerLastName: "Alausa",
            customerName: "Tireni Alausa",
            customerEmail: "john.doe@example.com",
            customerPhoneNumber: "+1234567890",
            customerAddress: "123 Main Street, City, Country",
            orderFulfillmentMethod: "CARRYOUT",
            status: "ONGOING",
            progress: null,
            priorityLevel: "HIGH",
            fittingRequired: "true",
            startDate: "2025-09-20",
            endDate: "2025-10-30",
            clientType: "WALK_IN",
            additionalFitNotes: "Customer wants slim fit on sleeves.",
            additionalNotes:
              "Deliver before end of month. Include five extra buttons.",
            riderName: "Alex Smith",
            riderPhoneNumber: null,
          },
          {
            id: 302,
            orderId: "Order-8046",
            trackingId: "1360",
            dueDate: "2025-06-29T00:00:00.000+00:00",
            customerId: "JO9316",
            customerFirstName: "Joseph",
            customerLastName: "",
            customerName: "Joseph ",
            customerEmail: "joseph@gmail.com",
            customerPhoneNumber: "08033456789",
            customerAddress: "no 2 rhrhknjn",
            orderFulfillmentMethod: "CARRYOUT",
            status: "ONGOING",
            progress: null,
            priorityLevel: "LOW",
            fittingRequired: "false",
            startDate: "2025-06-29",
            endDate: "2025-06-29",
            clientType: "individual",
            additionalFitNotes: "wefwfff",
            additionalNotes: "fsgeggg",
            riderName: "Alex Smith",
            riderPhoneNumber: null,
          },
        ];
        setOrders(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to generate avatar initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper function to generate avatar color
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev: string[]) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.orderId));
    }
  };

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trackingId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || order.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All Priority" ||
      order.priorityLevel === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading orders...</span>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <DashboardLayout>
  //         <div className="text-center">
  //           <div className="text-red-500 mb-2">Error loading orders</div>
  //           <div className="text-gray-500 text-sm">{error}</div>
  //           <button
  //             onClick={() => window.location.reload()}
  //             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  //           >
  //             Retry
  //           </button>
  //         </div>
  //       </DashboardLayout>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Order Management
                </h1>
                <p className="text-gray-600 mt-1">Manage and view all orders</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white border-b px-8 py-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by customer, order ID, or tracking ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All Status</option>
                    <option>ONGOING</option>
                    <option>COMPLETED</option>
                    <option>CANCELLED</option>
                    <option>PENDING</option>
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>

                {/* Priority Filter */}
                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All Priority</option>
                    <option>HIGH</option>
                    <option>MEDIUM</option>
                    <option>LOW</option>
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Sort by: {sortBy}
                  </span>
                </div>

                {/* Export */}
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-8 py-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Summary
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Showing {filteredOrders.length} of {orders.length} results
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        Previous
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedOrders.length === filteredOrders.length &&
                            filteredOrders.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tracking ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order: Order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.orderId)}
                            onChange={() => handleSelectOrder(order.orderId)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`flex-shrink-0 h-10 w-10 ${getAvatarColor(
                                order.customerName
                              )} rounded-full flex items-center justify-center text-white text-sm font-medium`}
                            >
                              {getInitials(
                                order.customerFirstName,
                                order.customerLastName
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {order.customerName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customerEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                              order.priorityLevel
                            )}`}
                          >
                            {order.priorityLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            {formatDate(order.dueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.trackingId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default OrderManagement;
