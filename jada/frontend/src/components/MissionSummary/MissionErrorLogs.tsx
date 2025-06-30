import React, { useState } from "react";
import { FaSearch, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

interface ErrorLog {
  type: string;
  time: string;
  message: string;
}

interface MissionErrorLogsProps {
  logs: ErrorLog[];
}

const MissionErrorLogs: React.FC<MissionErrorLogsProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getLogIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'error':
        return <FaExclamationCircle className="log-icon error" />;
      case 'warning':
        return <FaExclamationTriangle className="log-icon warning" />;
      case 'info':
        return <FaInfoCircle className="log-icon info" />;
      default:
        return <FaInfoCircle className="log-icon info" />;
    }
  };
  
  return (
    <div className="mission-error-logs">
      <div className="logs-header">
        <h2>Error Logs</h2>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="logs-container">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, index) => (
            <div key={index} className={`log-item ${log.type.toLowerCase()}`}>
              <span className="log-time">{log.time}</span>
              <span className="log-type">
                {getLogIcon(log.type)}
                {log.type}
              </span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        ) : (
          <div className="no-logs">
            {searchTerm ? "No logs matching your search" : "No logs recorded"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionErrorLogs;