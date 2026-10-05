import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  BriefcaseBusiness,
  UserRound,
  CircleDollarSign,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DataTable, {
  type PaginationComponentProps,
  type TableColumn,
  createTheme,
} from "react-data-table-component";

/* =========================================================
   TYPES
========================================================= */

interface Data {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  image: string;

  company: {
    department: string;
    title: string;
  };

  salary: number;
  status: string;

  age?: number;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  joiningDate?: string;
  skills?: string[];
  about?: string;
}

interface RandomUserName {
  first: string;
  last: string;
}

interface RandomUserPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

interface RandomUserStreet {
  number: number;
  name: string;
}

interface RandomUserLocation {
  street: RandomUserStreet;
  city: string;
  state: string;
  country: string;
}

interface RandomUserDate {
  date: string;
}

interface RandomUser {
  gender: string;
  name: RandomUserName;
  email: string;
  phone: string;
  picture: RandomUserPicture;
  location: RandomUserLocation;
  dob: RandomUserDate;
  registered: RandomUserDate;
}

interface RandomUserResponse {
  results: RandomUser[];
}

interface EditFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  age: string;
  department: string;
  title: string;
  salary: string;
  status: string;
  city: string;
  state: string;
  country: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const departmentsList = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Design",
];

const jobTitles: Record<string, string[]> = {
  Engineering: [
    "Frontend Developer",
    "Backend Developer",
    "React Developer",
    "Software Engineer",
    "Full Stack Developer",
  ],

  Marketing: [
    "Marketing Executive",
    "Digital Marketing Specialist",
    "Marketing Manager",
    "SEO Specialist",
    "Content Strategist",
  ],

  Sales: [
    "Sales Executive",
    "Sales Manager",
    "Business Development Executive",
    "Account Executive",
    "Sales Representative",
  ],

  HR: [
    "HR Executive",
    "HR Manager",
    "Recruiter",
    "Talent Acquisition Specialist",
    "HR Coordinator",
  ],

  Finance: [
    "Financial Analyst",
    "Accountant",
    "Finance Executive",
    "Finance Manager",
    "Accounts Executive",
  ],

  Design: [
    "UI Designer",
    "UX Designer",
    "Product Designer",
    "Graphic Designer",
    "UI/UX Designer",
  ],
};

/* =========================================================
   DATA TABLE THEMES
========================================================= */

createTheme(
  "customDark",
  {
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
      disabled: "#64748b",
    },

    background: {
      default: "#0f172a",
    },

    context: {
      background: "#0b1329",
      text: "#ffffff",
    },

    divider: {
      default: "#1c3866",
    },
  },
  "dark",
);

createTheme(
  "customLight",
  {
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      disabled: "#94a3b8",
    },

    background: {
      default: "#f8fafc",
    },

    context: {
      background: "#e2e8f0",
      text: "#0f172a",
    },

    divider: {
      default: "#e2e8f0",
    },
  },
  "default",
);

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const getSkillsByDepartment = (
  department: string,
): string[] => {
  const skills: Record<string, string[]> = {
    Engineering: [
      "React",
      "TypeScript",
      "JavaScript",
      "REST API",
      "Git",
    ],

    Marketing: [
      "SEO",
      "Content Marketing",
      "Google Ads",
      "Analytics",
      "Social Media",
    ],

    Sales: [
      "CRM",
      "Negotiation",
      "Communication",
      "Lead Generation",
      "Client Management",
    ],

    HR: [
      "Recruitment",
      "Employee Relations",
      "Communication",
      "HRIS",
      "Talent Management",
    ],

    Finance: [
      "Accounting",
      "Excel",
      "Financial Analysis",
      "Budgeting",
      "Reporting",
    ],

    Design: [
      "Figma",
      "UI Design",
      "UX Research",
      "Wireframing",
      "Prototyping",
    ],
  };

  return (
    skills[department] ?? [
      "Communication",
      "Teamwork",
      "Leadership",
    ]
  );
};

const getAboutByDepartment = (
  firstName: string,
  department: string,
  title: string,
): string => {
  const about: Record<string, string> = {
    Engineering: `${firstName} is a skilled ${title} with experience building modern and scalable web applications. Passionate about clean code, responsive interfaces, and creating reliable user experiences.`,

    Marketing: `${firstName} is a creative ${title} with a strong interest in digital marketing, brand growth, content strategy, and customer engagement.`,

    Sales: `${firstName} is an enthusiastic ${title} who focuses on building strong customer relationships, identifying opportunities, and achieving business targets.`,

    HR: `${firstName} is a people-focused ${title} experienced in recruitment, employee engagement, talent management, and creating a positive workplace environment.`,

    Finance: `${firstName} is a detail-oriented ${title} with strong analytical skills and experience in financial reporting, budgeting, accounting, and business analysis.`,

    Design: `${firstName} is a creative ${title} who enjoys designing intuitive, accessible, and visually appealing digital experiences.`,
  };

  return (
    about[department] ??
    `${firstName} is a dedicated professional who enjoys working with a talented team and delivering high-quality results.`
  );
};

