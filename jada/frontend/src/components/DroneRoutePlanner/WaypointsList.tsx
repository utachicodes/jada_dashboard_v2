import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

interface Waypoint {
  id: number;
  latitude: string;
  longitude: string;
  altitude: string;
  speed: string; // Added speed
}

interface TakeoffLandingPoint {
  latitude: string;
  longitude: string;
  altitude: string;
}

interface WaypointsListProps {
  waypoints: Waypoint[];
  selectedWaypoint: number | null;
  setSelectedWaypoint: (id: number | null) => void;
  onAddWaypoint: () => void;
  onUpdateWaypoint: (id: number, waypoint: Partial<Waypoint>) => void;
  onDeleteWaypoint: (id: number) => void;
  takeoffPoint: TakeoffLandingPoint;
  landingPoint: TakeoffLandingPoint;
  onUpdateTakeoffPoint: (point: Partial<TakeoffLandingPoint>) => void;
  onUpdateLandingPoint: (point: Partial<TakeoffLandingPoint>) => void;
  onMissionStart: () => void;
  missionStarted: boolean;
  startMission: boolean;
}

const WaypointsList: React.FC<WaypointsListProps> = ({
  waypoints,
  selectedWaypoint,
  setSelectedWaypoint,
  onAddWaypoint,
  onUpdateWaypoint,
  onDeleteWaypoint,
  takeoffPoint,
  landingPoint,
  onUpdateTakeoffPoint,
  onUpdateLandingPoint,
  onMissionStart,
  missionStarted,
  startMission
}) => {
  const handleCoordinateChange = (
    id: number,
    field: keyof Waypoint,
    value: string
  ) => {
    onUpdateWaypoint(id, { [field]: value });
  };

  const handleTakeoffPointChange = (
    field: keyof TakeoffLandingPoint,
    value: string
  ) => {
    onUpdateTakeoffPoint({ [field]: value });
  };

  const handleLandingPointChange = (
    field: keyof TakeoffLandingPoint,
    value: string
  ) => {
    onUpdateLandingPoint({ [field]: value });
  };

  const calculateDistance = (): string => {
    return `${(waypoints.length * 1.5).toFixed(1)} km`;
  };

  const calculateTime = (): string => {
    return `${waypoints.length * 5} minutes`;
  };

    const [search, setSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };
  
  return (
    <div className="waypoints-container">
      <div className="waypoints-header">
        <h2>Waypoints</h2>
        <button className="add-waypoint-button" onClick={onAddWaypoint} disabled={missionStarted}>
          <FaPlus /> Add Waypoint
        </button>
      </div>
      <div className="load_map_route"> 
         Load Route 
        <input
          className="route-search-input"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search route..."
        />
      </div>
      <div className="waypoints-list">
        <div className="waypoint-item takeoff">
          <div className="waypoint-header">
            <div className="waypoint-title">
              <span className="waypoint-icon takeoff-icon">T</span>
              <h3>TakeOff</h3>
            </div>
          </div>
          <div className="waypoint-details">
            {["latitude", "longitude", "altitude"].map((key) => (
              <div className="coordinate-group" key={key}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                  type="text"
                  value={takeoffPoint[key as keyof TakeoffLandingPoint]}
                  onChange={(e) =>
                    handleTakeoffPointChange(
                      key as keyof TakeoffLandingPoint,
                      e.target.value
                    )
                  }
                  disabled={missionStarted}
                />
              </div>
            ))}
          </div>
        </div>

        {waypoints.map((waypoint) => (
          <div
            key={waypoint.id}
            className={`waypoint-item ${selectedWaypoint === waypoint.id ? "selected" : ""}`}
            onClick={() => setSelectedWaypoint(waypoint.id)}
          >
            <div className="waypoint-header">
              <div className="waypoint-title">
                <span className="waypoint-icon">{waypoint.id}</span>
                <h3>Waypoint {waypoint.id}</h3>
              </div>
              <button
                className="delete-waypoint"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteWaypoint(waypoint.id);
                }}
                disabled={missionStarted}
              >
                <FaTrash />
              </button>
            </div>

            <div className="waypoint-details">
              {["latitude", "longitude", "altitude", "speed"].map((key) => (
                <div className="coordinate-group" key={key}>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  <input
                    type="text"
                    value={waypoint[key as keyof Waypoint]}
                    onChange={(e) =>
                      handleCoordinateChange(waypoint.id, key as keyof Waypoint, e.target.value)
                    }
                    disabled={missionStarted}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="waypoint-item landing">
          <div className="waypoint-header">
            <div className="waypoint-title">
              <span className="waypoint-icon landing-icon">L</span>
              <h3>Landing</h3>
            </div>
          </div>
          <div className="waypoint-details">
            {["latitude", "longitude", "altitude"].map((key) => (
              <div className="coordinate-group" key={key}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                  type="text"
                  value={landingPoint[key as keyof TakeoffLandingPoint]}
                  onChange={(e) =>
                    handleLandingPointChange(
                      key as keyof TakeoffLandingPoint,
                      e.target.value
                    )
                  }
                  disabled={missionStarted}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mission-summary">
        <div className="summary-item">
          <span className="summary-label">Total Distance</span>
          <span className="summary-value">{calculateDistance()}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Estimated Time</span>
          <span className="summary-value">{calculateTime()}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Waypoints</span>
          <span className="summary-value">{waypoints.length}</span>
        </div>
      </div>

      {startMission ? 
      <div className="mission-actions">
        <button 
          className="start-mission-button" 
          onClick={onMissionStart} 
          disabled={missionStarted || waypoints.length === 0}
        >
          Start Mission
        </button>
        <button 
          className="preview-button" 
          disabled={missionStarted}
        >
          Return to Home
        </button>
      </div>
      : <></>}
    </div>
  );
};

export default WaypointsList;
