import React, { useState, useRef, useEffect } from "react";
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdTaskAlt,
  MdSettings,
  MdNotifications,
  MdClose,
  MdMenu,
} from "react-icons/md";
import { FaTasks, FaUsers, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuChevronDown as ChevronDown } from "react-icons/lu";
import {
  setOpenSidebar,
  logout,
  switchAccount,
  logoutAll,
  removeAccount,
  clearActiveAccount,
} from "../redux/slices/authSlice";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../redux/slices/api/notificationsApiSlice";
import clsx from "clsx";
import logo from "/src/assets/plogoo.png";

// Define links for each role
const staffLinks = [
  { label: "Home", link: "dashboard", icon: <MdDashboard /> },
  { label: "Objectives", link: "tasks", icon: <FaTasks /> },
  {
    label: "Progress Tracking",
    link: "progress",
    icon: <MdOutlinePendingActions />,
  },
  { label: "Development plan", link: "development", icon: <MdTaskAlt /> },
];

const adminLinks = [
  ...staffLinks,
  { label: "Team objectives", link: "admin2", icon: <FaUsers /> },
];

const superAdminLinks = [
  { label: "Home", link: "dashboard", icon: <MdDashboard /> },
  { label: "Organisation Performance", link: "sadmin2", icon: <MdDashboard /> },
  { label: "User Management", link: "sadmin1", icon: <MdTaskAlt /> },
  {
    label: "Progress Tracking",
    link: "progress",
    icon: <MdOutlinePendingActions />,
  },
  { label: "Development plan", link: "sadmin3", icon: <MdTaskAlt /> },
  { label: " Departments", link: "admin", icon: <MdTaskAlt /> },
];

