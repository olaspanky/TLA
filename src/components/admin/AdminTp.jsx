import React, { useState } from 'react';
import { ChevronDown, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';

const PerformanceDashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Dummy data
  const kpiData = {
    overallScore: { current: 3.7, max: 5.0, change: 0.3, trend: 'up' },
    completionRate: { value: 87, change: 8, trend: 'up' },
    retention: { value: 92, change: -3, trend: 'down' }
  };

  const progressData = { current: 75, max: 100 };

  const upcomingDeadlines = [
    {
      task: "Deliver high-fidelity prototype for VERSUS Ghana Landing page",
      subtitle: "High-fidelity prototype for Research Gala Lab website landing page",
      dueDate: "Last updated: Sep 5, 2024"
    },
    {
      task: "Deliver high-fidelity prototype for VERSUS Ghana Landing page",
      subtitle: "High-fidelity prototype for Research Gala Lab website landing page",
      dueDate: "Last updated: Sep 5, 2024"
    },
    {
      task: "Deliver high-fidelity prototype for VERSUS Ghana Landing page",
      subtitle: "High-fidelity prototype for Research Gala Lab website landing page",
      dueDate: "Last updated: Sep 5, 2024"
    },
    {
      task: "Deliver high-fidelity prototype for VERSUS Ghana Landing page",
      subtitle: "High-fidelity prototype for Research Gala Lab website landing page",
      dueDate: "Last updated: Sep 5, 2024"
    },
    {
      task: "Deliver high-fidelity prototype for VERSUS Ghana Landing page",
      subtitle: "High-fidelity prototype for Research Gala Lab website landing page",
      dueDate: "Last updated: Sep 5, 2024"
    }
  ];

  const employees = [
    {
      id: 1,
      name: "Samuel Rodriguez",
      avatar: "SR",
      role: "Senior Consultant",
      department: "Consulting & Development",
      manager: "Adaora Solomma",
      status: "Complete",
      dueDate: "Just now",
      bgColor: "bg-purple-500"
    },
    {
      id: 2,
      name: "Robert Angie",
      avatar: "RA",
      role: "Sr. Consultant Brand Public Re...",
      department: "Consulting & Development",
      manager: "Adaora Solomma",
      status: "Complete",
      dueDate: "4 minutes ago",
      bgColor: "bg-blue-500"
    },
    {
      id: 3,
      name: "Christiana Anbedzi",
      avatar: "CA",
      role: "Scientific Validation Associate",
      department: "Consulting & Development",
      manager: "Adaora Solomma",
      status: "Complete",
      dueDate: "Yesterday",
      bgColor: "bg-green-500"
    },
    {
      id: 4,
      name: "Shirikatu Alhassan",
      avatar: "SA",
      role: "Associate Product Designer",
      department: "Consulting & Development",
      manager: "Adaora Solomma",
      status: "Complete",
      dueDate: "Yesterday",
      bgColor: "bg-orange-500"
    },
    {
      id: 5,
      name: "Ohemama Adakyaa",
      avatar: "OA",
      role: "Associate Projects & Customer",
      department: "Consulting & Development",
      manager: "Adaora Solomma",
      status: "Complete",
      dueDate: "Feb 2, 2025",
      bgColor: "bg-pink-500"
    },
    {
      id: 6,
      name: "Shadrack Mensah",
      avatar: "SM",
      role: "Associate Analytics & Insight",
      department: "Consulting & Development",
      manager: "Adaora Solomma",
      status: "Complete",
      dueDate: "Just now",
      bgColor: "bg-indigo-500"
    }
  ];

  const CircularProgress = ({ value, max, size = 120 }) => {
    const percentage = (value / max) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            stroke="#10b981"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{value}/{max}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Overall Performance Score */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Overall Performance Score</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{kpiData.overallScore.current}</span>
              <span className="text-lg text-gray-500">/{kpiData.overallScore.max}</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600 flex items-center">
                ↑ +{kpiData.overallScore.change}% more in last quarter
              </span>
            </div>
          </div>

          {/* Review Completion Rate */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Review Completion Rate</h3>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-gray-900">{kpiData.completionRate.value}</span>
              <span className="text-lg text-gray-500">%</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600 flex items-center">
                ↑ {kpiData.completionRate.change}% increase in last quarter
              </span>
            </div>
          </div>

          {/* High Performer Retention */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">High Performer Retention</h3>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-gray-900">{kpiData.retention.value}</span>
              <span className="text-lg text-gray-500">%</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-red-600 flex items-center">
                ↓ {Math.abs(kpiData.retention.change)}% decrease in last quarter
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Tracking */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress tracking</h3>
            <div className="flex justify-center">
              <CircularProgress value={progressData.current} max={progressData.max} />
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900 mb-1">{deadline.task}</h4>
                  <p className="text-sm text-gray-600 mb-1">{deadline.subtitle}</p>
                  <p className="text-xs text-gray-500">{deadline.dueDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Review Table */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Performance Review</h3>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Filter size={16} />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                  <Plus size={16} />
                  Add Objectives
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Department</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Manager</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Due Date</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${employee.bgColor} flex items-center justify-center text-white text-sm font-medium`}>
                          {employee.avatar}
                        </div>
                        <span className="font-medium text-gray-900">{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{employee.role}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{employee.department}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{employee.manager}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{employee.dueDate}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;