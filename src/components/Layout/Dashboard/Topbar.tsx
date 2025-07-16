"use client";
import { Menu } from "lucide-react";

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 text-red-800 hover:bg-gray-100 rounded lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Your existing topbar content goes here */}
        <div className="flex items-center gap-4">
          {/* Add your existing topbar elements here */}
          <span className="text-gray-700">Welcome back!</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
