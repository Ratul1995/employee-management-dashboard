import { useState, useEffect, useRef } from "react";
import { Bell, Sun, MoonStar, X } from "lucide-react";
import alex from "../Images/alex-image.png";

interface HeaderProps {
  activetab: string;
  currentTime: Date;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Header = ({
  activetab,
  currentTime,
  // searchTerm = "",
  // onSearchChange,
}: HeaderProps) => {
  /*
   * Theme State (Dark mode default)
   */
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("empmanage-theme");
    return savedTheme === "light" ? false : true;
  });

  /*
   * Apply theme to <html> tag
   */
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("empmanage-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("empmanage-theme", "light");
    }
  }, [isDark]);

  /*
   * Notifications State
   */
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Task Assigned",
      message: "Build Employee Table with API",
      time: "5m ago",
      read: false,
    },
    {
      id: 2,
      title: "Leave Request",
      message: "John submitted a leave request",
      time: "1h ago",
      read: false,
    },
    {
      id: 3,
      title: "System Update",
      message: "Database maintenance completed",
      time: "2h ago",
      read: false,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /*
   * Close notification dropdown on outside click
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative z-30 border-b border-slate-300 bg-slate-200 px-4 py-3 transition-colors duration-300 dark:border-[#1c4b98] dark:bg-[#0F172A] sm:px-6 lg:px-6 xl:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Title & Time */}
        <div className="flex flex-col text-center sm:text-left">
          <h2 className="text-2xl font-bold capitalize text-slate-900 dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
            {activetab}
          </h2>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-white/60 sm:text-sm lg:text-xs">
            {currentTime.toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center  gap-3 sm:justify-end justify-center">
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative rounded-2xl p-2 text-slate-700 transition-all duration-300 hover:bg-slate-300 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Responsive Notification Dropdown */}
            {showNotifications && (
              <div
                style={{ backgroundColor: "#e0f2fe" }}
                className="fixed inset-x-4 top-20 z-9999 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border-2 border-sky-300 shadow-2xl sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 sm:w-80 md:w-96"
              >
                {/* Header */}
                <div
                  style={{ backgroundColor: "#bae6fd" }}
                  className="flex items-center justify-between border-b border-sky-300 p-3.5"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-bold text-blue-800 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-72 divide-y divide-sky-200 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs font-semibold text-slate-700">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: !item.read ? "#bae6fd" : "#e0f2fe",
                        }}
                        className="flex items-start justify-between gap-3 p-3 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-900">
                            {item.title}
                          </p>
                          <p className="mt-1 wrap-break-word text-xs font-medium text-slate-800">
                            {item.message}
                          </p>
                          <span className="mt-1 block text-[10px] font-semibold text-slate-600">
                            {item.time}
                          </span>
                        </div>
                        <button
                          onClick={() => removeNotification(item.id)}
                          className="p-1 text-slate-600 hover:text-slate-900"
                          aria-label="Remove notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark((prev) => !prev)}
            className="rounded-2xl p-2 text-slate-700 transition-all duration-300 hover:bg-slate-300 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="h-6 w-6 text-amber-400" />
            ) : (
              <MoonStar className="h-6 w-6 text-indigo-600" />
            )}
          </button>

          {/* Profile Section */}
          <div className="flex items-center space-x-3">
            <img
              src={alex}
              alt="Alex"
              className="h-10 w-10 rounded-full border-2 border-[#3B82F6] object-cover sm:h-12 sm:w-12"
            />
            <div className="hidden sm:block">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
                Alex Morgan
              </h3>
              <p className="text-[10px] text-slate-600 dark:text-white/60 sm:text-xs">
                Software Developer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
