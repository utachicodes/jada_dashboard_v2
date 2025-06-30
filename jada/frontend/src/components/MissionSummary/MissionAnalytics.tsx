import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartLine } from "react-icons/fa";

const MissionAnalytics: React.FC = () => {
  // Sample data for the mission analytics chart
  const analyticsData = [
    { time: "00:00", altitude: 45, speed: 80, battery: 98 },
    { time: "00:15", altitude: 120, speed: 90, battery: 90 },
    { time: "00:30", altitude: 180, speed: 90, battery: 75 },
    { time: "00:45", altitude: 150, speed: 90, battery: 60 },
    { time: "01:00", altitude: 135, speed: 85, battery: 45 }
  ];

  return (
    <div className="mission-analytics">
      <h2><FaChartLine className="section-icon" /> Mission Analytics</h2>
      <div className="analytics-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#b3b3b3', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#b3b3b3', fontSize: 12 }}
              width={30}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#232325', 
                border: 'none', 
                borderRadius: '4px',
                color: '#fff'
              }}
              cursor={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              iconType="circle"
              iconSize={8}
            />
            <Line 
              type="monotone" 
              dataKey="altitude" 
              name="Altitude" 
              stroke="#19e28c" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="speed" 
              name="Speed" 
              stroke="#007bff" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="battery" 
              name="Battery" 
              stroke="#ffb74d" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MissionAnalytics;