import React from "react";

interface MissionStatsProps {
  duration: string;
  distance: string;
  averageSpeed: string;
  batteryStart: string;
  batteryEnd: string;
  missionId: string;
}

const MissionStats: React.FC<MissionStatsProps> = ({
  duration,
  distance,
  averageSpeed,
  batteryStart,
  batteryEnd,
  missionId
}) => {
  return (
    <div className="mission-stats">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Duration</div>
          <div className="stat-value">{duration}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Distance</div>
          <div className="stat-value">{distance}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Speed</div>
          <div className="stat-value">{averageSpeed}</div>
        </div>
      </div>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Battery Start</div>
          <div className="stat-value">{batteryStart}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Battery End</div>
          <div className="stat-value">{batteryEnd}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Mission ID</div>
          <div className="stat-value">{missionId}</div>
        </div>
      </div>
    </div>
  );
};

export default MissionStats;