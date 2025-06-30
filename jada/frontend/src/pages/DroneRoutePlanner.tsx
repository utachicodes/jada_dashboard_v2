import React, { useEffect, useState } from "react";
import "../styles/DroneRoutePlanner.scss";
import DroneRouteMap from "../components/DroneRoutePlanner/DroneRouteMap";
import WaypointsList from "../components/DroneRoutePlanner/WaypointsList";
import DroneRouteHeader from "../components/DroneRoutePlanner/DroneRouteHeader";
import { useParams, useNavigate } from 'react-router-dom';
import { getWaypointsByMission, createWaypoint, updateWaypoint, deleteWaypoint } from '../api/waypointApi';
import { updateMissionStatus } from '../api/missionApi';
interface Waypoint {
  id: number;
  latitude: string;
  longitude: string;
  altitude: string;
  action: "Photo Capture" | "Video Recording" | "Surveillance" | "Delivery";
}

interface DroneRoutePlannerProps {
  missionId?: string;
}

interface TakeoffLandingPoint {
  latitude: string;
  longitude: string;
  altitude: string;
}

const DroneRoutePlanner: React.FC<DroneRoutePlannerProps> = ({ missionId }) => {
  const { id } = useParams<{ id: string }>();
  const [missionID, setMissionID] = useState<string>("");
  const [droneId, setDroneId] = useState<string>("Drone 1");
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
  const navigate = useNavigate();

  useEffect(() => {
    setMissionID(missionId || id || "");
  }, [missionId, id]);

  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    {
      id: 1,
      latitude: "40.7128°N",
      longitude: "74.0060°W",
      altitude: "150m",
      action: "Photo Capture"
    },
    {
      id: 2,
      latitude: "40.7138°N",
      longitude: "74.0050°W",
      altitude: "150m",
      action: "Video Recording"
    },
    {
      id: 3,
      latitude: "40.7148°N",
      longitude: "74.0040°W",
      altitude: "150m",
      action: "Surveillance"
    }
  ]);
  
  const [selectedWaypoint, setSelectedWaypoint] = useState<number | null>(null);
  const [isLiveView, setIsLiveView] = useState<boolean>(false);
  const [missionStarted, setMissionStarted] = useState<boolean>(false);
  
  // Add these imports

  
  // Add this to the useEffect
  useEffect(() => {
    const fetchWaypoints = async () => {
      if (missionID) {
        try {
          const response = await getWaypointsByMission(missionID);
          if (response.data && response.data.length > 0) {
            // Transform backend waypoints to frontend format
            const fetchedWaypoints = response.data.map((wp: any) => ({
              id: wp.waypointId,
              latitude: wp.latitude,
              longitude: wp.longitude,
              altitude: wp.altitude,
              action: wp.action
            }));
            setWaypoints(fetchedWaypoints);
          }
        } catch (error) {
          console.error("Error fetching waypoints:", error);
        }
      }
    };
  
    fetchWaypoints();
  }, [missionID]);
  
  // Update the addWaypoint function
  const addWaypoint = async () => {
    const newWaypoint: Waypoint = {
      id: waypoints.length + 1,
      latitude: "40.7128°N",
      longitude: "74.0060°W",
      altitude: "150m",
      action: "Photo Capture"
    };
    
    setWaypoints([...waypoints, newWaypoint]);
    
    if (missionID) {
      try {
        await createWaypoint({
          missionId: missionID,
          waypointId: newWaypoint.id,
          latitude: newWaypoint.latitude,
          longitude: newWaypoint.longitude,
          altitude: newWaypoint.altitude,
          action: newWaypoint.action,
          order: waypoints.length + 1
        });
      } catch (error) {
        console.error("Error creating waypoint:", error);
      }
    }
  };
  
  // Update the updateWaypoint function
  const updateWaypointHandler = async (id: number, waypoint: Partial<Waypoint>) => {
    setWaypoints(
      waypoints.map((wp) => (wp.id === id ? { ...wp, ...waypoint } : wp))
    );
    
    if (missionID) {
      try {
        // Find the waypoint in the database by its ID
        const response = await getWaypointsByMission(missionID);
        const dbWaypoint = response.data.find((wp: any) => wp.waypointId === id);
        
        if (dbWaypoint) {
          await updateWaypoint(dbWaypoint._id, {
            latitude: waypoint.latitude,
            longitude: waypoint.longitude,
            altitude: waypoint.altitude,
            action: waypoint.action,
          });
        }
      } catch (error) {
        console.error("Error updating waypoint:", error);
      }
    }
  };
  
  // Update the deleteWaypoint function
  const deleteWaypointHandler = async (id: number) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
    if (selectedWaypoint === id) {
      setSelectedWaypoint(null);
    }
    
    if (missionID) {
      try {
        // Find the waypoint in the database by its ID
        const response = await getWaypointsByMission(missionID);
        const dbWaypoint = response.data.find((wp: any) => wp.waypointId === id);
        
        if (dbWaypoint) {
          await deleteWaypoint(dbWaypoint._id);
        }
      } catch (error) {
        console.error("Error deleting waypoint:", error);
      }
    }
  };
  
  const toggleLiveView = () => {
    setIsLiveView(!isLiveView);
  };
  
  const saveMission = () => {
    console.log("Mission saved", {
      droneId,
      takeoffPoint,
      waypoints,
      landingPoint
    });
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
      updateWaypointHandler(id, { latitude: lat, longitude: lng });
    }
  };
  
  const handleMissionStart = async () => {
    // Validate mission requirements
    if (waypoints.length === 0) {
      alert("Cannot start mission: No waypoints defined");
      return;
    }
    
    if (!takeoffPoint || !landingPoint) {
      alert("Cannot start mission: Takeoff or landing point not set");
      return;
    }
    
    try {
      // Update mission status to "in-progress"
      if (missionID) {
        await updateMissionStatus(missionID, "in-progress");
      }
      
      setMissionStarted(true);
      setIsLiveView(true);
      console.log("Mission started");
      
      // Optional: Navigate to a different view or show a success message
      // navigate(`/in-progress-mission/${missionID}`);
    } catch (error) {
      console.error("Error starting mission:", error);
      alert("Failed to start mission. Please try again.");
    }
  };
  
  const updateTakeoffPoint = (point: Partial<TakeoffLandingPoint>) => {
    setTakeoffPoint(prev => ({ ...prev, ...point }));
  };
  
  const updateLandingPoint = (point: Partial<TakeoffLandingPoint>) => {
    setLandingPoint(prev => ({ ...prev, ...point }));
  };
  
  return (
    <div className="drone-route-planner">
      <DroneRouteHeader
        onSave={saveMission} 
        onToggleLiveView={toggleLiveView} 
        isLiveView={isLiveView} 
        // onSearchRoute={getRoutes}
      />
      
      <div className="drone-route-content">
        <DroneRouteMap 
          waypoints={waypoints} 
          selectedWaypoint={selectedWaypoint}
          setSelectedWaypoint={setSelectedWaypoint}
          isLiveView={isLiveView}
          takeoffPoint={takeoffPoint}
          landingPoint={landingPoint}
          onWaypointDrag={handleWaypointDrag}
          droneId={droneId}
        />
        
        <WaypointsList 
          waypoints={waypoints} 
          startMission={true}
          selectedWaypoint={selectedWaypoint}
          setSelectedWaypoint={setSelectedWaypoint}
          onAddWaypoint={addWaypoint}
          onUpdateWaypoint={updateWaypoint}
          onDeleteWaypoint={deleteWaypoint}
          takeoffPoint={takeoffPoint}
          landingPoint={landingPoint}
          onUpdateTakeoffPoint={updateTakeoffPoint}
          onUpdateLandingPoint={updateLandingPoint}
          onMissionStart={handleMissionStart}
          missionStarted={missionStarted}
        />
      </div>
    </div>
  );
};

export default DroneRoutePlanner;