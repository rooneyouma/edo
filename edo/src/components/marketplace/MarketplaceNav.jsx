import React from "react";
import Link from "next/link";
import { Bookmark, Menu } from "lucide-react";
import EdoLogo from "../../components/EdoLogo";
import ReactDOM from "react-dom";
import { isAuthenticated, getStoredUser, authAPI } from "../../utils/api";

const MarketplaceNav = () => {
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 768);
    }

    const checkAuth = async () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      if (isAuth) {
        try {
          const backendUser = await authAPI.getCurrentUser();
          setUser(backendUser);
        } catch (e) {
          // fallback to localStorage if backend fails
          const storedUser = getStoredUser();
          setUser(storedUser);
        }
      }
    };

    checkAuth();

    // Only add event listeners if we're in the browser
    if (typeof window !== "undefined") {
      // Listen for storage changes (when user logs in/out in another tab)
      window.addEventListener("storage", checkAuth);
      window.addEventListener("user-updated", checkAuth);
      const handleResize = () => setIsDesktop(window.innerWidth >= 768);
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("storage", checkAuth);
        window.removeEventListener("user-updated", checkAuth);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // This useEffect is now handled in the first one

  // Function to close the modal when clicking the backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowOptionsMenu(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setAuthenticated(false);
    setUser(null);
    setShowOptionsMenu(false);
    // Optionally redirect to home page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  // Popover menu for desktop (portal)
  const popoverMenu = (
    <div
      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]"
      style={{ top: "100%", right: 0 }}
    >
      <Link
        href="/my-bookings"
        className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
        onClick={() => setShowOptionsMenu(false)}
      >
        My Bookings
      </Link>
      <Link
        href="#"
        className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
        onClick={() => setShowOptionsMenu(false)}
      >
        Messages
      </Link>
      <Link
        href="/payments"
        className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
        onClick={() => setShowOptionsMenu(false)}
      >
        Payments
      </Link>
      <Link
        href="/bookmarks"
        className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
        onClick={() => setShowOptionsMenu(false)}
      >
        Bookmarks
      </Link>
      <Link
        href="/profile"
        className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
        onClick={() => setShowOptionsMenu(false)}
      >
        Profile
      </Link>
      <Link
        href="/settings"
        className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
        onClick={() => setShowOptionsMenu(false)}
      >
        Settings
      </Link>
      <button
        className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 p-4 bg-transparent w-full">
      {/* Always: Logo left, actions right in the same row */}
      <div className="flex flex-row items-center justify-between w-full">
        {/* Logo (always left) */}
        <div className="flex items-center">
          <EdoLogo
            className="h-8 w-auto sm:h-10 drop-shadow-lg"
            color="#00695c"
          />
        </div>
        {/* Actions (Sign In + Hamburger) right */}
        <div className="flex flex-row items-center gap-2 ml-auto">
          {!authenticated ? (
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-[#0d9488] text-white hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] ml-2"
            >
              Sign In
            </Link>
          ) : (
            <>
              {/* User greeting */}
              <span className="text-sm text-gray-800 mr-2 drop-shadow-sm">
                Hi, {user?.first_name || "User"}
              </span>
              {/* Profile Avatar Circle */}
              <Link
                href="/profile"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0d9488] text-white text-lg font-bold mr-2 hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                style={{ textDecoration: "none" }}
                aria-label="Profile"
              >
                {user?.profile_image_url ? (
                  <img
                    src={user.profile_image_url}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full object-cover"
                    style={{ background: "#0d9488" }}
                  />
                ) : user?.first_name ? (
                  user.first_name.charAt(0).toUpperCase()
                ) : (
                  "U"
                )}
              </Link>
              {/* Hamburger Menu for More Options */}
              <div className="relative ml-2">
                <button
                  onClick={() => setShowOptionsMenu((v) => !v)}
                  className="inline-flex items-center justify-center px-3 py-2 border border-[#0d9488] text-sm font-medium rounded-md text-[#0d9488] bg-white/80 backdrop-blur-sm hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] cursor-pointer shadow-sm"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                {showOptionsMenu &&
                  (isDesktop ? (
                    ReactDOM.createPortal(
                      <div
                        className="fixed inset-0 z-[9998]"
                        onClick={handleBackdropClick}
                        style={{ pointerEvents: "auto" }}
                      >
                        <div
                          className="absolute"
                          style={{ top: "60px", right: "16px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {popoverMenu}
                        </div>
                      </div>,
                      document.body
                    )
                  ) : (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center"
                      onClick={handleBackdropClick}
                      style={{ pointerEvents: "auto" }}
                    >
                      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xs mx-auto p-6 flex flex-col gap-4">
                        <Link
                          href="/my-bookings"
                          className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setShowOptionsMenu(false)}
                        >
                          My Bookings
                        </Link>
                        <Link
                          href="#"
                          className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setShowOptionsMenu(false)}
                        >
                          Messages
                        </Link>
                        <Link
                          href="/payments"
                          className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setShowOptionsMenu(false)}
                        >
                          Payments
                        </Link>
                        <Link
                          href="/bookmarks"
                          className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setShowOptionsMenu(false)}
                        >
                          Bookmarks
                        </Link>
                        <Link
                          href="/profile"
                          className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setShowOptionsMenu(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setShowOptionsMenu(false)}
                        >
                          Settings
                        </Link>
                        <button
                          className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded"
                          onClick={handleLogout}
                        >
                          Log Out
                        </button>
                        <button
                          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          onClick={() => setShowOptionsMenu(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MarketplaceNav;
