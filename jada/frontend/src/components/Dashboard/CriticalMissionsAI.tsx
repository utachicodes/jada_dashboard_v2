import React from "react";
import '../../styles/CriticalMissionsAI.scss';

interface CriticalMission {
  name: string;
  location: string;
  risk: number;
}

interface AIRecommendation {
  action: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
}

const CriticalMissionsAI: React.FC = () => {
  // Sample data based on the image
  const criticalMissions: CriticalMission[] = [
    { name: "Emergency Response", location: "East River Bridge", risk: 85 },
    { name: "Security Alert", location: "Government Building", risk: 78 },
    { name: "Hazardous Material", location: "Chemical Plant", risk: 92 }
  ];
  
  const aiRecommendations: AIRecommendation[] = [
    { 
      action: "Reassign DX-427 to East River Bridge", 
      reason: "Proximity and available battery", 
      priority: "High" 
    },
    { 
      action: "Schedule maintenance for DX-305", 
      reason: "Performance degradation detected", 
      priority: "Medium" 
    },
    { 
      action: "Increase surveillance frequency at North Industrial Zone", 
      reason: "Unusual activity patterns detected", 
      priority: "Medium" 
    }
  ];
  
  return (
    <div className="critical-ai-container">
      <div className="critical-missions">
        <h2 className="section-title">Critical Missions</h2>
        
        <div className="missions-list">
          {criticalMissions.map((mission, index) => (
            <div key={index} className="mission-card_info">
              <div className="mission-info">
                <h3 className="mission-name">{mission.name}</h3>
                <div className="mission-location">
                  <span className="location-icon">📍</span>
                  <span>{mission.location}</span>
                </div>
              </div>
              <div className="mission-risk">
                <span className={`risk-badge risk-${mission.risk >= 90 ? 'critical' : mission.risk >= 80 ? 'high' : 'medium'}`}>
                  Risk: {mission.risk}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="ai-recommendations">
        <h2 className="section-title">AI Recommendations</h2>
        
        <div className="recommendations-list">
          {aiRecommendations.map((recommendation, index) => (
            <div key={index} className="recommendation-card">
              <div className="recommendation-content">
                <h3 className="recommendation-action">{recommendation.action}</h3>
                <p className="recommendation-reason">Reason: {recommendation.reason}</p>
              </div>
              <div className="recommendation-priority">
                <span className={`priority-badge priority-${recommendation.priority.toLowerCase()}`}>
                  {recommendation.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CriticalMissionsAI;