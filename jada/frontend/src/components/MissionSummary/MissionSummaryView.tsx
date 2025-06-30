import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MissionHeader from "./MissionHeader";
import MissionStats from "./MissionStats";
import MissionErrorLogs from "./MissionErrorLogs";
import MissionAnalytics from "./MissionAnalytics";
import MissionCameraFeed from "./MissionCameraFeed";
import MissionFlightPath from "./MissionFlightPath";
import MissionExportOptions from "./MissionExportOptions";
import "../../styles/MissionSummary.scss";

interface MissionSummaryViewProps {
  missionId?: string;
  status?: string;
}

interface MissionData {
  id: string;
  name: string;
  status: "completed" | "aborted";
  duration: string;
  distance: string;
  averageSpeed: string;
  batteryStart: string;
  batteryEnd: string;
  errorLogs: ErrorLog[];
  cameraFeed: CameraFeedItem[];
  flightPath: string; // This would be a GeoJSON or similar format in a real app
}

interface ErrorLog {
  type: string;
  time: string;
  message: string;
}

interface CameraFeedItem {
  id: string;
  timestamp: string;
  imageUrl: string;
}

const MissionSummaryView: React.FC<MissionSummaryViewProps> = ({ missionId, status }) => {
  const navigate = useNavigate();
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, this would be an API call to fetch mission data
    // For now, we'll simulate with mock data
    setTimeout(() => {
      setMissionData({
        id: missionId || "MS-2024-0127",
        name: "Urban Surveillance Alpha",
        status: (status as "completed" | "aborted") || "completed",
        duration: "2h 14m 33s",
        distance: "12.4 km",
        averageSpeed: "24 km/h",
        batteryStart: "98%",
        batteryEnd: "23%",
        errorLogs: [
          { type: "ERROR", time: "00:15:23", message: "GPS signal interference detected" },
          { type: "WARNING", time: "00:45:12", message: "Battery level below 30%" },
          { type: "INFO", time: "01:25:45", message: "Mission parameters validated" }
        ],
        cameraFeed: [
          { id: "1", timestamp: "00:15:23", imageUrl: "/Users/pranavthakur/Desktop/flytBaseAssignment/frontend/src/assets/FRAME.png" },
          { id: "2", timestamp: "00:30:12", imageUrl: "frontend/src/assets/FRAME.png" },
          { id: "3", timestamp: "00:45:45", imageUrl: "frontend/src/assets/FRAME.png" },
          { id: "4", timestamp: "01:00:30", imageUrl: "frontend/src/assets/FRAME.png" }
        ],
        flightPath: "{\"type\":\"LineString\",\"coordinates\":[[40.712,-74.006],[40.713,-74.007],[40.714,-74.008]]}"
      });
      setLoading(false);
    });
  }, [missionId, status]);

  if (loading) {
    return <div className="mission-summary-loading">Loading mission data...</div>;
  }

  if (!missionData) {
    return <div className="mission-summary-error">Mission data not found</div>;
  }

  return (
    <div className="mission-summary-container">
      <MissionHeader 
        title="Mission Summary" 
        timestamp={new Date().toISOString()} 
        status={missionData.status} 
      />
      
      <div className="mission-summary-content">
        <div className="mission-summary-main">
          <MissionStats 
            duration={missionData.duration}
            distance={missionData.distance}
            averageSpeed={missionData.averageSpeed}
            batteryStart={missionData.batteryStart}
            batteryEnd={missionData.batteryEnd}
            missionId={missionData.id}
          />
          
          <MissionErrorLogs logs={missionData.errorLogs} />
          
          <div className="mission-summary-row">
            <MissionCameraFeed feedItems={missionData.cameraFeed} />
            <div className="mission-summary-column">
              <MissionFlightPath flightPathData={missionData.flightPath} />
              <MissionExportOptions missionId={missionData.id} />
            </div>
          </div>
          
          <MissionAnalytics />
        </div>
      </div>
    </div>
  );
};

export default MissionSummaryView;