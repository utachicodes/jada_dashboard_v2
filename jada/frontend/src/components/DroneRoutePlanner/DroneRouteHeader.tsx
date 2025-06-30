import React, { useState } from "react";
import { FaArrowLeft, FaEye, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface DroneRouteHeaderProps {
  onSave: () => void;
  onToggleLiveView: () => void;
  isLiveView: boolean;
}

const DroneRouteHeader: React.FC<DroneRouteHeaderProps> = ({ 
  onSave, 
  onToggleLiveView, 
  isLiveView,
}) => {
  const navigate = useNavigate();

  return (
    <div className="drone-route-header">
      <div className="header-left">
        <button 
          className="back-button" 
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <FaArrowLeft /> Back
        </button>
        <h1>Drone Route Planner</h1>
      </div>
      
      <div className="header-actions">
        <button 
          className="save-button" 
          onClick={onSave}
          aria-label="Save route"
        >
          <FaSave /> Save Route
        </button>
      </div>
    </div>
  );
};

export default DroneRouteHeader;
