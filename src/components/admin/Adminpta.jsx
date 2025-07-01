import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const PerformanceTrackingDashboard = () => {
  // Bar chart data
  const barChartData = [
    { name: 'Samuel\nRodriguez', value: 780 },
    { name: 'Robert Anger', value: 560 },
    { name: 'Akinseku\nAdeniyi', value: 720 },
    { name: 'Oluwaseun\nMajolagbe', value: 760 },
    { name: 'Joyce Ogabi', value: 620 },
    { name: 'Ogunkoya\nFunmi', value: 780 }
  ];

  // Line chart data
  const lineChartData = [
    { period: 'Q3 2024', value: 18 },
    { period: 'Q3 2024', value: 25 },
    { period: 'Q3 2024', value: 35 },
    { period: 'Q3 2024', value: 78 },
    { period: 'Q3 2024', value: 95 },
    { period: 'Q3 2024', value: 100 }
  ];

  // Top performers data
  const topPerformers = [
    {
      id: 1,
      name: 'Samuel Rodriguez',
      avatar: 'SR',
      score: '79%',
      bgColor: 'bg-purple-500'
    },
    {
      id: 2,
      name: 'Adeniyi Akinseku',
      avatar: 'AA',
      score: '76%',
      bgColor: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Oluwaseun Majorlagbe',
      avatar: 'OM',
      score: '76%',
      bgColor: 'bg-green-500'
    },
    {
      id: 4,
      name: 'Ogunkoya Funmi',
      avatar: 'OF',
      score: '75%',
      bgColor: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Performance tracking</h1>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Empty Left Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            {/* This appears to be empty in the original design */}
          </div>

          {/* Team Rating Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Team Rating</h3>
              <span className="text-sm text-gray-400">Updated at 04:23</span>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    interval={0}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    domain={[0, 1000]}
                    ticks={[0, 200, 400, 600, 800, 1000]}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                    barSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Team Rating Line Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Team Rating</h3>
              <span className="text-sm text-gray-400">Updated at 04:23</span>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="period" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    domain={[0, 120]}
                    ticks={[0, 20, 40, 60, 80, 100, 120]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Performers</h3>
            
            <div className="space-y-4">
              {topPerformers.map((performer) => (
                <div key={performer.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${performer.bgColor} flex items-center justify-center text-white text-sm font-medium`}>
                      {performer.avatar}
                    </div>
                    <span className="font-medium text-gray-900">{performer.name}</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{performer.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrackingDashboard;