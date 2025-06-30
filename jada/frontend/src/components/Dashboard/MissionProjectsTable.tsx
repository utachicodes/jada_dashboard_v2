import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
                

type Mission = {
  name: string;
  status: "planned" | "in-progress" | "completed" | "aborted";
  location: string;
  drone: string;
  operator: string;
  created: string;
  priority: "low" | "medium" | "high" | "critical";
};

interface MissionProjectsTableProps {
  missions: Mission[];
  viewMode: "grid" | "list" ;
}

const MissionProjectsTable: React.FC<MissionProjectsTableProps> = ({ missions, viewMode}) => {
const navigate = useNavigate();



const handleMissionRedirectPage = (index: number, mission: Mission) => {
  console.log(mission);

  switch (mission.status) {
    case "in-progress":
      navigate(`/in-progress-mission/${index + 1}`);
      break;
    case "planned":
      navigate(`/planned-mission/${index + 1}`);
      break;
    case "aborted":
      navigate(`/aborted-mission/${index + 1}`);
      break;
    case "completed":
      navigate(`/completed-mission/${index + 1}`);
      break;
    default:
      console.warn("Unknown mission status:", mission.status);
      break;
  }
};
  return (
    <div className="projects-container">
        
      {viewMode === 'list' ? (
        <div className="projects-table-container">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Mission Name</th>
                <th>Status</th>
                <th>Location</th>
                <th>Assigned Drone</th>
                <th>Operator</th>
                <th>Created Date</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m, i) => (
                <tr key={i}>
                  <td>{m.name}</td>
                  <td>
                    <span className={`status-badge ${m.status}`}>
                      {m.status.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </td>
                  <td>{m.location}</td>
                  <td>{m.drone}</td>
                  <td>{m.operator}</td>
                  <td>{m.created}</td>
                  <td>
                    <span className={`priority-badge ${m.priority}`}>
                      {m.priority.charAt(0).toUpperCase() + m.priority.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="action-button"><FaEye /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="projects-grid-container">
          {missions.map((mission, index) => (
            <div className="mission-card" key={index}>
              <div className="mission-card-header">
                <h3 className="mission-name">{mission.name}</h3>
                <span className={`status-badge ${mission.status}`}>
                  {mission.status.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </div>
              <div className="mission-card-content">
                <div className="mission-detail">
                  <div className="detail-with-icon">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>{mission.location}</span>
                  </div>
                </div>
                <div className="mission-detail">
                  <div className="detail-with-icon">
                    <FaCalendarAlt className="detail-icon" />
                    <span>Created: {mission.created}</span>
                  </div>
                </div>
              </div>
              <div className="mission-card-footer">
                <button 
                  className="view-button" 
                  onClick={()=>handleMissionRedirectPage(index, mission)}
                >
                  View      <FaEye />
                </button>
               
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MissionProjectsTable;