const getDateOnly = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

/* =========================================================
   CUSTOM PAGINATION
========================================================= */

const CustomPagination: React.FC<
  PaginationComponentProps
> = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  currentPage,
}) => {
  const totalPages = Math.ceil(
    rowCount / rowsPerPage,
  );

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(
      1,
      currentPage - 2,
    );

    const end = Math.min(
      totalPages,
      start + maxVisible - 1,
    );

    if (end - start + 1 < maxVisible) {
      start = Math.max(
        1,
        end - maxVisible + 1,
      );
    }

    for (
      let page = start;
      page <= end;
      page += 1
    ) {
      pages.push(page);
    }

    return pages;
  };

  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className="employee-pagination flex w-full items-center justify-center gap-2 px-4 py-5">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          onChangePage(
            currentPage - 1,
            rowCount,
          )
        }
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
          currentPage === 1
            ? "cursor-not-allowed border-slate-700 text-slate-600"
            : "border-slate-600 text-slate-300 hover:bg-slate-700"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={17} />
      </button>

      {getPageNumbers().map((page) => (
        <button
          type="button"
          key={page}
          onClick={() =>
            onChangePage(
              page,
              rowCount,
            )
          }
          className={`h-9 min-w-9 rounded-xl border px-2 text-sm font-medium transition ${
            currentPage === page
              ? "border-blue-500 bg-blue-600 text-white"
              : "border-slate-600 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onChangePage(
            currentPage + 1,
            rowCount,
          )
        }
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
          currentPage === totalPages
            ? "cursor-not-allowed border-slate-700 text-slate-600"
            : "border-slate-600 text-slate-300 hover:bg-slate-700"
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
};

/* =========================================================
   ADD INPUT
========================================================= */

interface AddInputProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

const AddInput: React.FC<AddInputProps> = ({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
      />
    </div>
  );
};

/* =========================================================
   ADD SELECT
========================================================= */

interface AddSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
}

const AddSelect: React.FC<AddSelectProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

/* =========================================================
   ADD EMPLOYEE
========================================================= */

interface AddEmployeeProps {
  show: boolean;
  onClose: () => void;
  onAddEmployee: (
    employee: Omit<Data, "id">,
  ) => void;
}

const AddEmployee: React.FC<
  AddEmployeeProps
> = ({
  show,
  onClose,
  onAddEmployee,
}) => {
  const [firstName, setFirstName] =
    useState("");
  const [lastName, setLastName] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [gender, setGender] =
    useState("male");
  const [phone, setPhone] =
    useState("");
  const [age, setAge] =
    useState("");
  const [department, setDepartment] =
    useState("Engineering");
  const [title, setTitle] =
    useState(
      jobTitles.Engineering[0] ?? "",
    );
  const [salary, setSalary] =
    useState("50000");
  const [city, setCity] =
    useState("");
  const [state, setState] =
    useState("");
  const [country, setCountry] =
    useState("USA");

  useEffect(() => {
    if (!show) {
      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [show]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setGender("male");
    setPhone("");
    setAge("");
    setDepartment("Engineering");
    setTitle(
      jobTitles.Engineering[0] ?? "",
    );
    setSalary("50000");
    setCity("");
    setState("");
    setCountry("USA");
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const image =
      gender.toLowerCase() === "female"
        ? `https://randomuser.me/api/portraits/women/${Math.floor(
            Math.random() * 80,
          )}.jpg`
        : `https://randomuser.me/api/portraits/men/${Math.floor(
            Math.random() * 80,
          )}.jpg`;

    const joiningDate =
      getDateOnly(new Date());

    const newEmployee: Omit<Data, "id"> = {
      firstName,
      lastName,
      email,
      gender,
      image,

      company: {
        department,
        title,
      },

      salary: Number(salary) || 0,
      status: "Active",

      age: Number(age) || undefined,

      phone,

      address: `${
        Math.floor(
          Math.random() * 900,
        ) + 100
      } Main Street`,

      city,
      state,
      country,

      joiningDate,

      skills:
        getSkillsByDepartment(
          department,
        ),

      about:
        getAboutByDepartment(
          firstName,
          department,
          title,
        ),
    };

    onAddEmployee(newEmployee);

    resetForm();
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-700 bg-[#0f172a] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-[#0f172a] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">
              Add Employee
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Create a new employee
              profile.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
        >
          <AddInput
            label="First Name"
            value={firstName}
            placeholder="Enter first name"
            onChange={(event) =>
              setFirstName(
                event.target.value,
              )
            }
          />

          <AddInput
            label="Last Name"
            value={lastName}
            placeholder="Enter last name"
            onChange={(event) =>
              setLastName(
                event.target.value,
              )
            }
          />

          <AddInput
            label="Email"
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
          />

          <AddInput
            label="Phone"
            value={phone}
            placeholder="Enter phone number"
            onChange={(event) =>
              setPhone(
                event.target.value,
              )
            }
          />

          <AddInput
            label="Age"
            type="number"
            value={age}
            placeholder="Enter age"
            onChange={(event) =>
              setAge(
                event.target.value,
              )
            }
          />

          <AddSelect
            label="Gender"
            value={gender}
            options={[
              "male",
              "female",
            ]}
            onChange={(event) =>
              setGender(
                event.target.value,
              )
            }
          />

          <AddSelect
            label="Department"
            value={department}
            options={departmentsList}
            onChange={(event) => {
              const newDepartment =
                event.target.value;

              const titles =
                jobTitles[
                  newDepartment
                ];

              setDepartment(
                newDepartment,
              );

              setTitle(
                titles?.[0] ?? "",
              );
            }}
          />

          <AddSelect
            label="Job Title"
            value={title}
            options={
              jobTitles[department] ??
              []
            }
            onChange={(event) =>
              setTitle(
                event.target.value,
              )
            }
          />

          <AddInput
            label="Salary"
            type="number"
            value={salary}
            placeholder="Enter salary"
            onChange={(event) =>
              setSalary(
                event.target.value,
              )
            }
          />

          <AddInput
            label="City"
            value={city}
            placeholder="Enter city"
            onChange={(event) =>
              setCity(
                event.target.value,
              )
            }
          />

          <AddInput
            label="State"
            value={state}
            placeholder="Enter state"
            onChange={(event) =>
              setState(
                event.target.value,
              )
            }
          />

          <AddInput
            label="Country"
            value={country}
            placeholder="Enter country"
            onChange={(event) =>
              setCountry(
                event.target.value,
              )
            }
          />

          <div className="flex items-center justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   EDIT EMPLOYEE
========================================================= */

interface EditEmployeeProps {
  show: boolean;
  employee: Data | null;
  formData: EditFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<EditFormData>
  >;
  onClose: () => void;
  onUpdateEmployee: (
    employee: Data,
  ) => void;
}

const EditEmployee: React.FC<
  EditEmployeeProps
> = ({
  show,
  employee,
  formData,
  setFormData,
  onClose,
  onUpdateEmployee,
}) => {
  useEffect(() => {
    if (!show) {
      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [show]);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!employee) {
      return;
    }

    const updatedEmployee: Data = {
      ...employee,

      firstName:
        formData.firstName,

      lastName:
        formData.lastName,

      email:
        formData.email,

      gender:
        formData.gender,

      phone:
        formData.phone,

      age:
        Number(formData.age) ||
        undefined,

      company: {
        department:
          formData.department,

        title:
          formData.title,
      },

      salary:
        Number(formData.salary) ||
        0,

      status:
        formData.status,

      city:
        formData.city,

      state:
        formData.state,

      country:
        formData.country,

      skills:
        getSkillsByDepartment(
          formData.department,
        ),

      about:
        getAboutByDepartment(
          formData.firstName,
          formData.department,
          formData.title,
        ),
    };

    onUpdateEmployee(
      updatedEmployee,
    );

    onClose();
  };

  if (!show || !employee) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-700 bg-[#0f172a] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-[#0f172a] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">
              Edit Employee
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Update employee
              information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
        >
          <AddInput
            label="First Name"
            value={
              formData.firstName
            }
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  firstName:
                    event.target.value,
                }),
              )
            }
          />

          <AddInput
            label="Last Name"
            value={
              formData.lastName
            }
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  lastName:
                    event.target.value,
                }),
              )
            }
          />

          <AddInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  email:
                    event.target.value,
                }),
              )
            }
          />

          <AddInput
            label="Phone"
            value={formData.phone}
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  phone:
                    event.target.value,
                }),
              )
            }
          />

          <AddInput
            label="Age"
            type="number"
            value={formData.age}
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  age:
                    event.target.value,
                }),
              )
            }
          />

          <AddSelect
            label="Gender"
            value={formData.gender}
            options={[
              "male",
              "female",
            ]}
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  gender:
                    event.target.value,
                }),
              )
            }
          />

          <AddSelect
            label="Department"
            value={
              formData.department
            }
            options={
              departmentsList
            }
            onChange={(event) => {
              const newDepartment =
                event.target.value;

              const titles =
                jobTitles[
                  newDepartment
                ];

              setFormData(
                (previous) => ({
                  ...previous,

                  department:
                    newDepartment,

                  title:
                    titles?.includes(
                      previous.title,
                    )
                      ? previous.title
                      : titles?.[0] ??
                        "",
                }),
              );
            }}
          />

          <AddSelect
            label="Job Title"
            value={formData.title}
            options={
              jobTitles[
                formData.department
              ] ?? []
            }
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  title:
                    event.target.value,
                }),
              )
            }
          />

          <AddInput
            label="Salary"
            type="number"
            value={formData.salary}
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  salary:
                    event.target.value,
                }),
              )
            }
          />

          <AddSelect
            label="Status"
            value={formData.status}
            options={[
              "Active",
              "Inactive",
            ]}
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  status:
                    event.target.value,
                }),
              )
            }
          />

          <AddInput
            label="City"
            value={formData.city}
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  city:
                    event.target.value,
                }),
              )
            }
          />

          <AddInput
            label="State"
            value={formData.state}
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  state:
                    event.target.value,
                }),
              )
            }
          />

          <AddInput
            label="Country"
            value={
              formData.country
            }
            onChange={(event) =>
              setFormData(
                (previous) => ({
                  ...previous,
                  country:
                    event.target.value,
                }),
              )
            }
          />

          <div className="flex items-center justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   DETAIL LINE
========================================================= */

interface DetailLineProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailLine: React.FC<
  DetailLineProps
> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-blue-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="wrap-break-word text-sm font-medium text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   INFO ROW
========================================================= */

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<
  InfoRowProps
> = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 py-3 last:border-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-slate-200">
        {value}
      </span>
    </div>
  );
};

/* =========================================================
   VIEW EMPLOYEE
========================================================= */

interface ViewEmployeeProps {
  show: boolean;
  employee: Data | null;
  onClose: () => void;
  onEdit: () => void;
}

const ViewEmployee: React.FC<
  ViewEmployeeProps
> = ({
  show,
  employee,
  onClose,
  onEdit,
}) => {
  useEffect(() => {
    if (!show) {
      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [show]);

  if (!show || !employee) {
    return null;
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-700 bg-[#0f172a] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-[#0f172a] px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-slate-700 bg-slate-900/50 p-6 md:flex-row">
            <img
              src={employee.image}
              alt={fullName}
              className="h-28 w-28 rounded-3xl object-cover ring-4 ring-blue-500/20"
            />

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">
                {fullName}
              </h2>

              <p className="mt-1 text-blue-400">
                {
                  employee.company
                    .title
                }
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {
                  employee.company
                    .department
                }
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  employee.status ===
                  "Active"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {employee.status}
              </span>
            </div>

            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Edit Employee
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/40 p-6">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
                <UserRound
                  size={20}
                  className="text-blue-400"
                />
                Personal Information
              </h3>

              <div className="space-y-4">
                <DetailLine
                  icon={
                    <Mail size={18} />
                  }
                  label="Email"
                  value={
                    employee.email
                  }
                />

                <DetailLine
                  icon={
                    <Phone size={18} />
                  }
                  label="Phone"
                  value={
                    employee.phone ??
                    "Not available"
                  }
                />

                <DetailLine
                  icon={
                    <CalendarDays
                      size={18}
                    />
                  }
                  label="Age"
                  value={
                    employee.age
                      ? `${employee.age} years`
                      : "Not available"
                  }
                />

                <DetailLine
                  icon={
                    <MapPin
                      size={18}
                    />
                  }
                  label="Location"
                  value={
                    [
                      employee.city,
                      employee.state,
                      employee.country,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                    "Not available"
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900/40 p-6">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
                <BriefcaseBusiness
                  size={20}
                  className="text-blue-400"
                />
                Work Information
              </h3>

              <InfoRow
                label="Department"
                value={
                  employee.company
                    .department
                }
              />

              <InfoRow
                label="Job Title"
                value={
                  employee.company
                    .title
                }
              />

              <InfoRow
                label="Salary"
                value={`$${employee.salary.toLocaleString()}`}
              />

              <InfoRow
                label="Joining Date"
                value={
                  employee.joiningDate ??
                  "Not available"
                }
              />

              <InfoRow
                label="Status"
                value={
                  employee.status
                }
              />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-900/40 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
              <UserRound
                size={20}
                className="text-blue-400"
              />
              About Employee
            </h3>

            <p className="text-sm leading-7 text-slate-400">
              {employee.about ??
                `${fullName} is a dedicated professional who contributes to the organization.`}
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-900/40 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <BriefcaseBusiness
                size={20}
                className="text-blue-400"
              />
              Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {(
                employee.skills ??
                []
              ).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-900/40 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <CircleDollarSign
                  size={22}
                />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Current Salary
                </p>

                <p className="text-2xl font-bold text-white">
                  $
                  {employee.salary.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN EMPLOYEE COMPONENT
========================================================= */

const Employee: React.FC = () => {
  const [list, setList] =
    useState<Data[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("");

  /* =======================================================
     THEME
  ======================================================= */

  const [isDarkMode, setIsDarkMode] =
    useState(() =>
      document.documentElement.classList.contains(
        "dark",
      ),
    );

  const [modalShow, setModalShow] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Data | null>(null);

  const [viewModalShow, setViewModalShow] =
    useState(false);

  const [editModalShow, setEditModalShow] =
    useState(false);

  const [editingEmployee, setEditingEmployee] =
    useState<Data | null>(null);

  /* =======================================================
     EDIT FORM STATE
  ======================================================= */

  const [editFormData, setEditFormData] =
    useState<EditFormData>({
      firstName: "",
      lastName: "",
      email: "",
      gender: "male",
      phone: "",
      age: "",
      department: "Engineering",
      title:
        jobTitles.Engineering[0] ?? "",
      salary: "",
      status: "Active",
      city: "",
      state: "",
      country: "",
    });

  /* =======================================================
     DARK MODE OBSERVER
  ======================================================= */

  useEffect(() => {
    const updateTheme = () => {
      const darkMode =
        document.documentElement.classList.contains(
          "dark",
        );

      setIsDarkMode(darkMode);
    };

    updateTheme();

    const observer =
      new MutationObserver(() => {
        updateTheme();
      });

    observer.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ["class"],
      },
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =======================================================
     FETCH EMPLOYEES
  ======================================================= */

  useEffect(() => {
    const fetchEmployees =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await axios.get<RandomUserResponse>(
              "https://randomuser.me/api/?results=100&nat=us",
            );

          const employees: Data[] =
            response.data.results.map(
              (user, index) => {
                const departmentName =
                  departmentsList[
                    index %
                      departmentsList.length
                  ];

                const titles =
                  jobTitles[
                    departmentName
                  ] ?? ["Employee"];

                const title =
                  titles[
                    index %
                      titles.length
                  ];

                const salary =
                  35000 +
                  ((index * 2750) %
                    45000);

                const status =
                  index % 5 === 0
                    ? "Inactive"
                    : "Active";

                const joiningDate =
                  getDateOnly(
                    new Date(
                      Date.now() -
                        (index + 1) *
                          1000 *
                          60 *
                          60 *
                          24 *
                          30,
                    ),
                  );

                const age =
                  new Date().getFullYear() -
                  new Date(
                    user.dob.date,
                  ).getFullYear();

                return {
                  id: index + 1,

                  firstName:
                    user.name.first,

                  lastName:
                    user.name.last,

                  email:
                    user.email,

                  gender:
                    user.gender,

                  image:
                    user.picture.large,

                  company: {
                    department:
                      departmentName,

                    title,
                  },

                  salary,

                  status,

                  age,

                  phone:
                    user.phone,

                  address: `${user.location.street.number} ${user.location.street.name}`,

                  city:
                    user.location
                      .city,

                  state:
                    user.location
                      .state,

                  country:
                    user.location
                      .country,

                  joiningDate,

                  skills:
                    getSkillsByDepartment(
                      departmentName,
                    ),

                  about:
                    getAboutByDepartment(
                      user.name.first,
                      departmentName,
                      title,
                    ),
                };
              },
            );

          setList(employees);
        } catch (err) {
          console.error(err);

          setError(
            "Unable to load employees. Please try again.",
          );
        } finally {
          setLoading(false);
        }
      };

    void fetchEmployees();
  }, []);

  /* =======================================================
     OPEN EDIT FORM
  ======================================================= */

  const openEditEmployee = (
    employee: Data,
  ) => {
    setEditingEmployee(employee);

    setEditFormData({
      firstName:
        employee.firstName,

      lastName:
        employee.lastName,

      email:
        employee.email,

      gender:
        employee.gender,

      phone:
        employee.phone ?? "",

      age:
        employee.age?.toString() ?? "",

      department:
        employee.company
          .department,

      title:
        employee.company.title,

      salary:
        employee.salary.toString(),

      status:
        employee.status,

      city:
        employee.city ?? "",

      state:
        employee.state ?? "",

      country:
        employee.country ?? "",
    });

    setEditModalShow(true);
  };

  /* =======================================================
     ADD EMPLOYEE
  ======================================================= */

  const handleAddEmployee = (
    employee: Omit<Data, "id">,
  ) => {
    setList((previous) => [
      {
        ...employee,

        id:
          previous.length > 0
            ? Math.max(
                ...previous.map(
                  (item) =>
                    item.id,
                ),
              ) + 1
            : 1,
      },

      ...previous,
    ]);
  };

  /* =======================================================
     UPDATE EMPLOYEE
  ======================================================= */

  const handleUpdateEmployee = (
    updatedEmployee: Data,
  ) => {
    setList((previous) =>
      previous.map((employee) =>
        employee.id ===
        updatedEmployee.id
          ? updatedEmployee
          : employee,
      ),
    );
  };

  /* =======================================================
     DEPARTMENTS
  ======================================================= */

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          list.map(
            (employee) =>
              employee.company
                .department,
          ),
        ),
      ),
    [list],
  );

  /* =======================================================
     GENDERS
  ======================================================= */

  const genders = useMemo(
    () =>
      Array.from(
        new Set(
          list.map(
            (employee) =>
              employee.gender,
          ),
        ),
      ),
    [list],
  );

  /* =======================================================
     FILTER
  ======================================================= */

  const filtered = useMemo(() => {
    const searchValue =
      search
        .trim()
        .toLowerCase();

    const filteredData =
      list.filter(
        (employee) => {
          const fullName =
            `${employee.firstName} ${employee.lastName}`.toLowerCase();

          const matchesSearch =
            !searchValue ||
            fullName.includes(
              searchValue,
            ) ||
            employee.email
              .toLowerCase()
              .includes(
                searchValue,
              );

          const matchesDepartment =
            !department ||
            employee.company
              .department ===
              department;

          const matchesGender =
            !gender ||
            employee.gender ===
              gender;

          return (
            matchesSearch &&
            matchesDepartment &&
            matchesGender
          );
        },
      );

    const sortedData = [
      ...filteredData,
    ];

    if (sortOrder === "high") {
      sortedData.sort(
        (a, b) =>
          b.salary - a.salary,
      );
    }

    if (sortOrder === "low") {
      sortedData.sort(
        (a, b) =>
          a.salary - b.salary,
      );
    }

    return sortedData;
  }, [
    list,
    search,
    department,
    gender,
    sortOrder,
  ]);

  /* =======================================================
     TABLE COLUMNS

     IMPORTANT:
     Do NOT wrap this in useMemo because the Edit button
     uses openEditEmployee and the View button uses state
     setters. Keeping this as a normal array avoids stale
     closures and exhaustive-deps problems during Vercel build.
  ======================================================= */

  const colData: TableColumn<Data>[] = [
    {
      name: "ID",

      selector: (row) =>
        row.id,

      sortable: true,

      width: "70px",
    },

    {
      name: "Employee",

      sortable: true,

      grow: 1.5,

      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <img
            src={row.image}
            alt={`${row.firstName} ${row.lastName}`}
            className="h-10 w-10 rounded-xl object-cover"
          />

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-100">
              {row.firstName}{" "}
              {row.lastName}
            </p>

            <p className="truncate text-xs capitalize text-slate-500">
              {row.gender}
            </p>
          </div>
        </div>
      ),
    },

    {
      name: "Email",

      selector: (row) =>
        row.email,

      sortable: true,

      grow: 2,

      cell: (row) => (
        <span className="truncate text-sm">
          {row.email}
        </span>
      ),
    },

    {
      name: "Department",

      selector: (row) =>
        row.company.department,

      sortable: true,

      cell: (row) => (
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
          {
            row.company
              .department
          }
        </span>
      ),
    },

    {
      name: "Job Title",

      selector: (row) =>
        row.company.title,

      sortable: true,

      grow: 1.4,
    },

    {
      name: "Salary",

      selector: (row) =>
        row.salary,

      sortable: true,

      cell: (row) => (
        <span className="font-semibold text-emerald-400">
          $
          {row.salary.toLocaleString()}
        </span>
      ),
    },

    {
      name: "Status",

      selector: (row) =>
        row.status,

      sortable: true,

      cell: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.status ===
            "Active"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },

    {
      name: "View",

      width: "85px",

      cell: (row) => (
        <button
          type="button"
          onClick={() => {
            setSelectedEmployee(
              row,
            );

            setViewModalShow(
              true,
            );
          }}
          className="rounded-lg bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/20"
        >
          View
        </button>
      ),
    },

    {
      name: "Edit",

      width: "85px",

      cell: (row) => (
        <button
          type="button"
          onClick={() =>
            openEditEmployee(row)
          }
          className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/20"
        >
          Edit
        </button>
      ),
    },
  ];

  /* =======================================================
     TABLE STYLES

     IMPORTANT:
     Background colors are intentionally NOT set here.

     The DataTable library can inject inline background
     colors during its first render. The CSS at the bottom
     controls the actual background using the html.dark
     class, which makes the toggle reliable after refresh.
  ======================================================= */

  const customStyles = useMemo(
    () => ({
      table: {
        style: {
          backgroundColor:
            "transparent",
        },
      },

      tableWrapper: {
        style: {
          backgroundColor:
            "transparent",
        },
      },

      header: {
        style: {
          backgroundColor:
            "transparent",
        },
      },

      headRow: {
        style: {
          minHeight: "56px",

          backgroundColor:
            "transparent",

          borderBottom:
            isDarkMode
              ? "1px solid #1c3866"
              : "1px solid #e2e8f0",
        },
      },

      headCells: {
        style: {
          color: isDarkMode
            ? "#94a3b8"
            : "#475569",

          backgroundColor:
            "transparent",

          fontSize: "12px",

          fontWeight: 700,

          textTransform:
            "uppercase",

          letterSpacing:
            "0.05em",
        },
      },

      rows: {
        style: {
          minHeight: "68px",

          backgroundColor:
            "transparent",

          color: isDarkMode
            ? "#e2e8f0"
            : "#334155",

          borderBottom:
            isDarkMode
              ? "1px solid #162a4b"
              : "1px solid #e2e8f0",
        },

        highlightOnHoverStyle: {
          backgroundColor:
            "transparent",

          borderBottomColor:
            isDarkMode
              ? "#1c3866"
              : "#e2e8f0",

          outline: "none",
        },
      },

      cells: {
        style: {
          fontSize: "13px",

          backgroundColor:
            "transparent",
        },
      },

      pagination: {
        style: {
          backgroundColor:
            "transparent",

          borderTop: "none",

          color: isDarkMode
            ? "#94a3b8"
            : "#475569",
        },
      },
    }),
    [isDarkMode],
  );

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setDepartment("");
    setGender("");
    setSortOrder("");
  };

  const hasFilters = Boolean(
    search ||
      department ||
      gender ||
      sortOrder,
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="w-full">
      <div
        className={`rounded-3xl border p-4 shadow-xl md:p-6 ${
          isDarkMode
            ? "border-[#1c3866] bg-[#0f172a]"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDarkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              Employees
            </h1>

            <p
              className={`mt-1 text-sm ${
                isDarkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Manage and monitor
              your employees.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setModalShow(true)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Employee
          </button>
        </div>

        {/* FILTER BAR */}

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative xl:col-span-2">
            <Search
              size={18}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDarkMode
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search employee or email..."
              className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-blue-500 ${
                isDarkMode
                  ? "border-slate-700 bg-slate-900/70 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            />
          </div>

          <select
            value={department}
            onChange={(event) =>
              setDepartment(
                event.target.value,
              )
            }
            className={`rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 ${
              isDarkMode
                ? "border-slate-700 bg-slate-900/70 text-slate-300"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <option value="">
              All Departments
            </option>

            {departments.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ),
            )}
          </select>

          <select
            value={gender}
            onChange={(event) =>
              setGender(
                event.target.value,
              )
            }
            className={`rounded-xl border px-4 py-3 text-sm capitalize outline-none focus:border-blue-500 ${
              isDarkMode
                ? "border-slate-700 bg-slate-900/70 text-slate-300"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <option value="">
              All Genders
            </option>

            {genders.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                  className="capitalize"
                >
                  {item}
                </option>
              ),
            )}
          </select>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value,
              )
            }
            className={`rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 ${
              isDarkMode
                ? "border-slate-700 bg-slate-900/70 text-slate-300"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <option value="">
              Sort Salary
            </option>

            <option value="high">
              Highest Salary
            </option>

            <option value="low">
              Lowest Salary
            </option>
          </select>
        </div>

        {/* FILTER RESULT */}

        {hasFilters && (
          <div className="mb-5 flex items-center justify-between">
            <p
              className={`text-sm ${
                isDarkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Showing{" "}
              <span
                className={`font-semibold ${
                  isDarkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                {filtered.length}
              </span>{" "}
              employees
            </p>

            <button
              type="button"
              onClick={
                clearFilters
              }
              className="flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              <X size={16} />
              Clear Filters
            </button>
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* TABLE */}

        <div
          className={`employee-data-table overflow-hidden rounded-2xl border ${
            isDarkMode
              ? "border-slate-800 bg-[#0f172a]"
              : "border-slate-200 bg-white"
          }`}
        >
          <DataTable
            columns={colData}
            data={filtered}
            customStyles={
              customStyles
            }
            theme={
              isDarkMode
                ? "customDark"
                : "customLight"
            }
            responsive
            dense
            highlightOnHover={false}
            progressPending={loading}
            pagination
            paginationPerPage={8}
            paginationRowsPerPageOptions={[
              8,
              16,
              24,
              32,
            ]}
            paginationComponent={
              CustomPagination
            }
          />
        </div>
      </div>

      {/* ADD EMPLOYEE */}

      <AddEmployee
        show={modalShow}
        onClose={() =>
          setModalShow(false)
        }
        onAddEmployee={
          handleAddEmployee
        }
      />

      {/* EDIT EMPLOYEE */}

      <EditEmployee
        show={editModalShow}
        employee={
          editingEmployee
        }
        formData={
          editFormData
        }
        setFormData={
          setEditFormData
        }
        onClose={() => {
          setEditModalShow(
            false,
          );

          setEditingEmployee(
            null,
          );
        }}
        onUpdateEmployee={
          handleUpdateEmployee
        }
      />

      {/* VIEW EMPLOYEE */}

      <ViewEmployee
        show={
          viewModalShow
        }
        employee={
          selectedEmployee
        }
        onClose={() => {
          setViewModalShow(
            false,
          );

          setSelectedEmployee(
            null,
          );
        }}
        onEdit={() => {
          if (
            selectedEmployee
          ) {
            openEditEmployee(
              selectedEmployee,
            );

            setViewModalShow(
              false,
            );
          }
        }}
      />

      {/* ===================================================
          DATA TABLE BACKGROUND FIX
          
          IMPORTANT:
          These rules use the actual html.dark class.

          Therefore the DataTable background changes
          immediately when your global theme toggle changes,
          including after browser refresh.
      =================================================== */}

      <style>
        {`
          /* =================================================
             COMMON
          ================================================= */

          .employee-data-table,
          .employee-data-table .rdt_TableWrapper,
          .employee-data-table .rdt_Table {
            transition:
              background-color 0.2s ease,
              color 0.2s ease;
          }

          /* =================================================
             LIGHT MODE
          ================================================= */

          .employee-data-table {
            background: #ffffff !important;
          }

          .employee-data-table .rdt_TableWrapper {
            background: #ffffff !important;
          }

          .employee-data-table .rdt_Table {
            background: #ffffff !important;
          }

          .employee-data-table .rdt_TableHead {
            background: #f8fafc !important;
          }

          .employee-data-table .rdt_TableHeadRow {
            background: #f8fafc !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }

          .employee-data-table .rdt_TableCol {
            background: #f8fafc !important;
            color: #475569 !important;
          }

          .employee-data-table .rdt_TableRow {
            background: #ffffff !important;
            color: #334155 !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }

          .employee-data-table .rdt_TableCell {
            background: transparent !important;
            color: #334155 !important;
          }

          .employee-data-table .rdt_Pagination {
            background: #f8fafc !important;
            color: #475569 !important;
          }

          .employee-data-table .rdt_TableFooter {
            background: #f8fafc !important;
          }

          /* =================================================
             DARK MODE
             
             The selector starts with html.dark.
             This is the important fix.
          ================================================= */

          html.dark .employee-data-table {
            background: #0f172a !important;
          }

          html.dark
          .employee-data-table
          .rdt_TableWrapper {
            background: #0f172a !important;
          }

          html.dark
          .employee-data-table
          .rdt_Table {
            background: #0f172a !important;
          }

          html.dark
          .employee-data-table
          .rdt_TableHead {
            background: #0f172a !important;
          }

          html.dark
          .employee-data-table
          .rdt_TableHeadRow {
            background: #0f172a !important;
            border-bottom: 1px solid #1c3866 !important;
          }

          html.dark
          .employee-data-table
          .rdt_TableCol {
            background: #0f172a !important;
            color: #94a3b8 !important;
          }

          html.dark
          .employee-data-table
          .rdt_TableRow {
            background: #0f172a !important;
            color: #e2e8f0 !important;
            border-bottom: 1px solid #162a4b !important;
          }

          html.dark
          .employee-data-table
          .rdt_TableRow:hover {
            background: #132342 !important;
          }

          html.dark
          .employee-data-table
          .rdt_TableCell {
            background: transparent !important;
            color: #e2e8f0 !important;
          }

          html.dark
          .employee-data-table
          .rdt_TableCell > div {
            background: transparent !important;
          }

          html.dark
          .employee-data-table
          .rdt_Pagination {
            background: #0f172a !important;
            color: #94a3b8 !important;
            border-top: none !important;
          }

          html.dark
          .employee-data-table
          .rdt_TableFooter {
            background: #0f172a !important;
          }

          /* =================================================
             PAGINATION
          ================================================= */

          .employee-data-table
          .employee-pagination {
            background: transparent !important;
          }

          html.dark
          .employee-data-table
          .employee-pagination {
            background: #0f172a !important;
          }

          /* =================================================
             DATA TABLE CELLS
          ================================================= */

          .employee-data-table
          .rdt_TableCell > div {
            background: transparent !important;
          }

          .employee-data-table
          .rdt_TableCol_Sortable {
            background: transparent !important;
          }

          /* =================================================
             REMOVE LIBRARY WHITE BACKGROUND
          ================================================= */

          .employee-data-table
          .rdt_TableBody {
            background: transparent !important;
          }

          html.dark
          .employee-data-table
          .rdt_TableBody {
            background: #0f172a !important;
          }
        `}
      </style>
    </div>
  );
};

export default Employee;