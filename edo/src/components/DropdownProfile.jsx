import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Transition from "../utils/Transition";
import { getStoredUser } from "../utils/api";
import { LogOut, Settings, SwitchCamera } from "lucide-react";

// In Next.js, images in the public folder are referenced directly with a path starting with /
const UserAvatar = "/images/user-avatar-32.png";

function DropdownProfile({ align, children }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null); // Initialize user state as null
  const router = useRouter();

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // Fetch user data only on client side
  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Check if user has both landlord and tenant roles
  const hasDualRoles =
    user &&
    user.roles &&
    user.roles.includes("landlord") &&
    user.roles.includes("tenant");

  // Determine current portal context
  const isCurrentPortalLandlord =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/landlord");
  const isCurrentPortalTenant =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/tenant");

  // Handle role switching
  const handleRoleSwitch = () => {
    if (isCurrentPortalLandlord && user.roles.includes("tenant")) {
      // Switch to tenant portal
      router.push("/tenant");
    } else if (isCurrentPortalTenant && user.roles.includes("landlord")) {
      // Switch to landlord portal
      router.push("/landlord");
    }
    setDropdownOpen(false);
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        {user && user.profile_image_url ? (
          <img
            className="w-8 h-8 rounded-full"
            src={user.profile_image_url}
            width="32"
            height="32"
            alt={user.first_name || user.name}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user &&
                (user.first_name
                  ? user.first_name.charAt(0)
                  : user.name
                  ? user.name.charAt(0)
                  : "U")}
            </span>
          </div>
        )}
        {/* Removed the name next to the profile picture */}
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full w-80 bg-white border border-gray-200 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          {/* Updated popover to match tenant header style */}
          <div className="px-4 py-3 border-b border-slate-200">
            <div className="flex items-center">
              {user && user.profile_image_url ? (
                <img
                  className="w-10 h-10 rounded-full"
                  src={user.profile_image_url}
                  alt={user.first_name || user.name}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user &&
                      (user.first_name
                        ? user.first_name.charAt(0)
                        : user.name
                        ? user.name.charAt(0)
                        : "U")}
                  </span>
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">
                  {user && (user.first_name || user.name)}
                </p>
                <p className="text-xs text-slate-500">{user && user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <ul>
            {hasDualRoles && (
              <li>
                <button
                  onClick={handleRoleSwitch}
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <SwitchCamera className="h-5 w-5 mr-3 text-slate-400" />
                  Switch to {isCurrentPortalLandlord
                    ? "Tenant"
                    : "Landlord"}{" "}
                  Portal
                </button>
              </li>
            )}
            <li>
              <Link
                href="/landlord/settings"
                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="h-5 w-5 mr-3 text-slate-400" />
                Settings
              </Link>
            </li>
            <li>
              <Link
                href="/auth/signin"
                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setDropdownOpen(false)}
              >
                <LogOut className="h-5 w-5 mr-3 text-slate-400" />
                Sign Out
              </Link>
            </li>
          </ul>
          {children}
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;
