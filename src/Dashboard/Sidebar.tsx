import {
  Users,
  LayoutDashboard,
  UserRoundPlus,
  Summary,
  Settings,
  X,
  LogOut,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
} from "lucide-react";

import * as React from "react";
import alex from "../Images/alex-image.png";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "@/Authenticaton-Folder/Authentication/CreateContext";

interface SidebarProps {
  sidebar: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activetab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "employee",
    label: "Employee",
    icon: UserRoundPlus,
  },
  {
    id: "reports",
    label: "Reports",
    icon: Summary,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

// Multi-year Indian public holiday mapping
const INDIAN_HOLIDAYS_MAP: Record<string, string> = {
  // 2025
  "2025-01-26": "Republic Day",
  "2025-03-14": "Holi",
  "2025-03-31": "Id-ul-Fitr (Eid)",
  "2025-04-18": "Good Friday",
  "2025-06-07": "Bakrid / Id-ul-Zuha",
  "2025-08-15": "Independence Day",
  "2025-09-05": "Milad-un-Nabi",
  "2025-10-02": "Mahatma Gandhi Jayanti",
  "2025-10-20": "Diwali (Deepavali)",
  "2025-11-05": "Guru Nanak Jayanti",
  "2025-12-25": "Christmas Day",

  // 2026
  "2026-01-26": "Republic Day",
  "2026-03-04": "Holi",
  "2026-03-20": "Id-ul-Fitr (Eid)",
  "2026-04-03": "Good Friday",
  "2026-05-27": "Bakrid / Id-ul-Zuha",
  "2026-08-15": "Independence Day",
  "2026-08-26": "Milad-un-Nabi",
  "2026-10-02": "Mahatma Gandhi Jayanti",
  "2026-11-08": "Diwali (Deepavali)",
  "2026-11-24": "Guru Nanak Jayanti",
  "2026-12-25": "Christmas Day",

  // 2027
  "2027-01-26": "Republic Day",
  "2027-03-10": "Id-ul-Fitr (Eid)",
  "2027-03-22": "Holi",
  "2027-03-26": "Good Friday",
  "2027-05-17": "Bakrid / Id-ul-Zuha",
  "2027-08-15": "Independence Day",
  "2027-10-02": "Mahatma Gandhi Jayanti",
  "2027-10-29": "Diwali (Deepavali)",
  "2027-11-14": "Guru Nanak Jayanti",
  "2027-12-25": "Christmas Day",
};

// Fixed annual national holidays
const FIXED_ANNUAL_HOLIDAYS: Record<string, string> = {
  "01-26": "Republic Day",
  "08-15": "Independence Day",
  "10-02": "Mahatma Gandhi Jayanti",
  "12-25": "Christmas Day",
};

const Sidebar = ({
  sidebar,
  setSidebarOpen,
  activetab,
  setActiveTab,
}: SidebarProps) => {
  // Today's date
  const today = React.useMemo(() => new Date(), []);

  // Currently displayed month
  const [currentMonth, setCurrentMonth] =
    React.useState<Date>(today);

  // Currently selected date
  const [date, setDate] =
    React.useState<Date | undefined>(today);

  // Calendar open / close state
  const [isCalendarOpen, setIsCalendarOpen] =
    React.useState<boolean>(true);

  // Format date as YYYY-MM-DD
  const formatDateKey = (
    selectedDate: Date,
  ): string => {
    const year = selectedDate.getFullYear();

    const month = String(
      selectedDate.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      selectedDate.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Format date as MM-DD
  const formatMonthDayKey = (
    selectedDate: Date,
  ): string => {
    const month = String(
      selectedDate.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      selectedDate.getDate(),
    ).padStart(2, "0");

    return `${month}-${day}`;
  };

  // Check whether a date is a holiday
  const isHolidayDate = (
    selectedDate: Date,
  ): boolean => {
    const fullKey =
      formatDateKey(selectedDate);

    const monthDayKey =
      formatMonthDayKey(selectedDate);

    return Boolean(
      INDIAN_HOLIDAYS_MAP[fullKey] ||
        FIXED_ANNUAL_HOLIDAYS[monthDayKey],
    );
  };

  // Get holiday name
  const getHolidayName = (
    selectedDate: Date | undefined,
  ): string | null => {
    if (!selectedDate) {
      return null;
    }

    const fullKey =
      formatDateKey(selectedDate);

    const monthDayKey =
      formatMonthDayKey(selectedDate);

    return (
      INDIAN_HOLIDAYS_MAP[fullKey] ||
      FIXED_ANNUAL_HOLIDAYS[monthDayKey] ||
      null
    );
  };

  const todayKey =
    formatDateKey(today);

  const selectedHolidayName =
    getHolidayName(date);

  const isTodaySelected =
    date !== undefined &&
    formatDateKey(date) === todayKey;

  // Previous year
  const handlePrevYear = () => {
    setCurrentMonth((previousMonth) => {
      return new Date(
        previousMonth.getFullYear() - 1,
        previousMonth.getMonth(),
        1,
      );
    });
  };

  // Next year
  const handleNextYear = () => {
    setCurrentMonth((previousMonth) => {
      return new Date(
        previousMonth.getFullYear() + 1,
        previousMonth.getMonth(),
        1,
      );
    });
  };

  // Previous month
  const handlePrevMonth = () => {
    setCurrentMonth((previousMonth) => {
      return new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth() - 1,
        1,
      );
    });
  };

  // Next month
  const handleNextMonth = () => {
    setCurrentMonth((previousMonth) => {
      return new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth() + 1,
        1,
      );
    });
  };

  const { logout } = UseAuth();

  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`${
        sidebar
          ? "translate-x-0"
          : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 flex w-80 transform flex-col justify-between border-r border-slate-300 bg-slate-200 transition-all duration-300 ease-out dark:border-[#1c4b98] dark:bg-[#0F172A] lg:static lg:inset-0 lg:w-64 lg:translate-x-0 xl:w-72 2xl:w-80`}
    >
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto pb-15 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-300 px-8 dark:border-[#1c4b98] lg:px-4 2xl:px-8">
          <div className="flex items-center space-x-4 lg:space-x-2 xl:space-x-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B82F6] shadow-2xl lg:h-9 lg:w-9 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12">
                <Users className="h-7 w-7 text-white lg:h-5 lg:w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7" />
              </div>
            </div>

            <div>
              <h1 className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-blue-500 lg:text-lg xl:text-xl 2xl:text-2xl">
                EmpManage
              </h1>

              <p className="text-xs font-medium text-slate-500 dark:text-white/60 lg:text-[10px] xl:text-xs">
                Employee Management System
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-300 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-2 px-6 lg:px-3 xl:px-4 2xl:px-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activetab === item.id;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() =>
                  setActiveTab(item.id)
                }
                className={`group relative flex w-full items-center overflow-hidden rounded-2xl px-3 py-3 text-left transition-all duration-300 lg:px-2 lg:py-2.5 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg dark:bg-white/20"
                    : "text-slate-700 hover:bg-slate-300/60 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-blue-600 dark:bg-[#0a3d90]" />
                )}

                <div
                  className={`relative z-10 mr-4 rounded-xl p-2 transition-all duration-300 group-hover:scale-110 ${
                    isActive
                      ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-slate-300/80 text-slate-800 dark:bg-white/10 dark:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                </div>

                <span className="relative z-10 text-sm font-semibold lg:text-xs xl:text-sm">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Calendar Section */}
        <div className="mt-6 px-3 lg:px-2 xl:px-4 2xl:px-6">
          <div className="rounded-2xl border border-slate-300/80 bg-slate-300/40 p-3 shadow-sm transition-all duration-300 dark:border-[#1c4b98]/60 dark:bg-[#131f3d] lg:p-2 xl:p-3">
            {/* Calendar Header */}
            <button
              type="button"
              onClick={() =>
                setIsCalendarOpen(
                  (previousState) =>
                    !previousState,
                )
              }
              className="flex w-full items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center space-x-2.5 lg:space-x-1.5 xl:space-x-2.5">
                <div className="rounded-lg bg-blue-500/10 p-1.5 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <CalendarIcon className="h-4 w-4 lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 lg:text-[10px] xl:text-xs">
                  Company Schedule
                </span>
              </div>

              <div className="rounded-lg p-1 text-slate-500 hover:bg-slate-300/60 dark:text-slate-400 dark:hover:bg-white/10">
                {isCalendarOpen ? (
                  <ChevronUp className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                ) : (
                  <ChevronDown className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                )}
              </div>
            </button>

            {/* Calendar Body */}
            {isCalendarOpen && (
              <div className="mt-3 flex w-full flex-col items-center">
                {/* Custom Navigation Controls */}
                <div className="mb-2 flex w-full items-center justify-between border-b border-slate-300/50 px-1 pb-2 dark:border-slate-700/50">
                  {/* Previous controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={handlePrevYear}
                      title="Previous Year"
                      aria-label="Previous Year"
                      className="rounded-lg p-1 text-slate-600 transition-colors hover:bg-slate-300/70 hover:text-black dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white lg:p-0.5 xl:p-1"
                    >
                      <ChevronsLeft className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      title="Previous Month"
                      aria-label="Previous Month"
                      className="rounded-lg p-1 text-slate-600 transition-colors hover:bg-slate-300/70 hover:text-black dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white lg:p-0.5 xl:p-1"
                    >
                      <ChevronLeft className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                    </button>
                  </div>

                  {/* Current month and year */}
                  <span className="whitespace-nowrap text-xs font-bold text-slate-800 dark:text-slate-100 lg:text-[10.5px] xl:text-xs">
                    {currentMonth.toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </span>

                  {/* Next controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      title="Next Month"
                      aria-label="Next Month"
                      className="rounded-lg p-1 text-slate-600 transition-colors hover:bg-slate-300/70 hover:text-black dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white lg:p-0.5 xl:p-1"
                    >
                      <ChevronRight className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextYear}
                      title="Next Year"
                      aria-label="Next Year"
                      className="rounded-lg p-1 text-slate-600 transition-colors hover:bg-slate-300/70 hover:text-black dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white lg:p-0.5 xl:p-1"
                    >
                      <ChevronsRight className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Calendar */}
                <Calendar
                  mode="single"
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  selected={date}
                  onSelect={setDate}
                  showOutsideDays={true}
                  fixedWeeks={true}
                  modifiers={{
                    today,
                    holiday: isHolidayDate,
                  }}
                  modifiersClassNames={{
                    holiday:
                      "!bg-red-600 !text-white hover:!bg-red-700 font-bold rounded-lg shadow-sm",

                    today:
                      '!bg-emerald-600 !text-white hover:!bg-emerald-700 font-bold rounded-lg shadow-sm [&[aria-selected="true"]]:!bg-emerald-600 [&[aria-selected="true"]]:!text-white',
                  }}
                  className="w-full rounded-xl border-none bg-transparent p-0 text-slate-800 dark:text-slate-200"
                />

                {/* Footer Banner */}
                <div className="mt-3 w-full border-t border-slate-300/60 pt-2 dark:border-[#1c4b98]/40">
                  {selectedHolidayName ? (
                    <div className="flex items-center space-x-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 lg:text-[9px] xl:text-[10px] 2xl:text-[11px]">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 lg:h-3 lg:w-3" />

                      <span className="truncate">
                        Holiday:{" "}
                        {selectedHolidayName}
                      </span>
                    </div>
                  ) : isTodaySelected ? (
                    <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 lg:text-[9px] xl:text-[10px] 2xl:text-[11px]">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 lg:h-1.5 lg:w-1.5" />

                      <span>
                        Today's Work Shift Active
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-slate-400 lg:text-[9px] xl:text-[10px] 2xl:text-[11px]">
                      <span>Selected:</span>

                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {date?.toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-6 lg:p-4 2xl:p-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-300 bg-slate-300/60 p-4 dark:border-[#1c4b98] dark:bg-[#0F172A] lg:p-3 2xl:p-4">
          <div className="relative flex flex-col items-center">
            <div className="mb-4 flex items-center space-x-3 lg:space-x-2 2xl:space-x-3">
              <img
                src={alex}
                alt="Alex"
                className="h-12 w-12 rounded-full border-2 border-[#3B82F6] object-cover lg:h-10 lg:w-10 2xl:h-12 2xl:w-12"
              />

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white lg:text-sm 2xl:text-base">
                  Alex Morgan
                </h3>

                <p className="text-xs text-slate-600 dark:text-white/60 lg:text-[10px] 2xl:text-xs">
                  Software Developer
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-40 rounded-2xl bg-[#3B82F6] py-1.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl lg:w-full lg:py-1 2xl:w-40 2xl:py-1.5"
            >
              <LogOut className="mr-2 inline h-4 w-4 lg:h-3.5 lg:w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;