import React from "react";
import '../../styles/DroneFleetTable.scss';
import { useEffect, useState } from 'react';
import { getAllDrones } from '../../api/droneApi';
import DroneModal from './DroneModal';

interface DroneData {
  id: string;
  name: string;
  model: string;
  status: "Active" | "Idle" | "Charging" | "Maintenance";
  battery: number;
  signal: number;
  location: string;
};

const DroneFleetTable: React.FC = () => {
  const [drones, setDrones] = useState<DroneData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editDrone, setEditDrone] = useState<any>(null);

  const fetchDrones = async () => {
    try {
      setLoading(true);
      const response = await getAllDrones();
      setDrones(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching drones:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrones();
  }, []);

  const handleAddDrone = () => {
    setEditDrone(null);
    setShowModal(true);
  };

  const handleEditDrone = (drone: any) => {
    setEditDrone(drone);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditDrone(null);
  };

  return (
    <div className="drone-fleet-table">
      <div className="table-header">
        <h2>Drone Fleet</h2>
        <button className="add-drone-button" onClick={handleAddDrone}>
          <span>+</span> Add Drone
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Loading drone data...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Drone ID</th>
              <th>Name</th>
              <th>Model</th>
              <th>Status</th>
              <th>Battery</th>
              <th>Signal</th>
              <th>Location</th>
              <th>Sensors</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drones.length > 0 ? (
              drones.map((drone) => (
                <tr key={drone.droneId}>
                  <td>{drone.droneId}</td>
                  <td>{drone.name}</td>
                  <td>{drone.droneModel}</td>
                  <td>
                    <span className={`status-indicator ${drone.status.toLowerCase()}`}>
                      {drone.status}
                    </span>
                  </td>
                  <td>
                    <div className="battery-indicator">
                      <div 
                        className="battery-level" 
                        style={{ width: `${drone.battery}%` }}
                      ></div>
                      <span>{drone.battery}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="signal-indicator">
                      <div 
                        className="signal-level" 
                        style={{ width: `${drone.signal}%` }}
                      ></div>
                      <span>{drone.signal}%</span>
                    </div>
                  </td>
                  <td>{drone.location}</td>
                  <td>{drone.sensors ? drone.sensors.join(', ') : 'None'}</td>
                  <td>
                    <button className="action-button view">View</button>
                    <button className="action-button edit" onClick={() => handleEditDrone(drone)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9}>No drones found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <DroneModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        editDrone={editDrone} 
        onDroneAdded={fetchDrones}
      />
    </div>
  );
};

export default DroneFleetTable;