import { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  Ruler,
  Calendar,
  FileText,
  ChevronRight,
  Check,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";

interface FormSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  required?: boolean;
}

interface StickyFormNavigatorProps {
  sections: FormSection[];
  completedSections?: string[];
  onSectionClick: (sectionId: string) => void;
}

const StickyFormNavigator: React.FC<StickyFormNavigatorProps> = ({
  sections,
  completedSections = [],
  onSectionClick,
}) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    const timer = setTimeout(() => setIsVisible(true), 500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [sections]);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      onSectionClick(sectionId);
    }

    // Close mobile drawer after selection
    if (isMobile) {
      setShowMobileDrawer(false);
    }
  };

  const getSectionStatus = (sectionId: string) => {
    if (completedSections.includes(sectionId)) return "completed";
    if (activeSection === sectionId) return "active";
    return "pending";
  };

  const getCurrentSectionInfo = () => {
    const currentSection = sections.find((s) => s.id === activeSection);
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    return { currentSection, currentIndex };
  };

  const progressPercentage = (completedSections.length / sections.length) * 100;

  // Mobile Bottom Navigation Bar
  if (isMobile) {
    const { currentSection, currentIndex } = getCurrentSectionInfo();

    return (
      <>
        {/* Mobile Progress Bar at Top */}
        <div
          className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full"
          }`}
        >
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-900">
                Form Progress
              </span>
              <span className="text-xs text-gray-600">
                {completedSections.length}/{sections.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 transition-all duration-300 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-100 translate-y-full"
          }`}
        >
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {currentSection && (
                  <div className="flex items-center">
                    <div className="mr-3">{currentSection.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {currentSection.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        Step {currentIndex + 1} of {sections.length}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowMobileDrawer(true)}
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Navigate
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Drawer */}
        {showMobileDrawer && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Form Sections
                </h2>
                <button
                  onClick={() => setShowMobileDrawer(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Progress */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Progress
                  </span>
                  <span className="text-sm text-gray-600">
                    {completedSections.length}/{sections.length} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Sections */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {sections.map((section, index) => {
                    const status = getSectionStatus(section.id);

                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(section.id)}
                        className={`w-full flex items-center p-4 rounded-xl text-left transition-all duration-200 ${
                          status === "active"
                            ? "bg-blue-50 border-2 border-blue-200 text-blue-700"
                            : status === "completed"
                            ? "bg-green-50 border-2 border-green-200 text-green-700"
                            : "bg-gray-50 border-2 border-gray-200 text-gray-600"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-sm font-medium ${
                            status === "completed"
                              ? "bg-green-500 text-white"
                              : status === "active"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          {status === "completed" ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <div className="mr-2">{section.icon}</div>
                            <h3 className="text-base font-medium">
                              {section.title}
                            </h3>
                          </div>
                          <p className="text-sm opacity-80">
                            {section.description}
                          </p>
                        </div>

                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Tablet Compact Navigator (768px - 1024px)
  if (window.innerWidth >= 768 && window.innerWidth < 1024) {
    return (
      <div
        className={`fixed right-4 top-20 z-40 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-xs">
          {/* Collapsible Header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-t-lg"
          >
            <div className="flex items-center">
              <div className="mr-2">
                {getCurrentSectionInfo().currentSection?.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {getCurrentSectionInfo().currentSection?.title ||
                    "Form Progress"}
                </h3>
                <div className="flex items-center mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-16">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs text-gray-600">
                    {completedSections.length}/{sections.length}
                  </span>
                </div>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {/* Expandable Content */}
          {isExpanded && (
            <div className="border-t border-gray-100 p-3">
              <div className="space-y-2">
                {sections.map((section, index) => {
                  const status = getSectionStatus(section.id);

                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`w-full flex items-center p-2 rounded-md text-left transition-all duration-200 text-sm ${
                        status === "active"
                          ? "bg-blue-50 border border-blue-200 text-blue-700"
                          : status === "completed"
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-medium ${
                          status === "completed"
                            ? "bg-green-500 text-white"
                            : status === "active"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {status === "completed" ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>

                      <div className="flex items-center">
                        <div className="mr-2 flex-shrink-0">{section.icon}</div>
                        <span className="font-medium">{section.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop Full Navigator (1024px+)
  return (
    <div
      className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900">Form Progress</h3>
          <div className="flex items-center mt-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="ml-2 text-xs text-gray-600">
              {completedSections.length}/{sections.length}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {sections.map((section, index) => {
            const status = getSectionStatus(section.id);

            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 group ${
                  status === "active"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : status === "completed"
                    ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-medium ${
                    status === "completed"
                      ? "bg-green-500 text-white"
                      : status === "active"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {status === "completed" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <div className="mr-2 flex-shrink-0">{section.icon}</div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          status === "active"
                            ? "text-blue-700"
                            : status === "completed"
                            ? "text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        {section.title}
                      </p>
                      <p
                        className={`text-xs truncate ${
                          status === "active"
                            ? "text-blue-600"
                            : status === "completed"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {section.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex-shrink-0 ml-2 transition-transform duration-200 ${
                    status === "active" ? "transform translate-x-1" : ""
                  }`}
                >
                  <ChevronRight
                    className={`h-4 w-4 ${
                      status === "active" ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <div className="flex items-center mr-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
              Completed
            </div>
            <div className="flex items-center mr-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
              Current
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
              Pending
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook remains the same
interface OrderItem {
  productType: string;
  specificItem: string;
  color: string;
  quantity: number;
}

interface StandardMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  [key: string]: number | undefined;
}

interface FormData {
  fullName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  orderItems?: OrderItem[];
  standardMeasurements?: StandardMeasurements;
  [key: string]: unknown;
}

export const useFormSections = (formData: FormData) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const sections: FormSection[] = [
    {
      id: "customer-selection",
      title: "Customer Selection",
      icon: <User className="h-4 w-4" />,
      description: "Select existing customer",
      required: false,
    },
    {
      id: "client-information",
      title: "Client Info",
      icon: <User className="h-4 w-4" />,
      description: "Basic client details",
      required: true,
    },
    {
      id: "order-information",
      title: "Order Details",
      icon: <ShoppingBag className="h-4 w-4" />,
      description: "Product specifications",
      required: true,
    },
    {
      id: "measurements",
      title: "Measurements",
      icon: <Ruler className="h-4 w-4" />,
      description: "Body measurements",
      required: true,
    },
    {
      id: "timeline",
      title: "Timeline",
      icon: <Calendar className="h-4 w-4" />,
      description: "Production schedule",
      required: true,
    },
    {
      id: "instructions",
      title: "Instructions",
      icon: <FileText className="h-4 w-4" />,
      description: "Special notes & references",
      required: false,
    },
  ];

  useEffect(() => {
    const completed: string[] = [];

    if (formData.fullName && formData.emailAddress && formData.phoneNumber) {
      completed.push("client-information");
    }

    if (formData.orderItems && formData.orderItems.length > 0) {
      const hasValidItems = (formData.orderItems as OrderItem[]).some(
        (item: OrderItem) =>
          item.productType &&
          item.specificItem &&
          item.color &&
          item.quantity > 0
      );
      if (hasValidItems) {
        completed.push("order-information");
      }
    }

    const measurements = formData.standardMeasurements;
    if (
      measurements &&
      (measurements.chest || measurements.waist || measurements.hips)
    ) {
      completed.push("measurements");
    }

    completed.push("timeline");
    completed.push("instructions");

    setCompletedSections(completed);
  }, [formData]);

  return { sections, completedSections };
};

export default StickyFormNavigator;
