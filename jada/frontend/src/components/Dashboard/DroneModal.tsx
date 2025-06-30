import React, { useState, useEffect } from 'react';
import '../../styles/DroneModal.scss';
import { createDrone, updateDroneStatus } from '../../api/droneApi';

interface DroneModalProps {
  isOpen: boolean;
  onClose: () => void;
  editDrone?: any;
  onDroneAdded?: () => void;
}

const DroneModal: React.FC<DroneModalProps> = ({ isOpen, onClose, editDrone, onDroneAdded }) => {
  const [formData, setFormData] = useState({
    droneId: '',
    name: '',
    droneModel: '',
    status: 'Idle',
    battery: 100,
    signal: 100,
    location: '',
    sensors: ''
  });

  useEffect(() => {
    if (editDrone) {
      setFormData({
        droneId: editDrone.droneId || '',
        name: editDrone.name || '',
        droneModel: editDrone.droneModel || '',
        status: editDrone.status || 'Idle',
        battery: editDrone.battery || 100,
        signal: editDrone.signal || 100,
        location: editDrone.location || '',
        sensors: editDrone.sensors ? editDrone.sensors.join(', ') : ''
      });
    }
  }, [editDrone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'battery' || name === 'signal' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const droneData = {
        ...formData,
        sensors: formData.sensors ? formData.sensors.split(',').map(s => s.trim()) : []
      };

      if (editDrone) {
        await updateDroneStatus(editDrone._id, droneData);
      } else {
        await createDrone(droneData);
      }

      if (onDroneAdded) {
        onDroneAdded();
      }
      onClose();
    } catch (error) {
      console.error('Error saving drone:', error);
      alert('Failed to save drone. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drone-modal-overlay">
      <div className="drone-modal">
        <div className="modal-header">
          <h2>{editDrone ? 'Edit Drone' : 'Add New Drone'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Drone ID</label>
            <input 
              type="text" 
              name="droneId" 
              value={formData.droneId} 
              onChange={handleChange} 
              required 
              disabled={!!editDrone}
            />
          </div>
          
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Model</label>
            <input 
              type="text" 
              name="droneModel" 
              value={formData.droneModel} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Idle">Idle</option>
              <option value="Charging">Charging</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Battery (%)</label>
            <input 
              type="number" 
              name="battery" 
              value={formData.battery} 
              onChange={handleChange} 
              min="0" 
              max="100" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Signal (%)</label>
            <input 
              type="number" 
              name="signal" 
              value={formData.signal} 
              onChange={handleChange} 
              min="0" 
              max="100" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Sensors (comma separated)</label>
            <input 
              type="text" 
              name="sensors" 
              value={formData.sensors} 
              onChange={handleChange} 
              placeholder="Camera, GPS, Thermal" 
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-button">{editDrone ? 'Update' : 'Add'} Drone</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DroneModal;