const Topbar = () => {
  const { activeAccount, accounts, isSidebarOpen } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const notificationsPanelRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Notification API hooks
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useGetNotificationsQuery({
    limit: 10,
    page: 1,
    unreadOnly: false,
  });

  const { data: unreadCountData } = useGetUnreadNotificationCountQuery();
  const unreadCount = unreadCountData?.count || 0;

  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation();

  const closeSidebar = () => dispatch(setOpenSidebar(false));

  const handleLogout = () => {
    dispatch(logout());
    setIsUserDropdownOpen(false);
    navigate("/log-in");
  };

  const handleLogoutAll = () => {
    dispatch(logoutAll());
    navigate("/log-in");
  };

  const handleLogoutAccount = (accountIndex) => {
    dispatch(removeAccount(accountIndex));

    if (
      accountIndex ===
      accounts.findIndex((acc) => acc.user.email === activeAccount.user.email)
    ) {
      if (accounts.length > 1) {
       
        dispatch(switchAccount(0));
      } else {
     
        navigate("/log-in");
      }
    }
  };

  const handleSwitchAccount = (index) => {
    dispatch(switchAccount(index));
    setShowAccountSwitcher(false);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleAddAccount = () => {
    dispatch(clearActiveAccount());
    navigate("/log-in");
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead().unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsPanelRef.current &&
        !notificationsPanelRef.current.contains(event.target)
      ) {
        if (!event.target.closest(".notification-bell")) {
          setShowNotificationsPanel(false);
        }
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        if (!event.target.closest(".mobile-menu-trigger")) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFilteredLinks = () => {
    if (!activeAccount) return staffLinks;
    if (activeAccount.user.role === "staff") return staffLinks;
    if (activeAccount.user.role === "super_admin") return superAdminLinks;
    if (activeAccount.user.role === "admin" || "manager") return adminLinks;
    return staffLinks;
  };

  const NavLink = ({ el, isMobile = false }) => (
    <Link
      to={el.link}
      onClick={() => {
        closeSidebar();
        if (isMobile) setIsMobileMenuOpen(false);
      }}
      className={clsx(
        "flex items-center text-white hover:text-blue-300 transition-colors",
        isMobile
          ? "text-[8px] xl:text-sm px-4 py-3 border-b border-gray-600/50 last:border-b-0"
          : "text-[8px] xl:text-sm px-2 lg:px-4 py-2",
        path === el.link.split("/")[0] ? "text-blue-300 underline" : ""
      )}
    >
      {isMobile && <span className="mr-3">{el.icon}</span>}
      <span className="truncate">{el.label}</span>
    </Link>
  );

  if (!activeAccount) return null;

  return (
    <div className="w-full h-[40vh] xl:h-[30vh] bg-[#000A48] flex flex-col gap-4 sm:gap-3 md:gap-3 lg:gap-3 p-3 px-9 xl:px-20">
      {/* Top Section: Logo, Search, and Actions */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} className="w-12 sm:w-16 md:w-20" alt="Logo" />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="search anything"
              className="bg-[#2A406F] text-white placeholder-gray-400 rounded-full px-3 lg:px-4 py-1 lg:py-2 focus:outline-none text-sm w-32 lg:w-auto"
            />
            <span className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              Q
            </span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              className="notification-bell text-white hover:text-blue-300 relative"
              onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
              aria-label="Notifications"
            >
              <MdNotifications size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>

       
          {(activeAccount.user.role === "admin" ||
            activeAccount.user.role === "super_admin") && (
            <Link
              to="/admin2"
              className="text-white hover:text-blue-300"
              aria-label="Settings"
            >
              <MdSettings size={24} />
            </Link>
          )}

   
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {activeAccount.user.name ? (
                  <span className="text-sm font-medium text-gray-700">
                    {activeAccount.user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <FaUsers className="text-gray-600" />
                )}
              </div>
              <span className="text-sm text-white hidden lg:inline">
                {activeAccount.user.name}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform ${
                  showAccountSwitcher ? "transform rotate-180" : ""
                }`}
              />
            </div>

            {/* Account Switcher Dropdown */}
            {showAccountSwitcher && (
              <div className="absolute right-0 mt-2 w-64 bg-[#2A406F] rounded-md shadow-lg z-50 py-1">
                <div className="px-4 py-2 border-b border-gray-600">
                  <p className="text-sm font-medium text-white">Signed in as</p>
                  <p className="text-sm text-gray-300 truncate">
                    {activeAccount.user.email}
                  </p>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {accounts.map((account, index) => (
                    <div
                      key={account.user.email}
                      className={`group flex items-center justify-between px-4 py-2 hover:bg-[#3A507F] cursor-pointer ${
                        account.user.email === activeAccount.user.email
                          ? "bg-[#1E2B4D]"
                          : ""
                      }`}
                    >
                      <div
                        className="flex items-center flex-1"
                        onClick={() => handleSwitchAccount(index)}
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-700">
                            {account.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-white">
                            {account.user.name}
                          </p>
                          <p className="text-xs text-gray-300 truncate">
                            {account.user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogoutAccount(index);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1"
                        title="Logout this account"
                      >
                        <FaSignOutAlt size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-600">
                  <button
                    onClick={handleAddAccount}
                    className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F]"
                  >
                    <FaPlus className="mr-2" /> Add Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F]"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout Current Account
                  </button>
                  {accounts.length > 1 && (
                    <button
                      onClick={handleLogoutAll}
                      className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F] rounded-b-md"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout All Accounts
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-trigger md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <MdMenu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed top-0 right-0 h-full w-64 bg-[#2A406F] shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out"
        >
          <div className="p-4 border-b border-gray-600 flex justify-between items-center">
            <h3 className="text-white text-lg font-semibold">Menu</h3>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-gray-300"
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-600">
            <div className="relative">
              <input
                type="text"
                placeholder="search anything"
                className="w-full bg-[#1E2B4D] text-white placeholder-gray-400 rounded-full px-4 py-2 focus:outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                Q
              </span>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="py-2">
            {getFilteredLinks().map((link) => (
              <NavLink el={link} key={link.link} isMobile={true} />
            ))}
          </div>

          {/* Mobile Account Switcher */}
          <div className="p-4 border-t border-gray-600">
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">Current Account</p>
              <div className="flex items-center px-3 py-2 bg-[#1E2B4D] rounded-md">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-gray-700">
                    {activeAccount.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-white">
                    {activeAccount.user.name}
                  </p>
                  <p className="text-xs text-gray-300 truncate">
                    {activeAccount.user.email}
                  </p>
                </div>
              </div>
            </div>

            <button
              className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F] rounded-md mb-2"
              onClick={() => {
                setShowAccountSwitcher(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <FaUsers className="mr-3" />
              Switch Account
            </button>

            {/* Add Account Button for Mobile */}
            <button
              onClick={handleAddAccount}
              className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F] rounded-md"
            >
              <FaPlus className="mr-3" />
              Add Account
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="p-4 border-t border-gray-600 space-y-3">
            {/* Notification Button */}
            <button
              className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F] rounded-md"
              onClick={() => {
                setShowNotificationsPanel(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <MdNotifications className="mr-3" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Settings */}
            {(activeAccount.user.role === "admin" ||
              activeAccount.user.role === "super_admin") && (
              <Link
                to="/admin2"
                className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MdSettings className="mr-3" />
                Settings
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left text-white text-sm px-4 py-2 hover:bg-[#3A507F] rounded-md"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Greeting and Desktop Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mt-1 sm:mt-2">
        {/* Greeting Section */}
        <div className="relative overflow-hidden w-auto">
          <div className="relative z-10 space-y-1 sm:space-y-2 p-2 sm:p-3 md:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 rounded-full animate-pulse w-2 h-2"></div>
                <h1 className="text-sm sm:text-base md:text-xs font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Hi, {activeAccount.user.name || "User"}
                </h1>
              </div>
              <span className="text-xs inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/30 w-fit">
                {activeAccount.user.role || "Team Member"}
              </span>
            </div>

            <div className="ml-2 sm:ml-3 md:ml-4 space-y-0.5 sm:space-y-1">
              {activeAccount.user.department?.name && (
                <p className="text-slate-400 text-xs font-medium truncate">
                  {activeAccount.user.department.name}
                </p>
              )}
              <p className="text-slate-300 text-xs">
                Track Your Objectives Progress
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden text-[2px] lg:flex gap-2 xl:gap-4 flex-wrap">
          {getFilteredLinks().map((link) => (
            <NavLink el={link} key={link.link} />
          ))}
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotificationsPanel && (
        <div
          ref={notificationsPanelRef}
          className="fixed top-0 left-0 h-full w-full sm:w-80 md:w-96 bg-[#2A406F] shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out"
        >
          <div className="p-3 sm:p-4 border-b border-gray-600 flex justify-between items-center">
            <h3 className="text-white text-base sm:text-lg font-semibold">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-blue-300 text-xs sm:text-sm hover:underline"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setShowNotificationsPanel(false)}
                className="text-white hover:text-gray-300"
              >
                <MdClose size={20} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 text-white text-center text-sm">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-4 text-white text-center text-sm">
              Error loading notifications
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-white text-center text-sm">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-gray-600">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={clsx(
                    "p-3 sm:p-4 hover:bg-[#3A507F] cursor-pointer transition-colors",
                    !notif.read ? "bg-[#1E2B4D]" : ""
                  )}
                  onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs sm:text-sm break-words">
                        {notif.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Account Switcher Panel */}
      {showAccountSwitcher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-full max-w-xs bg-[#2A406F] h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-600 flex justify-between items-center">
              <h3 className="text-white text-lg font-semibold">
                Switch Account
              </h3>
              <button
                onClick={() => setShowAccountSwitcher(false)}
                className="text-white hover:text-gray-300"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="divide-y divide-gray-600">
              {accounts.map((account, index) => (
                <div
                  key={account.user.email}
                  className={`group flex items-center justify-between px-4 py-3 ${
                    account.user.email === activeAccount.user.email
                      ? "bg-[#1E2B4D]"
                      : "hover:bg-[#3A507F]"
                  }`}
                >
                  <div
                    className="flex items-center flex-1"
                    onClick={() => {
                      handleSwitchAccount(index);
                      setShowAccountSwitcher(false);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-gray-700">
                        {account.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-white">{account.user.name}</p>
                      <p className="text-xs text-gray-300 truncate">
                        {account.user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogoutAccount(index);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1"
                    title="Logout this account"
                  >
                    <FaSignOutAlt size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-600">
              <button
                onClick={handleAddAccount}
                className="w-full flex items-center justify-center text-white text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md mb-2"
              >
                <FaPlus className="mr-2" />
                Add Account
              </button>
              <button
                onClick={handleLogoutAll}
                className="w-full flex items-center justify-center text-white text-sm px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
              >
                <FaSignOutAlt className="mr-2" />
                Logout All Accounts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
