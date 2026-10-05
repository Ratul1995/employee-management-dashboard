import axios from "axios";
import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Building2,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CalendarX,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

interface UserCompany {
  department?: string;
}

interface UserData {
  id: number;
  gender: string;
  company?: UserCompany;
  salary?: number;
}

interface DummyJsonResponse {
  users: UserData[];
  total: number;
  skip: number;
  limit: number;
}

export function ProgressWithLabel() {
  return (
    <Progress value={56} className="w-full max-w-sm">
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}

const CardData = () => {
  const [list, setList] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for smooth gauge animation on page mount / refresh
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // =========================================================
  // FETCH EMPLOYEE DATA
  // =========================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get<DummyJsonResponse>(
          "https://dummyjson.com/users?limit=200",
        );

        const usersWithSalary: UserData[] = (res.data.users || []).map(
          (user) => ({
            ...user,
            salary:
              user.salary ||
              30000 +
                ((user.id * 350) % 50000),
          }),
        );

        setList(usersWithSalary);
      } catch (err) {
        setError("Sorry, API cannot fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================================================
  // CARD CALCULATIONS
  // =========================================================

  const totalEmployees = list.length;

  const activeEmployees = Math.round(totalEmployees * 0.88);

  const totalDepartments = new Set(
    list
      .map((user) => user.company?.department)
      .filter((department): department is string => Boolean(department)),
  ).size;

  const totalSalary = list.reduce(
    (accumulator, currentUser) =>
      accumulator + (currentUser.salary || 0),
    0,
  );

  const avgSalary =
    totalEmployees > 0
      ? Math.round(totalSalary / totalEmployees)
      : 0;

  // =========================================================
  // DEPARTMENT DATA
  // =========================================================

  const departmentCounts: Record<string, number> = {};

  list.forEach((user) => {
    const department = user.company?.department || "Other";

    departmentCounts[department] =
      (departmentCounts[department] || 0) + 1;
  });

  const departmentData = Object.keys(departmentCounts).map(
    (department) => ({
      name: department,
      count: departmentCounts[department],
    }),
  );

  // =========================================================
  // GENDER DATA
  // =========================================================

  const maleCount = list.filter(
    (user) => user.gender === "male",
  ).length;

  const femaleCount = list.filter(
    (user) => user.gender === "female",
  ).length;

  const totalGender = maleCount + femaleCount || 1;

  const malePercent = Math.round(
    (maleCount / totalGender) * 100,
  );

  const femalePercent = Math.round(
    (femaleCount / totalGender) * 100,
  );

  const genderData = [
    {
      name: "Male",
      value: malePercent,
      color: "#3b82f6",
    },
    {
      name: "Female",
      value: femalePercent,
      color: "#ec4899",
    },
  ];

  // =========================================================
  // SALARY OVERVIEW MONTHLY TREND DATA
  // =========================================================

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const salaryOverviewData = months.map((month, index) => {
    const variation =
      Math.sin(index) * 4000 + index * 600;

    return {
      month,
      salary: Math.round(
        avgSalary - 4000 + variation,
      ),
    };
  });

  // =========================================================
  // CHART COLOR PALETTE
  // =========================================================

  const colorPalette = [
    "#3b82f6",
    "#10b981",
    "#a855f7",
    "#ec4899",
    "#f59e0b",
    "#06b6d4",
    "#6366f1",
    "#f97316",
    "#14b8a6",
    "#8b5cf6",
  ];

  // =========================================================
  // OPERATIONAL ATTENDANCE CALCULATIONS
  // =========================================================

  const attendanceTotal = totalEmployees || 176;

  const onTimeCount = totalEmployees
    ? Math.round(attendanceTotal * 0.806)
    : 142;

  const lateCount = totalEmployees
    ? Math.round(attendanceTotal * 0.102)
    : 18;

  const absentCount =
    attendanceTotal - onTimeCount - lateCount;

  const onTimePercent = Math.round(
    (onTimeCount / attendanceTotal) * 100,
  );

  const latePercent = Math.round(
    (lateCount / attendanceTotal) * 100,
  );

  const absentPercent =
    100 - onTimePercent - latePercent;

  // =========================================================
  // GAUGE METER DATA
  // =========================================================

  const revenueCurrent = Math.round(
    totalSalary / 1000,
  );

  const revenueTarget = Math.round(
    (totalSalary * 1.35) / 1000,
  );

  const targetGaugePercent =
    Math.min(
      Math.round(
        (revenueCurrent / revenueTarget) * 100,
      ),
      100,
    ) || 74;

  // =========================================================
  // GAUGE ANIMATION
  // =========================================================

  useEffect(() => {
    if (loading) {
      return;
    }

    let startTime: number | null = null;

    const duration = 1500;

    const animateGauge = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;

      const progress = Math.min(
        elapsed / duration,
        1,
      );

      // Smooth easeOutCubic animation
      const easeOutProgress =
        1 - Math.pow(1 - progress, 3);

      setAnimatedPercent(
        Math.round(
          easeOutProgress * targetGaugePercent,
        ),
      );

      if (progress < 1) {
        requestAnimationFrame(animateGauge);
      }
    };

    requestAnimationFrame(animateGauge);
  }, [loading, targetGaugePercent]);

  // =========================================================
  // GAUGE DATA
  // =========================================================

  const gaugeData = [
    {
      name: "Achieved",
      value: animatedPercent,
      fill: "#22c55e",
    },
    {
      name: "Remaining",
      value: Math.max(100 - animatedPercent, 0),
      fill: "#1e293b",
    },
  ];

  // =========================================================
  // GAUGE NEEDLE
  // =========================================================

  const renderArcEndpointNeedle = (
    value: number,
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
  ) => {
    const RADIAN = Math.PI / 180;

    const angle =
      180 - (value / 100) * 180;

    const midRadius =
      (innerRadius + outerRadius) / 2;

    // Shift starting point slightly inward
    const startRadius = midRadius - 5;

    const needleLength = 18;

    const arcX =
      cx +
      startRadius *
        Math.cos(-RADIAN * angle);

    const arcY =
      cy +
      startRadius *
        Math.sin(-RADIAN * angle);

    const endX =
      cx +
      (startRadius + needleLength) *
        Math.cos(-RADIAN * angle);

    const endY =
      cy +
      (startRadius + needleLength) *
        Math.sin(-RADIAN * angle);

    return (
      <g className="transition-all duration-75 ease-linear">
        {/* Main Needle */}
        <line
          x1={arcX}
          y1={arcY}
          x2={endX}
          y2={endY}
          stroke="#10b981"
          strokeWidth={4.5}
          strokeLinecap="round"
        />

        {/* Needle Highlight */}
        <line
          x1={arcX}
          y1={arcY}
          x2={endX}
          y2={endY}
          stroke="#064e3b"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </g>
    );
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="p-6 text-slate-500 dark:text-slate-400">
        Loading metrics...
      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return (
      <div className="p-6 text-rose-500">
        {error}
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6 p-6">

      {/* =====================================================
          CARDS SECTION
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total Employees */}

        <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] dark:border-[#1c3866] dark:bg-[#101b36] dark:text-white dark:hover:border-blue-500/50">

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:group-hover:text-slate-300">
              Total Employees
            </p>

            <h3 className="text-2xl font-bold">
              {totalEmployees}
            </h3>

            <div className="flex items-center pt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              +12%

              <span className="ml-1 text-slate-400 dark:text-slate-500">
                vs. last month
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-600 transition-transform duration-300 group-hover:scale-110 dark:border-blue-500/30 dark:bg-blue-600/20 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Active Employees */}

        <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] dark:border-[#1c3866] dark:bg-[#101b36] dark:text-white dark:hover:border-blue-500/50">

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:group-hover:text-slate-300">
              Active Employees
            </p>

            <h3 className="text-2xl font-bold">
              {activeEmployees}
            </h3>

            <div className="flex items-center pt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              +6%

              <span className="ml-1 text-slate-400 dark:text-slate-500">
                vs. last month
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-600 transition-transform duration-300 group-hover:scale-110 dark:border-emerald-500/30 dark:bg-emerald-600/20 dark:text-emerald-400">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Departments */}

        <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] dark:border-[#1c3866] dark:bg-[#101b36] dark:text-white dark:hover:border-blue-500/50">

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:group-hover:text-slate-300">
              Departments
            </p>

            <h3 className="text-2xl font-bold">
              {totalDepartments}
            </h3>

            <div className="pt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              0%

              <span className="ml-1 text-slate-400 dark:text-slate-500">
                vs. last month
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-purple-600 transition-transform duration-300 group-hover:scale-110 dark:border-purple-500/30 dark:bg-purple-600/20 dark:text-purple-400">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        {/* Avg Salary */}

        <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] dark:border-[#1c3866] dark:bg-[#101b36] dark:text-white dark:hover:border-blue-500/50">

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:group-hover:text-slate-300">
              Avg. Salary
            </p>

            <h3 className="text-2xl font-bold">
              ${avgSalary.toLocaleString()}
            </h3>

            <div className="flex items-center pt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              +10%

              <span className="ml-1 text-slate-400 dark:text-slate-500">
                vs. last month
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-600 transition-transform duration-300 group-hover:scale-110 dark:border-amber-500/30 dark:bg-amber-600/20 dark:text-amber-400">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* =====================================================
          CHARTS ROW
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

        {/* Department Bar Chart */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm xl:col-span-5 dark:border-[#1c3866] dark:bg-[#101b36] dark:text-white">

          <h3 className="mb-4 text-lg font-bold">
            Employees by Department
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={departmentData.map(
                  (department) => ({
                    ...department,
                    shortName:
                      department.name.length > 7
                        ? `${department.name.slice(
                            0,
                            7,
                          )}...`
                        : department.name,
                  }),
                )}
                margin={{
                  bottom: 25,
                  left: -15,
                  right: 10,
                  top: 10,
                }}
              >
                <XAxis
                  dataKey="shortName"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{
                    color: "#ffffff",
                  }}
                  formatter={(value) => [
                    `${Number(value ?? 0)} Employees`,
                    "Count",
                  ]}
                />

                <Bar
                  dataKey="count"
                  radius={[5, 5, 0, 0]}
                >
                  {departmentData.map(
                    (_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          colorPalette[
                            index %
                              colorPalette.length
                          ]
                        }
                      />
                    ),
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Donut Chart */}

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm xl:col-span-3 dark:border-[#1c3866] dark:bg-[#101b36] dark:text-white">

          <h3 className="mb-2 text-lg font-bold">
            Gender Distribution
          </h3>

          <div className="flex h-48 w-full items-center justify-center">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={genderData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {genderData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ),
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 pt-2 text-xs font-medium">

            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span>
                Male ({malePercent}%)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
              <span>
                Female ({femalePercent}%)
              </span>
            </div>

          </div>
        </div>

        {/* Salary Line Chart */}

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm xl:col-span-4 dark:border-[#1c3866] dark:bg-[#101b36] dark:text-white">

          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-bold">
              Salary Overview
            </h3>

            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500 dark:text-blue-400">
              Trend
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={salaryOverviewData}
                margin={{
                  left: -15,
                  right: 10,
                  top: 10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor="#3b82f6"
                    />

                    <stop
                      offset="50%"
                      stopColor="#8b5cf6"
                    />

                    <stop
                      offset="100%"
                      stopColor="#ec4899"
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(value: number) =>
                    `$${(value / 1000).toFixed(0)}k`
                  }
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => [
                    `$${Number(
                      value ?? 0,
                    ).toLocaleString()}`,
                    "Avg Salary",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="salary"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    fill: "#ec4899",
                    strokeWidth: 2,
                    stroke: "#ffffff",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#ec4899",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =====================================================
          ATTENDANCE + GAUGE
      ====================================================== */}

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">

        {/* Operational Attendance */}

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm transition-all duration-300 lg:col-span-8 dark:border-[#1c3866] dark:bg-[#101b36] dark:text-white">

          <div>

            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

              <div className="flex items-center space-x-2">

                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                  <Clock className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    Today's Attendance & Operational Health
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Instant status report for HR and management
                  </p>
                </div>

              </div>

              <span className="self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:self-auto dark:text-emerald-400">
                High Efficiency ({onTimePercent}%)
              </span>

            </div>

            <div className="mt-4 space-y-2">

              <div className="flex h-4 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 p-0.5 dark:border-[#1c3866] dark:bg-[#0b1329]">

                <div
                  style={{
                    width: `${onTimePercent}%`,
                  }}
                  className="group relative h-full rounded-l-full bg-emerald-500 transition-all duration-500 ease-in-out"
                  title={`On Time: ${onTimeCount} (${onTimePercent}%)`}
                />

                <div
                  style={{
                    width: `${latePercent}%`,
                  }}
                  className="group relative h-full bg-amber-500 transition-all duration-500 ease-in-out"
                  title={`Late: ${lateCount} (${latePercent}%)`}
                />

                <div
                  style={{
                    width: `${absentPercent}%`,
                  }}
                  className="group relative h-full rounded-r-full bg-purple-500 transition-all duration-500 ease-in-out dark:bg-purple-600"
                  title={`On Leave / Absent: ${absentCount} (${absentPercent}%)`}
                />

              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3 dark:border-slate-800/60">

            {/* On Time */}

            <div className="flex items-center space-x-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-[#162544]/50">

              <CheckCircle2 className="h-5 w-5 text-emerald-500" />

              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  On Time
                </div>

                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {onTimeCount}

                  <span className="ml-1 text-xs font-normal text-emerald-500 dark:text-emerald-400">
                    ({onTimePercent}%)
                  </span>
                </div>
              </div>

            </div>

            {/* Late */}

            <div className="flex items-center space-x-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-[#162544]/50">

              <AlertTriangle className="h-5 w-5 text-amber-500" />

              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Late Arrival
                </div>

                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {lateCount}

                  <span className="ml-1 text-xs font-normal text-amber-500 dark:text-amber-400">
                    ({latePercent}%)
                  </span>
                </div>
              </div>

            </div>

            {/* Absent */}

            <div className="flex items-center space-x-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-[#162544]/50">

              <CalendarX className="h-5 w-5 text-purple-500 dark:text-purple-400" />

              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  On Leave / Absent
                </div>

                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {absentCount}

                  <span className="ml-1 text-xs font-normal text-purple-500 dark:text-purple-400">
                    ({absentPercent}%)
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            TOTAL REVENUE GAUGE
        ================================================== */}

        <div className="flex flex-col items-center justify-between rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm transition-all duration-300 lg:col-span-4 dark:border-[#1c3866] dark:bg-[#101b36] dark:text-white">

          <div className="mb-1 flex w-full items-center justify-between">

            <h3 className="text-lg font-bold">
              Total Revenue
            </h3>

            <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-500">
              <Target className="h-4 w-4" />
            </div>

          </div>

          {/* Gauge Container */}

          <div className="relative flex h-40 w-full items-center justify-center">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="75%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={false}
                >
                  <Cell
                    key="achieved"
                    fill="#22c55e"
                  />

                  <Cell
                    key="remaining"
                    fill="#1e293b"
                  />
                </Pie>

              </PieChart>
            </ResponsiveContainer>

            {/* SVG Needle */}

            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 200 160"
            >
              {renderArcEndpointNeedle(
                animatedPercent,
                100,
                120,
                65,
                85,
              )}
            </svg>

            {/* Live Percentage */}

            <div className="absolute bottom-0 flex flex-col items-center">

              <span className="text-3xl font-extrabold text-slate-900 transition-all dark:text-white">
                {animatedPercent}%
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                Achieved
              </span>

            </div>

          </div>

          {/* Revenue Details */}

          <div className="mt-2 flex w-full flex-col items-center space-y-2">

            <div className="rounded-full bg-emerald-500 px-4 py-1 text-sm font-bold text-white shadow-sm">
              ${revenueCurrent.toLocaleString()}
            </div>

            <div className="space-y-0.5 text-center text-xs text-slate-500 dark:text-slate-400">

              <p>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Total Target:
                </span>{" "}
                ${revenueTarget.toLocaleString()}
              </p>

              <p>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Last 3 Months:
                </span>{" "}
                ${(revenueCurrent * 0.85).toFixed(0)}k
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CardData;