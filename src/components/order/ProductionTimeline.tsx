"use client";

import {
  Calendar,
  Trash2,
  Scissors,
  ShieldCheck,
  UserCheck,
  Package,
  CheckCircle,
} from "lucide-react";

// Types
interface Milestone {
  id: number;
  name: string;
  icon: string;
  date: string;
  color: string;
}

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

type MilestoneIconType =
  | "ruler"
  | "scissors"
  | "shield"
  | "needle"
  | "user"
  | "package";

interface ProductionTimelineProps {
  data: TimelineData;
  onChange: (field: TimelineField, value: string | boolean) => void;
  onMilestoneUpdate: (id: number, date: string) => void;
}

const PRIORITY_OPTIONS = [
  { value: "", label: "Select Item" },
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent" },
];

const FITTING_OPTIONS = [
  { value: "", label: "Select Item" },
  { value: "none", label: "No Fitting Required" },
  { value: "single", label: "Single Fitting" },
  { value: "multiple", label: "Multiple Fittings" },
  { value: "final-only", label: "Final Fitting Only" },
];

export const ProductionTimeline: React.FC<ProductionTimelineProps> = ({
  data,
  onChange,
  onMilestoneUpdate,
}) => {
  const getIcon = (iconType: MilestoneIconType | string): JSX.Element => {
    const iconMap: { [key: string]: JSX.Element } = {
      ruler: <div className="w-4 h-4 bg-current rounded-sm"></div>,
      scissors: <Scissors className="w-4 h-4" />,
      shield: <ShieldCheck className="w-4 h-4" />,
      needle: <div className="w-4 h-4 bg-current rounded-full"></div>,
      user: <UserCheck className="w-4 h-4" />,
      package: <Package className="w-4 h-4" />,
    };
    return iconMap[iconType] || <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Production Timeline
      </h2>

      <div className="space-y-6">
        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.startDate}
                onChange={(e) => onChange("startDate", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="dd-mm-yyyy"
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline Date*
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.deadlineDate}
                onChange={(e) => onChange("deadlineDate", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="dd-mm-yyyy"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Priority and Fitting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              value={data.priorityLevel}
              onChange={(e) => onChange("priorityLevel", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fitting Required
            </label>
            <select
              value={data.fittingRequired}
              onChange={(e) => onChange("fittingRequired", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
            >
              {FITTING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Production Milestones */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Production Milestones
          </h3>

          <div className="space-y-3">
            {data.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center space-x-4">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-md ${milestone.color}`}
                >
                  {getIcon(milestone.icon)}
                </div>

                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {milestone.name}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={milestone.date}
                    onChange={(e) =>
                      onMilestoneUpdate(milestone.id, e.target.value)
                    }
                    className="w-32 px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    placeholder="dd-mm-yyyy"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-3 w-3 text-gray-400" />
                </div>

                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Checkbox */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="notifyClient"
            checked={data.notifyClient}
            onChange={(e) => onChange("notifyClient", e.target.checked)}
            className="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900 mt-0.5"
          />
          <div>
            <label
              htmlFor="notifyClient"
              className="text-sm font-medium text-gray-900"
            >
              Notify client about production milestones
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Client will receive email updates when each milestone is completed
            </p>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">
            Additional Notes
          </h3>
          <textarea
            value={data.additionalNotes}
            onChange={(e) => onChange("additionalNotes", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Add any special instructions or notes for the production timeline..."
          />
        </div>
      </div>
    </div>
  );
};
