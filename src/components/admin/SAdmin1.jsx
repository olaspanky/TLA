import React, { useState } from 'react';
import { Search, Edit, ChevronDown, Filter, ArrowUpDown } from 'lucide-react';


const PerformanceDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const metrics = [
    {
      title: 'Overall Performance Score',
      value: '3.7/5.0',
      change: '0.3%',
      changeType: 'increase',
      period: 'increase vs last quarter'
    },
    {
      title: 'Review Completion Rate',
      value: '87%',
      change: '12%',
      changeType: 'increase',
      period: 'increase vs last quarter'
    },
    {
      title: 'High Performance Retention',
      value: '92%',
      change: '3%',
      changeType: 'decrease',
      period: 'decrease vs last quarter'
    }
  ];

  const employees = [
    {
      id: 1,
      name: 'Ayodej Alaran',
      role: 'Chief Executive Officer',
      department: 'General',
      manager: 'Ayodej Alaran',
      dueDate: 'Just now',
      status: 'Completed',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: 'Owolola Thompson',
      role: 'Global Human Resource',
      department: 'Human Resource',
      manager: 'Ayodej Alaran',
      dueDate: 'A minute ago',
      status: 'In Progress',
      avatar: '👩‍💼'
    },
    {
      id: 3,
      name: 'Adeoye Sobande',
      role: 'Chief Product Officer',
      department: 'Consulting & Development',
      manager: 'Ayodej Alaran',
      dueDate: '1 hour ago',
      status: 'Completed',
      avatar: '👨‍💻'
    },
    {
      id: 4,
      name: 'Adesola Arowolo',
      role: 'Chief Growth Officer',
      department: 'Growth',
      manager: 'Ayodej Alaran',
      dueDate: 'Yesterday',
      status: 'In Progress',
      avatar: '👩‍💻'
    },
    {
      id: 5,
      name: 'Julie Wole-Ajyi',
      role: 'Head of Marketing',
      department: 'Marketing',
      manager: 'Ayodej Alaran',
      dueDate: 'May 2, 2025',
      status: 'Overdue',
      avatar: '👩‍🎨'
    },
    {
      id: 6,
      name: 'Lanre Awolokun',
      role: 'Growth Manager',
      department: 'Growth',
      manager: 'Adesola Arowolo',
      dueDate: 'Just now',
      status: 'In Progress',
      avatar: '👨‍📊'
    },
    {
      id: 7,
      name: 'Sophie Runsewe',
      role: 'Human Resource Manager',
      department: 'Human Resource',
      manager: 'Owolola Th...',
      dueDate: 'A minute ago',
      status: 'Completed',
      avatar: '👩‍💼'
    },
    {
      id: 8,
      name: 'Samuel Rodriguez',
      role: 'Senior Consultant',
      department: 'Consulting & Development',
      manager: 'Adeoye Sob...',
      dueDate: '1 hour ago',
      status: 'Pending',
      avatar: '👨‍💼'
    },
    {
      id: 9,
      name: 'Kareem Omobolarinwa',
      role: 'Senior Full-stack Developer',
      department: 'Contract',
      manager: 'Adeoye Sob...',
      dueDate: 'Yesterday',
      status: 'Approved',
      avatar: '👨‍💻'
    },
    {
      id: 10,
      name: 'Oluwaseun Mojolagbe',
      role: 'Associate Customer & Product',
      department: 'Consulting & Development',
      manager: 'Adeoye Sob...',
      dueDate: 'May 2, 2025',
      status: 'Overdue',
      avatar: '👩‍💼'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="flex items-center text-sm">
                    <span className={`flex items-center ${
                      metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="mr-1">
                        {metric.changeType === 'increase' ? '↗' : '↘'}
                      </span>
                      {metric.change}
                    </span>
                    <span className="text-gray-500 ml-1">{metric.period}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Review Exceptions Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Performance Review Exceptions</h2>
            </div>
            
            {/* Table Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                </button>
                <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm mr-3">
                          {employee.avatar}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{employee.role}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{employee.department}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{employee.manager}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{employee.dueDate}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{
                          backgroundColor: employee.status === 'Completed' ? '#10b981' :
                                         employee.status === 'In Progress' ? '#3b82f6' :
                                         employee.status === 'Overdue' ? '#ef4444' :
                                         employee.status === 'Pending' ? '#f59e0b' :
                                         employee.status === 'Approved' ? '#8b5cf6' : '#6b7280'
                        }}></span>
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  &lt; Button
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">2</button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">3</button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">4</button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">5</button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;