import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/WeeklyMissionActivity.scss';

interface DailyActivity {
  day: string;
  missions: number;
  flightHours: number;
}

const WeeklyMissionActivity: React.FC = () => {
  // Sample data based on the image
  const weeklyData: DailyActivity[] = [
    { day: "Mon", missions: 4, flightHours: 12 },
    { day: "Tue", missions: 6, flightHours: 18 },
    { day: "Wed", missions: 8, flightHours: 23 },
    { day: "Thu", missions: 7, flightHours: 21 },
    { day: "Fri", missions: 9, flightHours: 26 },
    { day: "Sat", missions: 5, flightHours: 15 },
    { day: "Sun", missions: 3, flightHours: 9 }
  ];

  return (
    <div className="weekly-mission-activity">
      <div className="activity-header">
        <h2 className="section-title">Weekly Mission Activity</h2>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="day" 
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
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar 
              dataKey="missions" 
              name="Missions" 
              fill="#007bff" 
              radius={[2, 2, 0, 0]}
              barSize={20}
            />
            <Bar 
              dataKey="flightHours" 
              name="Flight Hours" 
              fill="#19e28c" 
              radius={[2, 2, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyMissionActivity;