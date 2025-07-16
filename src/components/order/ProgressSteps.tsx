// components/order/ProgressSteps.tsx
import React from "react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProgressStepsProps {
  currentStep: number;
  steps: Step[];
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs font-medium text-gray-900">
                  {step.title}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-px bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
