import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaMinus, FaExpand, FaCompass } from "react-icons/fa";
import CameraFeed from "./CameraFeed";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different waypoint types
const waypointIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const startIcon = new L.Icon({
  iconUrl: icon, // Replace with your start icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "start-icon",
});

const landingIcon = new L.Icon({
  iconUrl: icon, // Replace with your landing icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "landing-icon",
});

interface Waypoint {
  id: number;
  latitude: string;
  longitude: string;
  altitude: string;
  action: string;
}

interface DroneRouteMapProps {
  waypoints: Waypoint[];
  selectedWaypoint: number | null;
  setSelectedWaypoint: (id: number | null) => void;
  isLiveView: boolean;
  takeoffPoint?: {
    latitude: string;
    longitude: string;
    altitude: string;
  };
  landingPoint?: {
    latitude: string;
    longitude: string;
    altitude: string;
  };
  onWaypointDrag?: (id: number, lat: string, lng: string) => void;
  droneId?: string;
}

// Helper function to convert string coordinates to numbers
const parseCoordinate = (coord: string): number => {
  // Handle coordinates in the format "40.7128°N" or "74.0060°W"
  const value = parseFloat(coord);
  const isNegative = coord.includes("S") || coord.includes("W");
  return isNegative ? -value : value;
};

// Helper function to format coordinates as strings
const formatCoordinate = (value: number, isLatitude: boolean): string => {
  const abs = Math.abs(value);
  const direction = isLatitude
    ? value >= 0 ? "N" : "S"
    : value >= 0 ? "E" : "W";
  return `${abs.toFixed(4)}°${direction}`;
};

// Component to handle map events and controls
const MapController: React.FC<{
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
}> = ({ zoomLevel, setZoomLevel }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setZoom(zoomLevel);
  }, [zoomLevel, map]);
  
  return null;
};

