import React from "react";
import '../../styles/ResourceAllocation.scss';

interface DroneAllocation {
  category: string;
  percentage: number;
}

interface TeamMember {
  name: string;
  workload: number;
}

const ResourceAllocation: React.FC = () => {
  // Sample data based on the image
  const droneAllocations: DroneAllocation[] = [
    { category: "Surveillance", percentage: 42 },
    { category: "Monitoring", percentage: 28 },
    { category: "Inspection", percentage: 18 },
    { category: "Emergency", percentage: 12 }
  ];

  const teamWorkload: TeamMember[] = [
    { name: "Thomas A.", workload: 85 },
    { name: "Sarah L.", workload: 72 },
    { name: "Michael R.", workload: 64 },
    { name: "Jessica T.", workload: 45 }
  ];

  return (
    <div className="resource-allocation">
      <h2 className="section-title">Resource Allocation</h2>

      <div className="allocation-container">
        <div className="allocation-section">
          <h3 className="subsection-title">Drone Allocation</h3>
          
          {droneAllocations.map((item, index) => (
            <div key={index} className="allocation-item">
              <div className="allocation-label">
                <span>{item.category}</span>
                <span className="allocation-percentage">{item.percentage}%</span>
              </div>
              <div className="allocation-bar">
                <div 
                  className="allocation-fill"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="allocation-section">
          <h3 className="subsection-title">Team Workload</h3>
          
          {teamWorkload.map((member, index) => (
            <div key={index} className="allocation-item">
              <div className="allocation-label">
                <div className="team-member">
                  <div className="member-avatar">👤</div>
                  <span>{member.name}</span>
                </div>
                <span className="allocation-percentage">{member.workload}%</span>
              </div>
              <div className="allocation-bar">
                <div 
                  className="allocation-fill workload"
                  style={{ width: `${member.workload}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;