import React, { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

const TaskManagementInterface = () => {
  const [selectedRating, setSelectedRating] = useState('75%');
  const [assignedTo, setAssignedTo] = useState('Akinwunmi Gbolade');
  const [objectives, setObjectives] = useState([
    { id: 1, text: 'Develop a AI model for transforming the healthcare', completed: true, status: 'Done' },
    { id: 2, text: 'Develop product roadmap for the feature', completed: false, status: '50%' },
    { id: 3, text: 'Develop product roadmap for the feature', completed: false, status: '0%' },
    { id: 4, text: 'Develop product roadmap for the feature', completed: true, status: 'Done' }
  ]);

  const toggleObjective = (id) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, completed: !obj.completed } : obj
    ));
  };

  const getStatusBadge = (status) => {
    if (status === 'Done') {
      return 'bg-green-500 text-white';
    } else if (status === '50%') {
      return 'bg-orange-400 text-white';
    } else if (status === '0%') {
      return 'bg-red-500 text-white';
    }
    return 'bg-gray-300 text-gray-700';
  };

  const getProgressBarWidth = (status) => {
    if (status === 'Done') return '100%';
    if (status === '50%') return '50%';
    if (status === '0%') return '0%';
    return '75%';
  };

  const getProgressBarColor = (status) => {
    if (status === 'Done') return 'bg-green-500';
    if (status === '50%') return 'bg-orange-400';
    if (status === '0%') return 'bg-red-500';
    return 'bg-orange-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Upcoming Deadlines Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Deadlines</h2>
            
            {/* Lag Objectives Header */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Lag Objectives</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-8">
                  <span><strong>Assigned to:</strong> Gbolade Akinwunmi</span>
                  <span><strong>Due Date:</strong> May 11th, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <span><strong>Progress:</strong></span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-400 rounded-full transition-all duration-300"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Card */}
            <div className="border border-gray-200 rounded-lg p-6 relative">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Deliver high-fidelity prototype for VERSUS Ghana Landing page
              </h4>
              <div className="absolute top-4 right-4">
                <button className="text-gray-400 hover:text-gray-600">
                  <ExternalLink size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Objectives Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-6">Lead Objectives</h3>
            
            <div className="space-y-4 mb-8">
              {objectives.map((objective) => (
                <div key={objective.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={objective.completed}
                      onChange={() => toggleObjective(objective.id)}
                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <span className={`text-gray-800 ${objective.completed ? 'line-through text-gray-500' : ''}`}>
                      {objective.text}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(objective.status)}`}>
                    {objective.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Assignment and Rating Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned to
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ratings
                </label>
                <div className="relative">
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
                  >
                    <option value="75%">75%</option>
                    <option value="80%">80%</option>
                    <option value="85%">85%</option>
                    <option value="90%">90%</option>
                    <option value="95%">95%</option>
                    <option value="100%">100%</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Back
              </button>
              <button className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagementInterface;