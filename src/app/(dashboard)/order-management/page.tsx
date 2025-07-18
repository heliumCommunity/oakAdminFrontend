"use client";
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
  X,
  User,
  Package,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Trash2,
  UserCheck,
  FileText,
} from "lucide-react";

const OrderManagement = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sortBy] = useState("Name");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  // Initialize with mock data
  useEffect(() => {
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

  // const handleSelectAll = () => {
  //   if (selectedOrders.length === filteredOrders.length) {
  //     setSelectedOrders([]);
  //   } else {
  //     setSelectedOrders(filteredOrders.map((order) => order.orderId));
  //   }
  // };

  // Action handlers
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderSummary(true);
    setActiveDropdown(null);
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const handleAssignOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
    setActiveDropdown(null);
  };

  const handleEditOrder = (order: Order) => {
    // This will redirect to create order page with prefilled data
    console.log("Edit order:", order);
    // You can implement navigation to create order page here
    // For example: router.push(`/create-order?edit=${order.id}`);
    alert(
      "Edit functionality will redirect to create order page with prefilled data"
    );
  };

  const confirmDeleteOrder = () => {
    if (selectedOrder) {
      setOrders(orders.filter((order: Order) => order.id !== selectedOrder.id));
      setShowDeleteModal(false);
      setSelectedOrder(null);
    }
  };

  interface AssigneeData {
    riderName: string;
    riderPhone: string;
    assignedDate: string;
  }

  const handleAssignSubmit = (assigneeData: AssigneeData) => {
    // Handle assignment logic here
    console.log(
      "Assigning order:",
      selectedOrder?.orderId,
      "to:",
      assigneeData
    );
    setShowAssignModal(false);
    setSelectedOrder(null);
  };

  const toggleDropdown = (orderId: string) => {
    console.log("Toggling dropdown for order:", orderId);
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  // Modal Components
  const OrderSummaryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <button
            onClick={() => setShowOrderSummary(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {selectedOrder && (
          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </label>
                <p className="text-gray-900">{selectedOrder.orderId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking ID
                </label>
                <p className="text-gray-900">{selectedOrder.trackingId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                    selectedOrder.priorityLevel
                  )}`}
                >
                  {selectedOrder.priorityLevel}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer ID
                  </label>
                  <p className="text-gray-900">{selectedOrder.customerId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {selectedOrder.customerEmail}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {selectedOrder.customerPhoneNumber}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedOrder.customerAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fulfillment Method
                  </label>
                  <p className="text-gray-900">
                    {selectedOrder.orderFulfillmentMethod}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Type
                  </label>
                  <p className="text-gray-900">{selectedOrder.clientType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fitting Required
                  </label>
                  <p className="text-gray-900">
                    {selectedOrder.fittingRequired === "true" ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(selectedOrder.dueDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedOrder.startDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedOrder.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Notes
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fitting Notes
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">
                    {selectedOrder.additionalFitNotes}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">
                    {selectedOrder.additionalNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Rider Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Rider Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rider Name
                  </label>
                  <p className="text-gray-900">{selectedOrder.riderName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rider Phone
                  </label>
                  <p className="text-gray-900">
                    {selectedOrder.riderPhoneNumber || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-center mb-2">Delete Order</h3>
          <p className="text-gray-500 text-center mb-6">
            Are you sure you want to delete order {selectedOrder?.orderId}? This
            action cannot be undone.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteOrder}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AssignModal = () => {
    const [assigneeData, setAssigneeData] = useState({
      riderName: "",
      riderPhone: "",
      assignedDate: new Date().toISOString().split("T")[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleAssignSubmit(assigneeData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-md w-full mx-4">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Assign Order</h2>
            <button
              onClick={() => setShowAssignModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                value={selectedOrder?.orderId || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rider Name
              </label>
              <input
                type="text"
                value={assigneeData.riderName}
                onChange={(e) =>
                  setAssigneeData({
                    ...assigneeData,
                    riderName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rider Phone
              </label>
              <input
                type="tel"
                value={assigneeData.riderPhone}
                onChange={(e) =>
                  setAssigneeData({
                    ...assigneeData,
                    riderPhone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Date
              </label>
              <input
                type="date"
                value={assigneeData.assignedDate}
                onChange={(e) =>
                  setAssigneeData({
                    ...assigneeData,
                    assignedDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
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
                <span className="text-sm text-gray-600">Sort by: {sortBy}</span>
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
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            title="Edit Order"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(order.orderId);
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="More Actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === order.orderId && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleViewOrder(order)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Show Order Summary
                                  </button>
                                  <button
                                    onClick={() => handleAssignOrder(order)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Assign Order
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOrder(order)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Order
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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

      {/* Modals */}
      {showOrderSummary && <OrderSummaryModal />}
      {showDeleteModal && <DeleteModal />}
      {showAssignModal && <AssignModal />}
    </div>
  );
};

export default OrderManagement;
