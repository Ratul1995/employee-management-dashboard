import React, { useMemo, useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from "lucide-react";

type ReportPeriod = "This Month" | "Last Quarter" | "Year to Date";

interface ReportItem {
  id: number;
  title: string;
  category: "Finance" | "HR" | "Analytics" | "Operations";
  date: string;
  size: string;
  format: "PDF" | "CSV";
  period: ReportPeriod;
}

interface DepartmentCost {
  name: string;
  amount: string;
  percentage: number;
  color: string;
}

const rawReportsList: ReportItem[] = [
  {
    id: 1,
    title: "Monthly Payroll Summary",
    category: "Finance",
    date: "Oct 01, 2026",
    size: "2.4 MB",
    format: "PDF",
    period: "This Month",
  },
  {
    id: 2,
    title: "Employee Performance Metrics",
    category: "HR",
    date: "Sep 28, 2026",
    size: "1.8 MB",
    format: "CSV",
    period: "This Month",
  },
  {
    id: 3,
    title: "Department Cost Breakdown",
    category: "Analytics",
    date: "Sep 15, 2026",
    size: "4.1 MB",
    format: "PDF",
    period: "This Month",
  },
  {
    id: 4,
    title: "Attendance & Leave Audit",
    category: "Operations",
    date: "Sep 01, 2026",
    size: "950 KB",
    format: "CSV",
    period: "This Month",
  },
  {
    id: 5,
    title: "Q3 Financial Audit & Taxes",
    category: "Finance",
    date: "Jul 01, 2026",
    size: "5.6 MB",
    format: "PDF",
    period: "Last Quarter",
  },
  {
    id: 6,
    title: "Mid-Year HR Retention Analysis",
    category: "HR",
    date: "Jun 30, 2026",
    size: "3.2 MB",
    format: "CSV",
    period: "Last Quarter",
  },
  {
    id: 7,
    title: "Annual Compensation Benchmark",
    category: "Finance",
    date: "Jan 15, 2026",
    size: "8.4 MB",
    format: "PDF",
    period: "Year to Date",
  },
  {
    id: 8,
    title: "Yearly Infrastructure & Tools Cost",
    category: "Analytics",
    date: "Feb 10, 2026",
    size: "6.1 MB",
    format: "CSV",
    period: "Year to Date",
  },
];

const departmentCosts: DepartmentCost[] = [
  {
    name: "Engineering",
    amount: "$185,000",
    percentage: 45,
    color: "bg-blue-500",
  },
  {
    name: "Sales & Marketing",
    amount: "$92,000",
    percentage: 22,
    color: "bg-indigo-500",
  },
  {
    name: "Product & Design",
    amount: "$75,000",
    percentage: 18,
    color: "bg-purple-500",
  },
  {
    name: "Human Resources",
    amount: "$45,000",
    percentage: 10,
    color: "bg-emerald-500",
  },
  {
    name: "Finance & Legal",
    amount: "$22,100",
    percentage: 5,
    color: "bg-amber-500",
  },
];

const departmentFilters = [
  "All",
  "Engineering",
  "Sales & Marketing",
  "Product & Design",
  "Human Resources",
  "Finance & Legal",
];

const reportPeriods: ReportPeriod[] = [
  "This Month",
  "Last Quarter",
  "Year to Date",
];

export default function Reports() {
  const [selectedRange, setSelectedRange] =
    useState<ReportPeriod>("This Month");

  const [selectedDeptFilter, setSelectedDeptFilter] =
    useState<string>("All");

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Dynamic KPI Metrics
  const kpiData = useMemo(() => {
    switch (selectedRange) {
      case "Last Quarter":
        return [
          {
            title: "Total Quarterly Payroll",
            value: "$1,340,500",
            change: "+3.8%",
            isPositive: true,
            icon: (
              <DollarSign
                size={18}
                className="text-emerald-500 dark:text-emerald-400"
              />
            ),
          },
          {
            title: "Employee Retention",
            value: "93.2%",
            change: "+0.8%",
            isPositive: true,
            icon: (
              <TrendingUp
                size={18}
                className="text-blue-500 dark:text-blue-400"
              />
            ),
          },
          {
            title: "Avg Quarterly Attendance",
            value: "95.4%",
            change: "+1.2%",
            isPositive: true,
            icon: (
              <Users
                size={18}
                className="text-indigo-500 dark:text-indigo-400"
              />
            ),
          },
          {
            title: "Top Performing Dept",
            value: "Product & Design",
            change: "96% Efficiency",
            isPositive: true,
            icon: (
              <Award
                size={18}
                className="text-amber-500 dark:text-amber-400"
              />
            ),
          },
        ];

      case "Year to Date":
        return [
          {
            title: "Total YTD Payroll",
            value: "$4,120,800",
            change: "+12.4%",
            isPositive: true,
            icon: (
              <DollarSign
                size={18}
                className="text-emerald-500 dark:text-emerald-400"
              />
            ),
          },
          {
            title: "Employee Retention",
            value: "95.1%",
            change: "+2.4%",
            isPositive: true,
            icon: (
              <TrendingUp
                size={18}
                className="text-blue-500 dark:text-blue-400"
              />
            ),
          },
          {
            title: "Avg YTD Attendance",
            value: "96.8%",
            change: "+0.5%",
            isPositive: true,
            icon: (
              <Users
                size={18}
                className="text-indigo-500 dark:text-indigo-400"
              />
            ),
          },
          {
            title: "Top Performing Dept",
            value: "Engineering",
            change: "98% Efficiency",
            isPositive: true,
            icon: (
              <Award
                size={18}
                className="text-amber-500 dark:text-amber-400"
              />
            ),
          },
        ];

      case "This Month":
      default:
        return [
          {
            title: "Total Monthly Payroll",
            value: "$452,100",
            change: "+4.2%",
            isPositive: true,
            icon: (
              <DollarSign
                size={18}
                className="text-emerald-500 dark:text-emerald-400"
              />
            ),
          },
          {
            title: "Employee Retention",
            value: "94.8%",
            change: "+1.5%",
            isPositive: true,
            icon: (
              <TrendingUp
                size={18}
                className="text-blue-500 dark:text-blue-400"
              />
            ),
          },
          {
            title: "Avg Monthly Attendance",
            value: "96.2%",
            change: "-0.4%",
            isPositive: false,
            icon: (
              <Users
                size={18}
                className="text-indigo-500 dark:text-indigo-400"
              />
            ),
          },
          {
            title: "Top Performing Dept",
            value: "Engineering",
            change: "98% Efficiency",
            isPositive: true,
            icon: (
              <Award
                size={18}
                className="text-amber-500 dark:text-amber-400"
              />
            ),
          },
        ];
    }
  }, [selectedRange]);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return rawReportsList.filter(
      (item) => item.period === selectedRange,
    );
  }, [selectedRange]);

  // Filtered Departments
  const filteredDepartments = useMemo(() => {
    if (selectedDeptFilter === "All") {
      return departmentCosts;
    }

    return departmentCosts.filter((dept) =>
      dept.name
        .toLowerCase()
        .includes(selectedDeptFilter.toLowerCase()),
    );
  }, [selectedDeptFilter]);

  // Show notification
  const showNotification = (message: string) => {
    setDownloadSuccess(message);

    window.setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  // Trigger browser download
  const triggerDownload = (
    filename: string,
    content: string,
    mimeType: string,
  ) => {
    const blob = new Blob([content], {
      type: mimeType,
    });

    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.style.display = "none";
    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();

    window.setTimeout(() => {
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  // Generate printable PDF content
  const generatePDFDownload = (report: ReportItem) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      showNotification("Please allow pop-ups to generate the PDF.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${report.title}</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #1e293b;
            }

            .header {
              border-bottom: 2px solid #2563eb;
              padding-bottom: 15px;
              margin-bottom: 30px;
            }

            h1 {
              margin: 0;
              color: #0f172a;
              font-size: 24px;
            }

            p {
              margin: 5px 0;
              color: #64748b;
              font-size: 14px;
            }

            .content {
              margin-top: 20px;
              line-height: 1.6;
            }

            .card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            }

            .footer {
              margin-top: 50px;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 10px;
            }
          </style>
        </head>

        <body>
          <div class="header">
            <h1>${report.title}</h1>
            <p>EmpManage Official Organizational Report</p>
          </div>

          <div class="content">
            <p><strong>Category:</strong> ${report.category}</p>
            <p><strong>Date Generated:</strong> ${report.date}</p>
            <p><strong>Time Period:</strong> ${report.period}</p>

            <div class="card">
              <h3>Report Summary</h3>

              <p>
                This report contains validated metrics for
                ${report.title}.
                All metrics are computed dynamically from organizational
                database records.
              </p>
            </div>
          </div>

          <div class="footer">
            Generated automatically by EmpManage Dashboard System •
            ${new Date().toLocaleDateString()}
          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Individual report download
  const handleDownloadReport = (report: ReportItem) => {
    setDownloadingId(report.id);

    window.setTimeout(() => {
      if (report.format === "PDF") {
        generatePDFDownload(report);
      } else {
        const csvHeader =
          "Title,Category,Date,Period,Status\\n";

        const csvRow =
          `"${report.title}","${report.category}","${report.date}","${report.period}","Verified"\\n`;

        triggerDownload(
          `${report.title.replace(/\s+/g, "_")}.csv`,
          csvHeader + csvRow,
          "text/csv;charset=utf-8;",
        );
      }

      setDownloadingId(null);

      showNotification(`Generated ${report.title}`);
    }, 400);
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 text-slate-700 dark:text-slate-200">
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold animate-bounce">
          <CheckCircle2 size={16} />

          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Reports & Analytics

            <Sparkles
              size={18}
              className="text-blue-500 animate-pulse"
            />
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Generate, analyze, and export comprehensive organizational
            metrics.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex-1 sm:flex-initial flex items-center justify-between gap-2 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-2 w-full">
              <Calendar
                size={14}
                className="text-blue-500 dark:text-blue-400 shrink-0"
              />

              <select
                value={selectedRange}
                onChange={(event) => {
                  const value = event.target.value;

                  if (
                    reportPeriods.includes(
                      value as ReportPeriod,
                    )
                  ) {
                    setSelectedRange(value as ReportPeriod);
                  }
                }}
                className="bg-transparent focus:outline-none cursor-pointer w-full text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                {reportPeriods.map((period) => (
                  <option
                    key={period}
                    value={period}
                    className="bg-white text-slate-900 dark:bg-[#0b1329] dark:text-slate-200"
                  >
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiData.map((kpi) => (
          <MetricCard
            key={kpi.title}
            {...kpi}
          />
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Budget Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0b1329] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-4 sm:p-6 space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between relative">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                Department Expenditure Breakdown
              </h2>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Budget allocation across active departments.
              </p>
            </div>

            {/* Department Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsFilterMenuOpen((previous) => !previous)
                }
                className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 bg-slate-100 dark:bg-[#0f1938] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-colors cursor-pointer"
              >
                <Filter
                  size={12}
                  className="text-blue-500"
                />

                <span className="font-medium">
                  {selectedDeptFilter}
                </span>

                <ChevronDown size={12} />
              </button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#0f1938] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 py-1.5 text-xs">
                  {departmentFilters.map((dept) => (
                    <button
                      type="button"
                      key={dept}
                      onClick={() => {
                        setSelectedDeptFilter(dept);
                        setIsFilterMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-600/10 transition-colors ${
                        selectedDeptFilter === dept
                          ? "font-bold text-blue-600 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Department Progress Bars */}
          <div className="space-y-4 pt-2">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => (
                <DepartmentProgressBar
                  key={dept.name}
                  {...dept}
                />
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No department records matched your filter.
              </p>
            )}
          </div>
        </div>

        {/* Quick Report Downloads */}
        <div className="bg-white dark:bg-[#0b1329] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-4 sm:p-6 space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                Available Reports
              </h2>

              <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/20">
                {selectedRange}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Download formatted HR and financial audits.
            </p>

            <div className="space-y-2.5 pt-3">
              {filteredReports.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0f1938] border border-slate-200/80 dark:border-slate-800/60 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-200 group gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
                      <FileText size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {item.title}
                      </p>

                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {item.category} • {item.size} •{" "}
                        <strong className="text-slate-600 dark:text-slate-300">
                          {item.format}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadReport(item)}
                    disabled={downloadingId === item.id}
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-600/20 rounded-lg transition-all shrink-0 active:scale-95 disabled:opacity-50 cursor-pointer"
                    title={`Download ${item.title}`}
                  >
                    {downloadingId === item.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                  </button>
                </div>
              ))}

              {filteredReports.length === 0 && (
                <div className="py-8 text-center">
                  <FileText
                    size={24}
                    className="mx-auto text-slate-400 mb-2"
                  />

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No reports available for this period.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Metric Card */
/* -------------------------------------------------------------------------- */

function MetricCard({
  title,
  value,
  change,
  isPositive,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#0b1329] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300 group">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
          {title}
        </span>

        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0f1938] border border-slate-200 dark:border-slate-800 group-hover:scale-110 transition-transform shrink-0">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
          {value}
        </h3>

        <span
          className={`text-[10px] sm:text-[11px] font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-md shrink-0 ${
            isPositive
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20"
              : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight size={11} />
          ) : (
            <ArrowDownRight size={11} />
          )}

          {change}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Department Progress Bar */
/* -------------------------------------------------------------------------- */

function DepartmentProgressBar({
  name,
  amount,
  percentage,
  color,
}: DepartmentCost) {
  return (
    <div className="space-y-1.5 group">
      <div className="flex justify-between text-xs font-medium gap-2">
        <span className="text-slate-700 dark:text-slate-300 font-semibold truncate group-hover:text-blue-500 transition-colors">
          {name}
        </span>

        <span className="text-slate-500 dark:text-slate-400 shrink-0">
          {amount} ({percentage}%)
        </span>
      </div>

      <div className="w-full h-2.5 bg-slate-100 dark:bg-[#070d19] rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-800/60 p-0.5">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}