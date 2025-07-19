import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

// Interfaces
interface OrderItem {
  productType: string;
  specificItem: string;
  color: string;
  quantity: number;
  size?: string;
  material?: string;
  specialInstructions?: string;
}

interface OrderInformationProps {
  data: OrderItem[];
  onChange: (data: OrderItem[]) => void;
}

// Product options data
const productOptions = {
  kaftan: [
    "Classic Kaftan",
    "Embroidered Kaftan",
    "Long Sleeve Kaftan",
    "Short Sleeve Kaftan",
    "Ceremonial Kaftan",
    "Casual Kaftan",
    "Printed Kaftan",
    "Designer Kaftan",
  ],
  agbada: [
    "Traditional Agbada",
    "Embroidered Agbada",
    "Simple Agbada",
    "Ceremonial Agbada",
    "Wedding Agbada",
    "Festival Agbada",
    "Royal Agbada",
    "Modern Agbada",
  ],
  shoes: [
    "Oxford Shoes",
    "Loafers",
    "Brogues",
    "Derby Shoes",
    "Monk Strap",
    "Chelsea Boots",
    "Dress Boots",
    "Casual Sneakers",
    "Formal Sandals",
    "Traditional Shoes",
  ],
  casuals: [
    "Polo Shirt",
    "Casual Shirt",
    "T-Shirt",
    "Chinos",
    "Jeans",
    "Shorts",
    "Casual Blazer",
    "Hoodie",
    "Sweatshirt",
    "Casual Trousers",
  ],
};

const OrderInformation: React.FC<OrderInformationProps> = ({
  data,
  onChange,
}) => {
  const [searchTerms, setSearchTerms] = useState<{ [key: number]: string }>({});

  const addOrderItem = () => {
    const newItem: OrderItem = {
      productType: "",
      specificItem: "",
      color: "",
      quantity: 1,
      size: "",
      material: "",
      specialInstructions: "",
    };
    onChange([...data, newItem]);
  };

  const removeOrderItem = (index: number) => {
    const updatedItems = data.filter((_, i) => i !== index);
    onChange(updatedItems);
    // Clean up search terms
    const newSearchTerms = { ...searchTerms };
    delete newSearchTerms[index];
    setSearchTerms(newSearchTerms);
  };

  const updateOrderItem = <K extends keyof OrderItem>(
    index: number,
    field: K,
    value: OrderItem[K]
  ) => {
    const updatedItems = data.map((item, i) => {
      if (i === index) {
        // Reset specific item when product type changes
        if (field === "productType") {
          setSearchTerms((prev) => ({ ...prev, [index]: "" }));
          return { ...item, [field]: value, specificItem: "" };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updatedItems);
  };

  const handleSearchChange = (index: number, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [index]: value }));
  };

  const handleSelectItem = (index: number, item: string) => {
    updateOrderItem(index, "specificItem", item);
    setSearchTerms((prev) => ({ ...prev, [index]: "" }));
  };

  const filterOptions = (options: string[], searchTerm: string) => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Order Information
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Select products and specify details for this order
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-900">
                Item {index + 1}
              </h3>
              {data.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOrderItem(index)}
                  className="flex items-center text-red-600 hover:text-red-800 text-sm transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove Item
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type *
                </label>
                <select
                  value={item.productType}
                  onChange={(e) =>
                    updateOrderItem(index, "productType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  required
                >
                  <option value="">Select product type</option>
                  <option value="kaftan">Kaftan</option>
                  <option value="agbada">Agbada</option>
                  <option value="shoes">Shoes</option>
                  <option value="casuals">Casuals</option>
                </select>
              </div>

              {/* Specific Item with Search */}
              {item.productType && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Item *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={item.specificItem || searchTerms[index] || ""}
                      onChange={(e) => {
                        if (!item.specificItem) {
                          handleSearchChange(index, e.target.value);
                        }
                      }}
                      onFocus={() => {
                        if (item.specificItem) {
                          updateOrderItem(index, "specificItem", "");
                        }
                      }}
                      placeholder={`Search ${item.productType}...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />

                    {/* Dropdown for search results */}
                    {!item.specificItem && searchTerms[index] !== undefined && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filterOptions(
                          productOptions[
                            item.productType as keyof typeof productOptions
                          ] || [],
                          searchTerms[index] || ""
                        ).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleSelectItem(index, option)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            {option}
                          </button>
                        ))}
                        {filterOptions(
                          productOptions[
                            item.productType as keyof typeof productOptions
                          ] || [],
                          searchTerms[index] || ""
                        ).length === 0 && (
                          <div className="px-3 py-2 text-gray-500 text-sm">
                            No items found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  value={item.color}
                  onChange={(e) =>
                    updateOrderItem(index, "color", e.target.value)
                  }
                  placeholder="e.g., Navy Blue, White, Black"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateOrderItem(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Size (for clothing items) */}
              {(item.productType === "kaftan" ||
                item.productType === "agbada" ||
                item.productType === "casuals") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    value={item.size || ""}
                    onChange={(e) =>
                      updateOrderItem(index, "size", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="XXXL">XXXL</option>
                    <option value="Custom">Custom (use measurements)</option>
                  </select>
                </div>
              )}

              {/* Shoe Size (for shoes) */}
              {item.productType === "shoes" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shoe Size *
                  </label>
                  <input
                    type="text"
                    value={item.size || ""}
                    onChange={(e) =>
                      updateOrderItem(index, "size", e.target.value)
                    }
                    placeholder="e.g., 42, 9.5, 10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}

              {/* Material */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Material
                </label>
                <input
                  type="text"
                  value={item.material || ""}
                  onChange={(e) =>
                    updateOrderItem(index, "material", e.target.value)
                  }
                  placeholder="e.g., Cotton, Silk, Leather"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                value={item.specialInstructions || ""}
                onChange={(e) =>
                  updateOrderItem(index, "specialInstructions", e.target.value)
                }
                placeholder="Any special requirements or notes for this item..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addOrderItem}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Another Item</span>
        </button>
      </div>
    </div>
  );
};

export default OrderInformation;
