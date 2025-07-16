import { Check } from "lucide-react";

const Stepper = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, title: "Client Info", description: "Basic client details" },
    {
      number: 2,
      title: "Order Details",
      description: "Garment specifications",
    },
    { number: 3, title: "Measurements", description: "Body measurements" },
    { number: 4, title: "Review", description: "Confirm and submit" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep > step.number
                    ? "bg-green-500 text-white"
                    : currentStep === step.number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>

              {/* Step Info */}
              <div className="mt-2 text-center">
                <div
                  className={`text-sm font-medium ${
                    currentStep >= step.number
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={`h-1 rounded transition-colors ${
                    currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
