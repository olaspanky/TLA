import React, { useState } from 'react'
import Admin1 from "../components/admin/AdminTp"
import Admin2 from "../components/admin/AdminDepartment"
import Admin3 from "../components/admin/Adminuser"

const Admindash = () => {
  const [activeComponent, setActiveComponent] = useState(null)

  const renderComponent = () => {
    switch(activeComponent) {
      case 'admin1':
        return <Admin1 />
      case 'admin2':
        return <Admin2 />
      case 'admin3':
        return <Admin3 />
      default:
        return <div className="text-gray-500 text-center py-8">Select an admin panel to view</div>
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      
      {/* Subtle Navigation Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveComponent('admin1')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeComponent === 'admin1'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Admin Panel 1
        </button>
        
        <button
          onClick={() => setActiveComponent('admin2')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeComponent === 'admin2'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Department Management
        </button>
        
        <button
          onClick={() => setActiveComponent('admin3')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeComponent === 'admin3'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          User Management
        </button>
      </div>

      {/* Component Render Area */}
      <div className="bg-white rounded-lg border border-gray-200 min-h-[400px]">
        {renderComponent()}
      </div>
    </div>
  )
}

export default Admindash