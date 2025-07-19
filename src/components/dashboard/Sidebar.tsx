// components/layout/Sidebar.tsx
"use client";
import { Home, Settings, Users, ChartColumn, Plus, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.(); // Close mobile menu after logout
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#001D2F] shadow-md p-6 space-y-6
          transform transition-transform duration-300 ease-in-out
          lg:transform-none lg:block
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo with close button on mobile */}
        <div className="flex justify-between items-center lg:justify-center">
          <div className="flex justify-center flex-1 lg:flex-none">
            <Image
              src="/svg/oak-white.svg"
              alt="Oak Logo"
              width={120}
              height={40}
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/10 rounded lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Order Button */}
        <Link
          href="/create-order"
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#A08445B2] hover:bg-primary/90 rounded"
          onClick={onClose} // Close mobile menu when navigating
        >
          <Plus className="w-4 h-4" />
          Create Order
        </Link>

        {/* Navigation */}
        <nav className="space-y-8 text-sm font-medium text-white">
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-primary"
            onClick={onClose}
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/order-management"
            className="flex items-center gap-2 hover:text-primary"
            onClick={onClose}
          >
            <ChartColumn className="w-5 h-5" />
            Order Management
          </Link>
          <Link
            href="/order-management"
            className="flex items-center gap-2 hover:text-primary"
            onClick={onClose}
          >
            <ChartColumn className="w-5 h-5" />
            Customers
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 hover:text-primary"
            onClick={onClose}
          >
            <Users className="w-5 h-5" />
            Team Directory
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 hover:text-primary"
            onClick={onClose}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
