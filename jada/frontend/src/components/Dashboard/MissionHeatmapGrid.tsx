// MissionHeatmap.tsx
import React from "react";




const MissionHeatmapGrid: React.FC<any> = ({ heatmapData }) => (
  <div className="heatmap-container_gridd">
    <div className="day-labels">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
        <div key={i} className="day-label">{day}</div>
      ))}
    </div>

    <div className="heatmap-grid">
      {Object.entries(heatmapData).map(([month, days], monthIndex) => (
        <div key={monthIndex} className="monthly_mission_grid">
          {days.map((item, dayIndex) => (
            <div
              key={dayIndex}
              className={`heatmap-cell level-${item.value}`}
              title={`Day: ${item.day.toDateString()}, Value: ${item.value}`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default MissionHeatmapGrid;