const DroneRouteMap: React.FC<DroneRouteMapProps> = ({
  waypoints,
  selectedWaypoint,
  setSelectedWaypoint,
  isLiveView,
  takeoffPoint,
  landingPoint,
  onWaypointDrag,
  droneId
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(13);
  const mapRef = useRef<L.Map | null>(null);
  
  // Default center position (New York City coordinates)
  const defaultCenter: [number, number] = [40.7128, -74.0060];
  
  const increaseZoom = () => {
    if (zoomLevel < 18) setZoomLevel(zoomLevel + 1);
  };
  
  const decreaseZoom = () => {
    if (zoomLevel > 3) setZoomLevel(zoomLevel - 1);
  };
  
  const resetOrientation = () => {
    if (mapRef.current) {
      mapRef.current.setView(defaultCenter, zoomLevel);
    }
  };
  
  const toggleFullscreen = () => {
    const mapElement = document.querySelector('.drone-route-map-container');
    if (mapElement) {
      if (!document.fullscreenElement) {
        mapElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };
  
  // Convert waypoints to map markers
  const waypointMarkers = waypoints.map(waypoint => {
    const lat = parseCoordinate(waypoint.latitude);
    const lng = parseCoordinate(waypoint.longitude);
    
    return {
      id: waypoint.id,
      position: [lat, lng] as [number, number],
      altitude: waypoint.altitude,
      action: waypoint.action
    };
  });
  
  // Create path coordinates for polyline
  const pathCoordinates: [number, number][] = waypointMarkers.map(marker => marker.position);
  
  // Add takeoff and landing points to the path if they exist
  const fullPath: [number, number][] = [];
  
  if (takeoffPoint) {
    const takeoffLat = parseCoordinate(takeoffPoint.latitude);
    const takeoffLng = parseCoordinate(takeoffPoint.longitude);
    fullPath.push([takeoffLat, takeoffLng]);
  }
  
  fullPath.push(...pathCoordinates);
  
  if (landingPoint) {
    const landingLat = parseCoordinate(landingPoint.latitude);
    const landingLng = parseCoordinate(landingPoint.longitude);
    fullPath.push([landingLat, landingLng]);
  }
  
  return (
    <div className="drone-route-map-container">
      <div className="map-header">
        <div className="map-title">
          <h2>Map View {droneId && `- ${droneId}`}</h2>
          {isLiveView && <span className="live-badge">LIVE</span>}
        </div>
        <div className="map-coordinates">
          <div className="coordinate">
            <span className="coordinate-label">Drone Coordinates:</span>
            <span className="coordinate-value">
              {isLiveView && waypointMarkers.length > 0
                ? `${formatCoordinate(waypointMarkers[0].position[0], true)}, ${formatCoordinate(waypointMarkers[0].position[1], false)}`
                : "40.7128°N, 74.0060°W"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="map-content">
        <MapContainer 
          center={defaultCenter} 
          zoom={zoomLevel} 
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map) => { mapRef.current = map; }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
          
          {/* Takeoff point */}
          {takeoffPoint && (
            <Marker 
              position={[parseCoordinate(takeoffPoint.latitude), parseCoordinate(takeoffPoint.longitude)]}
              icon={startIcon}
              draggable={!isLiveView}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  if (onWaypointDrag) {
                    onWaypointDrag(
                      -1, // Special ID for takeoff point
                      formatCoordinate(position.lat, true),
                      formatCoordinate(position.lng, false)
                    );
                  }
                },
              }}
            >
              <Popup>Takeoff Point<br/>Altitude: {takeoffPoint.altitude}</Popup>
            </Marker>
          )}
          
          {/* Waypoints */}
          {waypointMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={waypointIcon}
              draggable={!isLiveView}
              eventHandlers={{
                click: () => setSelectedWaypoint(marker.id),
                dragend: (e) => {
                  const mapMarker = e.target;
                  const position = mapMarker.getLatLng();
                  if (onWaypointDrag) {
                    onWaypointDrag(
                      marker.id,
                      formatCoordinate(position.lat, true),
                      formatCoordinate(position.lng, false)
                    );
                  }
                },
              }}
              opacity={selectedWaypoint === marker.id ? 1 : 0.7}
            >
              <Popup>
                Waypoint {marker.id}<br/>
                Altitude: {marker.altitude}<br/>
                Action: {marker.action}
              </Popup>
            </Marker>
          ))}
          
          {/* Landing point */}
          {landingPoint && (
            <Marker 
              position={[parseCoordinate(landingPoint.latitude), parseCoordinate(landingPoint.longitude)]}
              icon={landingIcon}
              draggable={!isLiveView}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  if (onWaypointDrag) {
                    onWaypointDrag(
                      -2, // Special ID for landing point
                      formatCoordinate(position.lat, true),
                      formatCoordinate(position.lng, false)
                    );
                  }
                },
              }}
            >
              <Popup>Landing Point<br/>Altitude: {landingPoint.altitude}</Popup>
            </Marker>
          )}
          
          {/* Path between points */}
          {fullPath.length > 1 && (
            <Polyline 
              positions={fullPath}
              color="#000000ff"
              weight={3}
              dashArray="5, 5"
            />
          )}
          
          {/* Current drone position in live view */}
          {isLiveView && waypointMarkers.length > 0 && (
            <Marker
              position={waypointMarkers[0].position}
              icon={new L.Icon({
                iconUrl: icon, // Replace with drone icon
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                className: "drone-icon-pulse"
              })}
            >
              <Popup>Current Drone Position</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      <div className="map-controls">
        <button onClick={increaseZoom} className="map-control-button" aria-label="Zoom in">
          <FaPlus />
        </button>
        <button onClick={decreaseZoom} className="map-control-button" aria-label="Zoom out">
          <FaMinus />
        </button>
        <button onClick={toggleFullscreen} className="map-control-button" aria-label="Full screen">
          <FaExpand />
        </button>
        <button onClick={resetOrientation} className="map-control-button" aria-label="Reset orientation">
          <FaCompass />
        </button>
      </div>

      <CameraFeed />
    </div>
  );
};

export default DroneRouteMap;