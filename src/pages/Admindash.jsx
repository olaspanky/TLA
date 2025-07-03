import React, { useState } from 'react'
import Admin1 from "../components/admin/AdminTp"
import Admin2 from "../components/admin/AdminDepartment"
import Admin3 from "../components/admin/Adminuser"

const Admindash = () => {
  const [activeComponent, setActiveComponent] = useState(null)

 

  return (
    <div className="p-6 bg-white rounded-lg">
      
      {/* Subtle Navigation Buttons */}
     <Admin2/>
    </div>
  )
}

export default Admindash