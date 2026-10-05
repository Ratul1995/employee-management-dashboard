import React, { useState } from 'react';
import {
  Building,
  Shield,
  Database,
  Bell,
  Save,
  CheckCircle2,
  Download,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'data'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('EmpManage Inc.');
  const [supportEmail, setSupportEmail] = useState('admin@empmanage.com');
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('GMT +5:30 (IST)');

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [leaveNotifications, setLeaveNotifications] = useState(true);
  const [payrollReminders, setPayrollReminders] = useState(false);

  // Security State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Helper Toast Notification
  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Save Settings Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Toggle 2FA Handler
  const handleToggle2FA = () => {
    setIs2FAEnabled((prev) => {
      const nextState = !prev;
      showNotification(nextState ? 'Two-Factor Authentication Enabled!' : 'Two-Factor Authentication Disabled');
      return nextState;
    });
  };

  // Export Settings JSON Handler
  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      generalSettings: {
        companyName,
        supportEmail,
        currency,
        timezone,
      },
      notifications: {
        emailAlerts,
        leaveNotifications,
        payrollReminders,
      },
      security: {
        is2FAEnabled,
        defaultAccessLevel: 'Standard Employee Access (Read Only)',
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `EmpManage_Settings_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showNotification('System Settings exported as JSON!');
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 text-slate-700 dark:text-slate-200">
      {/* Dynamic Toast Notification */}
      {notificationMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold animate-bounce">
          <CheckCircle2 size={16} />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure system defaults, security, and notification preferences.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-medium self-start sm:self-auto">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Main Settings Layout (Sidebar Tabs + Content) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Navigation Tabs - Horizontal Scroll on Mobile, Vertical List on Desktop */}
        <div className="md:col-span-1 flex md:flex-col overflow-x-auto pb-1 md:pb-0 gap-1.5 bg-white dark:bg-[#0b1329] p-1.5 sm:p-2 rounded-2xl border border-slate-200 dark:border-slate-800/80 h-fit no-scrollbar shadow-sm transition-colors">
          <TabButton
            icon={<Building size={16} />}
            label="General"
            active={activeTab === 'general'}
            onClick={() => setActiveTab('general')}
          />
          <TabButton
            icon={<Bell size={16} />}
            label="Notifications"
            active={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
          />
          <TabButton
            icon={<Shield size={16} />}
            label="Security & Roles"
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          />
          <TabButton
            icon={<Database size={16} />}
            label="Data & Storage"
            active={activeTab === 'data'}
            onClick={() => setActiveTab('data')}
          />
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-white dark:bg-[#0b1329] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-4 sm:p-6 shadow-sm dark:shadow-xl transition-colors">
          <form onSubmit={handleSave} className="space-y-6">
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">General Information</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update company branding and localized system preferences.</p>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <InputField
                      label="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <InputField
                      label="Support Contact Email"
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <SelectField
                      label="Default Currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      options={['USD ($)', 'INR (₹)', 'EUR (€)', 'GBP (£)']}
                    />
                    <SelectField
                      label="System Timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      options={['GMT +5:30 (IST)', 'UTC +00:00 (GMT)', 'EST -05:00 (US Eastern)']}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Notification Preferences</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage how administrators and employees receive alerts.</p>
                </div>

                <div className="space-y-3 pt-1">
                  <ToggleOption
                    title="Email Notifications"
                    description="Receive email summaries for system updates and reports."
                    checked={emailAlerts}
                    onChange={() => setEmailAlerts(!emailAlerts)}
                  />
                  <ToggleOption
                    title="Leave & Attendance Requests"
                    description="Get instant alerts when employees submit leave requests."
                    checked={leaveNotifications}
                    onChange={() => setLeaveNotifications(!leaveNotifications)}
                  />
                  <ToggleOption
                    title="Payroll Reminders"
                    description="Automatic monthly prompts to review and approve payroll."
                    checked={payrollReminders}
                    onChange={() => setPayrollReminders(!payrollReminders)}
                  />
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Security Settings</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage account safety rules and role privileges.</p>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-[#0f1938] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Two-Factor Authentication (2FA)</p>
                        {is2FAEnabled ? (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                            <ShieldCheck size={12} /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                            <ShieldAlert size={12} /> Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Add an extra layer of protection to your admin portal.</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggle2FA}
                      className={`w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                        is2FAEnabled
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                          : 'bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-500'
                      }`}
                    >
                      {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Default Access Level</label>
                    <div className="p-3 bg-slate-50 dark:bg-[#070d19] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2 transition-colors">
                      <span className="truncate">Standard Employee Access</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">Read Only</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DATA TAB */}
            {activeTab === 'data' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Data Management</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Export or restore system records.</p>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-[#0f1938] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white">Export All Data</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Download a full snapshot of system settings in JSON format.</p>
                    </div>
                    <button
                      type="button"
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-medium transition-colors shrink-0 cursor-pointer"
                      onClick={handleExportJSON}
                    >
                      <Download size={14} />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Save size={14} />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

{/* Helper Components */}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 md:w-full cursor-pointer ${
        active
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
      }`}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function InputField({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input
        {...props}
        className="w-full bg-slate-50 dark:bg-[#070d19] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
      />
    </div>
  );
}

function SelectField({ label, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <select
        {...props}
        className="w-full bg-slate-50 dark:bg-[#070d19] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-white text-slate-800 dark:bg-[#0b1329] dark:text-slate-200">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleOption({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-[#0f1938] border border-slate-200 dark:border-slate-800/80 gap-3 transition-colors">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{title}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 cursor-pointer ${
          checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <div
          className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}