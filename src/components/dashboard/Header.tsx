import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search - adjust width on mobile */}
        <div className="w-full max-w-md lg:w-96">
          <Input
            placeholder="Search order by client name or order ID"
            className="rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-gray-500" />
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/user.jpg" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">Alex Meian</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
