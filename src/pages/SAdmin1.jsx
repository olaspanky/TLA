import React, { useState } from 'react';
import { Search, Edit, ChevronDown, Filter, ArrowUpDown, Calendar, X } from 'lucide-react';
import Admin3 from "../components/admin/Adminuser"

const PerformanceDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      dueDateFormatted: 'July 25, 2025',
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
      dueDateFormatted: 'July 25, 2025',
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
      dueDateFormatted: 'July 24, 2025',
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
      dueDateFormatted: 'July 24, 2025',
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
      dueDateFormatted: 'May 2, 2025',
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
      dueDateFormatted: 'July 25, 2025',
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
      dueDateFormatted: 'July 25, 2025',
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
      dueDateFormatted: 'July 24, 2025',
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
      dueDateFormatted: 'July 24, 2025',
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
      dueDateFormatted: 'May 2, 2025',
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

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Submitting employee data:', selectedEmployee);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Metrics Cards */}
       
        {/* Performance Review Exceptions Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-1 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 p-5">Performance Review Exceptions</h2>
            </div>
            
            {/* Table Controls */}
            <Admin3 />
          
          </div>

          {/* Table */}
         

          {/* Pagination */}
         
        </div>

        {/* Employee Details Modal */}
      
      </div>
    </div>
  );
};

export default PerformanceDashboard;