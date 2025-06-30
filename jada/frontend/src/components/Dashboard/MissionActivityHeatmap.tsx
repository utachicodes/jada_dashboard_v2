import React from "react";
import '../../styles/MissionActivityHeatmap.scss';

interface HeatmapProps {
  data?: {
    time: string;
    value: number;
  }[];
}

const generateMockHeatmapData = () => {
  const timeSlots = [
    "00:00", "03:00", "06:00", "09:00", "12:00",
    "15:00", "18:00", "21:00", "24:00"
  ];

  return timeSlots.map((time, index) => {
    const baseValue = Math.sin((index / (timeSlots.length - 1)) * Math.PI) * 60 + 20;
    const noise = (Math.random() - 0.5) * 20;
    return {
      time,
      value: Math.max(0, Math.min(100, Math.round(baseValue + noise)))
    };
  });
};

const MissionActivityHeatmap: React.FC<HeatmapProps> = ({ data }) => {
  const heatmapData = data && data.length > 0 ? data : generateMockHeatmapData();

  const generateSmoothPath = () => {
    const width = 100;
    const height = 100;

    const points = heatmapData.map((point, index) => ({
      x: (index / (heatmapData.length - 1)) * width,
      y: height - (point.value / 100) * height
    }));

    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      if (next) {
        const cp1x = prev.x + (curr.x - prev.x) * 0.5;
        const cp1y = prev.y;
        const cp2x = curr.x - (next.x - curr.x) * 0.5;
        const cp2y = curr.y;
        path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
      } else {
        path += ` L${curr.x},${curr.y}`;
      }
    }

    path += ` L${width},${height} L0,${height} Z`;
    return path;
  };

  return (
    <div className="heatmap-container">
      <h2 className="heatmap-title">Mission Activity Heatmap</h2>

      <div className="heatmap-graph-wrapper">
        <div className="heatmap-y-labels">
          <div>100</div>
          <div>75</div>
          <div>50</div>
          <div>25</div>
          <div>0</div>
        </div>

        <div className="heatmap-svg-wrapper">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="heatmap-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            <path
              d={generateSmoothPath()}
              fill="url(#heatmap-gradient)"
              stroke="#22d3ee"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      <div className="heatmap-x-labels">
        {heatmapData.map((point, index) => (
          <div key={index}>{point.time}</div>
        ))}
      </div>

      <div className="heatmap-legend">
        <div className="legend-item">
          <div className="legend-color" />
          <span>value</span>
        </div>
      </div>
    </div>
  );
};

export default MissionActivityHeatmap;
