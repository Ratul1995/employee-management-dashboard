import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import CardData from "./Card";
import Employee from "./Employee";
import Reports from "./Reports";
import Settings from "./Settings";

const MainBoard = () => {
  const [sidebar, setSidebarOpen] = useState(false);

  // Get the previously selected tab from sessionStorage
  const [activetab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("activeTab") || "dashboard";
  });

  const [currentTime, setCurrenttime] = useState(new Date());

  // Update current time every 1 minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrenttime(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Save active tab whenever it changes
  useEffect(() => {
    sessionStorage.setItem("activeTab", activetab);
  }, [activetab]);

  return (
    <div className="relative min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-[#0B1120] dark:text-white">
      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          sidebar={sidebar}
          setSidebarOpen={setSidebarOpen}
          activetab={activetab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content */}
        <main className="min-w-0 flex-1 bg-slate-100 transition-colors duration-300 dark:bg-[#0B1120]">
          {/* Mobile Navbar */}
          <div className="flex items-center justify-between border-b border-slate-300 p-4 dark:border-white/20 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl bg-slate-200 p-3 text-slate-900 transition-colors hover:bg-slate-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            <h1 className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-blue-500 md:text-4xl">
              EmpManage
            </h1>

            <div className="w-10" />
          </div>

          {/* Header */}
          <div className="flex flex-col">
            <Header activetab={activetab} currentTime={currentTime} />
          </div>

          {/* Dashboard Section */}
          <div>{activetab === "dashboard" && <CardData />}</div>

          {/* Employee Section */}
          <div>{activetab === "employee" && <Employee />}</div>

          {/* Reports Section */}
          <div>{activetab === "reports" && <Reports />}</div>

          {/* Settings Section */}
          <div>{activetab === "settings" && <Settings />}</div>
        </main>
      </div>
    </div>
  );
};

export default MainBoard;
