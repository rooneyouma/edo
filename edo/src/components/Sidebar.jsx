import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  Home,
  Building2,
  Users,
  MessageSquare,
  Bell,
  Wrench,
  CreditCard,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/landlord', icon: Home },
  { name: 'Properties', href: '/landlord/properties', icon: Building2 },
  { name: 'Tenants', href: '/landlord/tenants', icon: Users },
  { name: 'Messages', href: '/landlord/messages', icon: MessageSquare },
  { name: 'Notices', href: '/landlord/notices', icon: Bell },
  { name: 'Maintenance', href: '/landlord/maintenance', icon: Wrench },
  { name: 'Payments', href: '/landlord/payments', icon: CreditCard },
  { name: 'Settings', href: '/landlord/settings', icon: Settings },
];

const Sidebar = ({ isOpen, onClose, className }) => {
  return (
    <div
      className={`${className} ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
    >
      {/* Close button for mobile */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="Edo Real Estate"
          />
          <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
            Edo Real Estate
          </span>
        </div>
        <button
          type="button"
          className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          onClick={onClose}
        >
          <span className="sr-only">Close sidebar</span>
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon
              className="mr-3 h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 