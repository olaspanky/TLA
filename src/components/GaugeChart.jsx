// components/GaugeChart.js
import React from 'react';
import GaugeChart from 'react-gauge-chart';

const GaugeChartComponent = ({ value }) => {
  // Ensure the value is between 0 and 100
  const normalizedValue = Math.min(Math.max(value, 0), 100) / 100; // GaugeChart expects a value between 0 and 1

  return (
    <div style={{ width: '300px', height: '150px', margin: '0 auto' }}>
      <GaugeChart
        id="gauge-chart"
        nrOfLevels={4} // Number of color sections
        colors={['#FF0000', '#FF4500', '#FFD700', '#008000']} // Red, Orange, Yellow, Green
        arcWidth={0.3} // Thickness of the gauge arc
        percent={normalizedValue} // Value as a percentage (0 to 1)
        needleColor="#00008B" // Dark blue needle
        needleBaseColor="#00008B" // Dark blue needle base
        textColor="#000000" // Text color for the value
        formatTextValue={(value) => `${Math.round(value * 100)}`} // Display the actual value
      />
    </div>
  );
};

export default GaugeChartComponent;