import React from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

interface MissionHeaderProps {
  title: string;
  timestamp: string;
  status: "completed" | "aborted";
}

const MissionHeader: React.FC<MissionHeaderProps> = ({ title, timestamp, status }) => {
  const formattedDate = new Date(timestamp).toLocaleString();
  
  return (
    <div className="mission-header">
      <h1>{title}</h1>
      <div className="mission-header-details">
        <span className="timestamp">
          <FaClock className="icon" /> {formattedDate}
        </span>
        <div className={`status-indicator ${status}`}>
          <div className="status-icon">
            {status === "completed" ? (
              <FaCheckCircle size={24} />
            ) : (
              <FaTimesCircle size={24} />
            )}
          </div>
          <span className="status-text">{status.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default MissionHeader;