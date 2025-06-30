import React, { useState } from "react";
import "../../styles/MissionTimeline.scss";

interface TimelineData {
  time: string;
  completed: number;
  inProgress: number;
  planned: number;
  overdue: number;
}

const MissionTimeline: React.FC = () => {
  const [activeView, setActiveView] = useState<'day' | 'week' | 'month'>('week');

  const timelineData: TimelineData[] = [
    { time: "00:00", completed: 1, inProgress: 2, planned: 3, overdue: 0 },
    { time: "04:00", completed: 2, inProgress: 3, planned: 3, overdue: 0 },
    { time: "08:00", completed: 3, inProgress: 4, planned: 2, overdue: 1 },
    { time: "12:00", completed: 4, inProgress: 3, planned: 2, overdue: 1 },
    { time: "16:00", completed: 5, inProgress: 3, planned: 2, overdue: 1 },
    { time: "20:00", completed: 6, inProgress: 3, planned: 2, overdue: 1 },
    { time: "24:00", completed: 7, inProgress: 3, planned: 2, overdue: 1 },
  ];

  const generateStackedAreaPath = (
    dataKey: keyof Omit<TimelineData, 'time'>,
    baseValues: number[]
  ) => {
    const width = 100;
    const height = 100;
    const maxValue = 16;

    const topPoints = timelineData.map((data, index) => ({
      x: (index / (timelineData.length - 1)) * width,
      y: height - ((baseValues[index] + data[dataKey]) / maxValue) * height,
    }));

    const bottomPoints = timelineData.map((_, index) => ({
      x: (index / (timelineData.length - 1)) * width,
      y: height - (baseValues[index] / maxValue) * height,
    }));

    let topPath = `M${topPoints[0].x},${topPoints[0].y}`;
    for (let i = 1; i < topPoints.length; i++) {
      const prev = topPoints[i - 1];
      const curr = topPoints[i];
      const next = topPoints[i + 1];
      if (next) {
        const cp1x = prev.x + (curr.x - prev.x) * 0.5;
        const cp1y = prev.y;
        const cp2x = curr.x - (next.x - curr.x) * 0.5;
        const cp2y = curr.y;
        topPath += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
      } else {
        topPath += ` L${curr.x},${curr.y}`;
      }
    }

    let bottomPath = '';
    for (let i = bottomPoints.length - 1; i >= 0; i--) {
      const curr = bottomPoints[i];
      const prev = bottomPoints[i + 1];
      const next = bottomPoints[i - 1];
      if (i === bottomPoints.length - 1) {
        bottomPath += ` L${curr.x},${curr.y}`;
      } else if (next) {
        const cp1x = prev.x - (prev.x - curr.x) * 0.5;
        const cp1y = prev.y;
        const cp2x = curr.x + (next.x - curr.x) * 0.5;
        const cp2y = curr.y;
        bottomPath += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
      } else {
        bottomPath += ` L${curr.x},${curr.y}`;
      }
    }

    return `${topPath}${bottomPath} Z`;
  };

  return (
    <div className="mission-timeline">
      <div className="header">
        <h2>Mission Timeline</h2>
        <div className="toggle-buttons">
          {(['day', 'week', 'month'] as const).map((view) => (
            <button
              key={view}
              className={view === activeView ? "active" : ""}
              onClick={() => setActiveView(view)}
            >
              {view[0].toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <div className="grid-background" />
        <div className="chart-wrapper">
          <div className="y-axis">
            <div>16</div><div>12</div><div>8</div><div>4</div><div>0</div>
          </div>
          <div className="svg-container">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d={generateStackedAreaPath('completed', timelineData.map(() => 0))} fill="#22c55e" opacity="0.9" />
              <path d={generateStackedAreaPath('inProgress', timelineData.map(d => d.completed))} fill="#3b82f6" opacity="0.8" />
              <path d={generateStackedAreaPath('planned', timelineData.map(d => d.completed + d.inProgress))} fill="#f59e0b" opacity="0.8" />
              <path d={generateStackedAreaPath('overdue', timelineData.map(d => d.completed + d.inProgress + d.planned))} fill="#ef4444" opacity="0.8" />
            </svg>
          </div>
        </div>
        <div className="x-axis">
          {timelineData.map((data, index) => (
            <div key={index}>{data.time}</div>
          ))}
        </div>
      </div>

      <div className="legend">
        <div className="legend-item completed"><span>●</span> Completed</div>
        <div className="legend-item in-progress"><span>●</span> In Progress</div>
        <div className="legend-item planned"><span>●</span> Planned</div>
        <div className="legend-item overdue"><span>●</span> Overdue</div>
      </div>
    </div>
  );
};

export default MissionTimeline;
