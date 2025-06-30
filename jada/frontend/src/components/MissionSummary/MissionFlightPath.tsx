import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { TbBadge3DFilled } from "react-icons/tb";
import img from "../../assets/map.png"
interface MissionFlightPathProps {
  flightPathData: string;
}

const MissionFlightPath: React.FC<MissionFlightPathProps> = ({ flightPathData }) => {
  return (
    <div className="mission-flight-path">
      <h2><FaMapMarkedAlt className="section-icon" /> Flight Path</h2>
      <div className="flight-path-map">
        {/* In a real app, this would be a map component */}
        <div className="map-placeholder">
          <img src={img} alt="Flight path map" />
        </div>
        <button className="view-3d-button">
          <TbBadge3DFilled className="button-icon" /> View 3D Replay
        </button>
      </div>
    </div>
  );
};

export default MissionFlightPath;