import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MissionCreator.scss";
import DroneRouteMap from "../components/DroneRoutePlanner/DroneRouteMap";
import WaypointsList from "../components/DroneRoutePlanner/WaypointsList";
import { FaArrowLeft } from "react-icons/fa";
import { createMission } from "../api/missionApi";
import { getAllDrones } from '../api/droneApi';

interface Waypoint {
  id: number;
  latitude: string;
  longitude: string;
  altitude: string;
  action: "Photo Capture" | "Video Recording" | "Surveillance" | "Delivery";
}

interface TakeoffLandingPoint {
  latitude: string;
  longitude: string;
  altitude: string;
}

interface Drone {
  _id: string;
  name: string;
  droneId: string;
}

const MissionCreator: React.FC = () => {
  const navigate = useNavigate();
  
  // Mission basic info
  const [missionName, setMissionName] = useState<string>("");
  const [missionType, setMissionType] = useState<string>("Surveillance");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  
  // Drone and route info
  const [droneId, setDroneId] = useState<string>("Drone 1");
  const [assignedDrones, setAssignedDrones] = useState<string[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [loadingDrones, setLoadingDrones] = useState<boolean>(false);
  
  const [takeoffPoint, setTakeoffPoint] = useState<TakeoffLandingPoint>({
    latitude: "40.7128°N",
    longitude: "74.0060°W",
    altitude: "0m",
  });
  
  const [landingPoint, setLandingPoint] = useState<TakeoffLandingPoint>({
    latitude: "40.7138°N",
    longitude: "74.0070°W",
    altitude: "0m",
  });

  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    {
      id: 1,
      latitude: "40.7128°N",
      longitude: "74.0060°W",
      altitude: "150m",
      action: "Photo Capture"
    }
  ]);
  
  const [selectedWaypoint, setSelectedWaypoint] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Fetch drones on component mount
  useEffect(() => {
    const fetchDrones = async () => {
      try {
        setLoadingDrones(true);
        const response = await getAllDrones();
        setDrones(response.data || []);
      } catch (err) {
        console.error("Error fetching drones:", err);
      } finally {
        setLoadingDrones(false);
      }
    };
    
    fetchDrones();
  }, []);
  
  // Waypoint management functions
  const addWaypoint = () => {
    const newWaypoint: Waypoint = {
      id: waypoints.length + 1,
      latitude: "40.7128°N",
      longitude: "74.0060°W",
      altitude: "150m",
      action: "Photo Capture"
    };
    setWaypoints([...waypoints, newWaypoint]);
  };
  
  const updateWaypoint = (id: number, updatedWaypoint: Partial<Waypoint>) => {
    setWaypoints(waypoints.map(wp => 
      wp.id === id ? { ...wp, ...updatedWaypoint } : wp
    ));
  };
  
  const deleteWaypoint = (id: number) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
    if (selectedWaypoint === id) {
      setSelectedWaypoint(null);
    }
  };
  
  const handleWaypointDrag = (id: number, lat: string, lng: string) => {
    if (id === -1) {
      // Takeoff point
      setTakeoffPoint(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng
      }));
    } else if (id === -2) {
      // Landing point
      setLandingPoint(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng
      }));
    } else {
      // Regular waypoint
      updateWaypoint(id, { latitude: lat, longitude: lng });
    }
  };
  
  const updateTakeoffPoint = (point: Partial<TakeoffLandingPoint>) => {
    setTakeoffPoint(prev => ({ ...prev, ...point }));
  };
  
  const updateLandingPoint = (point: Partial<TakeoffLandingPoint>) => {
    setLandingPoint(prev => ({ ...prev, ...point }));
  };

  const handleDroneSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setAssignedDrones(selectedOptions);
  };

  const handleSensorSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSensors(selectedOptions);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!missionName.trim()) {
        newErrors.name = "Mission name is required";
      }
      
      if (!startDate) {
        newErrors.startDate = "Start date is required";
      }
      
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        newErrors.endDate = "End date must be after start date";
      }
      
      if (!description.trim()) {
        newErrors.description = "Mission description is required";
      }
    } else if (step === 2) {
      if (assignedDrones.length === 0) {
        newErrors.drones = "At least one drone must be assigned";
      }
    } else if (step === 3) {
      if (waypoints.length === 0) {
        newErrors.waypoints = "At least one waypoint is required";
      }
      
      if (!takeoffPoint || !landingPoint) {
        newErrors.points = "Both takeoff and landing points are required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        const missionData = {
          name: missionName,
          type: missionType,
          startDate,
          endDate,
          description,
          assignedDrones,
          location: "Custom Location",
          priority: "medium",
          takeoffPoint,
          landingPoint,
          waypoints,
          sensors: selectedSensors
        };
        
        const response = await createMission(missionData);
        console.log("Mission created successfully", response);
        navigate('/dashboard');
      } catch (error) {
        console.error("Error creating mission:", error);
        setErrors({
          ...errors,
          submit: "Failed to create mission. Please try again."
        });
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="mission-basic-info">
            <h2>Mission Information</h2>
            <div className="form-group">
              <label htmlFor="mission-name">Mission Name</label>
              <input 
                id="mission-name"
                type="text" 
                placeholder="Enter mission name" 
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="mission-type">Mission Type</label>
              <select 
                id="mission-type"
                value={missionType}
                onChange={(e) => setMissionType(e.target.value)}
              >
                <option value="Surveillance">Surveillance</option>
                <option value="Delivery">Delivery</option>
                <option value="Inspection">Inspection</option>
                <option value="Mapping">Mapping</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="start-date">Start Date</label>
              <input 
                id="start-date"
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {errors.startDate && <div className="error-message">{errors.startDate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="end-date">End Date</label>
              <input 
                id="end-date"
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {errors.endDate && <div className="error-message">{errors.endDate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="mission-description">Mission Description</label>
              <textarea 
                id="mission-description"
                placeholder="Enter mission details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="mission-drone-selection">
            <h2>Drone Assignment</h2>
            <div className="form-group">
              <label htmlFor="assigned-drones">Assigned Drones</label>
              <select 
                id="assigned-drones"
                multiple
                onChange={handleDroneSelection}
                value={assignedDrones}
              >
                {loadingDrones ? (
                  <option disabled>Loading drones...</option>
                ) : drones.length > 0 ? (
                  drones.map(drone => (
                    <option key={drone._id} value={drone._id}>
                      {drone.name} ({drone.droneId})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Drone-001">Drone-001</option>
                    <option value="Drone-002">Drone-002</option>
                    <option value="Drone-003">Drone-003</option>
                    <option value="Drone-004">Drone-004</option>
                  </>
                )}
              </select>
              <small className="help-text">Hold Ctrl/Cmd to select multiple drones</small>
              {errors.drones && <div className="error-message">{errors.drones}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="sensor-selection">Sensor Components</label>
              <select 
                id="sensor-selection"
                multiple
                onChange={handleSensorSelection}
                value={selectedSensors}
              >
                <option value="Thermal">Thermal Camera</option>
                <option value="LiDAR">LiDAR</option>
                <option value="Multispectral">Multispectral Camera</option>
                <option value="RGB">RGB Camera</option>
                <option value="Infrared">Infrared Sensor</option>
                <option value="Gas">Gas Detector</option>
                <option value="Radiation">Radiation Detector</option>
                <option value="Humidity">Humidity Sensor</option>
                <option value="Temperature">Temperature Sensor</option>
              </select>
              <small className="help-text">Hold Ctrl/Cmd to select multiple sensors</small>
            </div>
            
            <div className="drone-details">
              <h3>Drone Specifications</h3>
              {assignedDrones.length > 0 ? (
                <div className="drone-specs">
                  <div className="spec-item">
                    <span className="spec-label">Flight Time:</span>
                    <span className="spec-value">30 minutes</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Max Speed:</span>
                    <span className="spec-value">45 mph</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Camera:</span>
                    <span className="spec-value">4K Ultra HD</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Selected Sensors:</span>
                    <span className="spec-value">
                      {selectedSensors.length > 0 ? selectedSensors.join(', ') : 'None'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="no-drones-message">Select drones to view specifications</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="mission-route-planning">
            <div className="drone-route-content">
              <DroneRouteMap 
                waypoints={waypoints} 
                selectedWaypoint={selectedWaypoint}
                setSelectedWaypoint={setSelectedWaypoint}
                isLiveView={false}
                takeoffPoint={takeoffPoint}
                landingPoint={landingPoint}
                onWaypointDrag={handleWaypointDrag}
                droneId={droneId}
              />
              
              <WaypointsList 
                waypoints={waypoints} 
                startMission={false}
                selectedWaypoint={selectedWaypoint}
                setSelectedWaypoint={setSelectedWaypoint}
                onAddWaypoint={addWaypoint}
                onUpdateWaypoint={updateWaypoint}
                onDeleteWaypoint={deleteWaypoint}
                takeoffPoint={takeoffPoint}
                landingPoint={landingPoint}
                onUpdateTakeoffPoint={updateTakeoffPoint}
                onUpdateLandingPoint={updateLandingPoint}
                onMissionStart={() => {}}
                missionStarted={false}
              />
            </div>
            {errors.waypoints && <div className="error-message">{errors.waypoints}</div>}
            {errors.points && <div className="error-message">{errors.points}</div>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mission-creator">
      <div className="mission-creator-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft />
            Back
          </button>
          <h1>Create New Mission</h1>
        </div>
        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Mission Info</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Drone Selection</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Route Planning</div>
        </div>
      </div>
      
      <div className="mission-creator-content">
        {renderStepContent()}
        {errors.submit && <div className="error-message">{errors.submit}</div>}
      </div>
      
      <div className="mission-creator-actions">
        {currentStep > 1 && (
          <button className="prev-button" onClick={prevStep}>
            Previous
          </button>
        )}
        
        {currentStep < 3 ? (
          <button className="next-button" onClick={nextStep}>
            Next
          </button>
        ) : (
          <button className="create-button" onClick={handleSubmit}>
            Create Mission
          </button>
        )}
      </div>
    </div>
  );
};

export default MissionCreator;